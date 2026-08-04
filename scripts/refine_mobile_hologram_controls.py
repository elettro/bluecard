from pathlib import Path

path = Path("interactive-hologram/index.html")
text = path.read_text(encoding="utf-8")

old = """      .bc-hero-content {
        padding: 72px 0 56px;
      }
"""
new = """      .bc-hero-content {
        padding: 94px 0 56px;
      }

      .bc-sound-wrap {
        top: 12px;
        right: 10px;
        gap: 6px;
        flex-wrap: nowrap;
      }

      .bc-sound-wrap .bc-btn {
        width: auto;
        min-height: 34px;
        border-radius: 999px;
      }

      .bc-sound-toggle {
        width: 36px;
        min-width: 36px;
        height: 34px;
        padding: 0;
        font-size: 16px;
      }

      .bc-hide-text-toggle {
        min-height: 34px;
        padding: 0 11px;
        font-size: 11px;
        letter-spacing: 0;
      }

      .bc-eyebrow {
        margin-top: 10px;
      }
"""

if old not in text:
    raise SystemExit("Mobile hero content CSS marker not found")

path.write_text(text.replace(old, new, 1), encoding="utf-8")
