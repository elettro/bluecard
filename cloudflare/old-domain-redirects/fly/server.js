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
  const m = k.match(/^\/how-we-help\/([^/]+)\/?$/);
  if (m && ['cost-plus-drug-company','natural-disaster-relief','emergency-assistance','medication-assistance','medication-assistance-grant','ongoing-assistance','health-and-wellbeing'].includes(m[1])) return '/' + m[1] + '/';
  if (/^\/(product|products|shop|store)(\/|$)/.test(k)) return '/donate/';
  if (/[-"]$/.test(k)) return k.replace(/[^/]*$/, '') || '/';
  if (LEGACY_HTML[k]) return LEGACY_HTML[k];
  if (/^\/bluecard-events-.*\.html$/.test(k)) return '/past-events/';
  if (/^\/(bluecard|how-we-help|how-to|about|contact)[^/]*\.html$/.test(k)) return '/';
  return null;
}
// WordPress short links (/?p=ID and /?page_id=ID) -> new page. IDs recovered from the Wayback Machine; unknown IDs go to the homepage.
const WP_IDS = {
  '3': '/privacy-policy/',
  '254': '/who-we-are/',
  '289': '/emergency-cash-assistance/',
  '290': '/emergency-assistance/',
  '291': '/health-well-being/',
  '292': '/education-outreach/',
  '314': '/donate/',
  '316': '/volunteering/',
  '317': '/virtual-volunteering/',
  '318': '/team-blue-card/',
  '319': '/young-leadership/',
  '321': '/upcoming-events/',
  '584': '/blog/',
  '631': '/team-blue-card/',
  '657': '/survivors/',
  '742': '/past-events/',
  '749': '/dental-and-medical-assistance/',
  '752': '/telephone-response-system/',
  '756': '/ongoing-support/',
  '761': '/bnei-mitzvah-simcha-project/',
  '763': '/volunteering/',
  '772': '/newsletters/',
  '796': '/apply-here/',
  '818': '/calendars/',
  '1081': '/blog/2.html',
  '1090': '/blog/',
  '1248': '/blog/',
  '1336': '/calendars/',
  '1458': '/blog/6.html',
  '1464': '/blog/7.html',
  '1712': '/apply-here/',
  '1731': '/blog/',
  '1791': '/staff/',
  '1792': '/board-members/',
  '1814': '/990-financials/',
  '1815': '/990-financials/',
  '1952': '/blog/5.html',
  '1981': '/newsletters/',
  '2077': '/our-supporters/',
  '2162': '/new-applicant/',
  '2169': '/resources/',
  '2170': '/referring-agencies/',
  '3465': '/blog/11.html',
  '3547': '/resources/',
  '3602': '/blog/',
  '3657': '/blog/12.html',
  '3911': '/sitemap/',
  '4096': '/press/',
  '4637': '/blog/13.html',
  '5826': '/blog/1.html',
  '5895': '/blog/17.html',
  '5964': '/speakers-bureau/sami-steigmann/',
  '6012': '/speakers-bureau/',
  '6059': '/speakers-bureau/robert-brajer/',
  '6091': '/medication-assistance-grant/',
  '6125': '/press/',
  '6242': '/speakers-bureau/',
  '6289': '/podcast/',
  '6334': '/cost-plus-drug-company/',
  '6376': '/blog/18.html',
  '6579': '/speakers-bureau/goldie-jacoby/',
  '7123': '/donate/',
  '7127': '/donate/',
  '7128': '/donate/',
  '7129': '/donate/',
  '7187': '/donate/',
  '7188': '/donate/',
  '7246': '/donate/',
  '7247': '/donate/',
  '7300': '/donate/',
  '7338': '/calendars/',
  '7346': '/donate/',
  '7479': '/upcoming-events/',
  '7750': '/young-leadership/',
  '8188': '/blog/',
  '8556': '/blog/19.html',
  '8578': '/speakers-bureau/olga-spiegel/',
  '8590': '/speakers-bureau/lillian-feintuch/',
  '8970': '/interactive-hologram/',
  '9237': '/blog/20.html',
  '9243': '/blog/21.html',
  '9253': '/blog/22.html',
  '9653': '/blog/23.html',
  '9770': '/speakers-bureau/tom-jacobson/',
  '9852': '/speakers-bureau/fred-schoenfeld/',
  '9981': '/report-to-the-community/',
  '10271': '/terms-and-conditions/',
  '10280': '/sms-opt-in-policy/'
};
const LOWER = {};
for (const k of Object.keys(MAP)) LOWER[k.toLowerCase()] = MAP[k];

function resolve(rawPath, search) {
  const idm = (rawPath === '/' || rawPath === '/index.php') && search ? search.match(/[?&](?:p|page_id)=(\d+)/) : null;
  if (idm && WP_IDS[idm[1]]) return encodeURI(NEW + WP_IDS[idm[1]]);
  let path = rawPath;
  try { path = decodeURIComponent(path); } catch (e) {}
  path = path.replace(/\/(comments\/)?feed\/?$/i, '/'); // WordPress per-post RSS -> the post itself
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
