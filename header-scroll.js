(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  if (!header) return;

  const mobileLayout = window.matchMedia("(max-width: 560px)");
  const movementThreshold = 8;
  const showNearTop = 80;
  let lastScrollY = window.scrollY;
  let scheduled = false;

  function updateHeader() {
    const currentScrollY = Math.max(0, window.scrollY);
    const movement = currentScrollY - lastScrollY;

    if (!mobileLayout.matches || currentScrollY <= showNearTop || document.activeElement && header.contains(document.activeElement)) {
      header.classList.remove("is-hidden");
    } else if (movement > movementThreshold) {
      header.classList.add("is-hidden");
    } else if (movement < -movementThreshold) {
      header.classList.remove("is-hidden");
    }

    lastScrollY = currentScrollY;
    scheduled = false;
  }

  window.addEventListener("scroll", () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateHeader);
  }, { passive: true });

  window.addEventListener("resize", updateHeader, { passive: true });
  header.addEventListener("focusin", () => header.classList.remove("is-hidden"));
})();
