# SM GOLD — Daily Gold & Silver Rate Card

A premium, responsive rate-card website for a jewellery shop. Public page shows today's rates; a separate admin page lets the owner edit the date and rates. Rates are stored in the browser (per your choice), so the owner's saved values persist on their device across refreshes.

## Design direction

Emerald & Gold — deep emerald (#064e3b) as the rich base for the rate card, champagne gold (#c9a84c) accents and hairline ornamental borders, warm ivory (#f5f0e0) page background. Serif display type for the shop name and headings (Cormorant), clean sans for numbers and body text. Subtle touches only: fine gold rule ornaments, soft inner glow on the card, gentle fade-and-rise on load, restrained hover states. No flashy motion.

## Pages

**`/` — Public rate card**
- Monogram mark + "SM GOLD" + "JEWELRY STORE" subtitle
- "Today's Gold Rate" heading with formatted date, e.g. `10 AUGUST 2026`
- Rate table with fixed rows (labels not editable anywhere):
  - 22K 91.6 — ₹14,348 per gram
  - 18K 75.0 — ₹11,739 per gram
  - 9K 37.5 — ₹6,706 per gram
  - SILVER 1 GR — ₹244.00
- 22K is visually emphasised as the headline rate
- Two actions: **Share on WhatsApp** (opens WhatsApp with a formatted rate message) and **Download rate card as image** (saves the card as a PNG for WhatsApp status)
- Shop address and both phone numbers, tappable as `tel:` links
- Footer: "All rates are inclusive of GST", WhatsApp link, phone numbers, address
- No admin controls or admin link visible on the public page

**`/admin` — Manage rates**
- Date picker + four rate fields (22K, 18K, 9K, Silver); purity labels are fixed text
- Validation: required, numeric, positive, sane upper bound, valid date; inline error messages
- Save shows "Rates updated successfully." and the public card reflects new values immediately
- "Reset to defaults" option
- Live preview of the card beside the form on desktop

## Technical notes

- TanStack Start routes: `src/routes/index.tsx` (public) and `src/routes/admin.tsx`
- Shared state in a small `useRates` hook reading/writing `localStorage` with a versioned key, seeded with the default values; safe hydration (no SSR mismatch)
- `Intl.NumberFormat('en-IN')` for ₹ formatting; date formatted to uppercase `DD MONTH YYYY`
- Zod-backed form validation
- PNG export via `html-to-image` on the rate-card node
- Design tokens (emerald/gold/ivory, radii, shadows, fonts) added to `src/styles.css`; fonts loaded via `<link>` in `__root.tsx`
- Per-route SEO metadata; `/admin` marked `noindex`

## Notes

- Browser-storage persistence means edits live only on the device where they were saved — visitors on other phones see the defaults. Say the word and I'll move it to Lovable Cloud with an owner login so one update publishes to everyone.
- No image was attached to your message; the layout follows the structure described in your brief. Attach the reference and I'll align details.
