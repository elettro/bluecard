from pathlib import Path
import re

css_path = Path('global-layout.css')
css = css_path.read_text(encoding='utf-8')

old = '''.bluecard-nav .menu > li > a::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 0;
  height: 3px;
  border-radius: 999px;
  background: #0b4f9c;
'''
new = '''.bluecard-nav .menu > li > a::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 0;
  height: 3px;
  border-radius: 999px;
  background: #ffffff;
'''

if old not in css:
    raise SystemExit('Global navigation underline CSS marker not found')
css_path.write_text(css.replace(old, new, 1), encoding='utf-8')

updated = 0
pattern = re.compile(r'(global-layout\.css)(?:\?[^"\'<>\s]*)?')
for path in Path('.').rglob('*.html'):
    text = path.read_text(encoding='utf-8')
    revised, count = pattern.subn(r'\1?v=20260806-7', text)
    if count and revised != text:
        path.write_text(revised, encoding='utf-8')
        updated += 1

if updated == 0:
    raise SystemExit('No HTML global-layout.css references were cache-busted')

print(f'Changed global nav underline to white and refreshed {updated} HTML files.')
