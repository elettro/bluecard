from pathlib import Path

base_path = Path('global-layout-base.js')
base = base_path.read_text(encoding='utf-8')

old_strip = '''<div class="bc-top-donate-strip" role="region" aria-label="Donate call to action">
  <a class="bc-top-donate-btn" href="/bluecard/donate/" rel="noopener noreferrer" target="_blank">DONATE</a>'''
new_strip = '''<div class="bc-top-donate-strip" role="region" aria-label="Donate call to action">
  <a class="bc-top-brand" href="/bluecard/index.html" aria-label="The Blue Card home">
    <img src="/bluecard/images/logo/TBC-TAGLINE_HORIZ-VECTOR-WHITE-OL-01.png" alt="The Blue Card. Assisting Holocaust Survivors in Need">
  </a>
  <a class="bc-top-donate-btn" href="/bluecard/donate/" rel="noopener noreferrer" target="_blank">DONATE</a>'''

if old_strip not in base:
    raise SystemExit('Top strip marker not found in global-layout-base.js')
base = base.replace(old_strip, new_strip, 1)

old_desktop_logo = '''  <div class="bluecard-nav-inner">
    <a class="site-logo" href="/bluecard/index.html" aria-label="The Blue Card home">
      <img src="/bluecard/images/logo/blue-card-logo-fullsize-.png" alt="The Blue Card">
    </a>
    <ul class="menu" id="bluecard-main-menu">'''
new_desktop_logo = '''  <div class="bluecard-nav-inner">
    <ul class="menu" id="bluecard-main-menu">'''

if old_desktop_logo not in base:
    raise SystemExit('Desktop logo marker not found in global-layout-base.js')
base = base.replace(old_desktop_logo, new_desktop_logo, 1)
base_path.write_text(base, encoding='utf-8')

css_path = Path('global-layout.css')
css = css_path.read_text(encoding='utf-8')

brand_css = '''
.bc-top-brand {
  display: none;
}

.bc-top-brand img {
  display: block;
  width: auto;
  object-fit: contain;
}
'''
marker = '''.bc-top-donate-btn {
'''
if brand_css.strip() not in css:
    if marker not in css:
        raise SystemExit('Donate button CSS marker not found')
    css = css.replace(marker, brand_css + '\n' + marker, 1)

desktop_css = '''
@media (min-width: 1100px) {
  .bc-top-donate-strip {
    min-height: 112px;
    padding: 10px 28px;
    grid-template-columns: minmax(280px, 1fr) auto minmax(280px, 1fr);
    column-gap: 28px;
  }

  .bc-top-brand {
    grid-column: 1;
    justify-self: start;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
  }

  .bc-top-brand img {
    height: 88px;
    max-width: 390px;
  }

  .bc-top-donate-btn {
    grid-column: 2;
  }

  .bc-top-contact {
    grid-column: 3;
  }

  .bluecard-nav-inner {
    min-height: 58px;
    justify-content: center;
    padding: 0 18px;
  }

  .site-logo {
    display: none !important;
  }

  .bluecard-nav .menu {
    flex: 0 1 auto;
    flex-wrap: nowrap;
    justify-content: center;
    gap: 4px;
  }

  .bluecard-nav a {
    padding: 10px 14px;
  }
}
'''

if desktop_css.strip() not in css:
    insert_before = '/* Global navigation */'
    if insert_before not in css:
        raise SystemExit('Global navigation CSS marker not found')
    css = css.replace(insert_before, desktop_css + '\n' + insert_before, 1)

css_path.write_text(css, encoding='utf-8')

layout_path = Path('global-layout.js')
layout = layout_path.read_text(encoding='utf-8')
old_version = "baseScript.src = '/bluecard/global-layout-base.js?v=20260804-8';"
new_version = "baseScript.src = '/bluecard/global-layout-base.js?v=20260804-11';"
if old_version not in layout:
    raise SystemExit('Base script version marker not found in global-layout.js')
layout_path.write_text(layout.replace(old_version, new_version, 1), encoding='utf-8')

hologram_path = Path('interactive-hologram/index.html')
hologram = hologram_path.read_text(encoding='utf-8')
hologram = hologram.replace('../global-layout.css?v=20260804-10', '../global-layout.css?v=20260804-11')
hologram = hologram.replace('../global-layout.js?v=20260804-10', '../global-layout.js?v=20260804-11')
hologram_path.write_text(hologram, encoding='utf-8')
