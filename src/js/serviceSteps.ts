const parsePx = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getStepSize = (card: HTMLElement, title: HTMLElement) => {
  const styles = window.getComputedStyle(card);
  const paddingTop = parsePx(styles.paddingTop);
  const rowGap = parsePx(styles.rowGap);
  const titleHeight = title.getBoundingClientRect().height;

  return paddingTop + titleHeight + rowGap;
};

const updateStickyOffsets = (list: HTMLElement) => {
  const items = Array.from(
    list.querySelectorAll<HTMLElement>(".service-steps__list-item")
  );
  if (!items.length) return;

  const stepSizes = items.map((item) => {
    const card = item.querySelector<HTMLElement>(".service-steps__card");
    const title = item.querySelector<HTMLElement>(".service-steps__card-title");
    if (!card || !title) return 0;
    return getStepSize(card, title);
  });

  let accumulatedOffset = stepSizes[0];
  items.forEach((item, index) => {
    if (index > 0) {
      accumulatedOffset += stepSizes[index - 1];
    }
    item.style.setProperty("--sticky-top", `${accumulatedOffset}px`);
  });
};

export default function serviceSteps() {
  const lists = Array.from(
    document.querySelectorAll<HTMLElement>(".service-steps__list")
  );
  if (!lists.length) return;

  const updateAll = () => {
    lists.forEach(updateStickyOffsets);
  };

  let updateRafId = 0;
  const scheduleUpdate = () => {
    if (updateRafId) {
      window.cancelAnimationFrame(updateRafId);
    }
    updateRafId = window.requestAnimationFrame(updateAll);
  };

  const handleResize = () => {
    scheduleUpdate();
  };

  updateAll();
  window.addEventListener("resize", handleResize);
  window.addEventListener("load", updateAll, { once: true });

  if ("fonts" in document) {
    void document.fonts.ready.then(updateAll);
  }

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });

    const observeTargets = new Set<HTMLElement>();

    lists.forEach((list) => {
      const section = list.closest<HTMLElement>(".service-steps");
      const heading = section?.querySelector<HTMLElement>(".service-steps__heading");
      if (heading) {
        observeTargets.add(heading);
      }

      const titleTops = Array.from(
        list.querySelectorAll<HTMLElement>(".service-steps__card-title")
      );
      titleTops.forEach((titleTop) => observeTargets.add(titleTop));
    });

    observeTargets.forEach((target) => resizeObserver.observe(target));
  }
}
