# New Chocolate House — Static Catalogue

A plain HTML, CSS and JavaScript catalogue. It does not need Node.js, a database or a build command.

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

Product links use `?pricing=retail#product-ID` or `?pricing=wholesale#product-ID` (for example, `https://your-domain/?pricing=wholesale#product-2`) and open the matching details popup with the linked pricing mode. Switching between Retail and Wholesale updates the page URL, so copying the address preserves the selected mode. An explicit mode in a link takes priority over the recipient's saved preference. Older links without a pricing parameter still work and use the saved preference, or retail by default. Keep product IDs stable so shared links continue to work. Links automatically use the current domain and hosting path, including GitHub Pages project subdirectories. No server routes, API keys or database are needed.

Retail and wholesale carts are saved separately in browser storage. Wholesale products default to a minimum of 10 units unless configured otherwise. Set `wholesaleWeight` for a different wholesale pack size and `wholesaleMinQuantity` for a different minimum; a wholesale size of `1 kg` defaults to a minimum of one. The first add uses the minimum quantity; subsequent adds increase the quantity by one. Set `inStock: false` to disable ordering for a product.

Use an HTTP preview or your published site when checking shared links. Opening `index.html` directly from disk produces a local file link that customers cannot access.

## Light and dark appearance

The sun/moon button in the header switches between light and dark mode. The first visit follows the device preference; a manual choice is saved in browser storage. If storage is blocked, the switch still works for the current visit. `theme.js` applies the theme before the page paints and requires no server or dependencies.

## Publish as static files

Upload everything in this folder to a repository. A static host should serve `index.html` from the repository root. No build step is required.

Include `theme.js` when publishing the site, alongside `index.html`, `styles.css`, `app.js`, `products.js`, and the assets folder. The HTML uses versioned CSS and JavaScript references to request the updated assets. If Cloudflare still serves an older HTML page after deployment, purge the site's cached HTML and reload.

This project intentionally has no checkout, customer-data collection, payment processing, database or administrator login. Before choosing GitHub Pages for a business catalogue, review GitHub's current Pages usage limits and terms. The same files can be published on another static host without changes.
