'use client';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { PROJECTS } from '../lib/projects';
import Hero from './Hero';
import CareerTimeline from './CareerTimeline';
import ProjectCard from './ProjectCard';
import SkillsGrid from './SkillsGrid';

const Overview = () => {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation();

  return (
    <div className="overview">
      <section className="ov-section">
        <Hero />
      </section>

      <section className="ov-section" id="experience">
        <h2 className="ov-heading">{t('experience')}</h2>
        <div className="ov-card">
          <CareerTimeline language={language} kinds={['work']} />
        </div>
      </section>

      <section className="ov-section" id="projects">
        <h2 className="ov-heading">{t('projects')}</h2>
        {PROJECTS.map((project) => (
          <div className="ov-card" key={project.id}>
            <ProjectCard project={project} language={language} />
          </div>
        ))}
      </section>

      <section className="ov-section" id="education">
        <h2 className="ov-heading">{t('education')}</h2>
        <div className="ov-card">
          <CareerTimeline language={language} kinds={['education']} />
        </div>
      </section>

      <section className="ov-section" id="skills">
        <h2 className="ov-heading">{t('skills')}</h2>
        <div className="ov-card">
          <SkillsGrid language={language} />
        </div>
      </section>
    </div>
  );
};

export default Overview;
