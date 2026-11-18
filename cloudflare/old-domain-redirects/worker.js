// bluecardfund.org -> bluecard.org permanent redirects (301), page to page, single hop.
// redirects.json is {old_path: new_path}; build it with build_map.py.
import MAP from './redirects.json';

const NEW = 'https://bluecard.org';

function norm(p) {
  let s = p.toLowerCase();
  if (!s.startsWith('/wp-content/')) { if (!s.endsWith('/')) s += '/'; }
  return s;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const key = norm(url.pathname);
    // exact file paths keep their original case in the map
    let target = MAP[url.pathname] || MAP[key];
    if (!target) {
      const lower = Object.keys(MAP).find((k) => k.toLowerCase() === key);
      if (lower) target = MAP[lower];
    }
    if (!target) {
      const p = url.pathname;
      if (p === '/robots.txt') target = '/robots.txt';
      else if (/^\/(sitemap.*\.xml|wp-sitemap.*\.xml)$/i.test(p)) target = '/sitemap.xml';
      else if (/^\/(wp-|feed|comments|author|category|tag|page|xmlrpc|\?s=)/i.test(p)) target = '/';
      else target = p; // same path on the new site (its 404 page handles strays)
    }
    // mapped targets drop the query string; unknown same-path keep it
    const qs = MAP[url.pathname] || MAP[key] ? '' : url.search;
    return new Response(null, {
      status: 301,
      headers: { Location: NEW + target + qs, 'Cache-Control': 'public, max-age=86400' },
    });
  },
};
