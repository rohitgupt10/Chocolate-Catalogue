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

Every product has a compact **Order Now** link between its price and **View details**, plus an **Order on WhatsApp** link in its details popup, addressed to **+977 9769805573**. It prepares a message with the product name, size, listed price and a link to that product; the customer reviews it and taps Send in WhatsApp. The number must have an active WhatsApp account. To change it, edit `whatsappNumber` in `app.js`, using the country code and number with digits only. The shop's general telephone contact is separate and remains unchanged.

Product links use `#product-ID` (for example, `https://your-domain/#product-1`) and open the matching details popup. Keep product IDs stable so shared links continue to work. Links automatically use the current domain and hosting path, including GitHub Pages project subdirectories. No server routes, API keys or database are needed.

Use an HTTP preview or your published site when checking shared links. Opening `index.html` directly from disk produces a local file link that customers cannot access.

## Publish as static files

Upload everything in this folder to a repository. A static host should serve `index.html` from the repository root. No build step is required.

For this update, publish `index.html`, `styles.css`, `app.js`, and this README together. The HTML uses versioned CSS and JavaScript references to request the updated assets. If Cloudflare still serves an older HTML page after deployment, purge the site's cached HTML and reload.

This project intentionally has no checkout, customer-data collection, payment processing, database or administrator login. Before choosing GitHub Pages for a business catalogue, review GitHub's current Pages usage limits and terms. The same files can be published on another static host without changes.
