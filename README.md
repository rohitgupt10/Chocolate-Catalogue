# New Chocolate House — Static Catalogue

A plain HTML, CSS and JavaScript retail catalogue, with a separate protected wholesale price service. The public catalogue needs no build command. Wholesale access needs the deployed service described below.

## Preview locally

Double-click `index.html`, or open the folder in VS Code and use a simple local web server such as Live Server.

## Update products and prices

Open `products.js`. Each product has editable fields for its name, brand, category, price, weight, type, origin, description and image.

Put product photos in `assets/products/`, then set the product's image value like this:

```js
image: "assets/products/dairy-milk.jpg",
```

Set `active: false` to hide an item. Copy an existing product block and give it a new unique `id` to add a product.

## WhatsApp orders and product links

In-stock products have an **Add to cart** button on their card and in their details popup. The popup also has an **Order on WhatsApp** link, addressed to **+977 9769805573**. It prepares a message with the product name, available size, listed price, image link and product link; wholesale messages also include the minimum quantity. The cart prepares one WhatsApp message with all selected products, quantities and an estimated total. The customer reviews the message and taps Send in WhatsApp. The number must have an active WhatsApp account. To change it, edit `whatsappNumber` in `app.js`, using the country code and number with digits only. The shop's general telephone contact is separate and remains unchanged.

Product links use `?pricing=retail#product-ID` or `?pricing=wholesale#product-ID`. Wholesale links require the business-details form before showing wholesale prices. Cancelling shows the retail version. A shared link or a saved pricing preference cannot bypass the form. Keep product IDs stable so shared links continue to work. Links automatically use the current domain and hosting path.

Retail and wholesale carts are saved separately in browser storage. Wholesale products default to a minimum of 10 units unless configured otherwise. Set `wholesaleWeight` for a different wholesale pack size and `wholesaleMinQuantity` for a different minimum; a wholesale size of `1 kg` defaults to a minimum of one. The first add uses the minimum quantity; subsequent adds increase the quantity by one. Set `inStock: false` to disable ordering for a product.

Use an HTTP preview or your published site when checking shared links. Opening `index.html` directly from disk produces a local file link that customers cannot access.

## Wholesale access and confidential prices

Clicking Wholesale asks for a shop name, a nine-digit Nepal PAN/VAT number (English or Devanagari digits) and confirmation that the customer represents the shop. The form checks required fields and number format, then unlocks immediately. This is self-declared access: there is no IRD verification, ownership check, ThirdFactor account, or paid PAN-checking integration. Someone can submit made-up details. The business name is included in wholesale WhatsApp order messages.

`products.js` contains retail prices only. `wholesale-access.js` retrieves wholesale prices after submission from the separate service at `https://nch-wholesale-access.savoryhawk512.chatgpt.site`. The service validates the form, issues a signed eight-hour access grant and requires that grant on subsequent price requests. A same-tab session can restore access after reload. The browser keeps only the access grant and expiry in session storage, not PANs or a saved price list. Lock wholesale prices clears access and returns to retail. A service error keeps prices locked; the form offers a WhatsApp fallback.

The original wholesale price backup is in the ignored local `.private/wholesale-prices.json`. Never add this file or wholesale price values to the public repository. The separately versioned service checkout is in ignored `wholesale-service/`; its README describes publishing. For future wholesale price changes, update the private backup and the service's secret `WHOLESALE_PRICES_JSON`, then deploy a saved service version to apply the new environment revision. Keep `ACCESS_SIGNING_KEY` in runtime secrets. Rotating it invalidates existing grants. Retail prices, sizes, photos and stock status remain editable in `products.js`.

The service does not retain a database of shop submissions or PAN numbers. Price responses prohibit caching; unlocked prices stay in page memory. Current public source no longer includes wholesale prices, but previously published versions remain in public Git history and may exist in caches. This change cannot retract those earlier disclosures. Do not rewrite repository history as part of routine publication.

## Light and dark appearance

The sun/moon button in the header switches between light and dark mode. The first visit follows the device preference; a manual choice is saved in browser storage. If storage is blocked, the switch still works for the current visit. `theme.js` applies the theme before the page paints and requires no server or dependencies.

## Shopping views and shop details

Product cards show available pack sizes in retail and wholesale mode; missing sizes are marked “Pack size: ask us”. Wholesale cards and details show the minimum order calculation. The floating cart displays the current subtotal; delivery is extra and unpriced products remain explicitly marked for a price enquiry.

On phones, customers can switch between Cards and Compact list. This preference is saved locally and does not change the desktop grid. Collection filters work together with search, category and sorting. Shop picks use existing `featured` products; add confirmed product IDs to `bestSellerIds` in `store-info.js` to label them Best sellers. `newArrivalIds` controls the New arrivals collection; update it as products are added. Highlights exclude out-of-stock products; the catalogue keeps their stock status visible.

Edit opening hours, delivery areas, delivery charges and payment methods in `store-info.js`. Current confirmed details: 8 AM–8 PM, delivery across Nepal mainly to cities, Rs. 180–200 per kg, and Fonepay, Nepal Pay or cash. Customers confirm address availability and the final delivery charge on WhatsApp. Delivery is not automatically added to cart totals because shipping weight and the exact charge need confirmation. No payment is collected on the website. Include `store-info.js` when publishing.

## Mobile zoom

Touch-first phones and tablets keep a fixed page scale. `mobile-zoom.js` applies the mobile viewport setting and prevents pinch gestures; the matching CSS keeps one-finger scrolling and taps available. Desktop and laptop zoom retains its normal behavior. Browser or operating-system accessibility settings may override page-level zoom restrictions.

## Publish as static files

Upload everything in this folder to a repository. A static host should serve `index.html` from the repository root. No build step is required.

Include `wholesale-access.js`, `store-info.js`, `theme.js`, `mobile-zoom.js` and `header-scroll.js` when publishing the site, alongside `index.html`, `styles.css`, `app.js`, `products.js`, and the assets folder. Keep the separate wholesale service available. The HTML uses versioned CSS and JavaScript references to request updated assets. If Cloudflare still serves older HTML after deployment, purge the cached HTML and reload. Never upload `.private`, `.codex-tmp`, or `wholesale-service` as static catalogue files.

This project has no payment processing, customer registration database or administrator login. Customers choose to send WhatsApp orders themselves. The static catalogue can be moved to another host; update the wholesale service's allowed origins before changing domains.
