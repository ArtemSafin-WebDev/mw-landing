import Swiper from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { StoriesSelectEvent } from "./types";

export default function storiesBlockSlider() {
  const elements = [
    ...document.querySelectorAll<HTMLElement>(".stories__slider"),
  ];

  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");
    if (!container) return;
    const instance = new Swiper(container, {
      slidesPerView: "auto",
      speed: 600,
      longSwipesRatio: 0.2,
      modules: [Navigation],
      navigation: {
        prevEl: element.querySelector<HTMLButtonElement>(
          ".stories__slider-arrow--prev"
        ),
        nextEl: element.querySelector<HTMLButtonElement>(
          ".stories__slider-arrow--next"
        ),
      },
    });
    const slides = Array.from(instance.slides);
    slides.forEach((slide) => {
      slide.addEventListener("click", (event) => {
        event.preventDefault();
        const id = slide
          .querySelector(".stories__slider-card")
          ?.getAttribute("data-story-id")!;
        const selectEvent: StoriesSelectEvent = new CustomEvent(
          "stories:select",
          {
            bubbles: true,
            detail: {
              index: id,
            },
          }
        );
        element.dispatchEvent(selectEvent);
      });
    });
  });
}
