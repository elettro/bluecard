from pathlib import Path
import re

root = Path('.')
css_path = root / 'global-layout.css'
js_path = root / 'global-layout-base.js'

css = css_path.read_text(encoding='utf-8')
css = css.replace('min-width: 132px;', 'min-width: 158px;')
css = css.replace('font-size: 13px;\n  line-height: 1;\n  padding: 8px 18px;', 'font-size: 16px;\n  line-height: 1;\n  padding: 10px 22px;', 1)
css = css.replace('gap: 6px;\n  color: #ffffff;\n  text-decoration: none;\n  font-size: 13px;', 'gap: 8px;\n  color: #ffffff;\n  text-decoration: none;\n  font-size: 16.25px;', 1)
css = css.replace('width: 15px;\n  height: 15px;', 'width: 19px;\n  height: 19px;', 1)
css_path.write_text(css, encoding='utf-8')

js = js_path.read_text(encoding='utf-8')
needle = '  .bc-top-contact{grid-column:3!important}\n'
insert = ('  .bc-top-contact{grid-column:3!important}\n'
          '  .bc-top-contact-link{font-size:16.25px!important;gap:8px!important}\n'
          '  .bc-top-contact-icon{width:19px!important;height:19px!important}\n'
          '  .bc-top-donate-btn{min-width:158px!important;font-size:16px!important;padding:10px 22px!important}\n')
if needle in js and 'font-size:16.25px!important' not in js:
    js = js.replace(needle, insert, 1)
js_path.write_text(js, encoding='utf-8')

cache_token = '20260806-1218'
for path in root.rglob('*.html'):
    text = path.read_text(encoding='utf-8')
    updated = re.sub(r'global-layout\.css\?v=[^"\']+', f'global-layout.css?v={cache_token}', text)
    if updated != text:
        path.write_text(updated, encoding='utf-8')
