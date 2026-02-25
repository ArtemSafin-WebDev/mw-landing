const DRAG_THRESHOLD_PX = 8;
const DEFAULT_SPEED_PX_PER_SECOND = 40;

type PointerState = {
  id: number;
  startX: number;
  startY: number;
  startOffset: number;
  dragging: boolean;
};

function normalizeOffset(value: number, length: number) {
  if (length <= 0) return 0;
  const result = value % length;
  return result < 0 ? result + length : result;
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

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let loopWidth = 0;
  let offset = 0;
  let isInViewport = true;
  let lastTimestamp = 0;
  let pointerState: PointerState | null = null;
  let frameId = 0;
  let resizeFrameId = 0;
  let intersectionObserver: IntersectionObserver | null = null;
  let resizeObserver: ResizeObserver | null = null;

  const requestRebuild = () => {
    if (resizeFrameId) {
      window.cancelAnimationFrame(resizeFrameId);
    }
    resizeFrameId = window.requestAnimationFrame(() => {
      rebuildTrack();
    });
  };

  const applyTransform = () => {
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  };

  const clearClones = () => {
    track
      .querySelectorAll<HTMLElement>("[data-service-clients-clone='true']")
      .forEach((clone) => clone.remove());
  };

  const rebuildTrack = () => {
    const progress =
      loopWidth > 0 ? normalizeOffset(offset, loopWidth) / loopWidth : 0;

    clearClones();
    track.style.transform = "translate3d(0, 0, 0)";

    const baseWidth = track.scrollWidth;
    if (baseWidth <= 0) {
      loopWidth = 0;
      offset = 0;
      return;
    }

    loopWidth = baseWidth;
    const minTrackWidth = Math.max(baseWidth * 2, baseWidth + root.clientWidth);
    let guard = 0;

    while (track.scrollWidth < minTrackWidth && guard < 1000) {
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

  const onPointerEnd = (event: PointerEvent) => {
    if (!pointerState || pointerState.id !== event.pointerId) return;

    if (pointerState.dragging && root.hasPointerCapture(event.pointerId)) {
      root.releasePointerCapture(event.pointerId);
    }

    pointerState = null;
    root.classList.remove("is-dragging");
    lastTimestamp = 0;
  };

  const tick = (timestamp: number) => {
    const canAnimate =
      loopWidth > 0 &&
      !prefersReducedMotion.matches &&
      isInViewport &&
      pointerState === null;

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

    pointerState = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offset,
      dragging: false
    };
    lastTimestamp = 0;
  });

  root.addEventListener("pointermove", (event) => {
    if (!pointerState || pointerState.id !== event.pointerId) return;
    if (loopWidth <= 0) return;

    const deltaX = event.clientX - pointerState.startX;
    const deltaY = event.clientY - pointerState.startY;

    if (!pointerState.dragging) {
      if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) return;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        pointerState = null;
        return;
      }

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

  if ("IntersectionObserver" in window) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        isInViewport = entries.some((entry) => entry.isIntersecting);
        lastTimestamp = 0;
      },
      {
        threshold: 0
      }
    );
    intersectionObserver.observe(root);
  }

  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(() => {
      requestRebuild();
    });
    resizeObserver.observe(root);
  }
  window.addEventListener("resize", requestRebuild);

  rebuildTrack();
  frameId = window.requestAnimationFrame(tick);

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
  const marquees = Array.from(
    document.querySelectorAll<HTMLElement>("[data-service-clients]")
  );

  marquees.forEach((marquee) => {
    initMarquee(marquee);
  });
}
