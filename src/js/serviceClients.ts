const DRAG_THRESHOLD_PX = 8;
const DEFAULT_SPEED_PX_PER_SECOND = 100;

// Active pointer data while the user is dragging the marquee.
type PointerState = {
  id: number;
  startX: number;
  startY: number;
  startOffset: number;
  dragging: boolean;
};

// Keep offset in [0, loopLength) so wrapping is mathematically seamless.
function normalizeOffset(value: number, length: number) {
  if (length <= 0) return 0;
  const result = value % length;
  return result < 0 ? result + length : result;
}

// Read the current flex gap from computed styles.
function getTrackGap(track: HTMLElement) {
  const styles = window.getComputedStyle(track);
  const rawGap = styles.columnGap || styles.gap || "0";
  const parsedGap = Number.parseFloat(rawGap);
  return Number.isFinite(parsedGap) ? parsedGap : 0;
}

// Compute one logical cycle width (original set only), including gap continuity.
function getBaseLoopWidth(cards: HTMLElement[], track: HTMLElement) {
  const cardsWidth = cards.reduce((sum, card) => sum + card.getBoundingClientRect().width, 0);
  // Include the inter-set gap (between the last card of the current set
  // and the first card of the next cloned set) for a seamless loop.
  const gapWidth = getTrackGap(track) * Math.max(0, cards.length);
  return cardsWidth + gapWidth;
}

function initMarquee(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>(".service-clients__cards");
  if (!track) return;

  const originalCards = Array.from(
    track.querySelectorAll<HTMLElement>(".service-clients__card")
  ).filter((card) => !card.hasAttribute("data-service-clients-clone"));
  if (!originalCards.length) return;

  const speedFromAttribute = Number.parseFloat(root.dataset.speed ?? "");
  const speedPxPerSecond =
    Number.isFinite(speedFromAttribute) && speedFromAttribute > 0
      ? speedFromAttribute
      : DEFAULT_SPEED_PX_PER_SECOND;
  const speedPxPerMs = speedPxPerSecond / 1000;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Width of one cycle before cloning, current offset inside the cycle,
  // and lightweight runtime state for animation/observers.
  let loopWidth = 0;
  let offset = 0;
  let isInViewport = true;
  let lastTimestamp = 0;
  let pointerState: PointerState | null = null;
  let frameId = 0;
  let resizeFrameId = 0;
  let intersectionObserver: IntersectionObserver | null = null;
  let resizeObserver: ResizeObserver | null = null;

  // Debounced rebuild for resize/layout changes (1 recalculation per frame).
  const requestRebuild = () => {
    if (resizeFrameId) {
      window.cancelAnimationFrame(resizeFrameId);
    }
    resizeFrameId = window.requestAnimationFrame(() => {
      rebuildTrack();
    });
  };

  // Render current offset to GPU-friendly transform.
  const applyTransform = () => {
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  };

  // Remove previously generated clones before rebuilding.
  const clearClones = () => {
    track
      .querySelectorAll<HTMLElement>("[data-service-clients-clone='true']")
      .forEach((clone) => clone.remove());
  };

  // Build an infinitely scrolling track:
  // 1) measure one "base" cycle,
  // 2) append clones until content is long enough,
  // 3) preserve previous progress ratio to avoid jumps after rebuild.
  const rebuildTrack = () => {
    const progress = loopWidth > 0 ? normalizeOffset(offset, loopWidth) / loopWidth : 0;

    clearClones();
    track.style.transform = "translate3d(0, 0, 0)";

    const baseWidth = getBaseLoopWidth(originalCards, track);
    if (baseWidth <= 0) {
      loopWidth = 0;
      offset = 0;
      return;
    }

    loopWidth = baseWidth;
    const rootWidth = root.getBoundingClientRect().width;
    const minTrackWidth = Math.max(baseWidth * 2, baseWidth + rootWidth);
    let guard = 0;

    while (track.getBoundingClientRect().width < minTrackWidth && guard < 1000) {
      originalCards.forEach((card) => {
        const clone = card.cloneNode(true) as HTMLElement;
        clone.setAttribute("data-service-clients-clone", "true");
        clone.setAttribute("aria-hidden", "true");
        track.append(clone);
      });
      guard += 1;
    }

    offset = normalizeOffset(progress * loopWidth, loopWidth);
    applyTransform();
  };

  // Unified drag end handler for pointerup/cancel/lostcapture.
  const onPointerEnd = (event: PointerEvent) => {
    if (!pointerState || pointerState.id !== event.pointerId) return;

    if (pointerState.dragging && root.hasPointerCapture(event.pointerId)) {
      root.releasePointerCapture(event.pointerId);
    }

    pointerState = null;
    root.classList.remove("is-dragging");
    lastTimestamp = 0;
  };

  // Main animation loop:
  // move with constant px/s speed and wrap by loop width.
  const tick = (timestamp: number) => {
    const canAnimate =
      loopWidth > 0 && !prefersReducedMotion.matches && isInViewport && pointerState === null;

    if (canAnimate) {
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }
      const delta = Math.min(timestamp - lastTimestamp, 48);
      offset = normalizeOffset(offset + delta * speedPxPerMs, loopWidth);
      applyTransform();
    }

    lastTimestamp = timestamp;
    frameId = window.requestAnimationFrame(tick);
  };

  root.addEventListener("pointerdown", (event) => {
    if (pointerState) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (loopWidth <= 0) return;

    // Remember drag start so pointermove can convert deltaX into new offset.
    pointerState = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offset,
      dragging: false,
    };
    lastTimestamp = 0;
  });

  root.addEventListener("pointermove", (event) => {
    if (!pointerState || pointerState.id !== event.pointerId) return;
    if (loopWidth <= 0) return;

    const deltaX = event.clientX - pointerState.startX;
    const deltaY = event.clientY - pointerState.startY;

    if (!pointerState.dragging) {
      // Ignore tiny moves and keep vertical page scrolling unaffected.
      if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) return;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        pointerState = null;
        return;
      }

      // Drag starts only for horizontal intent.
      pointerState.dragging = true;
      root.classList.add("is-dragging");
      root.setPointerCapture(event.pointerId);
    }

    offset = normalizeOffset(pointerState.startOffset - deltaX, loopWidth);
    applyTransform();

    if (event.cancelable) {
      event.preventDefault();
    }
  });

  root.addEventListener("pointerup", onPointerEnd);
  root.addEventListener("pointercancel", onPointerEnd);
  root.addEventListener("lostpointercapture", onPointerEnd);

  // Pause work when section is offscreen.
  if ("IntersectionObserver" in window) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        isInViewport = entries.some((entry) => entry.isIntersecting);
        lastTimestamp = 0;
      },
      {
        threshold: 0,
      }
    );
    intersectionObserver.observe(root);
  }

  // Rebuild when root/track geometry can change.
  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(() => {
      requestRebuild();
    });
    resizeObserver.observe(root);
  }
  window.addEventListener("resize", requestRebuild);

  // Initial layout + animation start.
  rebuildTrack();
  frameId = window.requestAnimationFrame(tick);

  // Cleanup runtime resources.
  window.addEventListener("unload", () => {
    window.cancelAnimationFrame(frameId);
    if (resizeFrameId) {
      window.cancelAnimationFrame(resizeFrameId);
    }
    if (intersectionObserver) {
      intersectionObserver.disconnect();
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    window.removeEventListener("resize", requestRebuild);
  });
}

export default function serviceClients() {
  const marquees = Array.from(document.querySelectorAll<HTMLElement>("[data-service-clients]"));

  marquees.forEach((marquee) => {
    initMarquee(marquee);
  });
}
