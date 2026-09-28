'use client';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { EXPERIENCES } from '../lib/career';
import { PROJECTS } from '../lib/projects';
import Stage from './Stage';
import Hero from './Hero';
import ExperienceStage from './ExperienceStage';
import EducationStage from './EducationStage';
import ProjectCard from './ProjectCard';
import SkillsGrid from './SkillsGrid';
import RecapStage from './RecapStage';
import MessageForm from './MessageForm';

const WORK = EXPERIENCES.filter((e) => e.kind === 'work');
const EDUCATION = EXPERIENCES.filter((e) => e.kind === 'education');
const EXP_HUES = ['violet', 'cyan', 'amber', 'rose'] as const;
const PROJ_HUES = ['cyan', 'violet'] as const;

const Stages = () => {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation();

  return (
    <div className="stages">
      <Stage id="hero" hue="lime" navLabel={t('intro')}>
        <Hero />
      </Stage>

      {WORK.map((exp, i) => (
        <Stage
          key={exp.id}
          id={`exp-${exp.id}`}
          kicker={`${String(i + 1).padStart(2, '0')} — ${t('experience')}`}
          hue={EXP_HUES[i % EXP_HUES.length]}
          group="career"
          navLabel={exp.company}
        >
          <ExperienceStage experience={exp} language={language} />
        </Stage>
      ))}

      <Stage
        id="edu"
        kicker={`${String(WORK.length + 1).padStart(2, '0')} — ${t('education')}`}
        hue="amber"
        group="career"
        navLabel={t('education')}
      >
        <EducationStage schools={EDUCATION} language={language} />
      </Stage>

      {PROJECTS.map((project, i) => (
        <Stage
          key={project.id}
          id={`proj-${project.id}`}
          kicker={`${String(WORK.length + 2 + i).padStart(2, '0')} — ${t('projects')}`}
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
        kicker={`${String(WORK.length + PROJECTS.length + 2).padStart(2, '0')} — ${t('skills')}`}
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
        kicker={`${String(WORK.length + PROJECTS.length + 3).padStart(2, '0')} — ${t('recap')}`}
        title={t('recapTitle')}
        hue="lime"
        navLabel={t('recap')}
        wide
      >
        <p className="stage-lede">{t('recapIntro')}</p>
        <RecapStage language={language} />
      </Stage>

      {/* The closing stage. Deliberately the narrow (non-wide) column and the
          only thing on screen — it's the one place a visitor is asked to act,
          so it gets a page rather than a tile in the recap grid. */}
      <Stage
        id="contact"
        kicker={`${String(WORK.length + PROJECTS.length + 4).padStart(2, '0')} — ${t('contact')}`}
        title={t('messageHeading')}
        hue="violet"
        navLabel={t('contact')}
      >
        <p className="stage-lede">{t('messageIntro')}</p>
        <div className="ov-card glass">
          <MessageForm />
        </div>
      </Stage>
    </div>
  );
};

export default Stages;
