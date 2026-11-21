#!/usr/bin/env python3
"""Build /newsletters/ homebase (search + categories + year groups), update sitemap.xml and llms.txt.
Local only. Original PDF-only index is preserved below the archive as 'Printed newsletters'."""
import json, os, re, html, subprocess, collections

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.environ.get("NL_REPO") or os.path.abspath(os.path.join(HERE, "..", ".."))
WORK = HERE
SITE = "https://bluecard.org"
CAT_ORDER = ["In the Press", "Remembrance", "Programs & Help", "Statements", "Disaster Relief", "Year in Review"]
CAT_BLURB = {
    "In the Press": "Press features, op-eds and news about The Blue Card",
    "Remembrance": "Holocaust remembrance days, tributes and history",
    "Programs & Help": "How The Blue Card helps survivors, and guidance for families",
    "Statements": "Public statements from The Blue Card",
    "Disaster Relief": "Emergency help for survivors after disasters",
    "Year in Review": "Annual look back at our work",
}


def esc(s):
    return html.escape(s, quote=True)


def original_index():
    return open(os.path.join(REPO, "newsletters", "index.html"), encoding="utf-8").read()


def main():
    cards = json.load(open(os.path.join(WORK, "cards.json"), encoding="utf-8"))
    cards.sort(key=lambda c: c["yymmdd"], reverse=True)
    total = len(cards)
    years = sorted({c["year"] for c in cards}, reverse=True)
    by_year = collections.OrderedDict((y, [c for c in cards if c["year"] == y]) for y in years)
    cats = collections.Counter(c["cat"] for c in cards)
    first, last = cards[-1]["date_long"], cards[0]["date_long"]

    orig = original_index()
    org_schema = next(l for l in orig.split("\n") if '"Organization","NGO"' in l)
    web_schema = next(l for l in orig.split("\n") if '"@type": "WebSite"' in l)
    icons = "\n".join(l for l in orig.split("\n") if l.startswith('<link href="/favicon') or l.startswith('<link href="/apple'))
    old_css = re.findall(r"<style>(.*?)</style>", orig, re.S)[-1]
    pdf_main = orig[orig.index('<section class="newsletters-featured">'):orig.index("</main>")]
    if 'class="nl-print"' in orig:
        pdf_main = pdf_main.rsplit("\n    </div>\n  </div>", 1)[0]

    desc = ("Read The Blue Card's email newsletters online: %d past messages from %s through %s on Holocaust "
            "survivor care, remembrance, press coverage and ways to help." % (total, first, last))
    title = "Newsletter Archive | The Blue Card"
    url = SITE + "/newsletters/"

    # JSON-LD
    items = [{"@type": "ListItem", "position": i + 1, "url": "%s/newsletters/%s/" % (SITE, c["slug"]), "name": c["title"]}
             for i, c in enumerate(cards)]
    ld_page = {"@context": "https://schema.org", "@type": "CollectionPage", "@id": url + "#collection", "url": url,
               "name": "Newsletter Archive", "description": desc, "isPartOf": {"@id": SITE + "/#website"},
               "publisher": {"@id": SITE + "/#organization"}, "inLanguage": "en", "numberOfItems": total,
               "mainEntity": {"@type": "ItemList", "numberOfItems": total, "itemListElement": items}}
    ld_crumb = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
        {"@type": "ListItem", "position": 2, "name": "Newsletters", "item": url}]}

    css = """
  :root{--bc-blue:#064d8b;--bc-deep:#073763;--bc-ink:#172033;--bc-muted:#5d6a7c;--bc-line:#dbe6f2;--bc-soft:#f5f9fd;--bc-card:#fff}
  *{box-sizing:border-box}
  body{margin:0;font-family:Arial,Helvetica,sans-serif;color:var(--bc-ink);background:#fff}
  .nl-page{width:100%;background:linear-gradient(180deg,#f7fbff 0%,#fff 240px)}
  .nl-wrap{max-width:1180px;margin:0 auto;padding:56px 22px 72px}
  .nl-eyebrow{color:var(--bc-blue);font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;margin:0 0 12px}
  .nl-hero{display:grid;grid-template-columns:1.35fr .65fr;gap:30px;align-items:end;border-bottom:1px solid var(--bc-line);padding-bottom:30px}
  .nl-hero h1{margin:0;font-size:clamp(34px,5vw,62px);line-height:1.02;letter-spacing:-.04em;color:var(--bc-deep)}
  .nl-hero p{margin:16px 0 0;max-width:760px;color:var(--bc-muted);font-size:18px;line-height:1.6}
  .nl-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
  .nl-stat{background:var(--bc-card);border:1px solid var(--bc-line);border-radius:18px;padding:18px;box-shadow:0 12px 32px rgba(7,55,99,.07)}
  .nl-stat strong{display:block;color:var(--bc-blue);font-size:32px;line-height:1}
  .nl-stat span{display:block;margin-top:8px;color:var(--bc-muted);font-size:13px;line-height:1.35}
  .nl-controls{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.95);backdrop-filter:blur(12px);border:1px solid var(--bc-line);border-radius:22px;padding:16px;margin:28px 0 34px;box-shadow:0 18px 48px rgba(7,55,99,.08)}
  .nl-control-row{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:center}
  .nl-search{width:100%;border:1px solid var(--bc-line);border-radius:999px;padding:14px 18px;font-size:15px;outline:none;color:var(--bc-ink);background:#fff}
  .nl-search:focus{border-color:var(--bc-blue);box-shadow:0 0 0 4px rgba(6,77,139,.12)}
  .nl-reset{border:1px solid var(--bc-blue);background:var(--bc-blue);color:#fff;padding:13px 18px;border-radius:999px;font-weight:700;cursor:pointer}
  .nl-filter-label{margin:14px 0 6px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--bc-muted);font-weight:700}
  .nl-chips,.nl-year-nav{display:flex;flex-wrap:wrap;gap:9px}
  .nl-chip{cursor:pointer;display:inline-flex;align-items:center;gap:7px;color:var(--bc-deep);border:1px solid var(--bc-line);background:var(--bc-soft);border-radius:999px;padding:9px 13px;font-size:13px;font-weight:700;font-family:inherit}
  .nl-chip span{color:var(--bc-muted);font-weight:700}
  .nl-chip:hover{border-color:var(--bc-blue);color:var(--bc-blue);background:#fff}
  .nl-chip[aria-pressed="true"]{background:var(--bc-blue);border-color:var(--bc-blue);color:#fff}
  .nl-chip[aria-pressed="true"] span{color:#cfe3f7}
  .nl-year-pill{display:inline-flex;align-items:center;gap:7px;text-decoration:none;color:var(--bc-deep);border:1px solid var(--bc-line);background:var(--bc-soft);border-radius:999px;padding:9px 12px;font-size:13px;font-weight:700}
  .nl-year-pill span{color:var(--bc-muted)}
  .nl-year-pill:hover{border-color:var(--bc-blue);color:var(--bc-blue);background:#fff}
  .nl-results-note{margin:14px 2px 0;color:var(--bc-muted);font-size:14px;font-weight:700}
  .nl-year-section{scroll-margin-top:200px;margin:42px 0 0}
  .nl-year-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid var(--bc-line);margin-bottom:18px;padding-bottom:12px}
  .nl-year-heading h2{margin:0;color:var(--bc-deep);font-size:34px;letter-spacing:-.03em}
  .nl-year-heading span{color:var(--bc-muted);font-weight:700;font-size:14px}
  .nl-card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
  .nl-card{background:var(--bc-card);border:1px solid var(--bc-line);border-radius:22px;padding:20px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 14px 36px rgba(7,55,99,.06);transition:transform .15s,box-shadow .15s}
  .nl-card:hover{transform:translateY(-3px);box-shadow:0 22px 44px rgba(7,55,99,.12);border-color:#b9d2ec}
  .nl-card-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:12px}
  .nl-date{color:var(--bc-blue);font-size:15px;font-weight:800;line-height:1.25}
  .nl-cat{color:var(--bc-muted);background:var(--bc-soft);border:1px solid var(--bc-line);border-radius:999px;padding:5px 9px;font-size:11px;font-weight:700;white-space:nowrap}
  .nl-card h3{margin:0 0 10px;font-size:18px;line-height:1.28;letter-spacing:-.015em}
  .nl-card h3 a{color:var(--bc-ink);text-decoration:none}
  .nl-card h3 a:hover{color:var(--bc-blue);text-decoration:underline;text-underline-offset:3px}
  .nl-card p{margin:0;color:var(--bc-muted);font-size:14px;line-height:1.55}
  .nl-read{display:inline-block;margin-top:18px;color:#fff;background:var(--bc-blue);border:1px solid var(--bc-blue);border-radius:999px;padding:9px 14px;font-size:13px;font-weight:800;text-decoration:none;align-self:flex-start}
  .nl-read:hover{color:var(--bc-blue);background:#fff}
  .nl-hidden{display:none!important}
  .nl-empty{display:none;margin:40px 0;padding:26px;border:1px dashed var(--bc-line);border-radius:18px;color:var(--bc-muted);text-align:center}
  .nl-print-intro{margin:70px 0 0;padding-top:34px;border-top:1px solid var(--bc-line)}
  .nl-print-intro h2{margin:0 0 8px;color:var(--bc-deep);font-size:34px;letter-spacing:-.03em}
  .nl-print-intro p{margin:0;color:var(--bc-muted);font-size:16px;line-height:1.6;max-width:760px}
  .nl-print .newsletters-container{width:100%}
  .nl-print .newsletters-featured{padding:30px 0 10px}
  .nl-print .newsletter-archive{padding:10px 0 0}
  @media (max-width:980px){.nl-hero{grid-template-columns:1fr}.nl-card-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media (max-width:640px){.nl-wrap{padding:38px 16px 54px}.nl-controls{position:static}.nl-year-section{scroll-margin-top:24px}.nl-control-row{grid-template-columns:1fr}.nl-card-grid{grid-template-columns:1fr}}
"""
    chips = ['<button type="button" class="nl-chip" data-cat="" aria-pressed="true">All <span>%d</span></button>' % total]
    for c in CAT_ORDER:
        if cats.get(c):
            chips.append('<button type="button" class="nl-chip" data-cat="%s" aria-pressed="false" title="%s">%s <span>%d</span></button>'
                         % (esc(c), esc(CAT_BLURB[c]), esc(c), cats[c]))
    pills = "".join('<a href="#year-%d" class="nl-year-pill">%d <span>%d</span></a>' % (y, y, len(v)) for y, v in by_year.items())

    sections = []
    for y, lst in by_year.items():
        cs = []
        for c in lst:
            hay = " ".join([c["title"], c["desc"], c["cat"], c["date_long"], str(c["year"])]).lower()
            cs.append(
                '<article class="nl-card" data-cat="%s" data-search="%s">'
                '<div><div class="nl-card-top"><time class="nl-date" datetime="%s">%s</time><span class="nl-cat">%s</span></div>'
                '<h3><a href="/newsletters/%s/">%s</a></h3><p>%s</p></div>'
                '<a class="nl-read" href="/newsletters/%s/" aria-label="Read: %s">Read newsletter &rarr;</a></article>'
                % (esc(c["cat"]), esc(hay), c["date_iso"], esc(c["date_long"]), esc(c["cat"]), c["slug"], esc(c["title"]),
                   esc(c["desc"]), c["slug"], esc(c["title"])))
        sections.append(
            '<section class="nl-year-section" id="year-%d" data-year-section="%d"><div class="nl-year-heading"><h2>%d</h2>'
            '<span class="nl-year-count">%d newsletters</span></div><div class="nl-card-grid">%s</div></section>'
            % (y, y, y, len(lst), "".join(cs)))

    js = """
(function(){
  var TOTAL=%d;
  var search=document.getElementById('nlSearch'),reset=document.getElementById('nlReset'),note=document.getElementById('nlNote'),
      empty=document.getElementById('nlEmpty'),cards=[].slice.call(document.querySelectorAll('.nl-card')),
      sections=[].slice.call(document.querySelectorAll('.nl-year-section')),chips=[].slice.call(document.querySelectorAll('.nl-chip')),cat='';
  function run(){
    var q=search.value.trim().toLowerCase(),shown=0;
    cards.forEach(function(c){
      var ok=(!q||(c.getAttribute('data-search')||'').indexOf(q)>-1)&&(!cat||c.getAttribute('data-cat')===cat);
      c.classList.toggle('nl-hidden',!ok); if(ok)shown++;
    });
    sections.forEach(function(s){
      var n=s.querySelectorAll('.nl-card:not(.nl-hidden)').length;
      s.classList.toggle('nl-hidden',n===0);
      s.querySelector('.nl-year-count').textContent=n+' newsletter'+(n===1?'':'s');
    });
    note.textContent=(q||cat)?('Showing '+shown+' of '+TOTAL+' newsletters'+(cat?' in '+cat:'')+(q?' matching "'+search.value.trim()+'"':'')+'.'):('Showing all '+TOTAL+' newsletters, newest first.');
    empty.style.display=shown?'none':'block';
  }
  chips.forEach(function(b){b.addEventListener('click',function(){cat=b.getAttribute('data-cat');chips.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});run();});});
  search.addEventListener('input',run);
  reset.addEventListener('click',function(){search.value='';cat='';chips.forEach(function(x,i){x.setAttribute('aria-pressed',i===0?'true':'false')});run();search.focus();});
})();
""" % total

    page = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">\n'
            '<title>%s</title>\n<link rel="stylesheet" href="../global-layout.css?v=20260806-1536"/>\n'
            '<style>@media (max-width:1099px){#bc-global-nav{min-height:179px}}@media (max-width:767px){#bc-global-nav{min-height:174px}}</style>\n'
            '<style>%s</style>\n<style>%s</style>\n' % (esc(title), css, old_css)
            + '<meta name="description" content="%s">\n' % esc(desc)
            + '<meta property="og:title" content="%s">\n<meta property="og:description" content="%s">\n<meta property="og:type" content="website">\n' % (esc(title), esc(desc))
            + '<meta property="og:url" content="%s">\n<meta property="og:site_name" content="The Blue Card">\n' % url
            + '<meta property="og:image" content="%s/images/share/blue-card-share.png">\n<meta name="twitter:card" content="summary_large_image">\n' % SITE
            + '<meta name="twitter:image" content="%s/images/share/blue-card-share.png">\n<meta name="twitter:title" content="%s">\n<meta name="twitter:description" content="%s">\n' % (SITE, esc(title), esc(desc))
            + '<link rel="canonical" href="%s">\n' % url
            + org_schema + "\n" + web_schema + "\n"
            + '<script type="application/ld+json" data-seo-schema="true">%s</script>\n' % json.dumps(ld_page, ensure_ascii=False)
            + '<script type="application/ld+json" data-seo-schema="true">%s</script>\n' % json.dumps(ld_crumb, ensure_ascii=False)
            + icons + "\n</head>\n<body>\n"
            + '  <header id="bc-global-nav" aria-label="Global header"></header>\n'
            + '  <main class="nl-page"><div class="nl-wrap">\n'
            + '    <section class="nl-hero"><div><p class="nl-eyebrow">From The Blue Card</p><h1>Newsletter Archive</h1>'
              '<p>Read every email newsletter The Blue Card has shared with our community, from survivor stories and remembrance messages to press features and ways to help. '
              'Each one is dated and sorted newest first by year.</p></div>'
              '<div class="nl-stats"><div class="nl-stat"><strong>%d</strong><span>Newsletters online</span></div>'
              '<div class="nl-stat"><strong>%d&ndash;%d</strong><span>Years covered</span></div></div></section>\n' % (total, years[-1], years[0])
            + '    <section class="nl-controls" aria-label="Newsletter archive controls">'
              '<div class="nl-control-row"><input class="nl-search" id="nlSearch" type="search" placeholder="Search newsletters by title, topic, or date..." aria-label="Search newsletter archive">'
              '<button class="nl-reset" id="nlReset" type="button">Reset</button></div>'
              '<p class="nl-filter-label">Browse by topic</p><div class="nl-chips" role="group" aria-label="Filter by topic">%s</div>' % "".join(chips)
            + '<p class="nl-filter-label">Jump to a year</p><nav class="nl-year-nav" aria-label="Jump by year">%s</nav>' % pills
            + '<p class="nl-results-note" id="nlNote">Showing all %d newsletters, newest first.</p></section>\n' % total
            + '    <div id="nlArchive">%s</div>\n' % "".join(sections)
            + '    <div class="nl-empty" id="nlEmpty">No newsletters match your search. Try a different word or reset the filters.</div>\n'
            + '    <div class="nl-print"><div class="nl-print-intro"><h2>Printed Newsletters</h2><p>Earlier annual newsletters and year-in-review publications, available as PDF downloads.</p></div>\n'
            + pdf_main + "\n    </div>\n"
            + '  </div></main>\n  <footer id="bc-global-footer"></footer>\n  <script src="../global-layout.js?v=20260806-3"></script>\n'
            + "<script>%s</script>\n</body></html>\n" % js)
    open(os.path.join(REPO, "newsletters", "index.html"), "w", encoding="utf-8").write(page)

    # sitemap: replace all /newsletters/<slug>/ urls
    sp = os.path.join(REPO, "sitemap.xml")
    sm = open(sp, encoding="utf-8").read()
    sm = re.sub(r"\s*<url><loc>https://bluecard\.org/newsletters/[^<]+/</loc>.*?</url>", "", sm)
    sm = sm.replace("</urlset>", "")
    lines = ["  <!-- Newsletter archive -->"]
    for c in cards:
        lines.append('  <url><loc>%s/newsletters/%s/</loc><lastmod>%s</lastmod><changefreq>yearly</changefreq><priority>0.5</priority></url>'
                     % (SITE, c["slug"], c["date_iso"]))
    sm = sm.rstrip() + "\n" + "\n".join(lines) + "\n</urlset>\n"
    # newsletters hub lastmod/frequency
    sm = re.sub(r"(<loc>https://bluecard\.org/newsletters/</loc><lastmod>)[^<]*(</lastmod><changefreq>)[^<]*(</changefreq>)",
                r"\g<1>2026-11-20\g<2>weekly\g<3>", sm)
    open(sp, "w", encoding="utf-8").write(sm)

    # llms.txt
    lp = os.path.join(REPO, "llms.txt")
    lt = open(lp, encoding="utf-8").read()
    line = "- [Newsletter archive](%s/newsletters/) - %d past email newsletters from %s through %s, grouped by year and topic" % (SITE, total, first, last)
    lt = re.sub(r"- \[Newsletter archive\][^\n]*\n", "", lt)
    lt = lt.replace("- [Blog](https://bluecard.org/blog/)\n", "- [Blog](https://bluecard.org/blog/)\n" + line + "\n", 1)
    open(lp, "w", encoding="utf-8").write(lt)
    print("index built:", total, "cards,", len(years), "years; sitemap + llms updated")


if __name__ == "__main__":
    main()
