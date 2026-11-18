# Pre-built Tailwind styles

These CSS files replace the Tailwind browser script (cdn.tailwindcss.com) that five pages used to load on every visit:

- home.css -> index.html
- education-outreach.css, special-tribute.css, speakers-bureau.css, virtual-volunteering.css

Built with Tailwind CSS 3.4.17 (+ forms and container-queries plugins), minified, using each page's own settings.
virtual-volunteering.css uses the default settings because that page's inline config has a syntax error (an extra `}`) and was already being ignored by the browser.

If you add NEW Tailwind utility classes to one of these pages, the matching file here must be rebuilt, or the new classes will have no styling.
