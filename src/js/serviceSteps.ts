import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function serviceSteps() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>(".service-steps"));
  sections.forEach((section) => {
    const items = Array.from(section.querySelectorAll<HTMLElement>(".service-steps__list-item"));

    const HEADER_HEIGHT = 100;

    items.forEach((item, itemIndex) => {
      ScrollTrigger.create({
        trigger: item,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
        endTrigger: section,

        end: "bottom bottom",
        start: () => {
          const itemsBefore = items.slice(0, itemIndex);
          const totalHeight = itemsBefore.reduce(
            (acc, currentElement) => (acc += currentElement.offsetHeight),
            0
          );
          const headingsHeight = itemsBefore.reduce((acc, currentElement) => {
            const heading = currentElement.querySelector<HTMLElement>(".service-steps__card-title");
            if (!heading) return acc;
            return (acc += heading.offsetHeight);
          }, 0);
          const heightWithoutHeadings = totalHeight - headingsHeight;

          const offset = HEADER_HEIGHT + heightWithoutHeadings;

          return `top top+=${offset}`;
        },
      });
    });
  });
}
