#!/usr/bin/env python3
"""Build Blue Card newsletter archive pages from extracted Constant Contact JSON.

Reads:  D:/claude/bluecard-newsletters/extracted/nl_<id>.json, publish-2021-2026.tsv, candidates csv
Writes: D:/claude/bluecard/newsletters/<slug>/index.html (+images), newsletters/index.html,
        sitemap.xml, llms.txt  (local only - nothing is pushed)
"""
import csv, json, os, re, sys, html, hashlib, urllib.request, urllib.parse, collections, datetime
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.environ.get("NL_REPO") or os.path.abspath(os.path.join(HERE, "..", ".."))
WORK = os.environ.get("NL_WORK") or os.path.join(REPO, "scripts", "newsletters", "work")
os.makedirs(WORK, exist_ok=True)
SAMPLE = os.path.join(HERE, "sample-head.html")
SITE = "https://bluecard.org"
FORM_ID = "8a6c5794-3773-4d96-a0e9-c05739395bc8"
CTCT_M = "4ebbf9c73f31aeae9ec1f0bb2a432f8f"

MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August",
          "September", "October", "November", "December"]

CATEGORY_MAP = {
    "Press feature": "In the Press", "Press / op-ed": "In the Press", "Press release": "In the Press",
    "News": "In the Press", "News (overlaps blog #23)": "In the Press", "Statement / news": "In the Press",
    "Podcast": "In the Press", "Program / podcast": "In the Press",
    "Remembrance": "Remembrance", "Tribute": "Remembrance", "Awareness day": "Remembrance",
    "History / story": "Remembrance", "Program / history": "Remembrance",
    "Program": "Programs & Help", "Guidance (evergreen)": "Programs & Help",
    "Advisory (evergreen)": "Programs & Help", "Evergreen explainer": "Programs & Help",
    "Survivor spotlight": "Programs & Help",
    "Statement": "Statements", "Disaster relief": "Disaster Relief", "Year in review": "Year in Review",
}
CATEGORY_ORDER = ["In the Press", "Remembrance", "Programs & Help", "Statements", "Disaster Relief", "Year in Review"]

# internal path fixes for old bluecardfund.org URLs -> current bluecard.org paths
PATH_MAP = {
    "/": "/",
    "/become-involved/donate": "/donate/",
    "/donate-now": "/donate/",
    "/donate": "/donate/",
}

FURNITURE_MIN_EMAILS = 6   # image appearing in this many emails = template furniture
FOOTER_RE = re.compile(r"(unsubscribe|tax id number|forward this email|update profile|sent by|171 madison|view this email|"
                       r"try email marketing|safeunsubscribe|view in browser|constant contact|"
                       r"you are receiving this|trouble viewing|privacy policy)", re.I)
TOP_JUNK_RE = re.compile(r"^(join our email list|share:?|view (this )?(email )?in (your )?browser|trouble viewing.*|click here to view.*)$", re.I)
BADGE_HOSTS = ("charitynavigator.org", "guidestar.org", "best-charities.org", "give.org", "candid.org",
               "facebook.com", "twitter.com", "instagram.com", "linkedin.com", "youtube.com", "x.com",
               "constantcontact.com", "rs6.net", "forwardtofriend")


def slugify(s, n=60):
    s = html.unescape(s).lower()
    s = re.sub(r"['\u2019]", "", s)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    if len(s) > n:
        s = s[:n].rsplit("-", 1)[0]
    return s or "newsletter"


def fmt_date(yymmdd):
    y, m, d = 2000 + int(yymmdd[:2]), int(yymmdd[2:4]), int(yymmdd[4:6])
    return "%s %d, %d" % (MONTHS[m - 1], d, y), "%04d-%02d-%02d" % (y, m, d), y


class Blocks(HTMLParser):
    """Flatten the semi-structured extractor output into a linear block list."""
    BLOCK = {"p", "h2", "h3", "h4", "h5", "h6", "h1", "li"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks = []
        self.stack = []
        self.buf = []
        self.link = None  # current <a> href for wrapping images
        self.in_a = False
        self.skip = 0  # inside <style>/<script>/<head>/<title>

    def flush(self):
        t = "".join(self.buf)
        self.buf = []
        plain = re.sub(r"<[^>]*>", "", t).replace("\xa0", " ").strip()
        if plain:
            kind = self.stack[-1] if self.stack else "p"
            self.blocks.append({"t": "text", "tag": kind, "html": re.sub(r"\s+", " ", t).strip(), "text": plain})

    SKIP = {"style", "script", "head", "title", "noscript"}
    BREAK = {"td", "tr", "table", "div", "section", "br"}

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in self.SKIP:
            self.skip += 1
            return
        if self.skip:
            return
        if tag in ("td", "tr", "table", "div", "section"):
            self.flush()
            return
        if tag in self.BLOCK:
            self.flush()
            self.stack.append(tag)
        elif tag == "ul" or tag == "ol":
            self.flush()
        elif tag == "a":
            self.in_a = True
            self.link = a.get("href")
            self.buf.append('<a href="%s">' % html.escape(a.get("href") or "", quote=True))
        elif tag in ("b", "strong", "i", "em", "u"):
            self.buf.append("<%s>" % tag)
        elif tag == "br":
            self.buf.append("<br>")
        elif tag == "img":
            self.flush_inline_for_img()
            self.blocks.append({"t": "img", "src": a.get("src", ""), "alt": a.get("alt", ""),
                                "w": int(re.sub(r"\D", "", a.get("data-w") or a.get("width") or "") or 0), "h": int(re.sub(r"\D", "", a.get("data-h") or a.get("height") or "") or 0),
                                "href": self.link if self.in_a else None})

    def flush_inline_for_img(self):
        # keep text before an inline image as its own block (drop dangling open <a>)
        t = "".join(self.buf)
        plain = re.sub(r"<[^>]*>", "", t).replace("\xa0", " ").strip()
        if plain:
            self.flush()
        else:
            self.buf = []

    def handle_endtag(self, tag):
        if tag in self.SKIP:
            self.skip = max(0, self.skip - 1)
            return
        if self.skip:
            return
        if tag in ("td", "tr", "table", "div", "section"):
            self.flush()
            return
        if tag in self.BLOCK:
            self.flush()
            if self.stack:
                self.stack.pop()
        elif tag == "a":
            self.buf.append("</a>")
            self.in_a = False
            self.link = None
        elif tag in ("b", "strong", "i", "em", "u"):
            self.buf.append("</%s>" % tag)

    def handle_data(self, data):
        if self.skip:
            return
        self.buf.append(html.escape(data, quote=False))

    def close(self):
        super().close()
        self.flush()


def host_of(u):
    try:
        return urllib.parse.urlsplit(u).netloc.lower()
    except Exception:
        return ""


def is_badge_link(u):
    h = host_of(u or "")
    return any(b in h for b in BADGE_HOSTS)


def img_key(src):
    m = re.search(r"/([0-9a-f]{8}-[0-9a-f-]{27,})\.", src)
    return m.group(1) if m else src


def repo_has(path):
    p = path.split("#")[0].split("?")[0]
    full = os.path.join(REPO, p.strip("/").replace("/", os.sep))
    return os.path.isdir(full) and os.path.exists(os.path.join(full, "index.html")) or os.path.isfile(full)


UNRESOLVED = collections.Counter()


def rewrite_href(h):
    """Return (new_href or None to unwrap, kind)."""
    if not h:
        return None
    hs = h.strip()
    u = urllib.parse.urlsplit(hs)
    host = u.netloc.lower()
    if "donorperfect" in host:
        return "/donate/"
    if host in ("bluecardfund.org", "www.bluecardfund.org", "bluecard.org", "www.bluecard.org"):
        path = u.path or "/"
        key = path.rstrip("/") or "/"
        if key in PATH_MAP:
            new = PATH_MAP[key]
        else:
            new = path if path.endswith("/") or "." in path.rsplit("/", 1)[-1] else path + "/"
        if repo_has(new.split("?")[0]) or new == "/":
            return new + (("?" + u.query) if u.query and new != "/donate/" else "")
        UNRESOLVED[path] += 1
        return None
    if hs.startswith("mailto:") or hs.startswith("tel:"):
        return hs
    if u.scheme in ("http", "https"):
        if any(b in host for b in ("rs6.net", "constantcontact.com", "ctctcdn.com")):
            return None
        return hs
    return None


def finalize_links(h):
    h = re.sub(r"(?i)@(www\.)?bluecardfund\.org", "@bluecard.org", h)
    h = re.sub(r"(?i)(www\.)?bluecardfund\.org", "bluecard.org", h) if False else h
    def repl(m):
        href = html.unescape(m.group(1))
        new = rewrite_href(href)
        if new is None:
            return "\x00"  # marker: unwrap
        ext = new.startswith("http")
        attrs = ' href="%s"' % html.escape(new, quote=True)
        if ext:
            attrs += ' rel="noopener" target="_blank"'
        return "<a%s>" % attrs
    out = re.sub(r'<a href="([^"]*)">', repl, h)
    # unwrap anchors marked \x00 : remove marker and its matching </a>
    res = []
    depth_marker = []
    i = 0
    tokens = re.split(r"(<a[^>]*>|</a>|\x00)", out)
    stack = []
    for t in tokens:
        if t == "\x00":
            stack.append("drop")
        elif t.startswith("<a"):
            stack.append("keep")
            res.append(t)
        elif t == "</a>":
            if stack and stack.pop() == "drop":
                continue
            res.append(t)
        else:
            res.append(t)
    return "".join(res)


def build_page_body(blocks, meta, slug, img_paths):
    parts = []
    li_open = False
    for b in blocks:
        if b["t"] == "img":
            if li_open:
                parts.append("</ul>")
                li_open = False
            ip = img_paths.get(b["src"])
            if not ip:
                continue
            alt = html.escape(b["alt"] or meta["alt_default"], quote=True)
            tag = '<img src="%s" alt="%s" width="%d" height="%d" loading="lazy">' % (ip, alt, b["w"], b["h"])
            href = rewrite_href(b["href"]) if b.get("href") else None
            if href:
                ext = href.startswith("http")
                tag = '<a href="%s"%s>%s</a>' % (html.escape(href, quote=True),
                                                  ' rel="noopener" target="_blank"' if ext else "", tag)
            parts.append('<figure class="nl-fig">%s</figure>' % tag)
            continue
        h = finalize_links(b["html"])
        if not re.sub(r"<[^>]*>", "", h).strip():
            continue
        if b["tag"] == "li":
            if not li_open:
                parts.append("<ul>")
                li_open = True
            parts.append("<li>%s</li>" % h)
            continue
        if li_open:
            parts.append("</ul>")
            li_open = False
        tag = b["tag"] if b["tag"] in ("h2", "h3", "h4") else "p"
        if tag == "p" and len(b["text"]) < 90 and re.fullmatch(r"<b>.*</b>", h):
            tag = "h3"
        parts.append("<%s>%s</%s>" % (tag, h, tag))
    if li_open:
        parts.append("</ul>")
    return "".join(parts)


def esc(s):
    return html.escape(s, quote=True)


def guess_category(text):
    t = text.lower()
    if re.search(r"hurricane|flood|wildfire|disaster|earthquake|storm", t):
        return "Disaster Relief"
    if re.search(r"kristallnacht|yom hashoah|remembr|tribute|in memory|anniversary|survivor day|liberation|never forget|never again", t):
        return "Remembrance"
    if re.search(r"op-ed|featured|nbc|cbs|abc|times of israel|newsday|herald|jewish week|jns|podcast|interview|press|news", t):
        return "In the Press"
    if re.search(r"statement|condemn", t):
        return "Statements"
    return "Programs & Help"


def main():
    inp = json.load(open(os.path.join(WORK, "input.json"), encoding="utf-8"))
    items = []
    img_counter = collections.Counter()
    for r in inp:
        yymmdd, cid, name, typ, d = r["yymmdd"], r["id"], r["name"], r.get("type", ""), r["d"]
        p = Blocks()
        p.feed(d["html"])
        p.close()
        keys = {img_key(b["src"]) for b in p.blocks if b["t"] == "img"}
        for k in keys:
            img_counter[k] += 1
        items.append({"yymmdd": yymmdd, "id": cid, "name": name, "type": typ, "d": d, "blocks": p.blocks})
    furniture = set(json.load(open(os.path.join(HERE, "furniture.json"), encoding="utf-8")))

    nl_dir = os.path.join(REPO, "newsletters")
    used_slugs = {n for n in os.listdir(nl_dir) if os.path.isdir(os.path.join(nl_dir, n))}
    report = {"pages": 0, "images": 0, "img_fail": [], "thin": [], "no_image_pages": 0}
    cards = []
    sample_html = open(SAMPLE, encoding="utf-8").read()
    s_lines = sample_html.split("\n")
    head_css = s_lines[0:18]          # <!DOCTYPE ... </style>
    org_schema = s_lines[31]           # Organization JSON-LD line
    web_schema = s_lines[32]           # WebSite JSON-LD line
    icons = "\n".join(s_lines[35:39])  # favicon links
    css_extra = "\n".join(head_css[1:17])  # custom css rows between <style> and </style>
    # head_css[0] holds doctype..<style>@media...  -> keep its pieces
    first_line = head_css[0]
    head_open = first_line[:first_line.index("<title>")]
    style_start = first_line[first_line.index('<link rel="stylesheet"'):]

    for it in sorted(items, key=lambda x: x["yymmdd"], reverse=True):
        d = it["d"]
        subject = (d.get("subject") or d.get("title") or it["name"]).strip()
        subject = re.sub(r"\s+", " ", html.unescape(subject))
        date_long, date_iso, year = fmt_date(it["yymmdd"])
        slug_base = "%s-%s" % (it["yymmdd"], slugify(subject))
        slug = slug_base
        n = 2
        while slug in used_slugs:
            slug = "%s-%d" % (slug_base, n)
            n += 1
        used_slugs.add(slug)

        blocks = it["blocks"]
        # drop top junk and leading duplicates of subject/preheader
        pre = (d.get("preheader") or "").strip()
        if not pre:  # raw API html: hidden preview text shows up as a short first block before the greeting
            tb = [b for b in blocks if b["t"] == "text"][:2]
            if len(tb) == 2 and len(tb[0]["text"]) <= 200 and re.match(r"(dear|hi|hello|friends|to our)", tb[1]["text"], re.I)                     and not re.match(r"(dear|hi|hello)", tb[0]["text"], re.I):
                pre = tb[0]["text"].strip()
        cleaned = []
        for b in blocks:
            if b["t"] == "text":
                tx = b["text"].strip()
                if TOP_JUNK_RE.match(tx):
                    continue
                if len(cleaned) < 3 and (tx == pre or tx.lower() == subject.lower()):
                    continue
            cleaned.append(b)
        # cut footer: first footer-ish text block in the latter 55% of the content
        cut = len(cleaned)
        start_scan = int(len(cleaned) * 0.35)
        for i in range(start_scan, len(cleaned)):
            b = cleaned[i]
            if b["t"] == "text" and FOOTER_RE.search(b["text"]):
                cut = i
                break
        cleaned = cleaned[:cut]
        # drop furniture + badge/social images
        out = []
        for b in cleaned:
            if b["t"] == "img":
                if img_key(b["src"]) in furniture:
                    continue
                if b.get("href") and is_badge_link(b["href"]):
                    continue
                if b["w"] and b["w"] < 40:
                    continue
            out.append(b)
        # drop trailing blocks that are only furniture-ish whitespace
        while out and out[-1]["t"] == "text" and len(out[-1]["text"]) < 3:
            out.pop()
        cleaned = out

        # download images
        img_dir = os.path.join(REPO, "newsletters", slug, "images")
        img_paths = {}
        k = 0
        for b in cleaned:
            if b["t"] != "img" or b["src"] in img_paths:
                continue
            ext = os.path.splitext(urllib.parse.urlsplit(b["src"]).path)[1].lower() or ".jpg"
            if ext not in (".jpg", ".jpeg", ".png", ".gif", ".webp"):
                ext = ".jpg"
            k += 1
            fn = "img-%02d%s" % (k, ext)
            dest = os.path.join(img_dir, fn)
            os.makedirs(img_dir, exist_ok=True)
            if not os.path.exists(dest) or os.path.getsize(dest) < 200:
                try:
                    req = urllib.request.Request(b["src"], headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(req, timeout=40) as r, open(dest, "wb") as f:
                        f.write(r.read())
                except Exception as e:
                    report["img_fail"].append((slug, b["src"], str(e)))
                    continue
            img_paths[b["src"]] = "/newsletters/%s/images/%s" % (slug, fn)
            report["images"] += 1
        if not img_paths and os.path.isdir(img_dir):
            try:
                os.rmdir(img_dir)
            except OSError:
                pass

        text_blocks = [b for b in cleaned if b["t"] == "text"]
        body_text = " ".join(b["text"] for b in text_blocks)
        if len(body_text) < 120:
            report["thin"].append((slug, len(body_text)))

        # description
        desc = pre if pre and pre != subject else ""
        if not desc:
            desc = text_blocks[0]["text"] if text_blocks else subject
            for b in text_blocks[:4]:
                if len(b["text"]) > 60:
                    desc = b["text"]
                    break
        desc = re.sub(r"\s+", " ", desc).strip()
        if len(desc) > 158:
            desc = desc[:155].rsplit(" ", 1)[0] + "..."

        first_img = next((img_paths[b["src"]] for b in cleaned if b["t"] == "img" and b["src"] in img_paths and b["w"] >= 300), None)
        og_image = SITE + first_img if first_img else SITE + "/images/share/blue-card-share.png"
        if not img_paths:
            report["no_image_pages"] += 1

        meta = {"alt_default": "Image from The Blue Card newsletter: %s" % subject}
        body = build_page_body(cleaned, meta, slug, img_paths).replace("bluecardfund.org", "bluecard.org")

        sender = (d.get("fromName") or "").strip()
        url = "%s/newsletters/%s/" % (SITE, slug)
        title = "%s | The Blue Card" % subject
        cat = CATEGORY_MAP.get(it["type"].strip().strip('"').strip()) or guess_category(subject + " " + it["name"])
        sent_line = "Originally sent to The Blue Card email community on %s." % date_long
        if sender:
            sent_line = "From %s. %s" % (esc(sender), sent_line)

        author = ({"@type": "Person", "name": sender, "worksFor": {"@id": SITE + "/#organization"}}
                  if sender else {"@id": SITE + "/#organization"})
        article = {"@context": "https://schema.org", "@type": "Article", "@id": url + "#article",
                   "headline": subject, "description": desc, "url": url, "mainEntityOfPage": url,
                   "datePublished": date_iso, "dateModified": date_iso, "image": og_image,
                   "author": author, "publisher": {"@id": SITE + "/#organization"},
                   "isPartOf": {"@id": SITE + "/#website"}, "articleSection": cat, "inLanguage": "en"}
        crumbs = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Newsletters", "item": SITE + "/newsletters/"},
            {"@type": "ListItem", "position": 3, "name": subject, "item": url}]}

        page = (head_open + "<title>%s</title>" % esc(title) + style_start + "\n"
                + "\n".join(head_css[1:17]).replace("\n</style>", "") + "\n"
                + ".nl-fig{margin:1.4em 0;text-align:center}.nl-fig img{max-width:100%;height:auto;border-radius:6px}\n"
                + ".nl-letter h2,.nl-letter h3{color:#0057a8;margin:1.4em 0 .5em;line-height:1.25}.nl-letter ul{margin:0 0 1.1em 1.2em;line-height:1.7;font-size:1.05rem}\n"
                + ".nl-date{font-weight:700;color:#0057a8}\n"
                + "</style>\n"
                + '<meta name="description" content="%s">\n' % esc(desc)
                + '<meta property="og:title" content="%s">\n' % esc(title)
                + '<meta property="og:description" content="%s">\n' % esc(desc)
                + '<meta property="og:type" content="article">\n'
                + '<meta property="og:url" content="%s">\n' % url
                + '<meta property="og:site_name" content="The Blue Card">\n'
                + '<meta property="og:image" content="%s">\n' % og_image
                + '<meta property="article:published_time" content="%s">\n' % date_iso
                + '<meta name="twitter:card" content="summary_large_image">\n'
                + '<meta name="twitter:image" content="%s">\n' % og_image
                + '<meta name="twitter:title" content="%s">\n' % esc(title)
                + '<meta name="twitter:description" content="%s">\n' % esc(desc)
                + '<link rel="canonical" href="%s">\n' % url
                + org_schema + "\n" + web_schema + "\n"
                + '<script type="application/ld+json" data-seo-schema="true">%s</script>\n' % json.dumps(article, ensure_ascii=False)
                + '<script type="application/ld+json" data-seo-schema="true">%s</script>\n' % json.dumps(crumbs, ensure_ascii=False)
                + icons + "\n"
                + '</head><body><header id="bc-global-nav"></header><main class="blog-post-wrap">'
                + '<section class="blog-post-title-strip"><div class="blog-container"><h1>%s</h1></div></section>' % esc(subject)
                + '<article class="blog-post-content blog-container">'
                + '<p class="blog-post-meta"><a href="/newsletters/">&larr; Back to Newsletters</a> <span class="nl-date"><time datetime="%s">%s</time></span></p>' % (date_iso, date_long)
                + '<p class="nl-sent">%s</p>' % sent_line
                + '<div class="nl-letter">%s</div>' % body
                + '<aside class="nl-cta" aria-label="Support Holocaust survivors"><h2>Help a Holocaust survivor today</h2>'
                  '<p>Your gift provides housing, food, medical care and home assistance to survivors who are living in need.</p>'
                  '<a class="nl-btn" href="/donate/">Support Holocaust Survivors Today</a></aside>'
                + '<aside class="nl-sub"><h2>Get Our Newsletter</h2><p>Survivor stories, impact updates and ways to help, delivered to your inbox from The Blue Card.</p>'
                  '<div class="ctct-inline-form" data-form-id="%s"></div></aside>' % FORM_ID
                + '<p class="nl-sent">Learn more about <a href="/how-we-help/">how The Blue Card helps</a> or <a href="/apply-here/">how to apply for assistance</a>.</p>'
                + '</article></main><footer id="bc-global-footer"></footer>'
                + '<script src="/global-layout.js?v=20260806-3"></script>'
                + '<script>var _ctct_m="%s";</script>' % CTCT_M
                + '<script id="signupScript" src="//static.ctctcdn.com/js/signup-form-widget/current/signup-form-widget.min.js" async defer></script>'
                + '</body></html>')
        outdir = os.path.join(REPO, "newsletters", slug)
        os.makedirs(outdir, exist_ok=True)
        open(os.path.join(outdir, "index.html"), "w", encoding="utf-8").write(page)
        report["pages"] += 1
        cards.append({"slug": slug, "title": subject, "desc": desc, "date_long": date_long, "date_iso": date_iso,
                      "year": year, "cat": cat, "yymmdd": it["yymmdd"], "thumb": first_img})

    json.dump(cards, open(os.path.join(WORK, "new-cards.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump({"pages": report["pages"], "images": report["images"], "img_fail": report["img_fail"],
               "thin": report["thin"], "no_image_pages": report["no_image_pages"],
               "unresolved_links": UNRESOLVED.most_common()}, open(os.path.join(WORK, "build-report.json"), "w", encoding="utf-8"), indent=1)
    print("pages", report["pages"], "images", report["images"], "img_fail", len(report["img_fail"]),
          "thin", len(report["thin"]), "no_image_pages", report["no_image_pages"])
    print("unresolved internal links:", UNRESOLVED.most_common(30))


if __name__ == "__main__":
    main()
