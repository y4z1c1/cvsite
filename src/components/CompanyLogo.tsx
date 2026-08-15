'use client';
import { useEffect, useRef, useState } from 'react';
import { FaBriefcase, FaGraduationCap, FaCube } from 'react-icons/fa';

type Props = {
  logoId: string;
  alt: string;
  kind?: 'work' | 'education' | 'project';
  size?: number;
};

// Tries /logos/{logoId}.png and falls back to a generic icon when the file
// doesn't exist yet — the user will drop AI-generated logos in later, and
// they'll be picked up with zero code changes.
const CompanyLogo = ({ logoId, alt, kind = 'work', size = 40 }: Props) => {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // onError alone isn't enough: the <img> is server-rendered, so the browser
  // can request it and give up long before React hydrates and attaches the
  // handler — the error event is gone by then and the broken-image glyph
  // sticks. A settled image with no intrinsic width is one that failed, so
  // re-check that on mount and let onError cover failures after hydration.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    const Icon = kind === 'education' ? FaGraduationCap : kind === 'project' ? FaCube : FaBriefcase;
    return (
      <span className="logo-fallback" style={{ width: size, height: size }} aria-hidden>
        <Icon size={size * 0.5} />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={`/logos/${logoId}.png`}
      alt={alt}
      width={size}
      height={size}
      className="logo-img"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
};

export default CompanyLogo;
