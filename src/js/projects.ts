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
        autoAlpha: 0,
        duration: 1,
      });
    });

    const filtersBtn = element.querySelector<HTMLButtonElement>(
      ".projects__categories-btn"
    );
    filtersBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      filtersBtn.nextElementSibling?.classList.toggle("active");
    });

    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (
        target.matches(".projects__categories") ||
        target.closest(".projects__categories")
      )
        return;
      filtersBtn?.nextElementSibling?.classList.remove("active");
    });
  });
}
