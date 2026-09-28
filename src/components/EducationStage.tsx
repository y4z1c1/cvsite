'use client';
import type { Experience } from '../lib/career';
import CompanyLogo from './CompanyLogo';

type Props = { schools: Experience[]; language: 'en' | 'tr' };

// All education on one stage — a single degree line per school doesn't fill a
// full-viewport chapter the way a job does, so the schools share a page,
// newest first, each with the same head markup as ExperienceStage.
const EducationStage = ({ schools, language }: Props) => (
  <div className="edu-list">
    {schools.map((edu, i) => (
      <div className="edu-item" key={edu.id} style={{ '--i': i } as React.CSSProperties}>
        <div className="exp-stage-head">
          <CompanyLogo logoId={edu.logoId} alt={edu.company} kind="education" size={i === 0 ? 56 : 44} />
          <div className="exp-meta">
            <span>{edu.company}</span>
            <span className="exp-date">{edu.date[language]}</span>
          </div>
        </div>
        <h2 className={i === 0 ? 'exp-role' : 'exp-role edu-role-minor'}>{edu.role[language]}</h2>
        <ul className="exp-bullets">
          {edu.bullets[language].map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default EducationStage;
