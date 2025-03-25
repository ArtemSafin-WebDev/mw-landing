import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export default function headingAnimation() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-heading-animation")
  );
  elements.forEach((element) => {
    gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element.closest("section"),
          start: "top bottom-=30%",
          markers: false,
          scrub: false,
        },
      });

      tl.from("span", {
        yPercent: 100,
        duration: 0.6,
        ease: "power2.out",
      });
    }, element);
  });
}
