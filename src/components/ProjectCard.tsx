'use client';
import { TECH_ICONS } from '../lib/career';
import type { Project } from '../lib/projects';
import { useLiveStats } from '../hooks/useLiveStats';
import CompanyLogo from './CompanyLogo';

type Props = { project: Project; language: 'en' | 'tr' };

const ProjectCard = ({ project, language }: Props) => {
  const live = useLiveStats();
  const locale = language === 'tr' ? 'tr-TR' : 'en-US';

  // Per-stat merge, not a wholesale swap. An absent upstream key means that
  // count failed — NOT zero — so it has to fall through to the fallback value.
  // `?? fallback` would be wrong here: 0 is a legitimate reported value and
  // must survive, which is why this tests for undefined explicitly.
  const valueFor = (stat: Project['stats'][number]) => {
    const fresh = stat.metricKey ? live?.metrics[stat.metricKey] : undefined;
    return fresh === undefined ? stat.value : fresh;
  };

  return (
    <div className="project-card">
      <div className="project-head">
        <CompanyLogo logoId={project.logoId} alt={project.name} kind="project" size={44} />
        <div>
          <div className="project-name">
            {project.name}
            {project.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="project-link">
                {l.label} ↗
              </a>
            ))}
          </div>
          <div className="project-tagline">{project.tagline[language]}</div>
        </div>
      </div>

      <p className="project-desc">{project.description[language]}</p>

      {project.stats.length > 0 && (
        <div
          className="project-stats"
          // Upstream compute time, which can lag now by up to 15 minutes.
          // Surfaced as a tooltip rather than visible chrome — it matters to
          // anyone who wonders whether these are real, and to nobody else.
          title={live?.generatedAt ? `Live — updated ${new Date(live.generatedAt).toLocaleString(locale)}` : undefined}
        >
          {project.stats.map((s) => (
            <div className="project-stat" key={s.label.en}>
              <span className="project-stat-value">{valueFor(s).toLocaleString(locale)}</span>
              <span className="project-stat-label">{s.label[language]}</span>
            </div>
          ))}
        </div>
      )}

      <div className="tech-row">
        {project.tech.map((id) => {
          const { label, Icon } = TECH_ICONS[id];
          return (
            <span className="tech-chip" key={id} title={label}>
              <Icon size={13} />
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectCard;
