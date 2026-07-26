import type { IconType } from 'react-icons';
import {
  DiPython, DiJava, DiReact, DiJavascript1, DiMongodb,
} from 'react-icons/di';
import {
  SiTypescript, SiSolidity, SiDjango, SiMysql, SiSui, SiSpring, SiSpringboot,
  SiVuedotjs, SiNodedotjs, SiNextdotjs, SiSupabase, SiDocker, SiGithubactions,
  SiCloudflare, SiHetzner, SiTailwindcss, SiC, SiCplusplus, SiSharp,
  SiUnity, SiHtml5, SiPostgresql,
} from 'react-icons/si';
import { FaBriefcase, FaGraduationCap, FaChartLine } from 'react-icons/fa';
// react-icons has no Adobe icons in the `si` set — the tabler (`tb`) set does.
// TbApi (not the literal fa/FaSoap bar-of-soap glyph) for SOAP web services.
import {
  TbBrandAdobePremier, TbBrandAdobeAfterEffect, TbBrandAdobePhotoshop, TbApi,
} from 'react-icons/tb';

export type TechId =
  | 'python' | 'java' | 'typescript' | 'javascript' | 'react' | 'vue'
  | 'spring' | 'spring-boot' | 'django' | 'solidity' | 'sui' | 'node'
  | 'mongodb' | 'mysql' | 'postgresql' | 'soap'
  | 'nextjs' | 'supabase' | 'docker' | 'github-actions' | 'cloudflare'
  | 'hetzner' | 'tailwind' | 'ml'
  | 'c' | 'cpp' | 'csharp' | 'unity' | 'html-css'
  | 'premiere' | 'after-effects' | 'photoshop';

export const TECH_ICONS: Record<TechId, { label: string; Icon: IconType }> = {
  python: { label: 'Python', Icon: DiPython },
  java: { label: 'Java', Icon: DiJava },
  typescript: { label: 'TypeScript', Icon: SiTypescript },
  javascript: { label: 'JavaScript', Icon: DiJavascript1 },
  react: { label: 'React', Icon: DiReact },
  vue: { label: 'Vue.js', Icon: SiVuedotjs },
  spring: { label: 'Java Spring', Icon: SiSpring },
  'spring-boot': { label: 'Spring Boot', Icon: SiSpringboot },
  django: { label: 'Django', Icon: SiDjango },
  solidity: { label: 'Solidity', Icon: SiSolidity },
  sui: { label: 'Sui Move', Icon: SiSui },
  node: { label: 'Node.js', Icon: SiNodedotjs },
  mongodb: { label: 'MongoDB', Icon: DiMongodb },
  mysql: { label: 'MySQL', Icon: SiMysql },
  postgresql: { label: 'PostgreSQL', Icon: SiPostgresql },
  soap: { label: 'SOAP Web Services', Icon: TbApi },
  nextjs: { label: 'Next.js', Icon: SiNextdotjs },
  supabase: { label: 'Supabase', Icon: SiSupabase },
  docker: { label: 'Docker', Icon: SiDocker },
  'github-actions': { label: 'GitHub Actions', Icon: SiGithubactions },
  cloudflare: { label: 'Cloudflare', Icon: SiCloudflare },
  hetzner: { label: 'Hetzner', Icon: SiHetzner },
  tailwind: { label: 'Tailwind CSS', Icon: SiTailwindcss },
  ml: { label: 'Machine Learning', Icon: FaChartLine },
  c: { label: 'C', Icon: SiC },
  cpp: { label: 'C++', Icon: SiCplusplus },
  csharp: { label: 'C#', Icon: SiSharp },
  unity: { label: 'Unity', Icon: SiUnity },
  'html-css': { label: 'HTML/CSS', Icon: SiHtml5 },
  premiere: { label: 'Adobe Premiere Pro', Icon: TbBrandAdobePremier },
  'after-effects': { label: 'Adobe After Effects', Icon: TbBrandAdobeAfterEffect },
  photoshop: { label: 'Adobe Photoshop', Icon: TbBrandAdobePhotoshop },
};

export { FaBriefcase, FaGraduationCap };

// Single source of truth for the skills section — grouped for display, but
// still keying off TECH_ICONS so labels/icons never drift.
export const SKILL_GROUPS: { id: string; label: { en: string; tr: string }; items: TechId[] }[] = [
  {
    id: 'languages',
    label: { en: 'Languages', tr: 'Diller' },
    items: ['python', 'java', 'c', 'cpp', 'csharp', 'typescript', 'javascript'],
  },
  {
    id: 'frontend',
    label: { en: 'Frontend', tr: 'Frontend' },
    items: ['react', 'vue', 'nextjs', 'tailwind', 'html-css'],
  },
  {
    id: 'backend',
    label: { en: 'Backend & Data', tr: 'Backend & Veri' },
    items: ['node', 'spring', 'spring-boot', 'django', 'mysql', 'postgresql', 'mongodb', 'supabase', 'soap'],
  },
  {
    id: 'blockchain',
    label: { en: 'Blockchain', tr: 'Blockchain' },
    items: ['solidity', 'sui'],
  },
  {
    id: 'infra',
    label: { en: 'Infra & DevOps', tr: 'Altyapı & DevOps' },
    items: ['docker', 'github-actions', 'cloudflare', 'hetzner'],
  },
  {
    id: 'other',
    label: { en: 'Other', tr: 'Diğer' },
    items: ['unity', 'ml', 'premiere', 'after-effects', 'photoshop'],
  },
];

export type Experience = {
  id: string;
  company: string;
  role: { en: string; tr: string };
  date: { en: string; tr: string };
  /** Filename stem looked up as /logos/{logoId}.png; falls back to a generic icon. */
  logoId: string;
  kind: 'work' | 'education';
  tech: TechId[];
  bullets: { en: string[]; tr: string[] };
};

export const EXPERIENCES: Experience[] = [
  {
    id: 'turkish-tech',
    company: 'Turkish Technology',
    role: { en: 'Part-Time Full-Stack Developer', tr: 'Yarı Zamanlı Full-Stack Geliştirici' },
    date: { en: 'Oct 2025 – Present', tr: 'Ekim 2025 – Günümüz' },
    logoId: 'turkish-technology',
    kind: 'work',
    tech: ['java', 'spring', 'spring-boot', 'vue', 'postgresql', 'soap'],
    bullets: {
      en: [
        'Full-stack web apps with Java Spring + Vue.js',
        'Enterprise-level software with high code-quality standards',
      ],
      tr: [
        'Java Spring + Vue.js ile full-stack web uygulamaları',
        'Yüksek kod kalitesiyle kurumsal yazılım çözümleri',
      ],
    },
  },
  {
    id: 'riskoptima',
    company: 'RiskOptima WealthTech Corp.',
    role: { en: 'Software Developer', tr: 'Yazılım Geliştirici' },
    date: { en: 'Jul 2025 – Oct 2025', tr: 'Temmuz 2025 – Ekim 2025' },
    logoId: 'riskoptima',
    kind: 'work',
    tech: ['python', 'ml'],
    bullets: {
      en: [
        'Algorithmic trading & ML models for financial markets',
        'Automated trading systems and risk management algorithms',
        'Started as intern, promoted to Software Developer',
      ],
      tr: [
        'Finansal piyasalar için algoritmik ticaret ve ML modelleri',
        'Otomatik ticaret sistemleri ve risk yönetimi algoritmaları',
        'Stajyer olarak başlayıp Yazılım Geliştirici olarak terfi',
      ],
    },
  },
  {
    id: 'suicity',
    company: 'SuiCityP2E',
    role: { en: 'Blockchain Developer', tr: 'Blockchain Geliştiricisi' },
    date: { en: 'Aug 2024 – Jul 2025', tr: 'Ağustos 2024 – Temmuz 2025' },
    logoId: 'suicity',
    kind: 'work',
    tech: ['sui', 'react', 'typescript', 'node', 'mongodb'],
    bullets: {
      en: [
        'Play-to-earn blockchain game, full-stack (React/TS/Node/MongoDB)',
        'Smart contracts in Sui Move for game mechanics & asset ownership',
        'Managed DevOps pipeline: deployment and infrastructure',
      ],
      tr: [
        'Oyna-kazan blockchain oyunu, full-stack (React/TS/Node/MongoDB)',
        'Oyun mekanikleri ve varlık sahipliği için Sui Move akıllı sözleşmeleri',
        'DevOps: dağıtım ve altyapı yönetimi',
      ],
    },
  },
  {
    id: 'freelance',
    company: 'Freelance',
    role: { en: 'Fullstack Developer', tr: 'Fullstack Geliştirici' },
    date: { en: 'Sep 2022 – May 2024', tr: 'Eylül 2022 – Mayıs 2024' },
    logoId: 'freelance',
    kind: 'work',
    tech: ['react', 'solidity', 'javascript'],
    bullets: {
      en: [
        'Frontends + smart contracts for blockchain NFT projects',
        'NFT minting dApps with responsive, cross-browser design',
      ],
      tr: [
        'Blockchain NFT projeleri için ön yüz ve akıllı sözleşmeler',
        'Duyarlı tasarımlı NFT basım dApp\'leri',
      ],
    },
  },
  {
    id: 'bogazici',
    company: 'Boğaziçi University',
    role: { en: 'B.Sc. Computer Engineering', tr: 'Bilgisayar Mühendisliği Lisans' },
    date: { en: 'Sep 2021 – Jun 2026', tr: 'Eylül 2021 – Haziran 2026' },
    logoId: 'bogazici',
    kind: 'education',
    tech: [],
    bullets: {
      en: ['Graduated June 2026'],
      tr: ['Haziran 2026 mezunu'],
    },
  },
  {
    id: 'sakarya-fen',
    company: 'Sakarya Cevat Ayhan Science High School',
    role: { en: 'High School Diploma', tr: 'Lise Diploması' },
    date: { en: 'Sep 2017 – Jun 2021', tr: 'Eylül 2017 – Haziran 2021' },
    logoId: 'sakarya-fen',
    kind: 'education',
    tech: [],
    bullets: {
      en: ['Graduated June 2021'],
      tr: ['Haziran 2021 mezunu'],
    },
  },
];
