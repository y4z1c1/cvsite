import { EXPERIENCES, SKILL_GROUPS, TECH_ICONS } from './career';
import { PROJECTS } from './projects';
import { CONTACT } from './persona';

// Plain-markdown dump of the whole CV, for the Hero "copy for AI" chip —
// pasting this into an LLM chat gives it the same facts as the site itself,
// without scraping/rendering. Kept separate from persona.ts's prompt (that
// one is for our own chat backend and is phrased in first person).
export function buildAISummary(language: 'en' | 'tr' = 'en'): string {
  const work = EXPERIENCES.filter((e) => e.kind === 'work');
  const education = EXPERIENCES.filter((e) => e.kind === 'education');
  const lines: string[] = [];

  lines.push(`# ${CONTACT.name} — ${CONTACT.title}`);
  lines.push(`${CONTACT.location} · ${CONTACT.email} · ${CONTACT.github} · ${CONTACT.linkedin}`);

  lines.push('', '## Experience');
  for (const e of work) {
    lines.push(`- **${e.role[language]}**, ${e.company} (${e.date[language]})`);
    for (const b of e.bullets[language]) lines.push(`  - ${b}`);
  }

  lines.push('', '## Education');
  for (const e of education) {
    lines.push(`- **${e.role[language]}**, ${e.company} (${e.date[language]})`);
  }

  lines.push('', '## Projects');
  for (const p of PROJECTS) {
    lines.push(`- **${p.name}** — ${p.tagline[language]}`);
    lines.push(`  ${p.description[language]}`);
    if (p.links.length) lines.push(`  ${p.links.map((l) => l.url).join(', ')}`);
  }

  lines.push('', '## Skills');
  for (const g of SKILL_GROUPS) {
    lines.push(`- ${g.label[language]}: ${g.items.map((id) => TECH_ICONS[id].label).join(', ')}`);
  }

  lines.push('', `Source: yusufanilyazici.com`);
  return lines.join('\n');
}
