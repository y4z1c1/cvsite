import type { TechId } from './career';

export type Project = {
  id: string;
  name: string;
  tagline: { en: string; tr: string };
  description: { en: string; tr: string };
  /** Filename stem looked up as /logos/{logoId}.png; falls back to a generic icon. */
  logoId: string;
  tech: TechId[];
  /** Live platform numbers; formatted per-locale at render time. */
  stats: { value: number; label: { en: string; tr: string } }[];
  links: { label: string; url: string }[];
};

export const PROJECTS: Project[] = [
  {
    id: 'bogazicicim',
    name: 'Boğaziçi Çim',
    tagline: {
      en: 'course & teacher reviews + forum for Boğaziçi University students',
      tr: 'Boğaziçi Üniversitesi öğrencileri için ders & hoca yorumları + forum',
    },
    description: {
      en: 'A full-stack platform where Boğaziçi students review courses, teachers and clubs, and discuss on a forum. Built solo: product, backend, frontend and all infrastructure.',
      tr: 'Boğaziçi öğrencilerinin dersleri, hocaları ve kulüpleri değerlendirdiği, forumda tartıştığı full-stack bir platform. Ürün, backend, frontend ve tüm altyapı tek kişilik iş.',
    },
    logoId: 'bogazicicim',
    tech: ['nextjs', 'typescript', 'supabase', 'tailwind', 'docker', 'github-actions', 'cloudflare', 'hetzner'],
    stats: [
      { value: 3239, label: { en: 'users', tr: 'kullanıcı' } },
      { value: 17815, label: { en: 'course/teacher reviews', tr: 'ders/hoca yorumu' } },
      { value: 2008, label: { en: 'teachers', tr: 'hoca' } },
      { value: 4206, label: { en: 'courses', tr: 'ders' } },
      { value: 50, label: { en: 'clubs', tr: 'kulüp' } },
      { value: 1812, label: { en: 'club reviews', tr: 'kulüp yorumu' } },
      { value: 34997, label: { en: 'forum posts', tr: 'forum gönderisi' } },
    ],
    links: [{ label: 'bogazicicim.com', url: 'https://bogazicicim.com' }],
  },
  {
    id: 'cvsite',
    name: 'yusufanilyazici.com',
    tagline: {
      en: 'this website — an AI persona of me you can chat with',
      tr: 'bu site — benimle sohbet edebildiğin bir yapay zeka personam',
    },
    description: {
      en: 'The site you are on right now. A Next.js portfolio where an LLM answers as me with streaming replies, rich UI cards (this one included), and chat-driven theme/language switching.',
      tr: 'Şu an içinde olduğun site. Bir LLM\'in benim yerime yanıt verdiği Next.js portfolyo: akan yanıtlar, zengin UI kartları (bu kart dahil) ve sohbetten tema/dil değiştirme.',
    },
    logoId: 'cvsite',
    tech: ['nextjs', 'typescript', 'docker', 'github-actions', 'cloudflare', 'hetzner'],
    stats: [],
    links: [{ label: 'github.com/y4z1c1/cvsite', url: 'https://github.com/y4z1c1/cvsite' }],
  },
];
