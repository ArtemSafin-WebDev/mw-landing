import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export default function mobileCallback() {
  const mobileCallback =
    document.querySelector<HTMLLinkElement>(".mobile-callback");

  const callbackTrigger = document.querySelector<HTMLLinkElement>(
    ".intro__btn, .service-intro__cta-link"
  );
  if (!mobileCallback || !callbackTrigger) return;
  let mm = gsap.matchMedia();
  mm.add("(max-width: 640px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: callbackTrigger,
        start: "bottom top",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(mobileCallback, {
      autoAlpha: 0,
      duration: 0.3,
    });
  });
}
