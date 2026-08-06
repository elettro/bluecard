from pathlib import Path
import re

layout_path = Path('global-layout.js')
text = layout_path.read_text(encoding='utf-8')

replacements = {
    '.bc-advisory-legacy-subtitle{max-width:760px;margin:15px 0 0;color:#cbd9f3;font-size:17px;line-height:1.6}\n': '',
    '.bc-advisory-legacy-layout{display:grid;grid-template-columns:330px minmax(0,1fr);gap:58px;margin-top:55px}': '.bc-advisory-legacy-layout{display:grid;grid-template-columns:300px minmax(0,1fr);gap:52px;margin-top:44px}',
    '.bc-advisory-legacy-chair-name{margin-top:18px;color:#fff;font-family:Georgia,"Times New Roman",serif;font-size:46px;font-weight:700;line-height:1}': '.bc-advisory-legacy-chair-name{margin-top:16px;color:#fff;font-family:inherit;font-size:34px;font-weight:800;line-height:1.08;letter-spacing:-.02em}',
    '.bc-advisory-legacy-member{padding:15px 0;border-bottom:1px solid rgba(255,255,255,.18);color:#f2f6ff;font-size:17px;font-weight:700}': '.bc-advisory-legacy-member{padding:16px 0;border-bottom:1px solid rgba(255,255,255,.18);color:#f2f6ff;font-family:inherit;font-size:21px;font-weight:700;line-height:1.25}',
    '@media(max-width:520px){.bc-advisory-legacy{padding:30px 20px;border-radius:24px}.bc-advisory-legacy-title{font-size:36px}.bc-advisory-legacy-subtitle{font-size:16px}.bc-advisory-legacy-chair-name{font-size:39px}.bc-advisory-legacy:before{right:-20px;bottom:-22px;font-size:190px}}': '@media(max-width:520px){.bc-advisory-legacy{padding:30px 20px;border-radius:24px}.bc-advisory-legacy-title{font-size:36px}.bc-advisory-legacy-chair-name{font-size:30px}.bc-advisory-legacy-member{font-size:19px}.bc-advisory-legacy:before{right:-20px;bottom:-22px;font-size:190px}}',
    '      <p class="bc-advisory-legacy-subtitle">A distinguished group supporting the integrity, relevance, and reach of Holocaust education.</p>\n': ''
}

for old, new in replacements.items():
    if old not in text:
        raise SystemExit(f'Advisory panel marker not found: {old[:90]}')
    text = text.replace(old, new, 1)

layout_path.write_text(text, encoding='utf-8')

page_path = Path('interactive-hologram/index.html')
page = page_path.read_text(encoding='utf-8')
page, count = re.subn(
    r'(<script\b[^>]*\bsrc=["\'][^"\']*global-layout\.js)(?:\?[^"\']*)?(["\'])',
    r'\1?v=20260806-8\2',
    page,
    count=1,
    flags=re.I,
)
if count != 1:
    raise SystemExit('Interactive Hologram global-layout.js reference not found')
page_path.write_text(page, encoding='utf-8')

print('Refined advisory panel typography and removed subtitle.')
