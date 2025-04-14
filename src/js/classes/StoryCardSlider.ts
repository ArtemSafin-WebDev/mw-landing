import Swiper from "swiper";
import { SwiperOptions } from "swiper/types";
import { EffectFade } from "swiper/modules";
import gsap from "gsap";

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
    loop: false,
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
    this.stopVideos();
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

    document.addEventListener("storymodal:open", this.handeStoryModalOpen);
    document.addEventListener("storymodal:close", this.handleStoryModalClose);
  }

  private handeStoryModalOpen = () => {
    this.sliderOnHold = false;
    if (this.instance) this.runSlider(this.instance);
  };

  private handleStoryModalClose = () => {
    this.sliderOnHold = true;
    this.pauseSliderOnClose();
  };

  private pauseSliderOnClose = () => {
    console.log("Pausing slider on close");
    this.autoplayTween?.kill();
    if (this.instance) this.pauseVideo(this.instance);
  };

  private runSlider = async (swiper: Swiper) => {
    console.log("Running slider");
    if (typeof swiper?.realIndex === "undefined") return;
    this.setPaginationBullets(swiper.realIndex);
    const duration = await this.getCurrentSlideDuration(swiper);
    this.autoplay(swiper.realIndex, duration);
    this.stopVideos();
    this.playVideo(swiper);
  };

  private stopVideos = () => {
    console.log("Stopping all videos");
    this.slides.forEach((slide) => {
      const video = slide?.querySelector<HTMLVideoElement>("video");
      if (!video) return;
      const src = !!video.currentSrc
        ? video.currentSrc
        : video.getAttribute("data-src")!;
      console.log("Stopped video src", src);
      video.pause();
      video.removeAttribute("src");
      video.setAttribute("data-src", src);
      video.preload = "none";
      video.currentTime = 0;
    });
  };

  private playVideo = (swiper: Swiper) => {
    const activeSlide = this.slides[swiper.realIndex];

    const video = activeSlide?.querySelector<HTMLVideoElement>("video");

    if (video) {
      console.log("Playing video", video);
      console.log("Current video src", video.currentSrc, video.src);
      if (!video.currentSrc) {
        console.log("Setting video src", video.getAttribute("data-src")!);
        video.src = video.getAttribute("data-src")!;
      }

      // if (video.readyState >= 4) {
      //   this.autoplayTween?.play();
      // } else {
      //   video.addEventListener(
      //     "canplaythrough",
      //     () => {
      //       this.autoplayTween?.play();
      //     },
      //     { once: true }
      //   );
      // }

      this.autoplayTween?.play();
      video.play();
    }
  };

  private pauseVideo = (swiper: Swiper) => {
    const activeSlide = this.slides[swiper.realIndex];
    const video = activeSlide?.querySelector<HTMLVideoElement>("video");
    console.log("Pausing video", video);
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
      console.log("Card duration", cardDuration);
      return cardDuration;
    }
    console.log("Default duration", this.DURATION);
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
          if (this.instance?.isEnd)
            document.dispatchEvent(new CustomEvent("storyslider:end"));
        },
      }
    );
  };

  private pause = () => {
    if (this.pauseTimer) clearTimeout(this.pauseTimer);
    this.pauseTimer = setTimeout(() => {
      console.log("Pausing on hold");
      this.longPress = true;
      this.autoplayTween?.pause();
      if (this.instance) this.pauseVideo(this.instance);
    }, 300);
  };

  private play = () => {
    console.log("Resuming after pause");
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
      console.log("Clicked on the right side");
      if (this.instance?.isEnd)
        document.dispatchEvent(new CustomEvent("storyslider:end"));
      if (slidesCount && slidesCount > 1) {
        this.instance?.slideNext();
      } else {
        if (this.instance) this.runSlider(this.instance);
      }
    } else {
      console.log("Clicked on the left side");
      if (this.instance?.isBeginning)
        document.dispatchEvent(new CustomEvent("storyslider:start"));
      if (slidesCount && slidesCount > 1) {
        this.instance?.slidePrev();
      } else {
        if (this.instance) this.runSlider(this.instance);
      }
    }
  };

  public restart = () => {
    console.log("Restarting slider");
    this.instance?.slideToLoop(0);
  };

  public destroy = () => {
    console.log("Destroying slider");
    this.instance?.destroy(true);
    this.stopVideos();
    this.card.classList.remove("slider-initialized");
    this.container?.removeEventListener("pointerdown", this.pause);
    this.container?.removeEventListener("pointerup", this.play);
    this.container?.removeEventListener("click", this.handleSideClick);
    document.removeEventListener("storymodal:open", this.handeStoryModalOpen);
    document.removeEventListener(
      "storymodal:close",
      this.handleStoryModalClose
    );
    this.autoplayTween?.kill();
    this.bullets.forEach((bullet) => {
      bullet.classList.remove("active");
    });
    this.videoAbortController?.abort();
    this.videoAbortController = null;
  };
}
