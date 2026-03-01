import Swiper from "swiper";
import { Navigation } from "swiper/modules";

import "swiper/css";

export default function serviceProjects() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".service-projects"));
  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");
    if (!container) return;
    new Swiper(container, {
      slidesPerView: "auto",
      speed: 600,
      longSwipesRatio: 0.2,
      modules: [Navigation],
      navigation: {
        prevEl: element.querySelector<HTMLButtonElement>(".service-projects__slider-arrow--prev"),
        nextEl: element.querySelector<HTMLButtonElement>(".service-projects__slider-arrow--next"),
      },
    });
  });
}
