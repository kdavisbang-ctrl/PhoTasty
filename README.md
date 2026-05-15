# Phở Tasty

The official website for **Phở Tasty** — authentic Vietnamese phở, bánh mì, bún and boba at 6044 East 82nd Street, Indianapolis, IN.

A static single-page site built with hand-written HTML, CSS, and a small JavaScript routing layer. No build step. No dependencies. Just drop it on a static host.

## Structure

```
.
├── index.html          # main page — intro scene, menu, story, photos
├── 404.html            # graceful fallback for unknown URLs
├── .nojekyll           # tell GitHub Pages to serve files as-is
├── robots.txt          # search-engine directives
├── sitemap.xml         # search-engine sitemap
└── assets/
    ├── css/style.css   # all styles
    ├── js/main.js      # navigation + ambient animations (lanterns, particles)
    └── images/         # photography + SVG favicon
```

## Local preview

Open `index.html` in a browser, or run any static server from the repo root:

```bash
# Python 3
python3 -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main` (or whichever branch you publish from) · **Folder:** `/ (root)`
4. Save. GitHub Pages will publish at `https://<username>.github.io/<repo>/` within a minute or two.

The `.nojekyll` file ensures GitHub serves files without trying to process them through Jekyll. The site is fully relative-pathed, so it works at the root domain or under a project subpath without changes.

### Optional: custom domain

Add a single-line `CNAME` file at the repo root with your domain (e.g. `photasty.com`), then point your DNS A/CNAME records at GitHub Pages per [GitHub's docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Editing content

- **Menu items, prices, descriptions** — edit the relevant `<article class="dish">` blocks in `index.html`.
- **Photos** — replace files in `assets/images/`. Keep filenames or update the `src` attributes.
- **Hours / address / phone** — search for `6044 East 82nd` or the phone number in `index.html` (also update the JSON-LD block in `<head>`).
- **Colors / typography** — adjust the CSS custom properties in `:root { ... }` near the top of `assets/css/style.css`.

## Notes

- **Routing.** The site is one HTML file with four screens (intro, menu, story, photos). Navigation is hash-based — `#menu`, `#story`, `#photos`, `#visit`, `#menu/pho` — so deep links and back/forward both work, no server config needed.
- **Accessibility.** Buttons are real `<button>` elements; cards expose `tabindex`; stars carry `aria-label`s; the site respects `prefers-reduced-motion`.
- **SEO.** Open Graph + Twitter Card meta tags, a `Restaurant` schema.org JSON-LD block, `sitemap.xml`, and `robots.txt` are all in place.
