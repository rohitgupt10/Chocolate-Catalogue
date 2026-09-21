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

## Publish as static files

Upload everything in this folder to a repository. A static host should serve `index.html` from the repository root. No build step is required.

This project intentionally has no checkout, customer-data collection, payment processing, database or administrator login. Before choosing GitHub Pages for a business catalogue, review GitHub's current Pages usage limits and terms. The same files can be published on another static host without changes.
