import Swiper from "swiper";
import StoryCardSlider from "./classes/StoryCardSlider";
import { EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

export default function storiesModal() {
  const mql = window.matchMedia("(max-width: 640px)");
  let instance: Swiper | null = null;
  const storiesModal = document.querySelector<HTMLElement>(".stories__modal");
  if (!storiesModal) return;
  const container = storiesModal.querySelector<HTMLElement>(
    ".stories__modal-slider > .swiper"
  );
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>(".stories__slider-card")
  );
  const closeBtn = storiesModal?.querySelector<HTMLButtonElement>(
    ".stories__modal-close"
  );
  if (!container) return;
  const slides = Array.from(
    storiesModal.querySelectorAll<HTMLElement>(
      ".stories__modal-slider > .swiper > .swiper-wrapper > .swiper-slide"
    )
  );
  let cardSliders: StoryCardSlider[] = [];

  function initCardSlider(swiper: Swiper) {
    cardSliders.forEach((slider) => slider.destroy());
    cardSliders = [];
    const slides = Array.from(swiper.slides);

    const currentSlide = slides[swiper.activeIndex];
    const card = currentSlide.querySelector<HTMLElement>(
      ".stories__modal-slider-card"
    );
    if (!card) return;
    const cardSlider = new StoryCardSlider(card);
    cardSliders.push(cardSlider);
  }

  const handleWidthChange = (e: MediaQueryListEvent | MediaQueryList) => {
    if (e.matches) {
      if (instance) instance.destroy();
      let activeIndex = 0;
      instance = new Swiper(container, {
        slidesPerView: 1,
        speed: 600,
        init: false,
        effect: "fade",
        modules: [EffectFade],
        allowTouchMove: false,
        fadeEffect: {
          crossFade: true,
        },
        on: {
          init: (swiper) => {
            initCardSlider(swiper);
            activeIndex = swiper.activeIndex;
          },
          slideChange: (swiper) => {
            if (swiper.activeIndex === activeIndex) return;
            initCardSlider(swiper);
            activeIndex = swiper.activeIndex;
          },
        },
      });
      instance.init();
    } else {
      if (instance) instance.destroy();

      let activeIndex = 0;

      instance = new Swiper(container, {
        slidesPerView: 1,
        speed: 600,
        spaceBetween: 10,
        init: false,
        on: {
          init: (swiper) => {
            initCardSlider(swiper);
            activeIndex = swiper.activeIndex;
          },
          slideChange: (swiper) => {
            if (swiper.activeIndex === activeIndex) return;
            initCardSlider(swiper);
            activeIndex = swiper.activeIndex;
          },
        },
      });

      instance.init();

      slides.forEach((slide, slideIndex) => {
        slide.addEventListener("click", () => {
          if (slideIndex === activeIndex) return;
          instance?.slideTo(slideIndex);
        });
      });
    }
  };

  mql.addEventListener("change", handleWidthChange);

  handleWidthChange(mql);

  closeBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    storiesModal.classList.remove("active");
    document.body.classList.remove("modal-open");
  });

  cards.forEach((card) => {
    const id = card.getAttribute("data-story-id");
    const correspondingCardInModal = document.querySelector(
      `.stories__modal-slider-card[data-story-id="${id}"]`
    );
    if (!correspondingCardInModal) return;
    const slideIndex = slides.findIndex(
      (slide) => slide === correspondingCardInModal.parentElement
    );
    card.addEventListener("click", (_event) => {
      if (instance) {
        instance.slideTo(slideIndex, 0);
        storiesModal.classList.add("active");
        document.body.classList.add("modal-open");
      }

      const activeSlider = cardSliders.find(
        (slider) => slider.card === correspondingCardInModal
      );
      if (activeSlider) {
        activeSlider.restart();
      }
    });
  });

  const texts = Array.from(
    document.querySelectorAll<HTMLElement>(".stories__modal-slider-card-text")
  );
  texts.forEach((text) => {
    text.addEventListener("click", () => {
      text.classList.toggle("shown");
    });
    text.addEventListener("mouseenter", () => {
      text.classList.add("shown");
    });
    text.addEventListener("mouseleave", () => {
      text.classList.remove("shown");
    });
  });
}
