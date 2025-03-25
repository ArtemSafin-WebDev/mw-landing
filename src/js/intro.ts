import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export default function intro() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".intro"));

  elements.forEach((element) => {
    let mm = gsap.matchMedia();
    const introBtn = element.querySelector<HTMLLinkElement>(".intro__btn");
    const bgItems = Array.from(
      element.querySelectorAll<HTMLElement>(".intro__bg-item")
    );
    const nameItems = Array.from(
      element.querySelectorAll<HTMLElement>(".intro__project-name-item")
    );

    let activeIndex = 0;
    let prevIndex = 0;

    const length = bgItems.length;
    const cycle = () => {
      if (activeIndex < length - 1) {
        activeIndex += 1;
      } else {
        activeIndex = 0;
      }
      return activeIndex;
    };

    let timer: gsap.core.Tween | null = null;

    const setActive = (index: number) => {
      bgItems.forEach((item) => item.classList.remove("active"));
      nameItems.forEach((item) => item.classList.remove("active"));
      bgItems[index]?.classList.add("active");
      nameItems[index]?.classList.add("active");

      prevIndex = index;

      timer?.kill();
      timer = gsap.delayedCall(1.5, () => {
        setActive(cycle());
      });
    };

    introBtn?.addEventListener("mouseenter", () => {
      setActive(prevIndex);
    });

    introBtn?.addEventListener("mouseleave", () => {
      timer?.kill();
      timer = null;
    });

    mm.add(
      "(min-width: 641px)",
      () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: "top top",
            end: "bottom top",
            markers: false,
            scrub: true,
          },
        });

        tl.addLabel("parallaxStart");
        tl.to(".intro__parallax-layer", {
          yPercent: 50,
          duration: 1,
          ease: "none",
        });
        tl.to(
          ".intro__content",
          {
            scale: 0.95,
            duration: 1,
          },
          "parallaxStart"
        );
      },
      element
    );
  });
}
