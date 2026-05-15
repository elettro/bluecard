const data = [
  { region: "Alberta", agencies: [{ city: "Calgary", name: "Calgary Jewish Community Centre", url: "https://www.calgaryjcc.com/" }]},
  { region: "Alabama", agencies: [{ city: "Birmingham", name: "Levite JCC", url: "https://bhamjcc.org/" }]},
  { region: "Arizona", agencies: [{ city: "Chandler", name: "East Valley JCC", url: "https://www.evjcc.org/" },{ city: "Scottsdale", name: "Martin Pear JCC in the Valley of the Sun", url: "https://www.vosjcc.org/" },{ city: "Tucson", name: "Tucson Jewish Community Center", url: "https://tucsonjcc.org/" }]},
  { region: "California", agencies: [{ city: "Berkeley", name: "Jewish Community Center of the East Bay", url: "https://jcceastbay.org/" },{ city: "Los Angeles", name: "Westside Jewish Community Center", url: "http://www.westsidejcc.org/" },{ city: "San Francisco", name: "JCC of San Francisco", url: "https://www.jccsf.org/" }]},
  { region: "Florida", agencies: [{ city: "Miami", name: "Dave & Mary Alper JCC", url: "https://www.alperjcc.org/" },{ city: "Miami Beach", name: "Galbut Family Miami Beach JCC on the Simkins Family Campus", url: "https://mbjcc.org/" }]},
  { region: "New York", agencies: [{ city: "Brooklyn", name: "Hebrew Educational Society", url: "https://www.thehes.org/" },{ city: "New York", name: "Marlene Meyerson JCC Manhattan", url: "https://mmjccm.org/" },{ city: "Staten Island", name: "Joan and Alan Bernikow JCC of Staten Island", url: "https://www.sijcc.org/" }]},
  { region: "Ontario", agencies: [{ city: "Toronto", name: "Miles Nadal JCC", url: "https://www.mnjcc.org/" }]},
  { region: "Quebec", agencies: [{ city: "Montreal", name: "Sylvan Adams YM-YWHA", url: "https://ymywha.com/" }]},
  { region: "Texas", agencies: [{ city: "Austin", name: "Shalom Austin JCC", url: "https://shalomaustin.org/" },{ city: "Houston", name: "Evelyn Rubenstein Jewish Community Center", url: "https://www.erjcchouston.org/" }]}
];

function buildAccordion(filter) {
  const accordion = document.getElementById('accordion');
  accordion.innerHTML = '';
  let totalVisible = 0;
  const q = (filter || '').toLowerCase().trim();
  data.forEach((reg) => {
    const matchingAgencies = reg.agencies.filter(a => !q || a.city.toLowerCase().includes(q) || a.name.toLowerCase().includes(q));
    if (q && matchingAgencies.length === 0) return;
    totalVisible += matchingAgencies.length;
    const forceOpen = q && matchingAgencies.length > 0;
    const div = document.createElement('div'); div.className = 'region';
    const header = document.createElement('div');
    header.className = 'region-header' + (forceOpen ? ' open' : '');
    header.innerHTML = `<span class="region-name">${reg.region}</span><span class="region-count">${matchingAgencies.length}</span><svg class="chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>`;
    const body = document.createElement('div'); body.className = 'region-body' + (forceOpen ? ' open' : '');
    matchingAgencies.forEach(a => {
      const row = document.createElement('div'); row.className = 'agency';
      const cityHl = q ? highlight(a.city, q) : a.city;
      const nameHl = q ? highlight(a.name, q) : a.name;
      row.innerHTML = `<span class="agency-city">${cityHl}</span><span class="agency-name"><a href="${a.url}" target="_blank" rel="noopener">${nameHl}</a></span>`;
      body.appendChild(row);
    });
    header.addEventListener('click', () => { header.classList.toggle('open'); body.classList.toggle('open'); });
    div.appendChild(header); div.appendChild(body); accordion.appendChild(div);
  });
  document.getElementById('resultCount').textContent = q ? `${totalVisible} result${totalVisible !== 1 ? 's' : ''}` : '';
}
function highlight(text, q) { const idx = text.toLowerCase().indexOf(q); return idx === -1 ? text : text.slice(0, idx) + '<mark>' + text.slice(idx, idx + q.length) + '</mark>' + text.slice(idx + q.length); }
function expandAll() { document.querySelectorAll('.region-header').forEach(h => h.classList.add('open')); document.querySelectorAll('.region-body').forEach(b => b.classList.add('open')); }
function collapseAll() { document.querySelectorAll('.region-header').forEach(h => h.classList.remove('open')); document.querySelectorAll('.region-body').forEach(b => b.classList.remove('open')); }
function clearSearch() { document.getElementById('searchInput').value = ''; buildAccordion(''); }
document.getElementById('searchInput').addEventListener('input', function() { buildAccordion(this.value); });
buildAccordion('');
