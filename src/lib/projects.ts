import type { TechId } from './career';
import type { MetricKey } from './liveStats';

export type Project = {
  id: string;
  name: string;
  tagline: { en: string; tr: string };
  description: { en: string; tr: string };
  /** Filename stem looked up as /logos/{logoId}.png; falls back to a generic icon. */
  logoId: string;
  tech: TechId[];
  /**
   * Platform numbers, formatted per-locale at render time. `value` is the
   * last-known-good fallback and is what renders until — or unless — the live
   * count for `metricKey` arrives from /api/stats. Stats without a `metricKey`
   * are static by definition.
   */
  stats: { value: number; metricKey?: MetricKey; label: { en: string; tr: string } }[];
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
    // Live from bogazicicim.com/api/public/stats; these values are the
    // fallback. `courseTeacherReviews` is deliberately ONE combined count —
    // upstream attaches a review to a course x teacher pair, so splitting it
    // into separate course and teacher numbers would double-count.
    // `clubReviews` is disjoint from it.
    stats: [
      { value: 3239, metricKey: 'users', label: { en: 'users', tr: 'kullanıcı' } },
      { value: 17815, metricKey: 'courseTeacherReviews', label: { en: 'course/teacher reviews', tr: 'ders/hoca yorumu' } },
      { value: 2008, metricKey: 'teachers', label: { en: 'teachers', tr: 'hoca' } },
      { value: 4206, metricKey: 'courses', label: { en: 'courses', tr: 'ders' } },
      { value: 50, metricKey: 'clubs', label: { en: 'clubs', tr: 'kulüp' } },
      { value: 1812, metricKey: 'clubReviews', label: { en: 'club reviews', tr: 'kulüp yorumu' } },
      { value: 34997, metricKey: 'forumPosts', label: { en: 'forum posts', tr: 'forum gönderisi' } },
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
