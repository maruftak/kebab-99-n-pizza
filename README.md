# Kebab 99 N Pizza — Online Ordering

Responsive, static ordering website for a kebab & pizza shop. Browse the menu on
phone or laptop, build a cart, and check out for pickup or delivery. Built as a
zero-dependency static site — fast, cheap to host, and small attack surface.

> Rebuilt from a Claude-designed neo-brutalist mockup into a deployable site.
> The original design export is kept in [`design-source/`](design-source/) for reference.

## Features

- **Full menu** — kebabs, plates, pizza, pide, snack packs, burgers, sides, sweets, deals — with per-item photos and sizes.
- **Cart** — add/remove/quantity, persisted in `localStorage`, live badge and cart bar across pages.
- **Checkout** — pickup or delivery, contact + payment fields, order confirmation with live status tracking.
- **Contact** — hours, location placeholders, and a validated message form.
- **Responsive** — mobile-first; works 320px → widescreen. Collapsible nav on small screens.
- **Accessible** — semantic HTML, ARIA labels, keyboard focus states, `prefers-reduced-motion` support.

## Tech

Plain HTML + CSS + vanilla JS. No framework, no build step, no npm dependencies.

```
index.html          Home
menu.html           Menu (rendered from data)
order.html          Cart → checkout → confirmation
contact.html        Contact + message form
assets/
  css/styles.css    Design system (tokens) + responsive layout
  js/menu-data.js   Menu items, prices, sizes, image map
  js/cart.js        localStorage cart (validated, observable)
  js/menu.js        Menu rendering + add-to-cart
  js/order.js       Cart/checkout/confirmation flow
  js/contact.js     Contact form validation
  js/main.js        Shared nav + cart-badge
  img/*.jpg         Self-hosted food photos
vercel.json         Security headers + caching
```

## Run locally

Any static file server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy (Vercel)

No build command — it's a static site. Either:

- Import the GitHub repo at [vercel.com/new](https://vercel.com/new), or
- Run `vercel` / `vercel --prod` from this folder.

`vercel.json` sets security headers and long-lived caching for images.

## Security

Designed against the OWASP Top 10 for a static, backendless site:

- **No inline scripts or inline event handlers** — strict CSP `script-src 'self'` (no `unsafe-inline`, no `eval`).
- **No `innerHTML`** — all dynamic content is built with `createElement` + `textContent`, so menu/cart/form data can never inject markup (XSS).
- **`localStorage` cart is validated** on read — tampered or malformed data is dropped, not trusted.
- **Demo payment only** — card number / expiry / CVC are held in memory for the checkout view, **never written to storage and never transmitted**. No real payment is processed.
- **Security headers** via `vercel.json` — CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`.
- **Zero third-party JS** — no supply-chain surface. Only Google Fonts (allow-listed in CSP).

## Customising

Replace the placeholders before going to production:

- Address, phone, socials, map — in `contact.html` and the home/footer.
- Menu items and prices — in `assets/js/menu-data.js`.
- Swap images in `assets/img/` (keep the same filenames, or update the `img` fields).

Photos are from [Unsplash](https://unsplash.com) (free to use).
