from pathlib import Path
import re

css_path = Path('global-layout.css')
css = css_path.read_text(encoding='utf-8')
css = css.replace('background: #ffffff;\n  opacity: 0;\n  transform: scaleX(0);', 'background: #ffffff !important;\n  opacity: 0;\n  transform: scaleX(0);', 1)
css = css.replace('opacity: 1;\n  transform: scaleX(1);', 'opacity: 1 !important;\n  transform: scaleX(1) !important;', 1)
css_path.write_text(css, encoding='utf-8')

version = '20260806-1518'
for path in Path('.').rglob('*.html'):
    if any(part in {'.git', 'node_modules'} for part in path.parts):
        continue
    text = path.read_text(encoding='utf-8', errors='ignore')
    updated = re.sub(r'(global-layout\.css)(?:\?v=[^"\']+)?', rf'\1?v={version}', text)
    if updated != text:
        path.write_text(updated, encoding='utf-8')
