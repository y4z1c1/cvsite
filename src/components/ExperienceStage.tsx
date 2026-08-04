'use client';
import type { Experience } from '../lib/career';
import { TECH_ICONS } from '../lib/career';
import CompanyLogo from './CompanyLogo';

type Props = { experience: Experience; language: 'en' | 'tr' };

// One job, full-stage editorial treatment — deliberately separate from
// CareerTimeline (which stays a compact multi-item list for chat bubbles).
const ExperienceStage = ({ experience: exp, language }: Props) => (
  <>
    <div className="exp-stage-head" style={{ '--i': 0 } as React.CSSProperties}>
      <CompanyLogo logoId={exp.logoId} alt={exp.company} kind={exp.kind} size={56} />
      <div className="exp-meta">
        <span>{exp.company}</span>
        {exp.employmentType && <span className="exp-employment-type">{exp.employmentType[language]}</span>}
        <span className="exp-date">{exp.date[language]}</span>
      </div>
    </div>
    <h2 className="exp-role" style={{ '--i': 1 } as React.CSSProperties}>{exp.role[language]}</h2>
    <ul className="exp-bullets" style={{ '--i': 2 } as React.CSSProperties}>
      {exp.bullets[language].map((b) => (
        <li key={b}>{b}</li>
      ))}
    </ul>
    {exp.tech.length > 0 && (
      <div className="tech-row" style={{ '--i': 3 } as React.CSSProperties}>
        {exp.tech.map((id) => {
          const { label, Icon } = TECH_ICONS[id];
          return (
            <span className="tech-chip" key={id} title={label}>
              <Icon size={13} />
              {label}
            </span>
          );
        })}
      </div>
    )}

    {/* Earlier stints at the same company — nested beneath the current role,
        LinkedIn-style, instead of collapsed into a single bullet. */}
    {exp.previousPositions && exp.previousPositions.length > 0 && (
      <div className="exp-prev-list" style={{ '--i': 4 } as React.CSSProperties}>
        {exp.previousPositions.map((pos) => (
          <div className="exp-prev" key={pos.role.en}>
            <span className="exp-prev-rail" aria-hidden />
            <div className="exp-prev-body">
              <div className="exp-prev-head">
                <span className="exp-prev-role">{pos.role[language]}</span>
                {pos.employmentType && <span className="exp-employment-type">{pos.employmentType[language]}</span>}
                <span className="exp-date">{pos.date[language]}</span>
              </div>
              <ul className="exp-bullets exp-prev-bullets">
                {pos.bullets[language].map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    )}
  </>
);

export default ExperienceStage;
