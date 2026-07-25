'use client';
import { TECH_ICONS } from '../lib/career';
import type { Project } from '../lib/projects';
import CompanyLogo from './CompanyLogo';

type Props = { project: Project; language: 'en' | 'tr' };

const ProjectCard = ({ project, language }: Props) => (
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

    <div className="project-pipeline">
      <div className="project-pipeline-title">ci/cd</div>
      <ol>
        {project.deploySteps[language].map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </div>
  </div>
);

export default ProjectCard;
