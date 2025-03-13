import Swiper from "swiper";
import { SwiperOptions } from "swiper/types";
import { EffectFade } from "swiper/modules";
import gsap from "gsap";
import { getVideoDuration } from "../utils";

import "swiper/css";
import "swiper/css/effect-fade";

export default class StoryCardSlider {
  private container: HTMLElement | null = null;
  private instance: Swiper | null = null;
  private bullets: HTMLElement[] = [];
  private slides: HTMLElement[] = [];
  private readonly DURATION = 8;
  private autoplayTween: gsap.core.Tween | null = null;
  private pauseTimer: any = null;
  private longPress = false;
  private sliderOnHold = true;
  private videoAbortController: AbortController | null = null;

  private options: SwiperOptions = {
    speed: 400,
    effect: "fade",
    fadeEffect: {
      crossFade: false,
    },
    loop: true,
    nested: false,
    longSwipesRatio: 0.2,
    modules: [EffectFade],
    allowTouchMove: false,
  };
  constructor(public card: HTMLElement) {
    if (this.card.closest(".stories__modal")?.classList.contains("active"))
      this.sliderOnHold = false;
    this.container = card.querySelector(".swiper");
    this.bullets = Array.from(
      card.querySelectorAll(".stories__modal-slider-card-progress-bullet")
    );
    this.slides = Array.from(card.querySelectorAll(".swiper-slide"));
    this.card.classList.add("slider-initialized");
    if (this.container) {
      this.instance = new Swiper(this.container, {
        ...this.options,
        ...{
          init: false,
          on: {
            init: (swiper) => {
              if (this.sliderOnHold) return;
              this.runSlider(swiper);
            },
            slideChange: (swiper) => {
              if (
                swiper.previousIndex === swiper.activeIndex ||
                this.sliderOnHold
              )
                return;
              this.runSlider(swiper);
            },
          },
        },
      });

      this.instance.init();
    }

    this.card?.addEventListener("pointerdown", this.pause);
    this.card?.addEventListener("pointerup", this.play);
    this.container?.addEventListener("click", this.handleSideClick);

    document.addEventListener("storymodal:open", () => {
      this.sliderOnHold = false;
      if (this.instance) this.runSlider(this.instance);
    });
    document.addEventListener("storymodal:close", () => {
      this.sliderOnHold = true;
      this.pauseSliderOnClose();
    });
  }

  private pauseSliderOnClose = () => {
    this.autoplayTween?.kill();
    if (this.instance) this.pauseVideo(this.instance);
  };

  private runSlider = async (swiper: Swiper) => {
    if (typeof swiper?.realIndex === "undefined") return;
    this.setPaginationBullets(swiper.realIndex);
    const duration = await this.getCurrentSlideDuration(swiper);
    this.autoplay(swiper.realIndex, duration);
    this.stopVideos();
    this.playVideo(swiper);
  };

  private stopVideos = () => {
    this.slides.forEach((slide) => {
      const video = slide?.querySelector<HTMLVideoElement>("video");
      if (!video) return;
      video?.pause();
      video.currentTime = 0;
    });
  };

  private playVideo = (swiper: Swiper) => {
    const activeSlide = this.slides[swiper.realIndex];

    const video = activeSlide?.querySelector<HTMLVideoElement>("video");

    if (this.videoAbortController) {
      this.videoAbortController.abort();
      this.videoAbortController = null;
    }

    this.videoAbortController = new AbortController();
    const signal = this.videoAbortController.signal;

    if (video) {
      this.autoplayTween?.pause();

      if (video.readyState >= 4) {
        this.autoplayTween?.play();
      } else {
        video.addEventListener(
          "canplaythrough",
          () => {
            this.autoplayTween?.play();
          },
          { once: true }
        );
      }

      video.addEventListener(
        "paused",
        () => {
          console.log("Video paused");
          this.autoplayTween?.pause();
        },
        {
          signal,
        }
      );
      video.addEventListener(
        "waiting",
        () => {
          console.log("Video waiting");
          this.autoplayTween?.pause();
        },
        {
          signal,
        }
      );
      video.addEventListener(
        "playing",
        () => {
          console.log("Video playing");
          this.autoplayTween?.play();
        },
        {
          signal,
        }
      );

      video.play();
    }
  };

  private pauseVideo = (swiper: Swiper) => {
    const activeSlide = this.slides[swiper.realIndex];
    const video = activeSlide?.querySelector<HTMLVideoElement>("video");
    video?.pause();
  };

  private getCurrentSlideDuration = async (swiper: Swiper) => {
    const index = swiper.realIndex;
    const slides = this.slides;
    const nextSlide = slides[index];

    const card = nextSlide.querySelector<HTMLElement>(
      ".stories__modal-slider-card-media-card"
    );

    if (card?.hasAttribute("data-stories-duration")) {
      const cardDuration = Number(card.getAttribute("data-stories-duration"));
      return cardDuration;
    }

    const video = nextSlide.querySelector<HTMLVideoElement>("video");
    if (video) {
      try {
        const videoDuration = await getVideoDuration(video);
        console.log("Video duration", videoDuration);
        return videoDuration.seconds;
      } catch (err) {
        console.error(err);
        return this.DURATION;
      }
    }

    return this.DURATION;
  };

  private setPaginationBullets = (index: number) => {
    this.bullets.forEach((bullet) => bullet.classList.remove("active"));
    this.bullets[index]?.classList.add("active");
  };

  private autoplay = (index: number, duration: number = this.DURATION) => {
    if (this.autoplayTween) this.autoplayTween.kill();
    this.autoplayTween = gsap.fromTo(
      this.bullets[index],
      { "--progress": 0 },
      {
        "--progress": 1,
        duration,
        ease: "linear",
        onComplete: () => {
          this.instance?.slideNext();
        },
      }
    );
  };

  private pause = () => {
    if (this.pauseTimer) clearTimeout(this.pauseTimer);
    this.pauseTimer = setTimeout(() => {
      this.longPress = true;
      this.autoplayTween?.pause();
      if (this.instance) this.pauseVideo(this.instance);
    }, 300);
  };

  private play = () => {
    if (this.pauseTimer) clearTimeout(this.pauseTimer);
    if (this.autoplayTween?.paused) this.autoplayTween?.play();
    if (this.instance) this.playVideo(this.instance);
  };

  private handleSideClick = (event: MouseEvent) => {
    if (!this.container) return;
    if (this.longPress) {
      this.longPress = false;
      return;
    }

    const rect = this.container.getBoundingClientRect();
    const x = event.pageX - rect.left;
    const slidesCount = this.instance?.slides?.length;
    if (x > rect.width / 2) {
      if (slidesCount && slidesCount > 1) {
        this.instance?.slideNext();
      } else {
        if (this.instance) this.runSlider(this.instance);
      }
    } else {
      if (slidesCount && slidesCount > 1) {
        this.instance?.slidePrev();
      } else {
        if (this.instance) this.runSlider(this.instance);
      }
    }
  };

  public restart = () => {
    this.instance?.slideToLoop(0);
  };

  public destroy = () => {
    this.instance?.destroy(true);
    this.stopVideos();
    this.card.classList.remove("slider-initialized");
    this.container?.removeEventListener("pointerdown", this.pause);
    this.container?.removeEventListener("pointerup", this.play);
    this.container?.removeEventListener("click", this.handleSideClick);
    this.autoplayTween?.kill();
    this.bullets.forEach((bullet) => {
      bullet.classList.remove("active");
    });
  };
}
