import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function serviceSteps() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>(".service-steps"));
  sections.forEach((section) => {
    const items = Array.from(section.querySelectorAll<HTMLElement>(".service-steps__list-item"));
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top+=100",
        // end: "+=200%",
        end: () => {
          const offset =
            items.reduce((acc, currentElement) => {
              return (acc += currentElement.offsetHeight);
            }, 0) + 100;

          return `top+=${offset} top+=100`;
        },
        pin: true,
        pinSpacing: true,
        markers: true,
        invalidateOnRefresh: true,
        scrub: true,
      },
    });

    function calculateOffset(cardIndex: number) {
      const itemsBefore = items.slice(0, cardIndex);
      console.log("ITEMS BEFORE", cardIndex, itemsBefore);

      const totalHeight = itemsBefore.reduce(
        (acc, currentElement) => (acc += currentElement.offsetHeight),
        0
      );

      const headingsHeight = itemsBefore.reduce((acc, currentElement) => {
        const heading = currentElement.querySelector<HTMLElement>(".service-steps__card-title");
        if (!heading) return acc;
        return (acc += heading.offsetHeight);
      }, 0);

      console.log("ITEMS BEFORE HEIGHT", totalHeight);

      return totalHeight - headingsHeight;
    }

    items.forEach((item, itemIndex) => {
      tl.to(item, {
        y: () => {
          const offset = calculateOffset(itemIndex);
          console.log("Offset", offset);
          return -1 * offset;
        },
        ease: "none",
      });
    });
  });
}
