from pathlib import Path

path = Path('interactive-hologram/index.html')
text = path.read_text(encoding='utf-8')

style_block = '''
<style id="bc-mobile-dropdown-logo-hard-fix">
@media (max-width: 980px) {
  #bc-global-nav .bluecard-nav.is-open .bluecard-nav-logo,
  #bc-global-nav .bluecard-nav.is-open .site-logo {
    display: none !important;
    visibility: hidden !important;
    width: 0 !important;
    height: 0 !important;
    min-width: 0 !important;
    min-height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
  }

  #bc-global-nav .bluecard-nav.is-open .bluecard-nav-mobile-bar {
    min-height: 44px !important;
    height: 44px !important;
    padding: 0 8px !important;
    justify-content: flex-end !important;
  }

  #bc-global-nav .bluecard-nav.is-open .bluecard-nav-inner,
  #bc-global-nav .bluecard-nav.is-open .menu {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
}
</style>
'''

script_block = '''
<script id="bc-mobile-dropdown-logo-hard-fix-script">
(function () {
  function enforceMobileMenuState() {
    if (!window.matchMedia('(max-width: 980px)').matches) return;

    var nav = document.querySelector('#bc-global-nav .bluecard-nav');
    if (!nav) return;

    var mobileLogo = nav.querySelector('.bluecard-nav-logo');
    var desktopLogo = nav.querySelector('.site-logo');
    var mobileBar = nav.querySelector('.bluecard-nav-mobile-bar');
    var isOpen = nav.classList.contains('is-open');

    if (desktopLogo) {
      desktopLogo.style.setProperty('display', 'none', 'important');
    }

    if (mobileLogo) {
      if (isOpen) {
        mobileLogo.style.setProperty('display', 'none', 'important');
        mobileLogo.style.setProperty('visibility', 'hidden', 'important');
      } else {
        mobileLogo.style.removeProperty('display');
        mobileLogo.style.removeProperty('visibility');
      }
    }

    if (mobileBar) {
      if (isOpen) {
        mobileBar.style.setProperty('min-height', '44px', 'important');
        mobileBar.style.setProperty('height', '44px', 'important');
        mobileBar.style.setProperty('padding', '0 8px', 'important');
        mobileBar.style.setProperty('justify-content', 'flex-end', 'important');
      } else {
        mobileBar.style.removeProperty('min-height');
        mobileBar.style.removeProperty('height');
        mobileBar.style.removeProperty('padding');
        mobileBar.style.removeProperty('justify-content');
      }
    }
  }

  function attachObserver() {
    var nav = document.querySelector('#bc-global-nav .bluecard-nav');
    if (!nav) {
      window.setTimeout(attachObserver, 100);
      return;
    }

    enforceMobileMenuState();

    new MutationObserver(enforceMobileMenuState).observe(nav, {
      attributes: true,
      attributeFilter: ['class']
    });

    document.addEventListener('click', function () {
      window.setTimeout(enforceMobileMenuState, 0);
    });

    window.addEventListener('resize', enforceMobileMenuState);
  }

  attachObserver();
})();
</script>
'''

if 'bc-mobile-dropdown-logo-hard-fix' not in text:
    text = text.replace('</head>', style_block + '</head>', 1)

if 'bc-mobile-dropdown-logo-hard-fix-script' not in text:
    text = text.replace('</body>', script_block + '</body>', 1)

path.write_text(text, encoding='utf-8')
