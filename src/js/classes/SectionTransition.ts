import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

interface SectionTransitionOptions {
  darkSectionSelector?: string;
  lightSectionSelector?: string;
  initiallyLight?: boolean;
}

export default class SectionTransition {
  private darkSections: HTMLElement[] = [];
  private lightSections: HTMLElement[] = [];
  private timelines: gsap.core.Timeline[] = [];
  private initiallyLight: boolean;

  constructor(
    private element: HTMLElement,
    private elementLayer: HTMLElement,
    options: SectionTransitionOptions = {}
  ) {
    const {
      darkSectionSelector = "[data-section='dark']",
      lightSectionSelector = "[data-section='light']",
      initiallyLight = false,
    } = options;

    this.initiallyLight = initiallyLight;
    this.darkSections = Array.from(
      document.querySelectorAll(darkSectionSelector)
    );
    this.lightSections = Array.from(
      document.querySelectorAll(lightSectionSelector)
    );
  }

  private createDarkSectionsTimelines = () => {
    this.darkSections.forEach((section) => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          scrub: true,
          start: () => {
            let rect = this.element.getBoundingClientRect();
            return `top top+=${rect.height + rect.top}`;
          },
          end: () => {
            let rect = this.element.getBoundingClientRect();
            return `top+=${rect.height} top+=${rect.height + rect.top}`;
          },
        },
      });

      timeline.fromTo(
        this.elementLayer,
        {
          clipPath: "inset(100% 0 0 0)",
          immediateRender: false,
        },
        {
          duration: 1,
          ease: "none",
          clipPath: "inset(0% 0 0 0)",
        }
      );

      this.timelines.push(timeline);
    });
  };

  private createLightSectionsTimelines = () => {
    this.lightSections.forEach((section) => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          scrub: true,
          start: () => {
            let rect = this.element.getBoundingClientRect();
            return `top top+=${rect.height + rect.top}`;
          },
          end: () => {
            let rect = this.element.getBoundingClientRect();
            return `top+=${rect.height} top+=${rect.height + rect.top}`;
          },
        },
      });

      timeline.to(this.elementLayer, {
        duration: 1,
        ease: "none",
        clipPath: "inset(0% 0 100% 0%)",
      });
      this.timelines.push(timeline);
    });
  };

  public init = () => {
    this.createDarkSectionsTimelines();
    this.createLightSectionsTimelines();

    if (this.initiallyLight) {
      gsap.set(this.elementLayer, { clipPath: "inset(0% 0 0 0)" });
    }

    return this;
  };

  public destroy = () => {
    this.timelines.forEach((timeline) => timeline.kill());
    this.timelines = [];
  };

  public update = () => {
    ScrollTrigger.refresh();
  };
}
