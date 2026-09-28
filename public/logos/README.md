# Logos

Drop square PNG logos here — the UI falls back to generic icons for any
missing file, so partial drops are fine. Expected filenames:

- `turkish-technology.png` ✓ (from turkishtechnology.com favicon)
- `riskoptima.png` ✓ (from riskoptima.io)
- `suicity.png` ✓ (from suicityp2e.com)
- `bogazici.png` ✓ (official boun.edu.tr logo)
- `sakarya-fen.png` ✓
- `bogazicicim.png` ✓ (project)
- `planstudio.png` ✓ (project)
- `cvsite.png` ✓ (this site's project card)
- Freelance has no logo: its `logoId` is `''` in `src/lib/career.ts`, which
  renders the generic icon without requesting a file. To add one, drop
  `freelance.png` here and set `logoId: 'freelance'`.

Recommended: 256×256+, transparent background.
