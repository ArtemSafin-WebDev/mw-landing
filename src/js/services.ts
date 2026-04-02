import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function services() {
  const elements = Array.from(document.querySelectorAll(".services"));

  elements.forEach((element) => {
    const accordions = Array.from(element.querySelectorAll(".services__services-accordion"));
    accordions.forEach((accordion) => {
      const video = accordion.querySelector<HTMLVideoElement>("video");
      const btn = accordion.querySelector<HTMLButtonElement>(".services__services-accordion-btn");
      const dropdown = accordion.querySelector<HTMLDivElement>(
        ".services__services-accordion-dropdown"
      );

      dropdown?.addEventListener("transitionend", () => {
        ScrollTrigger.refresh();
      });
      btn?.addEventListener("click", (event) => {
        event.preventDefault();
        const isActive = accordion.classList.contains("active");
        if (isActive) {
          accordion.classList.remove("active");
          accordion.classList.remove("video-shown");
          if (!video) return;
          video.pause();
          video.currentTime = 0;
        } else {
          accordion.classList.add("active");
          if (!video || !video.paused) return;
          video.currentTime = 0;
          video.play();
        }
      });

      accordion.addEventListener("mouseenter", () => {
        accordion.classList.add("video-shown");
        if (!video) return;
        video.currentTime = 0;
        video.play();
      });
      accordion.addEventListener("mouseleave", () => {
        accordion.classList.remove("video-shown");
        if (!video) return;
        if (!accordion.classList.contains("active")) {
          video.pause();
          video.currentTime = 0;
        }
      });
    });
  });
}
