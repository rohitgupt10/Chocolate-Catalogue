(() => {
  "use strict";

  const products = (window.CATALOG_PRODUCTS || []).filter((product) => product.active !== false);
  const grid = document.querySelector("#product-grid");
  const categoryList = document.querySelector("#category-list");
  const searchInput = document.querySelector("#search-input");
  const sortSelect = document.querySelector("#sort-select");
  const productCount = document.querySelector("#product-count");
  const emptyState = document.querySelector("#empty-state");
  const clearFilters = document.querySelector("#clear-filters");
  const dialog = document.querySelector("#product-dialog");
  const dialogContent = document.querySelector("#dialog-content");
  const dialogClose = document.querySelector("#dialog-close");
  const cartToggle = document.querySelector("#cart-toggle");
  const cartCount = document.querySelector("#cart-count");
  const cartStatus = document.querySelector("#cart-status");
  const cartDialog = document.querySelector("#cart-dialog");
  const cartClose = document.querySelector("#cart-close");
  const cartItems = document.querySelector("#cart-items");
  const cartEmpty = document.querySelector("#cart-empty");
  const cartSummary = document.querySelector("#cart-summary");
  const cartItemTotal = document.querySelector("#cart-item-total");
  const cartPriceTotal = document.querySelector("#cart-price-total");
  const cartWhatsapp = document.querySelector("#cart-whatsapp");
  const cartClear = document.querySelector("#cart-clear");
  const whatsappNumber = "9779769805573";
  const cartStorageKey = "nch-cart-v1";
  const mobileLayout = window.matchMedia("(max-width: 560px)");
  const desktopPlaceholder = searchInput.placeholder;
  const desktopSortLabels = Array.from(sortSelect.options, (option) => option.textContent);
  let cartToastTimer;
  let cartToastHideTimer;

  function updateControlLabels() {
    searchInput.placeholder = mobileLayout.matches ? "Search products" : desktopPlaceholder;
    const mobileSortLabels = ["Featured", "Low price", "High price", "A–Z"];
    Array.from(sortSelect.options).forEach((option, index) => {
      option.textContent = mobileLayout.matches ? mobileSortLabels[index] : desktopSortLabels[index];
    });
  }

  mobileLayout.addEventListener("change", updateControlLabels);
  updateControlLabels();

  let selectedCategory = "All";
  let returnHash = "#catalogue";

  const hasPrice = (price) => price !== null && price !== undefined && price !== "" && Number.isFinite(Number(price));
  const formatPrice = (price) => hasPrice(price) ? `Rs. ${Number(price).toLocaleString("en-IN")}` : "Ask for price";
  const initials = (name) => name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();

  function productImageUrl(product) {
    return product.image ? new URL(product.image, window.location.href).href : "";
  }

  function createOrderLink(product, compact = false) {
    const message = [
      "Hello,",
      "I'd like to order:",
      `Product: ${product.name}`,
      `Price: ${formatPrice(product.price)}`,
    ];
    if (product.weight) message.splice(3, 0, `Size: ${product.weight}`);
    const imageUrl = productImageUrl(product);
    if (imageUrl) message.push(`Image: ${imageUrl}`);
    const link = document.createElement("a");
    link.className = "order-link";
    link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message.join("\n"))}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = compact ? "Order Now" : "Order on WhatsApp";
    link.setAttribute("aria-label", `Order ${product.name} on WhatsApp`);
    return link;
  }

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(cartStorageKey) || "{}");
      return new Map(
        Object.entries(saved)
          .map(([id, quantity]) => [id, Math.min(99, Math.max(1, Number(quantity) || 1))])
          .filter(([id]) => products.some((product) => String(product.id) === id))
      );
    } catch {
      return new Map();
    }
  }

  const cart = loadCart();

  function saveCart() {
    try {
      localStorage.setItem(cartStorageKey, JSON.stringify(Object.fromEntries(cart)));
    } catch {
      // The cart still works for this visit when storage is unavailable.
    }
  }

  function cartEntries() {
    return products
      .filter((product) => cart.has(String(product.id)))
      .map((product) => ({ product, quantity: cart.get(String(product.id)) }));
  }

  function addToCart(product) {
    const id = String(product.id);
    cart.set(id, Math.min(99, (cart.get(id) || 0) + 1));
    saveCart();
    renderCart();
    showCartToast(`${product.name} added · ${cart.get(id)} in cart`);
  }

  function showCartToast(message) {
    clearTimeout(cartToastTimer);
    clearTimeout(cartToastHideTimer);
    cartStatus.textContent = message;
    cartStatus.hidden = false;
    requestAnimationFrame(() => cartStatus.classList.add("is-visible"));
    cartToastTimer = setTimeout(() => {
      cartStatus.classList.remove("is-visible");
      cartToastHideTimer = setTimeout(() => {
        cartStatus.hidden = true;
      }, 220);
    }, 2200);
  }

  function setCartQuantity(product, quantity) {
    const id = String(product.id);
    if (quantity <= 0) cart.delete(id);
    else cart.set(id, Math.min(99, quantity));
    saveCart();
    renderCart();
  }

  function createAddToCartButton(product, compact = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `add-cart-button${compact ? " compact" : ""}`;
    button.textContent = "Add to cart";
    button.setAttribute("aria-label", `Add ${product.name} to cart`);
    button.addEventListener("click", () => addToCart(product));
    return button;
  }

  function createCartThumbnail(product) {
    const frame = document.createElement("div");
    frame.className = "cart-item-image";
    if (product.image) {
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = "";
      image.addEventListener("error", () => {
        frame.textContent = initials(product.name);
      }, { once: true });
      frame.append(image);
    } else {
      frame.textContent = initials(product.name);
    }
    return frame;
  }

  function bulkOrderMessage(entries) {
    const lines = ["Hello,", "I'd like to place a bulk order:"];
    entries.forEach(({ product, quantity }, index) => {
      lines.push("", `${index + 1}. Product: ${product.name}`);
      if (product.weight) lines.push(`Size: ${product.weight}`);
      lines.push(`Quantity: ${quantity}`, `Price: ${formatPrice(product.price)} each`);
      const imageUrl = productImageUrl(product);
      if (imageUrl) lines.push(`Image: ${imageUrl}`);
    });
    const total = entries.reduce((sum, { product, quantity }) => sum + (hasPrice(product.price) ? Number(product.price) * quantity : 0), 0);
    const hasUnknownPrice = entries.some(({ product }) => !hasPrice(product.price));
    lines.push("", `${hasUnknownPrice ? "Known-item total" : "Estimated total"}: ${formatPrice(total)}`);
    if (hasUnknownPrice) lines.push("Plus items marked Ask for price.");
    lines.push("Please confirm availability and final total.");
    return lines.join("\n");
  }

  function renderCart() {
    const entries = cartEntries();
    const itemCount = entries.reduce((sum, item) => sum + item.quantity, 0);
    const total = entries.reduce((sum, { product, quantity }) => sum + (hasPrice(product.price) ? Number(product.price) * quantity : 0), 0);
    const hasUnknownPrice = entries.some(({ product }) => !hasPrice(product.price));

    cartCount.textContent = String(itemCount);
    cartToggle.setAttribute("aria-label", `Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`);
    cartItems.replaceChildren();
    cartItems.hidden = entries.length === 0;
    cartEmpty.hidden = entries.length !== 0;
    cartSummary.hidden = entries.length === 0;

    entries.forEach(({ product, quantity }) => {
      const item = document.createElement("article");
      item.className = "cart-item";
      item.append(createCartThumbnail(product));

      const copy = document.createElement("div");
      copy.className = "cart-item-copy";
      const name = document.createElement("h3");
      name.textContent = product.name;
      const meta = document.createElement("p");
      meta.textContent = [product.weight, `${formatPrice(product.price)} each`].filter(Boolean).join(" · ");

      const actions = document.createElement("div");
      actions.className = "cart-item-actions";
      const quantityControls = document.createElement("div");
      quantityControls.className = "quantity-controls";
      const decrease = document.createElement("button");
      decrease.type = "button";
      decrease.textContent = "−";
      decrease.setAttribute("aria-label", `Decrease quantity of ${product.name}`);
      decrease.addEventListener("click", () => setCartQuantity(product, quantity - 1));
      const quantityText = document.createElement("span");
      quantityText.textContent = String(quantity);
      quantityText.setAttribute("aria-label", `Quantity ${quantity}`);
      const increase = document.createElement("button");
      increase.type = "button";
      increase.textContent = "+";
      increase.setAttribute("aria-label", `Increase quantity of ${product.name}`);
      increase.addEventListener("click", () => setCartQuantity(product, quantity + 1));
      quantityControls.append(decrease, quantityText, increase);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "cart-remove";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", `Remove ${product.name} from cart`);
      remove.addEventListener("click", () => setCartQuantity(product, 0));
      actions.append(quantityControls, remove);
      copy.append(name, meta, actions);
      item.append(copy);
      cartItems.append(item);
    });

    if (entries.length) {
      cartItemTotal.textContent = String(itemCount);
      cartPriceTotal.textContent = `${formatPrice(total)}${hasUnknownPrice ? " + ask-price items" : ""}`;
      cartWhatsapp.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(bulkOrderMessage(entries))}`;
    } else {
      cartWhatsapp.removeAttribute("href");
    }
  }

  function selectProduct(product) {
    if (!window.location.hash.startsWith("#product-")) {
      returnHash = window.location.hash || "#catalogue";
    }
    const hash = `#product-${product.id}`;
    if (window.location.hash === hash) syncProductFromHash();
    else window.location.hash = hash;
  }

  function syncProductFromHash() {
    const product = products.find((item) => window.location.hash === `#product-${item.id}`);
    if (product) openProduct(product);
    else if (dialog.open) dialog.close();
  }

  function createImage(product, showBadge = true) {
    const frame = document.createElement("div");
    frame.className = "product-image";

    if (product.image) {
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = product.name;
      image.loading = "lazy";
      image.addEventListener("error", () => {
        image.remove();
        frame.prepend(createPlaceholder(product));
      }, { once: true });
      frame.append(image);
    } else {
      frame.append(createPlaceholder(product));
    }

    if (showBadge && product.badge) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = product.badge;
      frame.append(badge);
    }
    return frame;
  }

  function createPlaceholder(product) {
    const placeholder = document.createElement("div");
    placeholder.className = "product-placeholder";
    placeholder.style.background = `linear-gradient(145deg, ${product.color || "#875d4a"}, #251512)`;
    placeholder.textContent = initials(product.name);
    return placeholder;
  }

  function filteredProducts() {
    const query = searchInput.value.trim().toLowerCase();
    const visible = products.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const searchable = `${product.name} ${product.brand} ${product.category} ${product.type} ${product.origin}`.toLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });

    return visible.sort((a, b) => {
      if (sortSelect.value === "price-low") {
        if (!hasPrice(a.price)) return 1;
        if (!hasPrice(b.price)) return -1;
        return Number(a.price) - Number(b.price);
      }
      if (sortSelect.value === "price-high") {
        if (!hasPrice(a.price)) return 1;
        if (!hasPrice(b.price)) return -1;
        return Number(b.price) - Number(a.price);
      }
      if (sortSelect.value === "name") return a.name.localeCompare(b.name);
      return Number(Boolean(b.image)) - Number(Boolean(a.image))
        || Number(b.featured) - Number(a.featured)
        || a.id - b.id;
    });
  }

  function renderProducts() {
    const visible = filteredProducts();
    grid.replaceChildren();
    productCount.textContent = `${visible.length} product${visible.length === 1 ? "" : "s"}`;
    emptyState.hidden = visible.length !== 0;

    visible.forEach((product) => {
      const card = document.createElement("article");
      card.className = "product-card";
      const button = document.createElement("button");
      button.className = "product-preview";
      button.type = "button";
      button.setAttribute("aria-label", `View details for ${product.name}`);
      button.append(createImage(product));

      const info = document.createElement("div");
      info.className = "product-info";
      const name = document.createElement("h3");
      name.textContent = product.name;
      const bottom = document.createElement("div");
      bottom.className = "product-bottom";
      const price = document.createElement("span");
      price.className = "price";
      price.textContent = formatPrice(product.price);
      const view = document.createElement("button");
      view.type = "button";
      view.className = "view-label";
      view.textContent = "View details";
      view.setAttribute("aria-label", `Details for ${product.name}`);
      view.addEventListener("click", () => selectProduct(product));
      bottom.append(price, createAddToCartButton(product, true), view);
      info.append(name);
      button.append(info);
      button.addEventListener("click", () => selectProduct(product));
      card.append(button, bottom);
      grid.append(card);
    });
  }

  function renderCategories() {
    const categories = ["All", ...new Set(products.map((product) => product.category))];
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-button";
      button.textContent = category;
      button.setAttribute("aria-pressed", String(category === selectedCategory));
      button.addEventListener("click", () => {
        selectedCategory = category;
        categoryList.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        renderProducts();
      });
      categoryList.append(button);
    });
  }

  function detailItem(label, value) {
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value;
    wrapper.append(term, description);
    return wrapper;
  }

  function openProduct(product) {
    dialogContent.replaceChildren();
    const layout = document.createElement("div");
    layout.className = "dialog-layout";
    layout.append(createImage(product));

    const copy = document.createElement("div");
    copy.className = "dialog-copy";
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = [product.brand, product.origin].filter(Boolean).join(" · ");
    eyebrow.hidden = !eyebrow.textContent;
    const title = document.createElement("h2");
    title.id = "product-dialog-title";
    title.textContent = product.name;
    const description = document.createElement("p");
    description.className = "description";
    description.textContent = product.description;
    const price = document.createElement("p");
    price.className = "dialog-price";
    price.textContent = formatPrice(product.price);
    const details = document.createElement("dl");
    details.className = "details-list";
    [
      ["Weight / size", product.weight],
      ["Type", product.type],
      ["Category", product.category],
      ["Origin", product.origin],
    ].filter(([, value]) => value).forEach(([label, value]) => details.append(detailItem(label, value)));
    const orderNote = document.createElement("p");
    orderNote.className = "order-note";
    orderNote.textContent = "Your message will be ready in WhatsApp. Tap Send to enquire.";
    const actions = document.createElement("div");
    actions.className = "dialog-actions";
    actions.append(createAddToCartButton(product), createOrderLink(product));
    copy.append(eyebrow, title, description, price, details, actions, orderNote);
    layout.append(copy);
    dialogContent.append(layout);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
  }

  searchInput.addEventListener("input", renderProducts);
  sortSelect.addEventListener("change", renderProducts);
  clearFilters.addEventListener("click", () => {
    searchInput.value = "";
    selectedCategory = "All";
    categoryList.replaceChildren();
    renderCategories();
    renderProducts();
    searchInput.focus();
  });
  dialogClose.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (!dialog.open && window.location.hash.startsWith("#product-")) {
      history.replaceState(null, "", returnHash);
    }
  });
  cartToggle.addEventListener("click", () => {
    renderCart();
    if (!cartDialog.open) cartDialog.showModal();
  });
  cartClose.addEventListener("click", () => cartDialog.close());
  cartDialog.addEventListener("click", (event) => {
    if (event.target === cartDialog) cartDialog.close();
  });
  cartClear.addEventListener("click", () => {
    cart.clear();
    saveCart();
    renderCart();
    showCartToast("Cart cleared.");
  });
  window.addEventListener("hashchange", syncProductFromHash);

  document.querySelector("#current-year").textContent = new Date().getFullYear();
  renderCategories();
  renderProducts();
  renderCart();
  syncProductFromHash();
})();
