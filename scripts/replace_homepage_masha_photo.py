from pathlib import Path

layout_path = Path('global-layout.js')
layout = layout_path.read_text(encoding='utf-8')
old = 'https://bluecardfund.org/wp-content/uploads/2025/02/111-VGindiphotosm-768x768.jpg'
new = '/bluecard/images/staff/masha_pearl-vertical-photo.jpg'
if old not in layout:
    raise SystemExit('Current homepage Masha image URL not found')
layout = layout.replace(old, new, 1)
layout_path.write_text(layout, encoding='utf-8')

home_path = Path('index.html')
home = home_path.read_text(encoding='utf-8')
old_script = '<script src="./global-layout.js" defer></script>'
new_script = '<script src="./global-layout.js?v=20260805-1" defer></script>'
if old_script not in home:
    raise SystemExit('Homepage global-layout.js script marker not found')
home_path.write_text(home.replace(old_script, new_script, 1), encoding='utf-8')
