'use client';
import { useState } from 'react';
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
