import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export default function projects() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".projects")
  );

  elements.forEach((element) => {
    const cards = Array.from(
      element.querySelectorAll<HTMLElement>(".projects__card")
    );
    cards.forEach((card) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=30%",
          end: "bottom top",
          markers: false,
          scrub: false,
        },
      });

      tl.from(card, {
        clipPath: "inset(0 100% 0 0)",
        autoAlpha: 0,
        duration: 1,
      });
    });
    gsap.context(() => {}, element);
  });
}
