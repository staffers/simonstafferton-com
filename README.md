# simonstafferton.com

Eleventy 3 on Cloudflare Pages, replacing the WordPress site. Decap CMS for the
blog, Cal.com embed for booking. No build steps beyond Eleventy, no database,
nothing to patch on a Tuesday morning.

## Local

```
npm install
npm start          # dev server on localhost:8080
npm run build      # writes to _site/
```

## Before it goes live

Four things need doing, in this order.

### 1. Cal.com handle

`src/_data/site.js` has a `cal` block with placeholder values:

```js
cal: {
  handle: "simonstafferton",
  event: "intro",
}
```

Set these to your real Cal.com handle and event slug — the two parts of
`cal.com/<handle>/<event>`. The booking page uses the inline embed, with the
brand colour set to the site's oxblood so it does not look bolted on. The
`<noscript>` fallback links straight to Cal.com.

### 2. Post bodies

The three posts in `src/posts/` have correct titles, dates, slugs and excerpts,
but the bodies are stubs with a migration note at the top. Get them properly from
a WordPress export rather than by copying from the rendered page:

WP admin → Tools → Export → Posts → download. The XML contains the full post
bodies including any HTML.

Paste each body in, delete the migration note blockquote, and check the dates
against the export — `google-analytics-channel-groupings` in particular was
estimated.

### 3. GitHub repo and Decap OAuth

- Create the repo and set `repo:` in `src/admin/config.yml` to `OWNER/REPO`.
- Create a GitHub OAuth app: Settings → Developer settings → OAuth Apps → New.
  - Homepage URL: `https://simonstafferton.com`
  - Authorization callback URL: `https://simonstafferton.com/oauth/callback`
- In the Cloudflare Pages project, add environment variables
  `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` for **both** Production and
  Preview.

The functions in `functions/oauth/` handle the flow. `/admin/` is `noindex` and
excluded in `robots.txt`.

> This is the same OAuth pattern as abtests.co.uk. Worth confirming it actually
> works here before assuming — that one is still unverified.

### 4. Cloudflare Pages project

- Build command: `npm run build`
- Output directory: `_site`
- Node version: 20 or later

Then point the domain across. `_redirects` and `_headers` are copied into the
build output automatically.

## Redirects

`src/_redirects` maps the old WordPress URLs. Posts keep their root-level slugs,
so they need no redirect — the URLs are unchanged, which is the whole point.

Mapped: `/book-me/` → `/book/`, `/about-me/` → `/about/`, `/what-i-do/` →
`/projects/`, `/contact-me/` → `/book/`, `/feed/` → `/feed.xml`, plus category,
tag, author and `wp-admin` paths.

`/training/` currently redirects to the homepage because there is no replacement
page. If you want training back, add the page and change the redirect.

## Things deliberately not built

**A scheduler.** Cal.com's free tier does this properly and is open source, so it
can be self-hosted later if it ever matters. Building one means Google Calendar
OAuth, free/busy queries, timezone and DST handling, double-booking races, `.ics`
generation and reschedule flows — a product, not a feature.

**A cookie banner.** Analytics is Plausible, which is cookieless, and Cal.com's
embed sets nothing until someone interacts with it. Nothing here needs consent,
which is why the old banner is gone.

## Structure

```
src/
  _data/site.js        title, nav, Cal.com handle, social links
  _includes/           base, page and post layouts
  posts/               blog posts (markdown)
  admin/               Decap CMS
  assets/style.css     the whole stylesheet
  _redirects           old WordPress URLs
  _headers             security headers, asset caching
functions/oauth/       GitHub OAuth for Decap
```

## Design notes

Palette is cool chalk (`#f1f2ef`) with deep ink (`#191d1b`), an oxblood accent
(`#7a2e3b`) and sage (`#7e9179`) for underlines. Fraunces for display with the
WONK axis on, Karla for body. Deliberately not the Stafferton Digital teal — this
is the personal site and should not read as agency collateral.

Fonts currently load from Google Fonts. `src/assets/fonts/` is there if you want
to self-host them later, which would be consistent with how the other sites work.
