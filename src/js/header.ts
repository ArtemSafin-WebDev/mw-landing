import { debounce } from "lodash";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/all";
import SectionTransition from "./classes/SectionTransition";

gsap.registerPlugin(ScrollTrigger);

export default function header() {
  const header = document.querySelector<HTMLElement>(".page-header");

  if (!header) return;

  const checkHeader = () => {
    if (window.scrollY > window.innerHeight / 2) {
      header.classList.add("page-header--fixed");
    } else {
      header.classList.remove("page-header--fixed");
    }
  };

  checkHeader();
  window.addEventListener("scroll", () => {
    checkHeader();
  });

  window.addEventListener("resize", debounce(checkHeader, 300));

  const logo = document.querySelector<HTMLElement>(".page-header__logo")!;
  const secondImage = document.querySelector<HTMLElement>(
    ".page-header__logo-image:nth-child(2)"
  )!;
  const studio = document.querySelector<HTMLElement>(".page-header__studio")!;
  const secondText = document.querySelector<HTMLElement>(
    ".page-header__studio span:nth-child(2)"
  )!;

  const navLinks = Array.from(
    document.querySelectorAll<HTMLElement>(".page-header__nav-link")
  );

  const burger = document.querySelector<HTMLElement>(".page-header__burger")!;
  const burgerItem = document.querySelector<HTMLElement>(
    ".page-header__burger .page-header__burger-inner:nth-child(2)"
  )!;

  new SectionTransition(logo, secondImage).init();
  new SectionTransition(studio, secondText).init();
  new SectionTransition(burger, burgerItem).init();

  let mm = gsap.matchMedia();
  mm.add("(min-width: 641px)", () => {
    const instances = navLinks.map((link) => {
      const span = link.querySelector<HTMLSpanElement>("span:nth-child(2)")!;
      return new SectionTransition(link, span).init();
    });

    return () => {
      instances.forEach((instance) => instance.destroy());
    };
  });
}
