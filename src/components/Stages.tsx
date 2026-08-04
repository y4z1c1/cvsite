'use client';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { EXPERIENCES } from '../lib/career';
import { PROJECTS } from '../lib/projects';
import Stage from './Stage';
import Hero from './Hero';
import ExperienceStage from './ExperienceStage';
import ProjectCard from './ProjectCard';
import SkillsGrid from './SkillsGrid';
import RecapStage from './RecapStage';

const WORK = EXPERIENCES.filter((e) => e.kind === 'work');
const EDUCATION = EXPERIENCES.filter((e) => e.kind === 'education');
const EXP_HUES = ['violet', 'cyan', 'amber', 'rose'] as const;
const PROJ_HUES = ['cyan', 'violet'] as const;

const Stages = () => {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation();

  return (
    <div className="stages">
      <Stage id="hero" hue="lime" navLabel="Intro">
        <Hero />
      </Stage>

      {WORK.map((exp, i) => (
        <Stage
          key={exp.id}
          id={`exp-${exp.id}`}
          kicker={`${String(i + 1).padStart(2, '0')} — ${t('experience').toUpperCase()}`}
          hue={EXP_HUES[i % EXP_HUES.length]}
          group="career"
          navLabel={exp.company}
        >
          <ExperienceStage experience={exp} language={language} />
        </Stage>
      ))}

      {EDUCATION.map((edu, i) => (
        <Stage
          key={edu.id}
          id={`edu-${edu.id}`}
          kicker={`${String(WORK.length + i + 1).padStart(2, '0')} — ${t('education').toUpperCase()}`}
          hue="amber"
          group="career"
          navLabel={edu.company}
        >
          <ExperienceStage experience={edu} language={language} />
        </Stage>
      ))}

      {PROJECTS.map((project, i) => (
        <Stage
          key={project.id}
          id={`proj-${project.id}`}
          kicker={`${String(WORK.length + EDUCATION.length + i + 1).padStart(2, '0')} — ${t('projects').toUpperCase()}`}
          title={project.name}
          hue={PROJ_HUES[i % PROJ_HUES.length]}
          group="projects"
          navLabel={project.name}
        >
          <div className="ov-card glass">
            <ProjectCard project={project} language={language} />
          </div>
        </Stage>
      ))}

      <Stage
        id="skills"
        kicker={`${String(WORK.length + EDUCATION.length + PROJECTS.length + 1).padStart(2, '0')} — ${t('skills').toUpperCase()}`}
        title={t('skills')}
        hue="lime"
        navLabel={t('skills')}
      >
        <div className="ov-card glass">
          <SkillsGrid language={language} />
        </div>
      </Stage>

      <Stage
        id="recap"
        kicker={`${String(WORK.length + EDUCATION.length + PROJECTS.length + 2).padStart(2, '0')} — ${t('recap').toUpperCase()}`}
        title={t('recapTitle')}
        hue="lime"
        navLabel={t('recap')}
        wide
      >
        <p className="recap-intro">{t('recapIntro')}</p>
        <RecapStage language={language} messageHeading={t('messageHeading')} />
      </Stage>
    </div>
  );
};

export default Stages;
