from pathlib import Path
import re

BLUE = '#0b4f9c'
OLD = '#e4202c'
VERSION = '20260806-3'

for file_name in ('global-layout.css', 'global-layout-base.js'):
    path = Path(file_name)
    text = path.read_text(encoding='utf-8')
    count = text.count(OLD)
    if count < 1:
        raise SystemExit(f'Navigation underline red color not found in {file_name}')
    path.write_text(text.replace(OLD, BLUE), encoding='utf-8')

layout_path = Path('global-layout.js')
layout = layout_path.read_text(encoding='utf-8')
layout, base_count = re.subn(
    r"baseScript\.src = '/bluecard/global-layout-base\.js\?v=[^']+';",
    f"baseScript.src = '/bluecard/global-layout-base.js?v={VERSION}';",
    layout,
    count=1,
)
if base_count != 1:
    raise SystemExit('Global layout base-script version marker not found')
layout_path.write_text(layout, encoding='utf-8')

css_pattern = re.compile(r'(<link\b[^>]*\bhref=["\'][^"\']*global-layout\.css)(?:\?[^"\']*)?(["\'])', re.I)
js_pattern = re.compile(r'(<script\b[^>]*\bsrc=["\'][^"\']*global-layout\.js)(?:\?[^"\']*)?(["\'])', re.I)

changed_html = 0
for html_path in Path('.').rglob('*.html'):
    text = html_path.read_text(encoding='utf-8')
    updated = css_pattern.sub(rf'\1?v={VERSION}\2', text)
    updated = js_pattern.sub(rf'\1?v={VERSION}\2', updated)
    if updated != text:
        html_path.write_text(updated, encoding='utf-8')
        changed_html += 1

if changed_html == 0:
    raise SystemExit('No HTML global-layout references were cache-busted')

print(f'Changed navigation underline to {BLUE} and cache-busted {changed_html} HTML files.')
