import type { IconType } from 'react-icons';
import {
  DiPython, DiJava, DiReact, DiJavascript1, DiMongodb,
} from 'react-icons/di';
import {
  SiTypescript, SiSolidity, SiDjango, SiMysql, SiSui, SiSpring, SiVuedotjs,
  SiNodedotjs, SiNextdotjs, SiSupabase, SiDocker, SiGithubactions,
  SiCloudflare, SiHetzner, SiTailwindcss,
} from 'react-icons/si';
import { FaBriefcase, FaGraduationCap, FaChartLine } from 'react-icons/fa';

export type TechId =
  | 'python' | 'java' | 'typescript' | 'javascript' | 'react' | 'vue'
  | 'spring' | 'django' | 'solidity' | 'sui' | 'node' | 'mongodb' | 'mysql'
  | 'nextjs' | 'supabase' | 'docker' | 'github-actions' | 'cloudflare'
  | 'hetzner' | 'tailwind' | 'ml';

export const TECH_ICONS: Record<TechId, { label: string; Icon: IconType }> = {
  python: { label: 'Python', Icon: DiPython },
  java: { label: 'Java', Icon: DiJava },
  typescript: { label: 'TypeScript', Icon: SiTypescript },
  javascript: { label: 'JavaScript', Icon: DiJavascript1 },
  react: { label: 'React', Icon: DiReact },
  vue: { label: 'Vue.js', Icon: SiVuedotjs },
  spring: { label: 'Java Spring', Icon: SiSpring },
  django: { label: 'Django', Icon: SiDjango },
  solidity: { label: 'Solidity', Icon: SiSolidity },
  sui: { label: 'Sui Move', Icon: SiSui },
  node: { label: 'Node.js', Icon: SiNodedotjs },
  mongodb: { label: 'MongoDB', Icon: DiMongodb },
  mysql: { label: 'MySQL', Icon: SiMysql },
  nextjs: { label: 'Next.js', Icon: SiNextdotjs },
  supabase: { label: 'Supabase', Icon: SiSupabase },
  docker: { label: 'Docker', Icon: SiDocker },
  'github-actions': { label: 'GitHub Actions', Icon: SiGithubactions },
  cloudflare: { label: 'Cloudflare', Icon: SiCloudflare },
  hetzner: { label: 'Hetzner', Icon: SiHetzner },
  tailwind: { label: 'Tailwind CSS', Icon: SiTailwindcss },
  ml: { label: 'Machine Learning', Icon: FaChartLine },
};

export { FaBriefcase, FaGraduationCap };

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
    tech: ['java', 'spring', 'vue'],
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
];
