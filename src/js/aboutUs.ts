import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export default function aboutUs() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".about-us")
  );
  elements.forEach((element) => {
    gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-us__card",
          scrub: 1,
          start: "top bottom",
          end: "bottom top",
        },
      });

      tl.to(".about-us__card-bg", {
        yPercent: -12,
        duration: 1,
        ease: "none",
      });
    }, element);
  });
}
