# Golden Rates

Build a beautiful, premium, professional gold jewellery rate website based on the attached reference image.



IMPORTANT:

The attached image is a DESIGN/CONTENT REFERENCE. Do not simply recreate it as a static image. Build a fully functional responsive website where the rate information can be manually edited.



WEBSITE PURPOSE:

This website is for a jewellery shop to publish its daily gold and silver rates. The shop owner should be able to manually change the date and the rates, while the purity categories remain fixed.



DESIGN:

Create a highly premium, elegant and unique jewellery-themed design inspired by luxury gold brands.



Do NOT make it look like a generic admin dashboard or a basic Bootstrap website.



Use:

- Elegant gold/champagne-gold visual accents

- Premium ivory/cream/white background

- Subtle luxury patterns and ornamental details

- Sophisticated typography

- Beautiful spacing and alignment

- Subtle animations and transitions

- Premium jewellery-store aesthetic

- Clean modern UI while retaining the traditional elegance of the reference

- Responsive design for mobile, tablet and desktop



The final result should look like a professionally designed jewellery company's official rate-card website.



MAIN RATE CARD:



Create a prominent rate-card section similar in purpose to the attached image.



Header:

[SHOP LOGO / MONOGRAM]

[SHOP NAME]

JEWELRY STORE



The shop name, logo, address and contact information should be easy to configure.



Use placeholders initially:

SHOP NAME: SM GOLD

SUBTITLE: JEWELRY STORE



ADDRESS:

ADD: D.NO 13/448 MAIN ROAD

CHINNA BAZAR

NEAR KAKARLAVARI STREET

NELLORE, A.P.



CONTACT:

+91 9440111113

+91 8759999932



DATE:

The date must NOT be hardcoded.



Create a date input/control so the shop owner can manually select or enter the date.



The selected date should automatically appear on the public rate card in a beautiful formatted style.



Example:

DATE: 10 AUGUST 2026



RATE TABLE:



The purity categories are FIXED and must not be editable from the rate-editing interface.



Fixed rows:



22K 91.6

18K 75.0

9K 37.5

SILVER 1 GR



Only the RATE value should be manually editable.



Initial example values:



22K 91.6 → ₹14,348 / gram

18K 75.0 → ₹11,739 / gram

9K 37.5 → ₹6,706 / gram

SILVER 1 GR → ₹244.00



IMPORTANT:

These are only initial/default values.



The shop owner must be able to change the rate manually whenever required.



ADMIN / EDITING FUNCTIONALITY:



Create a simple, secure-looking "Update Rates" / "Manage Rates" section.



The owner should be able to:

1. Change the date

2. Change the rate for 22K 91.6

3. Change the rate for 18K 75.0

4. Change the rate for 9K 37.5

5. Change the Silver rate

6. Save/update the information



The purity names MUST remain fixed.



After clicking Save/Update:

- The rate card should immediately reflect the new values.

- The selected date should update.

- Data should persist after refreshing the page if possible.

- Add a clear success message such as "Rates updated successfully."



PUBLIC RATE CARD:



The main public-facing page should show ONLY the polished rate card and shop information.



It should look excellent when:

- Viewed on a phone

- Viewed on a desktop

- Shared as a link

- Opened from WhatsApp



Make the rate card visually balanced and easy to read.



Add a premium "Today's Gold Rate" heading.



The rates should be displayed prominently with the ₹ symbol and "per gram".



FOOTER:



Include:

"All rates are inclusive of GST"



Then show:

WhatsApp icon

Phone/contact information

Shop address



Make phone numbers clickable on mobile and make the WhatsApp contact clickable.



IMPORTANT DESIGN REQUIREMENT:



Do NOT copy the exact visual design of the reference image.



Use the reference image to understand:

- Information hierarchy

- Rate table structure

- Jewellery branding

- Date placement

- Shop details

- Overall purpose



But create a NEW, UNIQUE, premium website design.



Think of the design as:

"Luxury Indian jewellery brand + modern digital gold rate card."



Add subtle gold ornamental elements, elegant borders, premium typography and tasteful animations.



Do not overdo animations or make it flashy.



TECHNICAL REQUIREMENTS:



- Fully responsive

- Mobile-first

- Fast loading

- Clean component structure

- Accessible text contrast

- Proper ₹ currency formatting

- Form validation for rates

- Prevent invalid/negative rates

- Date validation

- Smooth transitions

- Professional error and success states



If a backend/database is available in the project, use it so the manually entered rates and date persist reliably.



If authentication is required for editing, create a simple admin login so only the shop owner can modify the rates.



The public page should not expose the editing controls.



Also create a clean URL/page structure such as:



/                 → Public Gold Rate page

/admin             → Rate management page



The final website should feel like a REAL professional jewellery business website, not an AI-generated template.



MOST IMPORTANT:

Prioritize visual quality, premium aesthetics, usability and uniqueness.



Use the attached image as the reference for the information and layout, but redesign it into a significantly more beautiful and modern web experience.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://goldrategoswamyjewellers.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d57e523a-9d29-4009-a8c6-856c74a88fd7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
