(() => {
  "use strict";
  const api = "https://nch-wholesale-access.savoryhawk512.chatgpt.site";
  const storageKey = "nch-business-access-v1";
  const dialog = document.querySelector("#wholesale-access-dialog");
  const form = document.querySelector("#wholesale-access-form");
  const submit = document.querySelector("#wholesale-access-submit");
  const error = document.querySelector("#wholesale-access-error");
  let prices = new Map();
  let businessName = "";
  let expiresAt = 0;
  let expiryTimer;
  let controller;

  function hasAccess() { return prices.size > 0 && expiresAt > Date.now(); }
  function forget(announce = true) {
    controller?.abort();
    clearTimeout(expiryTimer);
    prices.clear();
    expiresAt = 0;
    businessName = "";
    try { sessionStorage.removeItem(storageKey); } catch { /* Access still clears for this visit. */ }
    if (announce) window.dispatchEvent(new Event("wholesale-access-ended"));
  }
  function accept(data, token) {
    if (!data || typeof token !== "string" || !token || !Number.isFinite(data.expiresAt) || data.expiresAt <= Date.now() || typeof data.shopName !== "string" || !data.prices || Array.isArray(data.prices)) throw new Error("unavailable");
    const entries = Object.entries(data.prices);
    if (!entries.length || entries.some(([id, price]) => !/^\d+$/.test(id) || !(price === null || (typeof price === "number" && Number.isFinite(price) && price >= 0)))) throw new Error("unavailable");
    prices = new Map(entries);
    businessName = data.shopName;
    expiresAt = data.expiresAt;
    clearTimeout(expiryTimer);
    expiryTimer = setTimeout(() => forget(), Math.min(expiresAt - Date.now(), 2147483647));
    try { sessionStorage.setItem(storageKey, JSON.stringify({token, expiresAt})); } catch { /* Access works for this page when storage is blocked. */ }
  }
  async function call(path, options = {}) {
    const response = await fetch(`${api}${path}`, {cache:"no-store", credentials:"omit", referrerPolicy:"no-referrer", ...options});
    if (!response.ok) throw new Error(response.status === 429 ? "rate_limit" : "unavailable");
    return response.json();
  }
  async function restore() {
    let saved;
    try { saved = JSON.parse(sessionStorage.getItem(storageKey) || "null"); } catch { return false; }
    if (!saved?.token || typeof saved.token !== "string" || saved.token.length > 2048 || saved.expiresAt <= Date.now()) { forget(false); return false; }
    try {
      const data = await call("/api/prices", {headers:{Authorization:`Bearer ${saved.token}`}, signal:AbortSignal.timeout(10000)});
      accept(data, saved.token);
      return true;
    } catch { forget(false); return false; }
  }
  function requestAccess() {
    error.hidden = true;
    submit.disabled = false;
    submit.textContent = "View wholesale prices";
    if (!dialog.open) dialog.showModal();
  }
  function details() {
    return {
      shopName:form.elements.shopName.value.trim(),
      pan:form.elements.pan.value.trim().replace(/[०-९]/g, c => String(c.charCodeAt(0) - 0x0966)),
      confirmed:form.elements.confirmed.checked,
    };
  }
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity() || controller) return;
    const body = details();
    error.hidden = true;
    submit.disabled = true;
    submit.textContent = "Opening wholesale prices…";
    controller = new AbortController();
    const active = controller;
    const timeout = setTimeout(() => active.abort(), 15000);
    try {
      const data = await call("/api/access", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body), signal:active.signal});
      if (active.signal.aborted || !dialog.open) return;
      accept(data, data.token);
      controller = null;
      dialog.close();
      window.dispatchEvent(new Event("wholesale-access-granted"));
    } catch (exception) {
      if (!dialog.open || controller !== active) return;
      error.textContent = exception.message === "rate_limit"
        ? "Too many attempts. Please try again later or contact us on WhatsApp."
        : "We couldn’t open wholesale prices right now. Please try again or send your shop details on WhatsApp.";
      error.hidden = false;
    } finally {
      clearTimeout(timeout);
      if (controller === active) {
        controller = null;
        submit.disabled = false;
        submit.textContent = "View wholesale prices";
      }
    }
  });
  document.querySelector("#wholesale-request-whatsapp").addEventListener("click", event => {
    if (!form.reportValidity()) { event.preventDefault(); return; }
    const {shopName, pan} = details();
    const message = `Hello, I’d like wholesale pricing.\nShop name: ${shopName}\nShop PAN/VAT: ${pan}`;
    event.currentTarget.href = `https://wa.me/9779769805573?text=${encodeURIComponent(message)}`;
  });
  document.querySelector("#wholesale-access-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => {
    controller?.abort();
    controller = null;
    form.reset();
    error.hidden = true;
    submit.disabled = false;
    submit.textContent = "View wholesale prices";
    document.querySelector("#wholesale-request-whatsapp").href = "https://wa.me/9779769805573";
    if (!hasAccess()) window.dispatchEvent(new Event("wholesale-access-cancelled"));
  });
  window.NCH_WHOLESALE_ACCESS = {
    hasAccess, restore, request:requestAccess, lock:forget,
    isOpen:() => dialog.open,
    shopName:() => hasAccess() ? businessName : "",
    price:id => hasAccess() ? prices.get(String(id)) : undefined,
  };
})();
