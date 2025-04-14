import Swiper from "swiper";
import StoryCardSlider from "./classes/StoryCardSlider";
import { EffectFade } from "swiper/modules";
import "swiper/css";

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
  const closeBtns = Array.from(
    storiesModal.querySelectorAll<HTMLElement>(
      ".stories__modal-close, .stories__modal-close-area"
    )
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
  let activeIndex = 0;
  let preventClickNavigation = false;

  const handleWidthChange = (e: MediaQueryListEvent | MediaQueryList) => {
    if (e.matches) {
      if (instance) instance.destroy();
      activeIndex = 0;
      instance = new Swiper(container, {
        slidesPerView: 1,
        speed: 600,
        init: false,
        effect: "fade",
        modules: [EffectFade],
        // effect: "cube",
        cubeEffect: {
          shadow: false,
        },
        longSwipesRatio: 0.2,
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
          destroy: () => {
            cardSliders.forEach((cardSlider) => cardSlider.destroy());
            cardSliders = [];
          },
        },
      });
      instance.init();
    } else {
      if (instance) instance.destroy();

      activeIndex = 0;

      instance = new Swiper(container, {
        slidesPerView: 1,
        speed: 600,
        spaceBetween: 10,
        init: false,
        slideToClickedSlide: true,
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
          destroy: () => {
            cardSliders.forEach((cardSlider) => cardSlider.destroy());
            cardSliders = [];
          },
        },
      });

      instance.init();
    }
  };

  mql.addEventListener("change", handleWidthChange);

  handleWidthChange(mql);

  document.addEventListener("storyslider:end", () => {
    console.log("Storysliderned", instance?.isEnd);
    preventClickNavigation = true;
    const handleTransitionEnd = () => {
      preventClickNavigation = false;
      instance?.off("slideChangeTransitionEnd", handleTransitionEnd);
    };
    instance?.on("slideChangeTransitionEnd", handleTransitionEnd);
    if (instance?.isEnd) {
      instance.slideTo(0);
    } else {
      instance?.slideNext();
    }
  });
  document.addEventListener("storyslider:start", () => {
    console.log("Storysliderstart", instance?.isBeginning);
    preventClickNavigation = true;
    const handleTransitionEnd = () => {
      preventClickNavigation = false;
      instance?.off("slideChangeTransitionEnd", handleTransitionEnd);
    };
    instance?.on("slideChangeTransitionEnd", handleTransitionEnd);
    if (instance?.isBeginning) {
      instance.slideTo(instance.slides.length - 1);
    } else {
      instance?.slidePrev();
    }
  });

  slides.forEach((slide, slideIndex) => {
    slide.addEventListener("click", () => {
      console.log("Equals", slideIndex, instance?.activeIndex);
      if (slideIndex === instance?.activeIndex) return;
      if (preventClickNavigation) return;
      instance?.slideTo(slideIndex);
      console.log("Sliding to", slideIndex);
    });
  });

  closeBtns.forEach((closeBtn) =>
    closeBtn.addEventListener("click", (event) => {
      event.preventDefault();
      storiesModal.classList.remove("active");
      document.body.classList.remove("modal-open");
      document.dispatchEvent(new CustomEvent("storymodal:close"));
    })
  );

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

      document.dispatchEvent(new CustomEvent("storymodal:open"));
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      storiesModal.classList.remove("active");
      document.body.classList.remove("modal-open");
      document.dispatchEvent(new CustomEvent("storymodal:close"));
    }
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
