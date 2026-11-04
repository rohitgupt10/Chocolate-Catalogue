# New product photos

The owner supplied these HEIC originals. The catalogue uses separate transparent WebP assets; the originals are retained unchanged. Retail and wholesale prices for listings 62–73 were supplied by the owner and entered in products.js. Listings 71 and 73 use the same prices as 70 and 72 respectively, as instructed. Sizes below were read from the original packaging, not generated images. Other sizes and product origins remain blank rather than guessed.

| ID | Product | Original photo | Visible weight | Asset stem |
| --- | --- | --- | --- | --- |
| 62 | BRU Gold Edition Coffee | IMG_5709.HEIC | Not confirmed | bru-gold-coffee |
| 63 | Weikfield Unsweetened Cocoa Powder | IMG_5710.HEIC | Not confirmed | weikfield-cocoa-powder |
| 64 | Queen Orange Jelly Candy | IMG_5707.HEIC | 200 g | queen-orange-jelly-candy |
| 65 | Nescafe Classic Coffee | IMG_5708.HEIC | Not confirmed | nescafe-classic-coffee |
| 66 | Dole Lavello Chocolate Assortment | IMG_5662.HEIC | 400 g | dole-lavello-chocolates |
| 67 | Uttam Soan Papdi | IMG_5661.HEIC | Not confirmed | uttam-soan-papdi |
| 68 | Weikfield Vanilla Custard Powder | IMG_5665.HEIC | Not confirmed | weikfield-vanilla-custard-powder |
| 69 | MacCoffee Original Soluble Coffee | IMG_5663.HEIC | 50 g | maccoffee-original-50g |
| 70 | Hershey's Strawberry Syrup | IMG_5664.HEIC | Not confirmed | hersheys-strawberry-syrup |
| 71 | Hershey's Chocolate Syrup | IMG_5664.HEIC | Not confirmed | hersheys-chocolate-syrup |
| 72 | Milk Classic Cheese Flavor Rice Crackers | IMG_5666.HEIC | 112 g | milk-classic-cheese-rice-crackers |
| 73 | Milk Classic Milk Flavor Rice Crackers | IMG_5666.HEIC | 112 g | milk-classic-milk-rice-crackers |

IMG_5667.HEIC is an alternate photo of the same two Milk Classic flavours, so it does not create duplicate listings. IMG_5665.HEIC shows two boxes of the same custard powder; the listing and image represent one box. The syrup and rice cracker flavours have individual listings and individual cutouts.

The Lavello original photo shows EXP 07.04.2026. Listing 66 remains marked out of stock, retained as instructed by the owner. Set `inStock: true` after confirmation of fresh stock.

## Image processing

Tool: built-in imagegen, edit mode with transparent background enabled. HEIC originals were decoded into JPEG previews for tool compatibility. Generated images are compressed as WebP with their alpha channel preserved. Final catalogue assets are stored in `assets/products/`, using the asset stem above followed by `-transparent.webp`.

Shared prompt template:

> Edit target: provided product photograph. Produce a clean e-commerce product cutout of [subject instruction below]. Remove the shop counter and all surroundings completely, on a genuinely transparent background with alpha, no white background and no checkerboard drawn. Preserve original product shape, proportions, colours, printed packaging, logo, text and visible details faithfully; do not redesign packaging or invent any text. Centre product fully visible with small even margins, no cropping, no added objects, no cast shadow. Output a single product asset.

Subject instructions:

- BRU: the BRU Gold Edition glass coffee jar. Rotate 180 degrees so the gold lid is on top and label reads upright.
- Cocoa: the Weikfield unsweetened Cocoa Powder jar. Rotate 180 degrees so the brown lid is on top and label reads upright.
- Queen: the entire Queen Orange Jelly Candy 200g pouch, upright. Preserve the transparent plastic and its printed labels, remove visible counter behind and through the clear plastic.
- Nescafe: the Nescafe Classic coffee jar. Rotate 180 degrees so red lid is on top and label reads upright.
- Lavello: the entire round Dole Lavello 400g chocolate box, label upright. Preserve exact package and wrappers, labels and stickers.
- Uttam: the Uttam Soan Papdi red packet. Rotate 90 degrees counterclockwise so UTTAM and Soan Papdi labels read upright horizontally.
- Custard: ONLY the left Weikfield Vanilla Custard Powder box. Remove the duplicate box on right. Keep the selected single box upright.
- MacCoffee: the MacCoffee Original 50g pouch upright.
- Strawberry syrup: ONLY the red Hershey's Strawberry Syrup bottle on the left. Remove the other chocolate bottle. Keep selected bottle upright.
- Chocolate syrup: ONLY the brown Hershey's Chocolate Syrup bottle on the right. Remove the other strawberry bottle. Keep selected bottle upright.
- Cheese crackers: ONLY the left Milk Classic Cheese Flavor 112g rice cracker pouch with orange wrappers. Remove the milk flavour pouch on right. Keep selected pouch upright and preserve clear plastic with believable transparency.
- Milk crackers: ONLY the right Milk Classic Milk Flavor 112g rice cracker pouch with pale yellow wrappers. Remove the cheese flavour pouch on left. Keep selected pouch upright and preserve clear plastic with believable transparency.

Syrup refinement prompt:

> Precise background-removal edit of this existing product cutout. Keep the bottle and all packaging pixels and text unchanged. Remove ALL glow, halo, coloured haze and shadow surrounding the bottle. Every pixel outside the actual physical bottle silhouette must have alpha 0, including the areas immediately next to the bottle edge. Bottle itself must be opaque. Use only a narrow clean antialiased edge. No background, no shadow, no glow. Centre the complete upright bottle with generous transparent margin, no cropping. Output genuine RGBA transparency.
