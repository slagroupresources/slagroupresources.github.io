# SLA Group Resources 2.0

A plain static site: one `index.html` plus a few small files. No build step. To edit, open `index.html`, copy an existing `<article class="card">` block, and change the text.

## Editing content (no code needed)
Everything on the homepage comes from three files in the `_data` folder. Open one on GitHub, click the pencil icon, edit, and click **Commit changes**. The site rebuilds itself in about a minute.

| File | What it controls |
|---|---|
| `_data/tip.json` | Tip of the week: `title` and `text` |
| `_data/resources.json` | Every resource, grouped into sections, plus the "Start here" picks for each path |
| `_data/handouts.json` | The group handouts (file, picture, description) |

**Adding a resource:** copy an existing item inside the right section's `items` list, paste it below, and change the values.
- `id`: unique, lowercase, dashes instead of spaces (also used for its thumbs-up count, so don't change it later)
- `title`, `text`, and optional `url` and `by`
- `for`: any of `"recovery"` (working on my own recovery), `"together"` (walking with someone), `"healing"` (hurt and healing)

**Changing "Start here":** under `start_here`, list up to four item `id`s for each path.

**Careful with commas and quotes.** Every item except the last in a list ends with a comma. If a commit breaks the file, GitHub keeps showing the last good version of the site, and the commit shows a red ✗ under the repository's **Actions** tab. Undo the edit to fix it.

## Sharing with a therapist
Each tracker page has **Share with your therapist**. People pick which trackers, a time range, and whether to include written notes.
- **Save as PDF** opens the print dialog with a clean report. Nothing is uploaded.
- **Create a private link** encrypts the report in the browser with a new random key. The key is only in the link after the `#`, which browsers never send to a server, so the database can't read it. Links expire after 7 or 30 days, and the person can remove them from their tracker any time.
- Private links need the `shares` rules from `firestore.rules` to be published in Firebase.

## Ratings (thumbs up / down)
Counts are stored in Firestore under `ratings/<resource id>`. Each browser can vote once per resource and can change or undo its vote. The thumbs only appear once the rules in `firestore.rules` are published in Firebase.

## Files
| File | Purpose |
|---|---|
| `index.html` | Homepage template (fills itself in from `_data`) |
| `_config.yml` | Site build settings |
| `robots.txt` | Lets search engines and AI crawlers in, and points them to the sitemap |
| `sitemap.xml` | Tells search engines the page exists. Update `lastmod` when you make big changes |
| `llms.txt` | Plain-text summary that AI assistants can read quickly |
| `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` | Browser-tab and phone home-screen icons (the small "open seat" logo) |
| `feelings-check-in.html`, `90-day-tracker.html`, `coping-skills-log.html` | The three trackers, each its own page and home-screen app |
| `tracker.html` | Forwards old tracker links to the right page |
| `shared.html`, `js/report.js` | Read-only report a person shares with their therapist (PDF or private link) |
| `manifest-*.webmanifest`, `img/icon-*` | Home-screen name and icon for each tracker |
| `files/qr-code.png` | QR code for sharing the site |
| `firestore.rules` | Security rules for the tracker database (copy of what's published in Firebase) |
| `files/thumbs/` | Preview pictures for the Word and PDF handouts |
| `img/mark-light.svg` | Logo in the site header |
| `img/logo.svg`, `img/logo.png` | Logo for light backgrounds (transparent) |
| `img/logo-light.svg` | Logo for dark backgrounds (transparent) |
| `files/` | Group handouts. **Add these four yourself** (download them from the old site) |

Files to put in `files/`:
- `healthy-sexual-decision-framework.png`
- `feelings-wheel.png`
- `coping-skills-log.docx`
- `90-day-detox-summary.pdf`

## Privacy policies

- `privacy.md` is the Privacy Policy and `consumer-health-data.md` is the Consumer Health Data Privacy Policy (for Washington's My Health My Data Act). Edit them on GitHub like any text file, and change the `updated:` date at the top when you do.
- Both are linked in the footer of every page. Keep them as two separate links, because Washington requires the health data policy to have its own link.
- If you change what the site collects, update both policies first.

## Page counts (Cloudflare Web Analytics)

Cookie-free visit counts on the homepage and policy pages only, never on the trackers or shared reports. Visitors whose browser sends Global Privacy Control or Do Not Track aren't counted.

1. Sign in at dash.cloudflare.com (a free account works), then go to **Analytics & Logs → Web Analytics → Add a site**.
2. Enter `www.slagroupresources.com` and choose the manual JavaScript snippet (not automatic setup).
3. Copy only the token, the long value after `"token":` in the snippet.
4. Paste it between the quotes in `_config.yml` at `cloudflare_analytics_token: ""` and commit. Counts start a few minutes after the site rebuilds.

To turn analytics off, empty the quotes again.

## Tracker database (Firebase)
`tracker.html` saves each person's data to Firestore, encrypted in their browser with a key made from their username and passphrase. The database only ever sees scrambled text, and a forgotten passphrase can't be recovered.
- The Firebase web config in `tracker.html` is not a secret. Access is controlled by `firestore.rules`.
- If you change the rules, paste `firestore.rules` into **Firestore Database → Rules** in the Firebase console and click **Publish**.
- **Delete expired share links automatically (required by the privacy policy):** in Google Cloud Console (project `slagroupresources`), go to **Firestore → Time-to-live (TTL) → Create policy**. Set Collection group to `shares` and Timestamp field to `expires`, then click **Create**. Expired reports are then deleted, usually within 24 hours.
- Optional extra protection: in Google Cloud Console → **APIs & Services → Credentials**, restrict the browser API key to the website `https://www.slagroupresources.com/*`.

## Why the certificate errors happen
Google Sites only works on `www.` addresses. The bare `slagroupresources.com` has to be forwarded by your domain registrar, and many registrars forward without a valid HTTPS certificate, so browsers show a certificate error. The hosts below issue certificates for both addresses automatically.

## Hosting (free): GitHub Pages, with DNS staying at Namecheap

### 1. Set up a separate GitHub identity
GitHub's terms allow one free personal account per person. To keep the site separate from your main profile without breaking that rule:
- **If you already have a GitHub account:** create a free **organization** instead. Click **+ → New organization → Free**, name it (e.g. `slagroupresources`), and choose "My personal account" as the owner. Give it the display name "SLA Group Resources" and no personal details. Your membership in an organization is private by default; check it under **People** to be sure.
- **If you don't have one:** sign up with a dedicated email address. Turn on two-factor authentication, then go to **Settings → Emails** and check **Keep my email addresses private**.

### 2. Create the repository
In the organization (or account), click **New repository**:
- Name: `slagroupresources.github.io` (must match the org or account name exactly, followed by `.github.io`)
- Visibility: **Public** (free GitHub Pages needs a public repository; it only holds the public website)
- Click **Create repository**

### 3. Upload the site
On the empty repository page, click **uploading an existing file**. Drag in the **contents** of this folder, not the folder itself: `index.html`, `robots.txt`, `sitemap.xml`, `llms.txt`, `README.md`, and the `files` folder with the four handouts. Click **Commit changes**.

### 4. Turn on Pages
**Settings → Pages → Build and deployment**: Source **Deploy from a branch**, branch **main**, folder **/ (root)** → **Save**. After a minute or two the site is live at `https://slagroupresources.github.io`. Check it there before touching DNS.

### 5. Verify the domain (prevents someone else from claiming it)
In the **organization's** (or account's) **Settings → Pages → Add a domain**, enter `slagroupresources.com`. GitHub shows a TXT record. Add it in Namecheap (step 6), then click **Verify**.

### 6. Point Namecheap at GitHub
Namecheap → **Domain List → Manage → Advanced DNS**. Nameservers must be **Namecheap BasicDNS**.

Delete:
- Any **URL Redirect** record for `@` (the old forwarding that causes the certificate errors)
- The old Google Sites record: CNAME `www` → `ghs.googlehosted.com`
- Any parking-page records for `@` or `www`

Keep any **MX** (email) records and existing **TXT** verification records.

Add:
| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | slagroupresources.github.io. |
| TXT | (from step 5) | (from step 5) |

### 7. Connect the custom domain
Repository **Settings → Pages → Custom domain**: enter `www.slagroupresources.com` → **Save**. GitHub checks DNS and issues a certificate. This usually takes under an hour, but DNS can take a few hours to settle. When the box becomes available, check **Enforce HTTPS**. The bare `slagroupresources.com` will redirect to www automatically.

### 8. Retire the Google Site
In Google Sites, go to **Settings → Custom domains** and remove `www.slagroupresources.com`. Then unpublish the old site so there aren't two copies.

### 9. Test
Open `http://slagroupresources.com`, `https://slagroupresources.com`, and `https://www.slagroupresources.com`. All three should land on the new site with no certificate warning.

### Updating the site later
In the repository, click a file → pencil icon → edit → **Commit changes**. To replace a file, use **Add file → Upload files** with the same name. Changes go live in a minute or two.

## After it's live
- **Google Search Console** (search.google.com/search-console): verify the domain and submit `sitemap.xml`.
- **Bing Webmaster Tools** (bing.com/webmasters): submit the sitemap. Bing's index also feeds ChatGPT search and Copilot.
- **Google Form:** In Settings → Responses, turn off "Restrict to users in…" and "Collect email addresses" so people can submit without a Google account.
- **Old Google Site:** Unpublish it, or point its custom domain at nothing, once the new site works, so there aren't two versions.

## Items to check
- **Quitter:** Many apps use this name. Confirm which one the group means, then add its link.
- **No Nutt and My Girl:** These were on the old site, but I couldn't confirm them, so I left them out. Add them back with links if the group still recommends them.
- Book links search Bookshop.org. Podcast links search Apple Podcasts where no official page was confirmed.
