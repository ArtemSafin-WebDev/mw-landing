import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export default class SectionTransition {
  private darkSections: HTMLElement[] = [];
  private lightSections: HTMLElement[] = [];
  private timelines: gsap.core.Timeline[] = [];
  constructor(
    private element: HTMLElement,
    private elementLayer: HTMLElement,
    darkSectionSelector: string = "[data-section='dark']",
    lightSectionSelector: string = "[data-section='light']"
  ) {
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
