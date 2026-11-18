// bluecardfund.org -> bluecard.org 301 redirect service (runs on Fly.io).
// Same rules as ../worker.js. redirects.json is {old_path: new_path}.
const http = require('http');
const MAP = require('./redirects.json');
const NEW = 'https://bluecard.org';
const LOWER = {};
for (const k of Object.keys(MAP)) LOWER[k.toLowerCase()] = MAP[k];

function resolve(rawPath, search) {
  let path = rawPath;
  try { path = decodeURIComponent(path); } catch (e) {}
  const key = path.toLowerCase().startsWith('/wp-content/') ? path.toLowerCase() : (path.toLowerCase().endsWith('/') ? path.toLowerCase() : path.toLowerCase() + '/');
  let target = MAP[path] || MAP[key] || LOWER[key] || LOWER[path.toLowerCase()];
  let qs = '';
  if (!target) {
    if (path === '/robots.txt') target = '/robots.txt';
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
