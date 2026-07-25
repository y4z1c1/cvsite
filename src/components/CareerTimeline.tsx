'use client';
import { EXPERIENCES, TECH_ICONS } from '../lib/career';
import CompanyLogo from './CompanyLogo';

type Props = { language: 'en' | 'tr' };

const CareerTimeline = ({ language }: Props) => (
  <div className="timeline">
    {EXPERIENCES.map((exp) => (
      <div className="timeline-item" key={exp.id}>
        <div className="timeline-rail">
          <CompanyLogo logoId={exp.logoId} alt={exp.company} kind={exp.kind} size={40} />
          <span className="timeline-line" aria-hidden />
        </div>
        <div className="timeline-content">
          <div className="timeline-head">
            <span className="timeline-role">{exp.role[language]}</span>
            <span className="timeline-company">{exp.company}</span>
            <span className="timeline-date">{exp.date[language]}</span>
          </div>
          {exp.tech.length > 0 && (
            <div className="tech-row">
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
          <ul className="timeline-bullets">
            {exp.bullets[language].map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </div>
    ))}
  </div>
);

export default CareerTimeline;
