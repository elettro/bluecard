from pathlib import Path
import re

css_path = Path('global-layout.css')
css = css_path.read_text(encoding='utf-8')

old_css = '''.bluecard-nav > .menu > li > a {
  position: relative;
}
.bluecard-nav > .menu > li > a::after {
  content: "";
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 9px;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 260ms ease;
}
.bluecard-nav .menu > li:hover > a,
.bluecard-nav .menu > li:focus-within > a,
.bluecard-nav .menu > li > a[aria-current="page"] {
  background: #0057a8;
  color: #fff;
}
.bluecard-nav .menu > li:hover > a::after,
.bluecard-nav .menu > li:focus-within > a::after,
.bluecard-nav .menu > li > a[aria-current="page"]::after {
  transform: scaleX(1);
}
'''

new_css = '''.bluecard-nav .menu > li > a {
  position: relative;
}
.bluecard-nav .menu > li > a::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 0;
  height: 3px;
  border-radius: 999px;
  background: #e4202c;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 280ms cubic-bezier(.22,.61,.36,1);
  pointer-events: none;
}
.bluecard-nav .menu > li:hover > a,
.bluecard-nav .menu > li:focus-within > a,
.bluecard-nav .menu > li > a[aria-current="page"] {
  background: #0057a8;
  color: #fff;
}
.bluecard-nav .menu > li:hover > a::after,
.bluecard-nav .menu > li:focus-within > a::after {
  transform: scaleX(1);
}
'''

if old_css not in css:
    raise SystemExit('Existing navigation underline CSS block not found')
css_path.write_text(css.replace(old_css, new_css, 1), encoding='utf-8')

base_path = Path('global-layout-base.js')
base = base_path.read_text(encoding='utf-8')
style_marker = '''</style>
<div class="bc-top-donate-strip" role="region" aria-label="Donate call to action">'''
underline_style = '''</style>
<style id="bc-nav-hover-underline-animation">
@media (min-width:981px){
  #bc-global-nav .bluecard-nav .menu>li>a{position:relative}
  #bc-global-nav .bluecard-nav .menu>li>a::after{content:"";position:absolute;left:14px;right:14px;bottom:0;height:3px;border-radius:999px;background:#e4202c;transform:scaleX(0);transform-origin:center;transition:transform 280ms cubic-bezier(.22,.61,.36,1);pointer-events:none}
  #bc-global-nav .bluecard-nav .menu>li:hover>a::after,
  #bc-global-nav .bluecard-nav .menu>li:focus-within>a::after{transform:scaleX(1)}
}
</style>
<div class="bc-top-donate-strip" role="region" aria-label="Donate call to action">'''

if 'id="bc-nav-hover-underline-animation"' not in base:
    if style_marker not in base:
        raise SystemExit('Global header style insertion marker not found')
    base = base.replace(style_marker, underline_style, 1)
base_path.write_text(base, encoding='utf-8')

layout_path = Path('global-layout.js')
layout = layout_path.read_text(encoding='utf-8')
layout, count = re.subn(
    r"baseScript\.src = '/bluecard/global-layout-base\.js\?v=[^']+';",
    "baseScript.src = '/bluecard/global-layout-base.js?v=20260806-2';",
    layout,
    count=1,
)
if count != 1:
    raise SystemExit('Global layout base-script version marker not found')
layout_path.write_text(layout, encoding='utf-8')

css_pattern = re.compile(r'(<link\b[^>]*\bhref=["\'][^"\']*global-layout\.css)(?:\?[^"\']*)?(["\'])', re.I)
js_pattern = re.compile(r'(<script\b[^>]*\bsrc=["\'][^"\']*global-layout\.js)(?:\?[^"\']*)?(["\'])', re.I)

changed_html = 0
for html_path in Path('.').rglob('*.html'):
    text = html_path.read_text(encoding='utf-8')
    updated = css_pattern.sub(r'\1?v=20260806-2\2', text)
    updated = js_pattern.sub(r'\1?v=20260806-2\2', updated)
    if updated != text:
        html_path.write_text(updated, encoding='utf-8')
        changed_html += 1

if changed_html == 0:
    raise SystemExit('No HTML global-layout references were updated')

print(f'Updated navigation animation and cache-busted {changed_html} HTML files.')
