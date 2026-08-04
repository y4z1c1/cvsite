'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

type StageContextValue = {
  activeId: string | null;
  register: (el: HTMLElement) => () => void;
};

const StageContext = createContext<StageContextValue>({
  activeId: null,
  register: () => () => {},
});

export const useStageContext = () => useContext(StageContext);

// A stage is "active" while it crosses the middle band of the viewport, so
// exactly one stage reads as current mid-scroll. Kept generous (30% band)
// so short stages don't flicker between in/ahead/behind on fast flicks.
const OBSERVER_OPTS: IntersectionObserverInit = {
  rootMargin: '-35% 0px -35% 0px',
  threshold: 0,
};

export const StageProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const ioRef = useRef<IntersectionObserver | null>(null);
  // Stage components mount (and call register) before this provider's own
  // effect runs — child effects fire first — so early registrations are
  // queued here and flushed once the observer exists.
  const pendingRef = useRef<Set<HTMLElement>>(new Set());

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return; // stages stay visible (see stages.css default)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add('is-in');
          el.classList.remove('is-ahead', 'is-behind');
          setActiveId(el.id);
        } else {
          el.classList.remove('is-in');
          // top < 0 means we've scrolled past it (it sits above the viewport now)
          const past = entry.boundingClientRect.top < 0;
          el.classList.toggle('is-behind', past);
          el.classList.toggle('is-ahead', !past);
        }
      }
    }, OBSERVER_OPTS);
    ioRef.current = io;

    // Flush anything that registered before the observer existed.
    pendingRef.current.forEach((el) => io.observe(el));
    pendingRef.current.clear();

    // Only once IO is confirmed working do we let CSS hide non-active
    // stages — this is the opt-in that keeps a no-JS/no-IO page fully visible.
    if (!reduceMotion) {
      document.documentElement.classList.add('stages-js');
    }

    return () => {
      io.disconnect();
      ioRef.current = null;
      document.documentElement.classList.remove('stages-js');
    };
  }, []);

  // Tabbing into an off-screen stage should reveal it immediately rather
  // than waiting for the IO round-trip — otherwise focus can land on
  // invisible (opacity:0) content.
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const stage = (e.target as HTMLElement)?.closest?.('.stage');
      if (stage) {
        stage.classList.add('is-in');
        stage.classList.remove('is-ahead', 'is-behind');
        if (stage.id) setActiveId(stage.id);
      }
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);

  const register = useCallback((el: HTMLElement) => {
    if (ioRef.current) ioRef.current.observe(el);
    else pendingRef.current.add(el);
    return () => {
      ioRef.current?.unobserve(el);
      pendingRef.current.delete(el);
    };
  }, []);

  return (
    <StageContext.Provider value={{ activeId, register }}>
      {children}
    </StageContext.Provider>
  );
};
