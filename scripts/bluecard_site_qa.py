#!/usr/bin/env python3
"""Non-destructive static QA for the Blue Card GitHub Pages site.
Run: python3 scripts/bluecard_site_qa.py
Checks local assets/links, SEO basics, accessibility flags, and XML sitemap.
This is a source audit, NOT a substitute for real-browser or form-delivery testing.
"""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import json
import posixpath
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
PAGES = sorted(p for p in ROOT.rglob('*.html') if '.git' not in p.parts)
HTML_REPORT = ROOT / "qa-bluecard-results.json"
issues = []
counts = Counter()

class Tags(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.images = []
        self.ids = []
        self.inputs = []
        self.labels = []
        self.scripts = []
        self.headings = []
        self.forms = []
        self.stylesheets = []
        self.frames = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'a': self.links.append(a)
        if tag == 'img': self.images.append(a)
        if a.get('id'): self.ids.append(a['id'])
        if tag in ('input','textarea','select'): self.inputs.append((tag,a))
        if tag == 'label': self.labels.append(a)
        if tag == 'script': self.scripts.append(a)
        if tag == 'link': self.stylesheets.append(a)
        if tag in ('h1','h2','h3','h4','h5','h6'): self.headings.append(tag)
        if tag == 'form': self.forms.append(a)
        if tag == 'iframe': self.frames.append(a)

def add(kind, path, detail):
    counts[kind] += 1
    if len(issues) < 1000:
        issues.append({'type':kind,'page':str(path),'detail':str(detail)[:240]})

def path_for(url, page):
    url = (url or '').strip()
    if not url or url.startswith(('#','mailto:','tel:','javascript:','data:','blob:')):
        return None
    u = urlparse(url)
    if u.scheme in ('http','https'):
        if u.netloc.lower() in ('elettro.github.io','www.elettro.github.io') and u.path.startswith('/bluecard/'):
            path = u.path[len('/bluecard/'):]
        elif u.netloc.lower() in ('bluecardfund.org','www.bluecardfund.org'):
            # Legacy WordPress content is not necessarily in this GitHub repository;
            # treat external absolute production URLs as a separate migration task.
            return None
        else: return None
    else:
        path = u.path
        if path.startswith('/bluecard/'): path = path[len('/bluecard/'):]
        elif path.startswith('/'): return None
        else: path = posixpath.join(page.parent.as_posix(),path)
    path = unquote(path)
    path = posixpath.normpath(path).lstrip('/')
    if path == '.': path = ''
    if path.endswith('/') or not Path(path).suffix: path = path.rstrip('/') + '/index.html' if path else 'index.html'
    return path

def check():
    for p in PAGES:
        relative = p.relative_to(ROOT)
        html = p.read_text(encoding='utf-8',errors='replace')
        t = Tags()
        try: t.feed(html)
        except Exception as exc: add('HTML_PARSE_ERROR',relative,exc)
        is_redirect = bool(re.search(r'http-equiv=["\\\']refresh',html,re.I))
        is_dev = '/dev/' in ('/'+relative.as_posix()) or relative.as_posix().startswith(('dev/','nav/dev/'))
        counts['HTML_PAGES_SCANNED'] += 1
        if not is_redirect and not is_dev:
            if not re.search(r'<title>[^<]+</title>',html,re.I): add('MISSING_TITLE',relative,'No title')
            if not re.search(r'<meta\\s+name=["\\\']description',html,re.I): add('MISSING_DESCRIPTION',relative,'No meta description')
            if t.headings.count('h1') == 0: add('MISSING_H1',relative,'No H1')
            if t.headings.count('h1') > 1: add('MULTIPLE_H1',relative,t.headings.count('h1'))
        for name,n in Counter(t.ids).items():
            if n > 1: add('DUPLICATE_ID',relative,name+' appears '+str(n)+' times')
        for img in t.images:
            if 'alt' not in img: add('MISSING_IMAGE_ALT',relative,img.get('src','(no src)'))
        for frame in t.frames:
            if 'title' not in frame: add('MISSING_IFRAME_TITLE',relative,frame.get('src','(no src)'))
        labeled = {lab.get('for') for lab in t.labels if lab.get('for')}
        for tag,attrs in t.inputs:
            if attrs.get('type') in ('hidden','submit','button','reset','image'): continue
            if attrs.get('id') and attrs.get('id') not in labeled and not attrs.get('aria-label') and not attrs.get('aria-labelledby') and 'placeholder' not in attrs:
                add('POSSIBLE_UNLABELED_FORM_FIELD',relative,tag+' '+attrs.get('id',''))
        for a in t.links:
            href=a.get('href','')
            file=path_for(href,relative)
            if file and not (ROOT / file).is_file():
                add('MISSING_INTERNAL_LINK',relative,href+' => '+file)
            blank=a.get('target') == '_blank'
            isdoc=bool(re.search(r'\\.(pdf|docx|xlsx)([?#]|$)',href,re.I))
            isinternal=href.startswith(('/bluecard/','../','./')) or href.startswith('https://elettro.github.io/bluecard/')
            if blank and isinternal and not isdoc: add('INTERNAL_NEW_TAB',relative,href)
            if blank and 'noopener' not in a.get('rel','').split(): add('BLANK_NO_NOOPENER',relative,href)
        for img in t.images:
            file=path_for(img.get('src',''),relative)
            if file and not (ROOT / file).is_file(): add('MISSING_IMAGE',relative,img.get('src'))
        for asset in t.scripts + t.stylesheets:
            src=asset.get('src') or (asset.get('href') if asset.get('rel') and 'stylesheet' in asset.get('rel','') else '')
            file=path_for(src,relative)
            if file and not (ROOT / file).is_file(): add('MISSING_STATIC_ASSET',relative,src)
        # Inline JSON-LD validation
        for m in re.finditer(r'<script[^>]*type=["\\\']application/ld\\+json["\\\'][^>]*>([\\s\\S]*?)</script>',html,re.I):
            try:json.loads(m.group(1).strip())
            except Exception as exc:add('INVALID_JSON_LD',relative,str(exc))

    xml = ROOT / 'sitemap.xml'
    if xml.exists():
        try:
            tree=ET.parse(xml)
            ns={'sm':'http://www.sitemaps.org/schemas/sitemap/0.9'}
            locs=[e.text for e in tree.findall('.//sm:loc',ns)]
            counts['SITEMAP_URLS'] = len(locs)
            for url,n in Counter(locs).items():
                if n>1:add('DUPLICATE_SITEMAP_LOC','sitemap.xml',url)
            for loc in locs:
                u=urlparse(loc)
                if u.netloc not in ('bluecardfund.org','www.bluecardfund.org'):
                    add('SITEMAP_BAD_HOST','sitemap.xml',loc)
                    continue
                path=u.path.lstrip('/')
                file=path.rstrip('/')+'/index.html' if path else 'index.html'
                if path.endswith('.html'): file=path
                page=ROOT / file
                if not page.exists():add('MISSING_SITEMAP_PAGE','sitemap.xml',loc)
                elif '<link rel="canonical"' in page.read_text(encoding='utf8',errors='replace'):
                    text=page.read_text(encoding='utf8',errors='replace')
                    m=re.search(r'<link\\s+rel=["\\\']canonical["\\\']\\s+href=["\\\']([^"\\\']+)',text,re.I)
                    if m and m.group(1).rstrip('/')!=loc.rstrip('/'):
                        add('SITEMAP_CANONICAL_MISMATCH',file,loc+' vs '+m.group(1))
        except Exception as exc:add('INVALID_SITEMAP','sitemap.xml',str(exc))

    print('BLUE CARD STATIC QA REPORT')
    for kind,n in sorted(counts.items()): print(f'{kind}: {n}')
    print('ISSUES (first 65)')
    for i in issues[:65]: print(i['type']+' | '+i['page']+' | '+i['detail'])
    HTML_REPORT.write_text(json.dumps({'counts':dict(counts),'issues':issues},indent=2),encoding='utf-8')
    print('Report saved:',HTML_REPORT.name)

if __name__=='__main__':check()
