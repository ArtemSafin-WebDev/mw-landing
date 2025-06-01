import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function services() {
  const elements = Array.from(document.querySelectorAll(".services"));

  elements.forEach((element) => {
    const accordions = Array.from(
      element.querySelectorAll(".services__services-accordion")
    );
    accordions.forEach((accordion) => {
      const btn = accordion.querySelector<HTMLButtonElement>(
        ".services__services-accordion-btn"
      );
      const dropdown = accordion.querySelector<HTMLDivElement>(
        ".services__services-accordion-dropdown"
      );

      dropdown?.addEventListener("transitionend", () => {
        ScrollTrigger.refresh();
      });
      btn?.addEventListener("click", (event) => {
        event.preventDefault();
        accordions.forEach((someAccordion) => {
          if (someAccordion === accordion) return;
          someAccordion.classList.remove("active");
        });
        accordion.classList.toggle("active");
      });
    });
  });
}
