from pathlib import Path

base_path = Path('global-layout-base.js')
base = base_path.read_text(encoding='utf-8')
marker = "    navTarget.innerHTML = `\n"
style = '''    navTarget.innerHTML = `
<style id="bc-desktop-header-layout">
@media (min-width:1100px){
  .bc-top-donate-strip{min-height:112px!important;padding:10px 28px!important;grid-template-columns:minmax(280px,1fr) auto minmax(280px,1fr)!important;column-gap:28px!important}
  .bc-top-brand{grid-column:1!important;justify-self:start!important;display:inline-flex!important;align-items:center!important;text-decoration:none!important}
  .bc-top-brand img{display:block!important;width:auto!important;height:88px!important;max-width:390px!important;object-fit:contain!important}
  .bc-top-donate-btn{grid-column:2!important}
  .bc-top-contact{grid-column:3!important}
  .bluecard-nav-inner{min-height:58px!important;justify-content:center!important;padding:0 18px!important}
  .site-logo{display:none!important}
  .bluecard-nav .menu{display:flex!important;flex:0 1 auto!important;flex-wrap:nowrap!important;justify-content:center!important;gap:4px!important}
  .bluecard-nav .menu>li>a{padding:10px 14px!important}
}
</style>
'''

if 'id="bc-desktop-header-layout"' not in base:
    if marker not in base:
        raise SystemExit('global layout markup marker not found')
    base = base.replace(marker, style, 1)
base_path.write_text(base, encoding='utf-8')

layout_path = Path('global-layout.js')
layout = layout_path.read_text(encoding='utf-8')
layout = layout.replace("global-layout-base.js?v=20260804-11", "global-layout-base.js?v=20260804-12")
layout_path.write_text(layout, encoding='utf-8')

hologram_path = Path('interactive-hologram/index.html')
hologram = hologram_path.read_text(encoding='utf-8')
hologram = hologram.replace('../global-layout.css?v=20260804-11', '../global-layout.css?v=20260804-12')
hologram = hologram.replace('../global-layout.js?v=20260804-11', '../global-layout.js?v=20260804-12')
hologram_path.write_text(hologram, encoding='utf-8')
