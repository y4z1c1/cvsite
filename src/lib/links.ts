// Single source of truth for outbound links — shared by Hero (link buttons)
// and Chat (`cv`/`github`/`linkedin`/`email` quick commands) so they cannot drift.
export const LINKS: Record<string, string> = {
  cv: '/resume-yusuf-anil-yazici.pdf',
  github: 'https://github.com/y4z1c1',
  linkedin: 'https://www.linkedin.com/in/y4z1c1/',
  email: 'mailto:yusufanilyazici@gmail.com',
};
