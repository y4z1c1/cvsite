'use client';
import { EXPERIENCES, TECH_ICONS } from '../lib/career';
import CompanyLogo from './CompanyLogo';

type Props = { language: 'en' | 'tr'; kinds?: ('work' | 'education')[] };

const CareerTimeline = ({ language, kinds = ['work', 'education'] }: Props) => (
  <div className="timeline">
    {EXPERIENCES.filter((exp) => kinds.includes(exp.kind)).map((exp) => (
      <div className="timeline-item" key={exp.id}>
        <div className="timeline-rail">
          <CompanyLogo logoId={exp.logoId} alt={exp.company} kind={exp.kind} size={40} />
          <span className="timeline-line" aria-hidden />
        </div>
        <div className="timeline-content">
          <div className="timeline-head">
            <span className="timeline-role">{exp.role[language]}</span>
            <span className="timeline-company">{exp.company}</span>
            <span className="timeline-date">
              {exp.employmentType ? `${exp.employmentType[language]} · ` : ''}
              {exp.date[language]}
            </span>
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
          {exp.previousPositions?.map((pos) => (
            <div className="timeline-prev" key={pos.role.en}>
              <div className="timeline-head">
                <span className="timeline-role">{pos.role[language]}</span>
                <span className="timeline-date">
                  {pos.employmentType ? `${pos.employmentType[language]} · ` : ''}
                  {pos.date[language]}
                </span>
              </div>
              <ul className="timeline-bullets">
                {pos.bullets[language].map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default CareerTimeline;
