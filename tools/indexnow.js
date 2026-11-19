// Tell IndexNow search engines (Bing, Yandex, etc.) which bluecard.org URLs are new or changed.
// Usage:  node tools/indexnow.js            -> submits every URL in sitemap.xml
//         node tools/indexnow.js /new-york/ /south-florida/   -> submits just those paths
// The key file https://bluecard.org/a363a69a9c2d9b1385350e497194bc23.txt must be live first.
const fs = require('fs');
const KEY = 'a363a69a9c2d9b1385350e497194bc23';
const HOST = 'bluecard.org';
let urls = process.argv.slice(2).map(p => p.startsWith('http') ? p : 'https://' + HOST + (p.startsWith('/') ? p : '/' + p));
if (!urls.length) {
  const xml = fs.readFileSync(__dirname + '/../sitemap.xml', 'utf8');
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
}
(async () => {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: 'https://' + HOST + '/' + KEY + '.txt', urlList: urls })
  });
  console.log('submitted', urls.length, 'URLs ->', res.status, res.statusText);
})();
