import gsap from "gsap";
import { Flip } from "gsap/all";

gsap.registerPlugin(Flip);

export default function loader() {
  const loader = document.querySelector<HTMLElement>(".loader");
  if (!loader) return;

  const mark = loader.querySelector<HTMLElement>(".loader__mark")!;
  const weber = loader.querySelector<HTMLElement>(".loader__weber")!;
  const studio = loader.querySelector<HTMLElement>(".loader__studio")!;
  const m = document.querySelector<HTMLElement>(".intro__m")!;
  const w = document.querySelector<HTMLElement>(".intro__w")!;
  const s = document.querySelector<HTMLElement>(".intro__s")!;
  const years = document.querySelector<HTMLElement>(".loader__years");

  const getXDistance = (element: HTMLElement, target: HTMLElement): number => {
    const elementRect = element.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const distance = targetRect.left - elementRect.left;
    return distance;
  };

  const loaderAnimation = () => {
    const tl = gsap.timeline();

    tl.to(
      years,
      {
        autoAlpha: 0,
        duration: 1,
      },
      0
    );

    tl.to(
      weber,
      {
        x: () => getXDistance(weber, w),
        duration: 1,
        ease: "power2.inOut",
      },
      0
    );
    tl.to(
      studio,
      {
        x: () => getXDistance(studio, s),
        duration: 1,
        ease: "power2.inOut",
      },
      0
    );
    tl.to(
      mark,
      {
        x: () => getXDistance(mark, m),
        duration: 1,
        ease: "power2.inOut",
      },
      0
    ).addLabel("afterMove");

    tl.to(
      ".loader__word span",
      {
        clipPath: "inset(0 100% 0 0)",
        duration: 0.5,
      },
      "afterMove"
    );

    tl.to(".loader", {
      autoAlpha: 0,
      duration: 0.6,
    }).add(() => {
      loader.remove();
    });

    tl.from(
      ".intro__text-content",
      {
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      ">-=0.3"
    );
  };

  setTimeout(() => {
    loaderAnimation();
  }, 1000);
}
