# CLAUDE.md — handoff for working on this site

Read this before changing anything. README.md is the editing guide for Ben; this file is for Claude sessions.

## The one story

A calm, safe, plain-voiced place for people in sex and love addiction recovery, their partners, and people who were hurt. It points people toward Brent Ruebensam's group (held through BetterHelp group sessions) and gives them the best resources and a few private tools. The site is run by Ben as a volunteer. Write in plain, warm, short sentences, like the original Google Site. No hype, no AI-sounding copy.

## Hard rules

- **Privacy is the product.** No ad or social pixels, no Google Analytics, no third-party cookies. The only analytics is Cloudflare Web Analytics (cookie-free), loaded through `_includes/analytics.html` on resource and info pages only. The public site token is `cloudflare_analytics_token` in `_config.yml` (empty it to turn analytics off), and it skips browsers that send GPC or Do Not Track. Never include it on tracker pages or `shared.html`.
- **Washington My Health My Data Act:** everything here is treated as consumer health data. `consumer-health-data.html` must stay linked separately from `privacy.html` on every page that collects data, including the homepage, all three trackers and `shared.html`. New trackers save nothing until the consent box is checked.
- **Tracker data is end-to-end encrypted.** The operator must never be able to read it. Never send the username or passphrase anywhere, and never log them.
- **Buy Me a Coffee stays off** until Brent agrees. Don't advertise BetterHelp beyond the "membership is required" note.
- **Every promise in the privacy policies must stay true.** The published text is `privacy.md` and `consumer-health-data.md`, which are the source of truth. The drafting notes and legal flags are in a Claude doc: https://claude.ai/artifact/5JchsVKbk8jCveXHWkcKEF. If a change affects data handling, update both policies and their `updated:` dates in the same commit, and tell Ben.

## How it's built

- **Hosting:** GitHub Pages from `main` of `slagroupresources/slagroupresources.github.io` (a GitHub org), custom domain `www.slagroupresources.com` (`CNAME`). The domain is registered at Namecheap, and DNS runs at Cloudflare. Every record must stay **DNS only (gray cloud)**: proxying would send all traffic through Cloudflare, which the privacy policy says doesn't happen, and it breaks GitHub's certificate.
- **Homepage:** `index.html` is a Jekyll/Liquid template. GitHub Pages builds it, so there's no local Jekyll; rubygems is blocked in the sandbox. Content comes from:
  - `_data/resources.json`: `start_here` paths (recovery / together / healing) and `sections` → items `{id, title, url?, by?, text?, points?, for[]}`. Keep `id`s stable, because ratings are keyed on them.
  - `_data/tip.json`: the tip of the week.
  - `_data/handouts.json`: Brent's handouts in `files/`.
- **Text pages:** `privacy.md` and `consumer-health-data.md` use `_layouts/page.html`. It has the same header and menu as the homepage, and `_includes/footer.html` is the shared footer with the policy links. The homepage also uses that footer include.
- **Tracker pages:** `feelings-check-in.html`, `90-day-tracker.html`, `coping-skills-log.html`.
  - They share the same CSS and JS and differ only in `<body data-page>`, title, h1, hero text, manifest, icons and apple title.
  - **When you change shared tracker code, make the same edit in all three.** The build scripts that first generated them aren't in the repo, so edit the HTML directly.
  - `tracker.html` is only a redirect for old links and installs.
- **Sharing with a therapist:** `js/report.js` (`makeSnapshot`, `renderReport`) is used by the tracker pages and by `shared.html`, the read-only viewer.
- **Firebase Firestore:** project `slagroupresources`. The web config in the pages is public by design, and security comes from `firestore.rules`. Ben pastes that file into Firebase → Firestore → Rules → Publish whenever it changes. Collections:
  - `vaults/{64-hex}`: `{ct, iv, updated}`. The key and ID come from PBKDF2-SHA256 (250k iterations, salt `'slagroupresources:'+username`, 512 bits): the first 32 bytes are the AES-GCM key, and the last 32 bytes, as hex, are the doc ID.
  - `ratings/{resource-id}`: `{up, down}` counters. Each change is ±1 at most.
  - `shares/{32-hex}`: `{ct, iv, created, expires}`, encrypted with a random key that lives only in the link fragment `shared.html#<id>.<base64url key>`. Expires in at most 31 days.
- **Browser storage keys:**
  - `trackerSession`: session storage, plus local storage when "keep me signed in" is checked.
  - `votes`, `startPath`, `trackerPage`, `trackerTab`, `installDismissed`.
  - Session-only state lives in variables.
- **Other files:**
  - `llms.txt`, `robots.txt` (allows AI crawlers) and `sitemap.xml`: update the sitemap when you add pages.
  - Manifests `manifest-{feelings,ninety,coping}.webmanifest` and icons `img/icon-{key}-*.png` let each tracker install on its own.

## Testing

- Serve locally with `python3 -m http.server 8765` from the repo root. ES module imports fail over `file://`.
- For offline tests, copy a tracker page and set the Firebase config to `null`. It then falls back to local-storage preview mode.
- Use Playwright with `/usr/bin/google-chrome`.
- Approximate the GitHub Pages build into `/tmp/sitebuild` with python-liquid and python-markdown, then serve that folder. See `render_site.py` below; it needs include names quoted for python-liquid. Pass a fake token to test the analytics include.
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

- Ben: **turn on a Firestore TTL policy** on collection group `shares`, field `expires`. The privacy policy promises expired reports are deleted within about a day.
- Ben: confirm Firestore backups and point-in-time recovery are off, since the policy says no backups. Turn on 2-step sign-in for the Google and GitHub accounts.
- Ben: have a privacy lawyer confirm whether Washington's law covers an individual volunteer.
- Ben: verify the domain in the org's Pages settings and enforce HTTPS, set the Google Form to anonymous, submit the sitemap to Search Console and Bing, and retire the old Google Site.
