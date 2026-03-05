import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function serviceSteps() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>(".service-steps"));
  sections.forEach((section) => {
    const sectionHeading = section.querySelector<HTMLElement>(".service-steps__heading");
    const content = section.querySelector<HTMLElement>(".service-steps__content");
    const list = section.querySelector<HTMLElement>(".service-steps__list");
    const items = Array.from(section.querySelectorAll<HTMLElement>(".service-steps__list-item"));
    if (!list || !items.length) return;

    const getHeaderOffset = () => {
      const HEADER_EXTRA_OFFSET = 30;

      const headerContent = document.querySelector<HTMLElement>(".page-header__content");
      if (headerContent) {
        return Math.max(0, headerContent.getBoundingClientRect().bottom + HEADER_EXTRA_OFFSET);
      }

      const header = document.querySelector<HTMLElement>(".page-header");
      if (header) {
        return Math.max(0, header.getBoundingClientRect().bottom + HEADER_EXTRA_OFFSET);
      }

      return HEADER_EXTRA_OFFSET;
    };
    const isMobile = () => window.matchMedia("(max-width: 640px)").matches;
    const getSectionHeadingOffset = () => {
      if (!sectionHeading || !isMobile()) return 0;

      const contentStyles = content ? window.getComputedStyle(content) : null;
      const rawGap = contentStyles ? contentStyles.rowGap || contentStyles.gap : "0";
      const gapBetweenHeadingAndList = Number.parseFloat(rawGap) || 0;

      return sectionHeading.offsetHeight + gapBetweenHeadingAndList;
    };

    const getHeadingHeight = (element: HTMLElement) => {
      const heading = element.querySelector<HTMLElement>(".service-steps__card-title");
      return heading?.offsetHeight ?? 0;
    };

    const getStackOffset = (itemIndex: number) => {
      const itemsBefore = items.slice(0, itemIndex);
      const stackedHeadingsHeight = itemsBefore.reduce(
        (acc, currentElement) => acc + getHeadingHeight(currentElement),
        0
      );

      return getHeaderOffset() + getSectionHeadingOffset() + stackedHeadingsHeight;
    };
    const getRequiredEndSpacer = () => {
      const lastItemIndex = items.length - 1;
      const lastItem = items[lastItemIndex];
      const lastOffset = getStackOffset(lastItemIndex);

      return Math.max(0, window.innerHeight - lastItem.offsetHeight - lastOffset);
    };
    const applyEndSpacer = () => {
      list.style.paddingBottom = `${getRequiredEndSpacer()}px`;
    };

    applyEndSpacer();

    if (sectionHeading) {
      ScrollTrigger.create({
        trigger: sectionHeading,
        pin: sectionHeading,
        pinSpacing: false,
        invalidateOnRefresh: true,
        endTrigger: section,
        end: "bottom bottom",
        start: () => {
          const offset = getHeaderOffset();
          return `top top+=${offset}`;
        },
      });
    }

    items.forEach((item, itemIndex) => {
      ScrollTrigger.create({
        trigger: item,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
        onRefreshInit: applyEndSpacer,
        endTrigger: section,
        end: "bottom bottom",
        start: () => {
          const offset = getStackOffset(itemIndex);

          return `top top+=${offset}`;
        },
      });
    });
  });
}
