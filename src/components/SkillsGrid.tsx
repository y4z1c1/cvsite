'use client';
import { SKILL_GROUPS, TECH_ICONS } from '../lib/career';

type Props = { language: 'en' | 'tr' };

const SkillsGrid = ({ language }: Props) => (
  <div className="skills-groups">
    {SKILL_GROUPS.map((group) => (
      <div className="skills-group" key={group.id}>
        <div className="skills-group-label muted">{group.label[language]}</div>
        <div className="tech-row">
          {group.items.map((id) => {
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
    ))}
  </div>
);

export default SkillsGrid;
