#!/usr/bin/env python3
"""Publish Constant Contact newsletters tagged [web] to bluecard.org/newsletters/.

Run daily by .github/workflows/newsletter-sync.yml.  Needs env:
  CC_CLIENT_ID, CC_CLIENT_SECRET, CC_REFRESH_TOKEN   (GitHub Actions secrets)

Flow: refresh token -> list sent emails -> keep names containing [web] -> skip ones already in
published-ids.json -> fetch html -> build page + images (newsletter_build.py) -> rebuild
/newsletters/ index, sitemap, llms.txt (newsletter_index.py).  The workflow commits the result.

  python newsletter_sync.py            # real run
  python newsletter_sync.py --dry-run  # list what would be published, change nothing
  python newsletter_sync.py --from-html FILE --date 261109 --subject "..."   # offline test of the page builder
"""
import argparse, base64, datetime, json, os, re, subprocess, sys, urllib.error, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
API = "https://api.cc.email/v3"
TOKEN_URL = "https://authz.constantcontact.com/oauth2/default/v1/token"
TAG_RE = re.compile(r"\[\s*web\s*\]", re.I)
IDS_FILE = os.path.join(HERE, "published-ids.json")
CARDS_FILE = os.path.join(HERE, "cards.json")
MAX_NEW_PER_RUN = 10   # safety brake: never publish more than this in one run


def http(url, data=None, headers=None, method=None):
    req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode("utf-8") or "null")
    except urllib.error.HTTPError as e:
        sys.exit("HTTP %s for %s: %s" % (e.code, url.split("?")[0], e.read().decode()[:300]))


def access_token():
    cid, sec, rt = (os.environ.get(k, "") for k in ("CC_CLIENT_ID", "CC_CLIENT_SECRET", "CC_REFRESH_TOKEN"))
    if not (cid and sec and rt):
        sys.exit("Missing CC_CLIENT_ID / CC_CLIENT_SECRET / CC_REFRESH_TOKEN")
    auth = base64.b64encode(("%s:%s" % (cid, sec)).encode()).decode()
    body = urllib.parse.urlencode({"refresh_token": rt, "grant_type": "refresh_token"}).encode()
    tok = http(TOKEN_URL, body, {"Authorization": "Basic " + auth, "Content-Type": "application/x-www-form-urlencoded",
                                 "Accept": "application/json"})
    return tok["access_token"]


def cc(path, tok):
    return http(API + path, headers={"Authorization": "Bearer " + tok, "Accept": "application/json"})


def sent_date_yymmdd(tok, activity_id):
    """First completed send date in US Eastern, as yymmdd."""
    hist = cc("/emails/activities/%s/send_history" % activity_id, tok)
    runs = [h for h in (hist if isinstance(hist, list) else []) if h.get("send_status") == "COMPLETED" and (h.get("count") or 0) > 0]
    if not runs:
        return None
    first = min(r["run_date"] for r in runs)
    dt = datetime.datetime.strptime(first[:19], "%Y-%m-%dT%H:%M:%S").replace(tzinfo=datetime.timezone.utc)
    try:
        from zoneinfo import ZoneInfo
        dt = dt.astimezone(ZoneInfo("America/New_York"))
    except Exception:
        dt = dt - datetime.timedelta(hours=5)
    return dt.strftime("%y%m%d")


def find_new(tok):
    published = set(json.load(open(IDS_FILE)))
    out = []
    campaigns = cc("/emails?limit=500", tok).get("campaigns", [])
    for c in campaigns:
        if not TAG_RE.search(c.get("name", "")) or str(c.get("current_status", "")).lower() != "done":
            continue
        full = cc("/emails/%s" % c["campaign_id"], tok)
        prim = next((a for a in full.get("campaign_activities", []) if a.get("role") == "primary_email"), None)
        if not prim or prim["campaign_activity_id"] in published:
            continue
        act = cc("/emails/activities/%s?include=html_content,permalink_url" % prim["campaign_activity_id"], tok)
        if not act.get("html_content"):
            print("SKIP (no html_content, format_type=%s): %s" % (act.get("format_type"), c["name"]))
            continue
        date = sent_date_yymmdd(tok, prim["campaign_activity_id"])
        if not date:
            print("SKIP (no completed send yet): %s" % c["name"])
            continue
        out.append({"yymmdd": date, "id": prim["campaign_activity_id"], "name": c["name"], "type": "",
                    "d": {"subject": act.get("subject", ""), "preheader": "", "fromName": act.get("from_name", ""),
                          "html": act["html_content"]}})
    return sorted(out, key=lambda r: r["yymmdd"])


def build(items):
    work = os.path.join(HERE, "work")
    os.makedirs(work, exist_ok=True)
    json.dump(items, open(os.path.join(work, "input.json"), "w", encoding="utf-8"), ensure_ascii=False)
    env = dict(os.environ, NL_WORK=work)
    subprocess.run([sys.executable, os.path.join(HERE, "newsletter_build.py")], check=True, env=env)
    new_cards = json.load(open(os.path.join(work, "new-cards.json"), encoding="utf-8"))
    cards = json.load(open(CARDS_FILE, encoding="utf-8"))
    have = {c["slug"] for c in cards}
    cards += [c for c in new_cards if c["slug"] not in have]
    json.dump(cards, open(CARDS_FILE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    subprocess.run([sys.executable, os.path.join(HERE, "newsletter_index.py")], check=True)
    ids = set(json.load(open(IDS_FILE))) | {i["id"] for i in items}
    json.dump(sorted(ids), open(IDS_FILE, "w"), indent=1)
    for c in new_cards:
        print("PUBLISHED", c["date_long"], "|", c["title"], "| /newsletters/%s/" % c["slug"])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--from-html")
    ap.add_argument("--date")
    ap.add_argument("--subject", default="")
    ap.add_argument("--id", default="offline-test")
    a = ap.parse_args()
    if a.from_html:  # offline test path
        items = [{"yymmdd": a.date, "id": a.id, "name": a.subject, "type": "",
                  "d": {"subject": a.subject, "preheader": "", "fromName": "", "html": open(a.from_html, encoding="utf-8").read()}}]
        return build(items)
    tok = access_token()
    items = find_new(tok)
    print("%d new [web] newsletter(s)" % len(items))
    for i in items:
        print(" -", i["yymmdd"], i["name"])
    if a.dry_run or not items:
        return
    if len(items) > MAX_NEW_PER_RUN:
        sys.exit("Safety stop: %d new newsletters in one run (limit %d). Check the [web] tags." % (len(items), MAX_NEW_PER_RUN))
    build(items)


if __name__ == "__main__":
    main()
