import type { TechId } from './career';

export type Project = {
  id: string;
  name: string;
  tagline: { en: string; tr: string };
  description: { en: string; tr: string };
  /** Filename stem looked up as /logos/{logoId}.png; falls back to a generic icon. */
  logoId: string;
  tech: TechId[];
  deploySteps: { en: string[]; tr: string[] };
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
    deploySteps: {
      en: [
        'push to main → GitHub Actions builds a standalone Next.js Docker image',
        'image pushed to GHCR (never built on the server)',
        'Coolify webhook pulls & rolling-deploys on a Hetzner box',
        'Traefik terminates TLS, Cloudflare proxies DNS',
        'Umami self-hosted on the same box for analytics',
      ],
      tr: [
        'main\'e push → GitHub Actions standalone Next.js Docker imajı derler',
        'imaj GHCR\'a gönderilir (sunucuda asla build alınmaz)',
        'Coolify webhook\'u Hetzner sunucusunda rolling deploy başlatır',
        'TLS Traefik\'te sonlanır, DNS Cloudflare proxy\'sinden geçer',
        'Analitik için aynı sunucuda self-hosted Umami',
      ],
    },
    links: [{ label: 'bogazicicim.com', url: 'https://bogazicicim.com' }],
  },
];
