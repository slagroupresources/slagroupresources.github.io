# CLAUDE.md — handoff for working on this site

Read this before changing anything. README.md is the editing guide for Ben; this file is for Claude sessions.

## The one story

A calm, safe, plain-voiced place for people in sex and love addiction recovery, their partners, and people who were hurt. Goal: the go-to free resource for sex addiction and infidelity recovery. It gives the best resources, plain guides, and a few private tools. The site is run by Ben as a volunteer. Write in plain, warm, short sentences, like the original Google Site. No hype, no AI-sounding copy.

## Hard rules

- **Privacy is the product.** No ad or social pixels, no Google Analytics, no third-party cookies. The only analytics is Cloudflare Web Analytics (cookie-free), loaded through `_includes/analytics.html` on resource and info pages only. The public site token is `cloudflare_analytics_token` in `_config.yml` (empty it to turn analytics off), and it skips browsers that send GPC or Do Not Track. Never include it on tracker pages or `shared.html`.
- **Washington My Health My Data Act:** everything here is treated as consumer health data. `consumer-health-data.html` must stay linked separately from `privacy.html` on every page that collects data, including the homepage, all three trackers and `shared.html`. New trackers save nothing until the consent box is checked.
- **Tracker data is end-to-end encrypted.** The operator must never be able to read it. Never send the username or passphrase anywhere, and never log them.
- **No affiliation, ever.** Never write "our group," "we meet," or anything that implies the site runs or speaks for a group. The site is independent and volunteer-run, not affiliated with BetterHelp, any therapist, or any group. Refer to "the Sex Addiction group sessions on BetterHelp." The shared footer states this on every page; keep it. Don't mention sponsors or "friends from group" either; say "someone you trust." Keep Help now wording short and basic.
- **Groups: only two.** Recommend the Sex Addiction group sessions on BetterHelp first, then Sex and Love Addicts Anonymous (SLAA) as the alternative, and nothing else. No links to SAA, S-Anon, COSA, RCA or other groups. Citing another group as the source of a fact (with a Sources entry) is fine; recommending it is not.
- **Buy Me a Coffee stays off** until Brent agrees. Don't advertise BetterHelp beyond the "membership is required" note.
- **Every promise in the privacy policies must stay true.** The published text is `privacy.md` and `consumer-health-data.md`, which are the source of truth. The drafting notes and legal flags are in a Claude doc: https://claude.ai/artifact/5JchsVKbk8jCveXHWkcKEF. If a change affects data handling, update both policies and their `updated:` dates in the same commit, and tell Ben.

## How it's built

- **Hosting:** GitHub Pages from `main` of `slagroupresources/slagroupresources.github.io` (a GitHub org), custom domain `www.slagroupresources.com` (`CNAME`). The domain is registered at Namecheap, and DNS runs at Cloudflare. Every record must stay **DNS only (gray cloud)**: proxying would send all traffic through Cloudflare, which the privacy policy says doesn't happen, and it breaks GitHub's certificate.
- **Homepage:** `index.html` is a Jekyll/Liquid template. GitHub Pages builds it, so there's no local Jekyll; rubygems is blocked in the sandbox. Content comes from:
  - `_data/resources.json`: `start_here` paths (recovery / together / healing) and `sections` → items `{id, title, url?, by?, text?, points?, for[]}`. Keep `id`s stable, because ratings are keyed on them.
  - `_data/tip.json`: the tip of the week.
  - `_data/handouts.json`: Brent's handouts in `files/`.
- **Shared chrome:** every page (homepage, layout pages, trackers) uses `_includes/header.html` (Guides/Resources/Trackers menus, "Help now", phone Menu panel) and `_includes/footer.html` (crisis line, independence statement, email, policy links; trackers pass `note=`). Styles in `css/chrome.css`, behavior in `js/chrome.js`. There is no Exit button or Esc quick exit: Ben removed it as useless. Don't add it back.
- **Text pages** use `_layouts/page.html` (front matter: title, description, lede, updated, `type: guide` adds Article JSON-LD; every layout page gets BreadcrumbList): guides `sex-addiction-recovery.md`, `healing-after-infidelity.md`, `rebuilding-trust.md`; `help-now.html` (breathing orb + urge timer, saves nothing); `privacy.md`, `consumer-health-data.md`.
- **FAQ:** `_data/faq.json` drives the visible FAQ and the FAQPage JSON-LD on the homepage.
- **SEO:** titles/descriptions/OG tags on every page, `img/og-image.png` (1200×630), WebSite + Organization + CollectionPage + FAQPage JSON-LD on the homepage, sitemap lists every public page, `llms.txt` summarizes the site for AI assistants.
- **Tracker pages:** `feelings-check-in.html`, `90-day-tracker.html`, `coping-skills-log.html`. They start with empty Jekyll front matter (`---` `---`) so the shared includes work; don't put `{{` or `{%` in their scripts.
  - They share the same CSS and JS and differ only in `<body data-page>`, title, h1, hero text, manifest, icons and apple title.
  - **When you change shared tracker code, make the same edit in all three.** The build scripts that first generated them aren't in the repo, so edit the HTML directly.
  - `tracker.html` is only a redirect for old links and installs.
- **Sharing with a therapist:** `js/report.js` (`makeSnapshot`, `renderReport`) is used by the tracker pages and by `shared.html`, the read-only viewer.
- **Firebase Firestore:** project `slagroupresources`. The web config in the pages is public by design, and security comes from `firestore.rules`. Ben pastes that file into Firebase → Firestore → Rules → Publish whenever it changes. Collections:
  - `vaults/{64-hex}`: `{ct, iv, updated}`. The key and ID come from PBKDF2-SHA256 (250k iterations, salt `'slagroupresources:'+username`, 512 bits): the first 32 bytes are the AES-GCM key, and the last 32 bytes, as hex, are the doc ID.
  - `stats/ratings`: ONE document with every resource's thumbs counts, `{<resource-id>: {up, down}, last_vote: <resource-id>}`. The homepage reads it over Firestore's REST API (no Firebase library on the homepage) and caches it in `localStorage.ratingsCache` for 6 hours, so a visit costs at most one read. Votes are REST `commit` writes with `updateTransforms` increments; the rules check that only the `last_vote` resource changed, by at most 1, never below 0. The old per-resource `ratings/{id}` collection is retired.
  - `shares/{32-hex}`: `{ct, iv, created, expires}`, encrypted with a random key that lives only in the link fragment `shared.html#<id>.<base64url key>`. Expires in at most 31 days. There's no TTL (it needs billing). Expired copies are deleted when the owner removes the link or signs in, and when `shared.html` gets a permission-denied on an expired link. The privacy policy describes exactly this, so keep them in sync.
- **Browser storage keys:**
  - `trackerSession`: session storage, plus local storage when "keep me signed in" is checked.
  - `votes`, `ratingsCache`, `startPath`, `trackerPage`, `trackerTab`, `installDismissed`.
  - Session-only state lives in variables.
- **Other files:**
  - `llms.txt`, `robots.txt` (allows AI crawlers) and `sitemap.xml`: update the sitemap when you add pages.
  - Manifests `manifest-{feelings,ninety,coping}.webmanifest` and icons `img/icon-{key}-*.png` let each tracker install on its own.

## Testing

- Serve locally with `python3 -m http.server 8765` from the repo root. ES module imports fail over `file://`.
- For offline tests, copy a tracker page and set the Firebase config to `null`. It then falls back to local-storage preview mode.
- Use Playwright with `/usr/bin/google-chrome`.
- The test scripts live outside the repo (`/home/claude/tests` in the original session): `render_site.py` approximates the Jekyll build into `/tmp/sitebuild` (python-liquid + python-markdown, expands includes with params, `jsonify`), `build_offline.sh` builds with analytics on and Firebase off and serves on :8766, `regression.py` (~220 checks: menus, paths, search, every tracker flow, share links, Help now timer, 320px fit, footer wording, analytics placement), `a11y.py` (axe-core WCAG 2.1 AA). If they're gone, rebuild them from this description.
- Check before pushing:
  - Sign in, then refresh and stay signed in.
  - Save an entry in each tracker.
  - Create, open and remove a share link.
  - Ratings render.
  - The mobile menu works.

## Git

- Commit as `SLA Group Resources <noreply@slagroupresources.com>`, with Claude attribution lines at the end.
- Push with `git -c push.negotiate=true push`.
- Ben reviews changes on the live site, so test before pushing.

## Open items (as of 2026-11-24)

- Ben: confirm Firestore backups and point-in-time recovery are off, since the policy says no backups. Turn on 2-step sign-in for the Google and GitHub accounts.
- Ben: have a privacy lawyer confirm whether Washington's law covers an individual volunteer.
- Ben: verify the domain in the org's Pages settings and enforce HTTPS, set the Google Form to anonymous, submit the sitemap to Search Console and Bing, and retire the old Google Site.
