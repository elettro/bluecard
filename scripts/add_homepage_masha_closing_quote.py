from pathlib import Path

layout_path = Path('global-layout.js')
layout = layout_path.read_text(encoding='utf-8')

old_css = '.bc-masha-quote-mark{display:block;font-family:Georgia,serif;font-size:82px;line-height:.55;color:#a8c8ff;margin-bottom:24px}.bc-masha-quote-text{margin:0;font-family:"Plus Jakarta Sans",sans-serif;font-size:clamp(32px,4.5vw,54px);font-style:italic;font-weight:700;line-height:1.12;letter-spacing:-.025em}.bc-masha-quote-rule{width:72px;height:4px;background:#a8c8ff;margin:34px 0 22px}'
new_css = '.bc-masha-quote-mark{display:block;font-family:Georgia,serif;font-size:82px;line-height:.55;color:#a8c8ff;margin-bottom:24px}.bc-masha-quote-text{margin:0;font-family:"Plus Jakarta Sans",sans-serif;font-size:clamp(32px,4.5vw,54px);font-style:italic;font-weight:700;line-height:1.12;letter-spacing:-.025em}.bc-masha-quote-close{display:block;text-align:right;font-family:Georgia,serif;font-size:82px;line-height:.55;color:#a8c8ff;margin:18px 0 -4px}.bc-masha-quote-rule{width:72px;height:4px;background:#a8c8ff;margin:34px 0 22px}'

if old_css not in layout:
    raise SystemExit('Masha quote CSS marker not found')
layout = layout.replace(old_css, new_css, 1)

old_html = '<blockquote class="bc-masha-quote-text">No survivor should face their final years alone, without dignity, without hope.</blockquote>\n    <div class="bc-masha-quote-rule"></div>'
new_html = '<blockquote class="bc-masha-quote-text">No survivor should face their final years alone, without dignity, without hope.</blockquote>\n    <span class="bc-masha-quote-close" aria-hidden="true">”</span>\n    <div class="bc-masha-quote-rule"></div>'

if old_html not in layout:
    raise SystemExit('Masha quote HTML marker not found')
layout = layout.replace(old_html, new_html, 1)

mobile_old = '.bc-masha-quote-mark{margin-bottom:18px}}'
mobile_new = '.bc-masha-quote-mark{margin-bottom:18px}.bc-masha-quote-close{text-align:center;margin-top:16px}}'
if mobile_old not in layout:
    raise SystemExit('Masha mobile CSS marker not found')
layout = layout.replace(mobile_old, mobile_new, 1)

layout_path.write_text(layout, encoding='utf-8')

home_path = Path('index.html')
home = home_path.read_text(encoding='utf-8')
old_script = '<script src="./global-layout.js?v=20260805-1" defer></script>'
new_script = '<script src="./global-layout.js?v=20260805-2" defer></script>'
if old_script not in home:
    raise SystemExit('Homepage script cache marker not found')
home_path.write_text(home.replace(old_script, new_script, 1), encoding='utf-8')
