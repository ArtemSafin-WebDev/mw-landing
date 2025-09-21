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
      if (card.closest(".projects__tab:not(.active)")) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=20%",
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

    if (element.matches(".projects:not(.projects--archive)")) {
      // const currentCategoryBtn = element.querySelector<HTMLLinkElement>(
      //   ".projects__all-link"
      // );
      const tabs = Array.from(
        element.querySelectorAll<HTMLElement>(".projects__tab")
      );
      const links = Array.from(
        element.querySelectorAll<HTMLLinkElement>(".projects__categories-link")
      );
      const btnTextElement = element.querySelector<HTMLElement>(
        ".projects__categories-btn-text"
      );

      const setActiveLink = (link: HTMLLinkElement) => {
        // if (currentCategoryBtn) currentCategoryBtn.href = link.href;
        const linkIndex = links.indexOf(link);
        links.forEach((link) => link.classList.remove("active"));
        link.classList.add("active");
        tabs.forEach((tab) => tab.classList.remove("active"));
        tabs[linkIndex]?.classList.add("active");
        const linkTextElement = link.querySelector(
          ".projects__categories-link-text"
        );
        if (btnTextElement && linkTextElement) {
          btnTextElement.textContent = linkTextElement.textContent;
        }
        ScrollTrigger.refresh();
      };

      links.forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          setActiveLink(link);
        });
      });

      const initiallyActiveLink = links.find((link) =>
        link.classList.contains("active")
      );

      if (initiallyActiveLink) setActiveLink(initiallyActiveLink);
    }
  });
}
