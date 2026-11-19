// bluecardfund.org -> bluecard.org 301 redirect service (runs on Fly.io).
// Same rules as ../worker.js. redirects.json is {old_path: new_path}.
const http = require('http');
const MAP = require('./redirects.json');
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
const LOWER = {};
for (const k of Object.keys(MAP)) LOWER[k.toLowerCase()] = MAP[k];

function resolve(rawPath, search) {
  let path = rawPath;
  try { path = decodeURIComponent(path); } catch (e) {}
  const key = path.toLowerCase().startsWith('/wp-content/') ? path.toLowerCase() : (path.toLowerCase().endsWith('/') ? path.toLowerCase() : path.toLowerCase() + '/');
  let target = MAP[path] || MAP[key] || LOWER[key] || LOWER[path.toLowerCase()];
  let qs = '';
  if (!target) {
    if (legacyHtml(path)) { target = legacyHtml(path); }
    else if (path === '/robots.txt') target = '/robots.txt';
    else if (/^\/(sitemap.*\.xml|wp-sitemap.*\.xml)$/i.test(path)) target = '/sitemap.xml';
    else if (/^\/(wp-|feed|comments|author|category|tag|page|xmlrpc)/i.test(path)) target = '/';
    else { target = path; qs = search; }
  }
  return encodeURI(NEW + target + qs);
}

http.createServer((req, res) => {
  if (req.url === '/__health') { res.writeHead(200); return res.end('ok'); }
  const u = new URL(req.url, 'http://x');
  res.writeHead(301, { Location: resolve(u.pathname, u.search), 'Cache-Control': 'public, max-age=86400' });
  res.end();
}).listen(process.env.PORT || 8080, '0.0.0.0');
