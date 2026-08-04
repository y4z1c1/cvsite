'use client';
import { FaGraduationCap, FaCode, FaPaperPlane } from 'react-icons/fa';
import { EXPERIENCES, SKILL_GROUPS, TECH_ICONS } from '../lib/career';
import { PROJECTS } from '../lib/projects';
import CompanyLogo from './CompanyLogo';
import MessageForm from './MessageForm';

type Props = { language: 'en' | 'tr'; messageHeading: string };

const goTo = (id: string) => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
};

// An Apple-keynote-style "recap" grid — one small card per stage above,
// click any card to jump back to it — capped off by the message form as the
// final, largest card, so the last thing a visitor sees is a clear CTA
// rather than a fading list.
const RecapStage = ({ language, messageHeading }: Props) => {
  const work = EXPERIENCES.filter((e) => e.kind === 'work');
  const education = EXPERIENCES.filter((e) => e.kind === 'education');
  const topSkills = SKILL_GROUPS.flatMap((g) => g.items).slice(0, 6);

  return (
    <div className="recap-grid">
      {work.map((e) => (
        <button key={e.id} type="button" className="recap-card glass" onClick={() => goTo(`exp-${e.id}`)}>
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

      {education.map((e) => (
        <button key={e.id} type="button" className="recap-card glass" onClick={() => goTo(`edu-${e.id}`)}>
          <span className="recap-card-icon"><FaGraduationCap size={16} /></span>
          <span className="recap-card-title">{e.role[language]}</span>
          <span className="recap-card-sub">{e.company}</span>
        </button>
      ))}

      <button type="button" className="recap-card glass" onClick={() => goTo('skills')}>
        <span className="recap-card-icon"><FaCode size={16} /></span>
        <span className="recap-card-title">{language === 'tr' ? 'Yetenekler' : 'Skills'}</span>
        <span className="recap-card-sub recap-card-skills">
          {topSkills.map((id) => {
            const { Icon } = TECH_ICONS[id];
            return <Icon key={id} size={13} />;
          })}
        </span>
      </button>

      <div className="recap-card recap-card-message glass">
        <span className="recap-card-icon"><FaPaperPlane size={16} /></span>
        <span className="recap-card-title">{messageHeading}</span>
        <MessageForm variant="section" />
      </div>
    </div>
  );
};

export default RecapStage;
