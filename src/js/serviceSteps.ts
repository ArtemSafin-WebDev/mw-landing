import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function serviceSteps() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>(".service-steps"));
  sections.forEach((section) => {
    const items = Array.from(section.querySelectorAll<HTMLElement>(".service-steps__list-item"));

    const HEADER_HEIGHT = 100;
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

      return HEADER_HEIGHT + stackedHeadingsHeight;
    };

    items.forEach((item, itemIndex) => {
      ScrollTrigger.create({
        trigger: item,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
        endTrigger: section,

        end: () => {
          const offset = getStackOffset(itemIndex);
          const currentHeadingHeight = getHeadingHeight(item);
          const extraScrollToReachStart = Math.max(0, window.innerHeight - item.offsetHeight - offset);
          const extraScroll = extraScrollToReachStart + currentHeadingHeight;

          return `bottom+=${extraScroll} bottom`;
        },
        start: () => {
          const offset = getStackOffset(itemIndex);

          return `top top+=${offset}`;
        },
      });
    });
  });
}
