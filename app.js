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

  let selectedCategory = "All";

  const hasPrice = (price) => price !== null && price !== undefined && price !== "" && Number.isFinite(Number(price));
  const formatPrice = (price) => hasPrice(price) ? `Rs. ${Number(price).toLocaleString("en-IN")}` : "Ask for price";
  const initials = (name) => name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();

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
      const view = document.createElement("span");
      view.className = "view-label";
      view.textContent = "View details";
      bottom.append(price, view);
      info.append(name, bottom);
      button.append(info);
      button.addEventListener("click", () => openProduct(product));
      card.append(button);
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
    eyebrow.textContent = `${product.brand} · ${product.origin}`;
    const title = document.createElement("h2");
    title.textContent = product.name;
    const description = document.createElement("p");
    description.className = "description";
    description.textContent = product.description;
    const price = document.createElement("p");
    price.className = "dialog-price";
    price.textContent = formatPrice(product.price);
    const details = document.createElement("dl");
    details.className = "details-list";
    details.append(
      detailItem("Weight / size", product.weight),
      detailItem("Type", product.type),
      detailItem("Category", product.category),
      detailItem("Origin", product.origin)
    );
    copy.append(eyebrow, title, description, price, details);
    layout.append(copy);
    dialogContent.append(layout);
    dialog.showModal();
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

  document.querySelector("#current-year").textContent = new Date().getFullYear();
  renderCategories();
  renderProducts();
})();
