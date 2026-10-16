# Blue Card production redirect deployment

Prepared October 16, 2026. **NOT LIVE.** Do not treat this file as a deployed rule set.

The domain `bluecardfund.org` has not yet been pointed at the GitHub staging site. GitHub Pages does **not** process an `.htaccess` or `_redirects` file and cannot return a genuine HTTP 301 by itself.

## Scope and safety

- Do not change DNS, GitHub Pages custom-domain settings, or staging URL paths until launch is authorized.
- Import the rules from `launch/production-redirects.csv` into the eventual production HTTP edge (e.g., a reverse proxy or Cloudflare redirect rule) only **after confirming the domain host and DNS architecture**.
- Always match the full path; preserve query strings where supported. Test both trailing-slash and old `index.html` variants if they receive traffic.
- Target URLs should be `https://bluecardfund.org` + `target_path`.
- The first eight URLs already have client-side HTML redirect stubs; these are *not* HTTP 301 responses. The other three are still full pages. **Do not delete them** until the edge redirects are deployed and verified.
- Keep distinct pages indexed: `/video-links/` and `/video-library/`; `/medication-assistance/` and `/medication-assistance-grant/`; `/emergency-assistance/` and `/emergency-cash-assistance/`. Do not merge without content owner approval.
- Before launch, review Google Search Console and the old WordPress sitemap for additional historical slugs. No speculative redirects should be activated.

## Acceptance test

After DNS cutover, each source returns **301**, with a `Location` header pointing to the correct final production URL. Final destination returns **200**, has a matching canonical URL, and does not redirect onward (avoid chains). Confirm staging `https://elettro.github.io/bluecard/` remains functional during prelaunch review. Test homepage, PDF paths, forms, social preview tags, and robots/sitemap again at launch.

## Prepared mappings

- `/hologram/` → `/interactive-hologram/` (Existing HTML redirect stub)
- `/how-we-help/dental-and-medical-assistance/` → `/dental-and-medical-assistance/` (Existing HTML redirect stub)
- `/how-we-help/education-outreach/` → `/education-outreach/` (Existing HTML redirect stub)
- `/how-we-help/emergency-cash-assistance/` → `/emergency-cash-assistance/` (Existing HTML redirect stub)
- `/how-we-help/health-wellbeing/` → `/health-well-being/` (Existing HTML redirect stub)
- `/how-we-help/monthly-assistance/` → `/ongoing-support/` (Existing HTML redirect stub)
- `/how-we-help/siggi-b-wilzig-fighting-cancer-together-program/` → `/siggi-b-wilzig-fighting-cancer-together-program/` (Existing HTML redirect stub)
- `/how-we-help/ters/` → `/telephone-response-system/` (Existing HTML redirect stub)
- `/ongoing-assistance/` → `/ongoing-support/` (Superseded content; preserve until production 301)
- `/health-and-wellbeing/` → `/health-well-being/` (Superseded content; preserve until production 301)
- `/the-blue-cards-medication-assistance-grant/` → `/medication-assistance-grant/` (Superseded content; preserve until production 301)
