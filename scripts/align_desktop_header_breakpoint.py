from pathlib import Path

base_path = Path('global-layout-base.js')
base = base_path.read_text(encoding='utf-8')
base = base.replace('@media (min-width:1100px){', '@media (min-width:981px){', 1)
base = base.replace('.bc-top-donate-strip{min-height:112px!important;', '.bc-top-donate-strip{display:grid!important;min-height:112px!important;', 1)
base_path.write_text(base, encoding='utf-8')

layout_path = Path('global-layout.js')
layout = layout_path.read_text(encoding='utf-8')
layout = layout.replace('global-layout-base.js?v=20260804-12', 'global-layout-base.js?v=20260804-13')
layout_path.write_text(layout, encoding='utf-8')

hologram_path = Path('interactive-hologram/index.html')
hologram = hologram_path.read_text(encoding='utf-8')
hologram = hologram.replace('../global-layout.css?v=20260804-12', '../global-layout.css?v=20260804-13')
hologram = hologram.replace('../global-layout.js?v=20260804-12', '../global-layout.js?v=20260804-13')
hologram_path.write_text(hologram, encoding='utf-8')
