// bluecardfund.org -> bluecard.org permanent redirects (301), page to page, single hop.
// redirects.json is {old_path: new_path}; build it with build_map.py.
import MAP from './redirects.json';

const NEW = 'https://bluecard.org';

// Pre-WordPress legacy *.html pages (Search Console 404s) -> closest page on the new site.
const LEGACY_HTML = {
  '/home.html': '/', '/index.html': '/',
  '/howyoucanhelp.html': '/how-we-help/', '/how-we-help.html': '/how-we-help/',
  '/how-we-help-hildegard-lash-foundation.html': '/how-we-help/',
  '/about-us.html': '/who-we-are/', '/contact-us.html': '/contact/',
  '/bluecard-newsletters.html': '/newsletters/', '/bluecard-board-members.html': '/board-members/',
  '/bluecard-tribute.html': '/special-tribute/', '/young-leadership.html': '/young-leadership/',
  '/bluecard-events-partners.html': '/our-supporters/', '/bluecard-giving-grid.html': '/donate/',
  '/how-to-apply.html': '/apply-here/',
};
function legacyHtml(p) {
  const k = p.toLowerCase();
  if (LEGACY_HTML[k]) return LEGACY_HTML[k];
  if (/^\/bluecard-events-.*\.html$/.test(k)) return '/past-events/';
  if (/^\/(bluecard|how-we-help|how-to|about|contact)[^/]*\.html$/.test(k)) return '/';
  return null;
}

function norm(p) {
  let s = p.toLowerCase();
  if (!s.startsWith('/wp-content/')) { if (!s.endsWith('/')) s += '/'; }
  return s;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;
    try { path = decodeURIComponent(path); } catch (e) {}
    const key = norm(path);
    // exact file paths keep their original case in the map
    let target = MAP[path] || MAP[key];
    if (!target) {
      const lower = Object.keys(MAP).find((k) => k.toLowerCase() === key);
      if (lower) target = MAP[lower];
    }
    if (!target) {
      const p = path;
      if (legacyHtml(p)) target = legacyHtml(p);
      else if (p === '/robots.txt') target = '/robots.txt';
      else if (/^\/(sitemap.*\.xml|wp-sitemap.*\.xml)$/i.test(p)) target = '/sitemap.xml';
      else if (/^\/(wp-|feed|comments|author|category|tag|page|xmlrpc|\?s=)/i.test(p)) target = '/';
      else target = p; // same path on the new site (its 404 page handles strays)
    }
    // mapped targets drop the query string; unknown same-path keep it
    const qs = MAP[path] || MAP[key] ? '' : url.search;
    return new Response(null, {
      status: 301,
      headers: { Location: encodeURI(NEW + target + qs), 'Cache-Control': 'public, max-age=86400' },
    });
  },
};
