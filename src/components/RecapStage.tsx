'use client';
import { FaCode } from 'react-icons/fa';
import { useTranslation } from '../hooks/useTranslation';
import { EXPERIENCES, SKILL_GROUPS, TECH_ICONS } from '../lib/career';
import { PROJECTS } from '../lib/projects';
import { goTo } from '../lib/scroll';
import CompanyLogo from './CompanyLogo';

type Props = { language: 'en' | 'tr' };

// An Apple-keynote-style "recap" grid — one small card per stage above, click
// any card to jump back to it. Every child here is a jump-back button and
// nothing else; the contact form used to sit in this grid as a double-width
// card, which crowded the recap and made one tile behave unlike all the
// others. It's its own stage now (see Stages.tsx).
const RecapStage = ({ language }: Props) => {
  const { t } = useTranslation();
  const work = EXPERIENCES.filter((e) => e.kind === 'work');
  const education = EXPERIENCES.filter((e) => e.kind === 'education');
  const topSkills = SKILL_GROUPS.flatMap((g) => g.items).slice(0, 6);

  // Same order as the stages above: work, education, projects, skills.
  return (
    <div className="recap-grid">
      {work.map((e) => (
        <button key={e.id} type="button" className="recap-card glass" onClick={() => goTo(`exp-${e.id}`)}>
          <CompanyLogo logoId={e.logoId} alt={e.company} kind={e.kind} size={32} />
          <span className="recap-card-title">{e.role[language]}</span>
          <span className="recap-card-sub">{e.company}</span>
        </button>
      ))}

      {education.map((e) => (
        <button key={e.id} type="button" className="recap-card glass" onClick={() => goTo('edu')}>
          <CompanyLogo logoId={e.logoId} alt={e.company} kind={e.kind} size={32} />
          <span className="recap-card-title">{e.role[language]}</span>
          <span className="recap-card-sub">{e.company}</span>
        </button>
      ))}

      {PROJECTS.map((p) => (
        <button key={p.id} type="button" className="recap-card glass" onClick={() => goTo(`proj-${p.id}`)}>
          <CompanyLogo logoId={p.logoId} alt={p.name} kind="project" size={32} />
          <span className="recap-card-title">{p.name}</span>
          <span className="recap-card-sub">{p.tagline[language]}</span>
        </button>
      ))}

      <button type="button" className="recap-card glass" onClick={() => goTo('skills')}>
        <span className="recap-card-icon"><FaCode size={16} /></span>
        <span className="recap-card-title">{t('skills')}</span>
        <span className="recap-card-sub recap-card-skills">
          {topSkills.map((id) => {
            const { Icon } = TECH_ICONS[id];
            return <Icon key={id} size={13} />;
          })}
        </span>
      </button>
    </div>
  );
};

export default RecapStage;
