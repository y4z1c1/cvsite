'use client';
import { useContext } from 'react';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { LanguageContext } from '../context/LanguageContext';
import { useStageContext } from '../context/StageContext';
import { EXPERIENCES } from '../lib/career';

type CareerNode = {
  id: string;
  company: string;
  role: { en: string; tr: string };
  date: { en: string; tr: string };
  kind: 'work' | 'education';
};

// Same order as Stages.tsx: all work stages, then all education stages.
const CAREER_NODES: CareerNode[] = EXPERIENCES.map((e) => ({
  id: e.kind === 'work' ? `exp-${e.id}` : `edu-${e.id}`,
  company: e.company,
  role: e.role,
  date: e.date,
  kind: e.kind,
}));
const PLAIN_STAGES = [
  { id: 'hero', label: 'Intro' },
  { id: 'proj-bogazicicim', label: 'Boğaziçi Çim' },
  { id: 'proj-cvsite', label: 'cvsite' },
  { id: 'skills', label: 'Skills' },
  { id: 'recap', label: 'Recap' },
];

const goTo = (id: string) => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
};

// The right-hand dot rail. Every stage gets a plain dot except the career
// cluster (jobs + education): while the visitor is anywhere in that run of
// stages, that segment of the rail expands horizontally — growing left from
// the fixed right edge, never touching the centered content column — to
// show company/date labels and a connecting fill line, like a compact
// milestone timeline folded into the existing nav instead of a second
// fixed element competing for space.
const StageNav = () => {
  const { language } = useContext(LanguageContext);
  const { activeId } = useStageContext();
  const careerActiveIndex = CAREER_NODES.findIndex((n) => n.id === activeId);
  const careerExpanded = careerActiveIndex >= 0;
  const careerFillPct = careerExpanded ? ((careerActiveIndex + 0.5) / CAREER_NODES.length) * 100 : 0;

  return (
    <nav className="stage-nav glass" aria-label="Section navigation">
      <button
        type="button"
        className="stage-nav-btn"
        aria-label={PLAIN_STAGES[0].label}
        aria-current={activeId === PLAIN_STAGES[0].id ? 'true' : undefined}
        onClick={() => goTo(PLAIN_STAGES[0].id)}
      >
        <span className="stage-nav-dot" aria-hidden />
      </button>

      <div className={`stage-nav-career${careerExpanded ? ' is-expanded' : ''}`}>
        <div className="stage-nav-career-fill" style={{ height: `${careerFillPct}%` }} aria-hidden />
        {CAREER_NODES.map((n, i) => {
          const state = i < careerActiveIndex ? 'past' : i === careerActiveIndex ? 'active' : 'future';
          const Icon = n.kind === 'education' ? FaGraduationCap : FaBriefcase;
          return (
            <button
              key={n.id}
              type="button"
              className="stage-nav-career-node"
              data-state={state}
              onClick={() => goTo(n.id)}
              aria-current={state === 'active' ? 'true' : undefined}
              aria-label={`${n.role[language]}, ${n.company}`}
            >
              <span className="stage-nav-career-dot"><Icon size={8} /></span>
              <span className="stage-nav-career-label">
                <strong>{n.company}</strong>
                <span>{n.date[language]}</span>
              </span>
            </button>
          );
        })}
      </div>

      {PLAIN_STAGES.slice(1).map((s) => (
        <button
          key={s.id}
          type="button"
          className="stage-nav-btn"
          aria-label={s.label}
          aria-current={s.id === activeId ? 'true' : undefined}
          onClick={() => goTo(s.id)}
        >
          <span className="stage-nav-dot" aria-hidden />
        </button>
      ))}
    </nav>
  );
};

export default StageNav;
