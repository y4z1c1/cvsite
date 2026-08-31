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
    id: 'planstudio',
    name: 'PlanStudio',
    tagline: {
      en: '3D floor-plan viewer: exact room m² + furniture fitting from phone scans',
      tr: 'telefon taramasından kesin oda m² ölçen 3D ev planı ve mobilya yerleşim aracı',
    },
    description: {
      en: "Scan a home with Polycam, drop the GLB in: per-room areas are measured exactly from the scan's semantic structure, real-scale furniture placement with soft wall physics shows what fits, and a first-person walk mode with openable doors lets you tour it. Vanilla three.js ES modules, no build step; bilingual (TR/EN).",
      tr: "Evi Polycam ile tarat, GLB'yi bırak: oda alanları taramanın semantik yapısından kesin ölçülür, duvar fizikli gerçek ölçekli mobilya yerleşimi neyin sığacağını gösterir, kapıları açılabilen birinci şahıs dolaşma moduyla evi gezersin. Saf three.js ES modülleri, build adımı yok; iki dilli (TR/EN).",
    },
    logoId: 'planstudio',
    tech: ['javascript', 'threejs', 'docker', 'github-actions', 'cloudflare', 'hetzner'],
    stats: [],
    links: [
      { label: 'plan.yusufanilyazici.com', url: 'https://plan.yusufanilyazici.com' },
      { label: 'github.com/y4z1c1/planstudio', url: 'https://github.com/y4z1c1/planstudio' },
    ],
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
