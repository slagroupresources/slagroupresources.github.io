---
layout: page
title: Privacy Policy
description: How SLA Group Resources handles your information. We don't ask who you are, we don't track you, and we can't read your tracker data.
updated: November 24, 2026
---

**The short version:** we don't ask who you are, we don't track you, and we can't read your tracker data. Your tracker entries are locked on your own device before they're saved, and only your username and passphrase can unlock them.

Because this is a recovery site, we treat everything here as health information. Our [Consumer Health Data Privacy Policy](consumer-health-data.html) explains your rights under Washington's My Health My Data Act and similar laws.

## Who we are

SLA Group Resources (www.slagroupresources.com) is a free resource site for people in sex and love addiction recovery, their partners, and people who have been hurt. It's run by a volunteer in Florida, USA. In this policy, "we" means that volunteer. You can reach us at [slagroupresources@gmail.com](mailto:slagroupresources@gmail.com).

We are not a healthcare provider, and we are not part of BetterHelp or any other company. Nothing on this site is medical or mental health advice. If you are in crisis, call or text 988 in the U.S.

## What we collect

Most of the site is just pages to read. You can use it without giving us anything.

| What | When | What we can see |
| --- | --- | --- |
| Encrypted tracker data | You save entries in the Feelings check-in, 90-day tracker or Coping skills log | Nothing readable. We store scrambled data, a random-looking ID, and the time it was last saved. |
| Shared reports | You create a private link to share with your therapist | Nothing readable. We store scrambled data, when it was made, and when it expires. |
| Resource ratings | You tap thumbs up or down | Only the totals for each resource. Votes aren't tied to you. |
| Resource suggestions | You fill out our suggestion form | What you type. The form doesn't ask for your name or email. Please don't include details about your own health. |
| Page counts | You visit the homepage or another resource page | Totals, like how many visits a page got and which sites sent visitors. Nothing that identifies you. Never on tracker pages or shared reports. |
| Basic connection data | You visit any page | We don't collect this. Our hosting and database providers receive your IP address and browser details, like they do for any website. See [Services we use](#services-we-use). |

We don't ask for your name, email, phone number or location. We don't use advertising, tracking pixels, social media trackers or cookies. **We never sell your information, and we never share it for advertising.**

## How tracker sign-in works

The trackers ask for a username and a passphrase. These aren't an account with us. They never leave your device and are never sent to us.

Your browser uses them to make two things: a key that locks your data, and an ID for where it's saved. Your entries are locked (encrypted) on your device before they're sent, and they're unlocked on your device when you sign in again. We, our providers and anyone who gets into our database see only scrambled data.

This also means we can't recover your data if you forget your username or passphrase. Write them down somewhere safe, or use a password manager.

When you start a new tracker, we ask you to agree to have your entries saved this way. Nothing is saved until you do.

If you share a report with your therapist, it's locked with a new one-time key. That key is only in the link you send. Browsers don't send that part of a link to any server, so we can't read the report. Links stop working after 7 or 30 days, whichever you choose, and you can remove a link any time.

## Information stored in your browser

The site saves a few things in your own browser's storage. They stay on your device and aren't sent to us.

- Your tracker session, so a refresh doesn't sign you out. If you check "Keep me signed in," it stays until you sign out. Otherwise it ends when you close the tab.
- Which resources you rated, so you can change your vote, and a copy of the rating totals, refreshed every few hours, so the page loads faster.
- Your last choice on "Where are you starting?" and your last tracker page.
- Whether you closed the "Add to home screen" message.

Your browser's password manager may offer to save your tracker username and passphrase. That's your browser's feature, not ours. On a shared device, don't check "Keep me signed in," and sign out when you're done.

## Services we use

These companies help run the site. Each one handles data under its own privacy policy and terms.

| Service | What it does for us | What it receives |
| --- | --- | --- |
| [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) (GitHub, Inc.) | Hosts the website | Your IP address and browser details. GitHub logs IP addresses for security. [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) |
| [Firebase](https://firebase.google.com/support/privacy) (Google LLC) | Stores encrypted tracker data, shared reports and rating totals, and delivers the database code to your browser | Your IP address and browser details when a page talks to the database. Google handles this for us as a service provider. |
| [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) (Cloudflare, Inc.) | Counts page visits on resource pages | The page address, the site that sent you, and your browser and country, without cookies or fingerprinting. It doesn't run on tracker pages or shared reports, and it doesn't run at all if your browser sends Do Not Track or Global Privacy Control. [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/) |
| Google Forms (Google LLC) | Collects resource suggestions | What you type, plus what Google collects under its [privacy policy](https://policies.google.com/privacy) |
| Namecheap | Registers our domain name | Nothing about visitors |

We only see page counts as totals, and we don't try to identify anyone from them.

The site links to outside resources, books, podcasts, videos, apps and support groups. When you follow a link, you leave our site, and that site's own privacy policy applies.

## How long we keep it

- **Tracker data:** until you delete it with "Delete my tracker." Deleting it removes it right away.
- **Shared reports:** nobody can open them after they expire. The stored copy, which stays encrypted, is deleted when you remove the link, when you next open your tracker, when someone tries the expired link, or when you delete your tracker.
- **Ratings:** totals are kept while the resource is listed.
- **Suggestions:** kept until we've reviewed them, and deleted within 12 months.
- **Page counts:** kept as totals in Cloudflare's reports.
- **Backups:** we don't keep backup copies of the database, so deleted data doesn't linger in an archive.
- **Provider logs:** kept by GitHub, Google and Cloudflare under their own policies.

## Your choices and rights

- Use the site without the trackers. Every resource page works without signing in.
- Delete your tracker any time with "Delete my tracker." This removes your saved data and any shared links.
- Remove a therapist link any time.
- Clear what's saved in your browser through your browser's settings.
- Turn on Global Privacy Control or Do Not Track to switch off page counts.
- Ask us what we hold, or ask us to delete something, by emailing [slagroupresources@gmail.com](mailto:slagroupresources@gmail.com). We answer within 45 days, and you can appeal our answer. Details are in our [Consumer Health Data Privacy Policy](consumer-health-data.html#your-rights).

Please don't email us your username or passphrase. We can't tell whose tracker is whose, so the "Delete my tracker" button is the way to delete tracker data.

## Do Not Track

We don't track you across sites, and we don't let anyone else do it on our site. If your browser sends a Do Not Track or Global Privacy Control signal, we also turn off page counts.

## Security

Tracker data and shared reports are encrypted in your browser with AES-256-GCM. Your key comes from your username and passphrase using PBKDF2 with 250,000 rounds. The database only accepts encrypted data, and it won't let anyone list what's stored. No system is perfect, so a strong passphrase that you don't use anywhere else is your best protection.

Only the volunteer who runs the site can manage the database.

If we learn of a security problem that affects your information, we'll post a notice on the site and follow the notification laws that apply.

## If we're asked for data

If the law requires it, we may have to hand over what we hold. That's only encrypted data, rating totals and suggestion form answers. We can't decrypt tracker data or shared reports.

## Children

This site is for adults 18 and older. It isn't meant for children, and we don't knowingly collect information from anyone under 18. If you think a child has used the trackers, contact us.

## Where data is stored

Our providers store data in the United States. If you visit from another country, your connection data goes to the U.S.

## Changes to this policy

If we change this policy, we'll update the date at the top. If a change affects how we handle your information, we'll post a note on the homepage first, and we'll ask for your agreement before using information in a new way.

## Contact

SLA Group Resources · [slagroupresources@gmail.com](mailto:slagroupresources@gmail.com)
