from pathlib import Path

path = Path("global-layout.js")
text = path.read_text(encoding="utf-8")

start_marker = "    var supportSection = document.getElementById('program-support');"
end_marker = "  }\n\n  function applyHomepageUpdates()"

start = text.find(start_marker)
end = text.find(end_marker, start)

if start == -1 or end == -1:
    raise SystemExit(f"Could not locate advisory panel block: start={start}, end={end}")

replacement = r'''    var supportSection = document.getElementById('program-support');
    if (supportSection) {
      supportSection.className = 'bc-section bc-advisory-legacy-section';
      supportSection.innerHTML = `
<style>
.bc-advisory-legacy-section{padding:88px 0;background:#f7f9fe}
.bc-advisory-legacy{position:relative;overflow:hidden;padding:clamp(48px,7vw,90px);border:1px solid rgba(255,255,255,.2);border-radius:34px;color:#fff;background:radial-gradient(circle at 20% 10%,#3966b9 0%,#173b7a 42%,#0f2857 100%);box-shadow:0 22px 60px rgba(14,45,100,.16)}
.bc-advisory-legacy:before{content:"1934";position:absolute;right:-12px;bottom:-56px;color:rgba(255,255,255,.045);font-size:clamp(180px,26vw,390px);font-weight:800;letter-spacing:-.08em;line-height:.8;pointer-events:none}
.bc-advisory-legacy-head,.bc-advisory-legacy-layout{position:relative;z-index:2}
.bc-advisory-legacy-eyebrow{font-size:12px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:#b9cdf3}
.bc-advisory-legacy-title{max-width:920px;margin:14px 0 0;color:#fff;font-size:clamp(38px,5vw,68px);font-weight:900;line-height:1.02;letter-spacing:-.045em}
.bc-advisory-legacy-subtitle{max-width:760px;margin:15px 0 0;color:#cbd9f3;font-size:17px;line-height:1.6}
.bc-advisory-legacy-layout{display:grid;grid-template-columns:330px minmax(0,1fr);gap:58px;margin-top:55px}
.bc-advisory-legacy-chair{padding:32px 0 32px 28px;border-left:2px solid #adc5ef}
.bc-advisory-legacy-chair-label{font-size:12px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:#afc7f1}
.bc-advisory-legacy-chair-name{margin-top:18px;color:#fff;font-family:Georgia,"Times New Roman",serif;font-size:46px;font-weight:700;line-height:1}
.bc-advisory-legacy-members{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 34px}
.bc-advisory-legacy-member{padding:15px 0;border-bottom:1px solid rgba(255,255,255,.18);color:#f2f6ff;font-size:17px;font-weight:700}
@media(max-width:820px){.bc-advisory-legacy-section{padding:66px 0}.bc-advisory-legacy{padding:38px 28px}.bc-advisory-legacy-layout{grid-template-columns:1fr;gap:34px;margin-top:42px}.bc-advisory-legacy-chair{padding:24px 0 24px 22px}.bc-advisory-legacy-members{grid-template-columns:1fr}}
@media(max-width:520px){.bc-advisory-legacy{padding:30px 20px;border-radius:24px}.bc-advisory-legacy-title{font-size:36px}.bc-advisory-legacy-subtitle{font-size:16px}.bc-advisory-legacy-chair-name{font-size:39px}.bc-advisory-legacy:before{right:-20px;bottom:-22px;font-size:190px}}
</style>
<div class="bc-container">
  <div class="bc-advisory-legacy">
    <div class="bc-advisory-legacy-head">
      <div class="bc-advisory-legacy-eyebrow">Education Support</div>
      <h2 class="bc-advisory-legacy-title">The Blue Card Holocaust Education Advisory Panel</h2>
      <p class="bc-advisory-legacy-subtitle">A distinguished group supporting the integrity, relevance, and reach of Holocaust education.</p>
    </div>
    <div class="bc-advisory-legacy-layout">
      <div class="bc-advisory-legacy-chair">
        <div class="bc-advisory-legacy-chair-label">Panel Chair</div>
        <div class="bc-advisory-legacy-chair-name">Michael Berenbaum</div>
      </div>
      <div class="bc-advisory-legacy-members" aria-label="Panel members">
        <div class="bc-advisory-legacy-member">Mehnaz Afridi</div>
        <div class="bc-advisory-legacy-member">Dr. Eva Fogelman</div>
        <div class="bc-advisory-legacy-member">Sofija Grandakovska</div>
        <div class="bc-advisory-legacy-member">Robin Hizme</div>
        <div class="bc-advisory-legacy-member">Michael Miller</div>
        <div class="bc-advisory-legacy-member">Mitchell Pinsky</div>
        <div class="bc-advisory-legacy-member">Joseph Potasnik</div>
      </div>
    </div>
  </div>
</div>`;
    }
'''

path.write_text(text[:start] + replacement + text[end:], encoding="utf-8")
