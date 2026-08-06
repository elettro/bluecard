from pathlib import Path
import re

css_path = Path('global-layout.css')
css = css_path.read_text(encoding='utf-8')
old = 'bottom: 2px;\n  height: 3px;'
new = 'bottom: 6px;\n  height: 3px;'
if old not in css:
    raise SystemExit('Expected underline position not found')
css = css.replace(old, new, 1)
css_path.write_text(css, encoding='utf-8')

version = '20260806-1536'
for path in Path('.').rglob('*.html'):
    if any(part in {'.git', 'node_modules'} for part in path.parts):
        continue
    text = path.read_text(encoding='utf-8', errors='ignore')
    updated = re.sub(r'(global-layout\.css)(?:\?v=[^"\']+)?', rf'\1?v={version}', text)
    if updated != text:
        path.write_text(updated, encoding='utf-8')
