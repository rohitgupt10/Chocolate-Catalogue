(() => {
  "use strict";

  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return;

  // Detect touch-first devices without changing desktop or laptop zoom.
  const mobileTouch = window.matchMedia("(hover: none) and (pointer: coarse)");
  const desktopViewport = viewport.content;

  function updateZoomMode() {
    const locked = mobileTouch.matches;
    document.documentElement.dataset.mobileZoomLocked = String(locked);
    viewport.content = locked
      ? `${desktopViewport}, minimum-scale=1, maximum-scale=1, user-scalable=no`
      : desktopViewport;
  }

  function preventPinch(event) {
    if (!mobileTouch.matches || !event.cancelable) return;
    if (event.type.startsWith("gesture") || event.touches.length > 1) {
      event.preventDefault();
    }
  }

  // Preserve one-finger scrolling and taps, including in the cart and dialogs.
  document.addEventListener("touchstart", preventPinch, { passive: false });
  document.addEventListener("touchmove", preventPinch, { passive: false });
  document.addEventListener("gesturestart", preventPinch, { passive: false });
  document.addEventListener("gesturechange", preventPinch, { passive: false });
  mobileTouch.addEventListener("change", updateZoomMode);
  updateZoomMode();
})();
