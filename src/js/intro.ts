import gsap from "gsap";

export default function intro() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".intro"));

  elements.forEach((element) => {
    const introBtn = element.querySelector<HTMLLinkElement>(".intro__btn");
    const bgItems = Array.from(
      element.querySelectorAll<HTMLElement>(".intro__bg-item")
    );
    const nameItems = Array.from(
      element.querySelectorAll<HTMLElement>(".intro__project-name-item")
    );

    let activeIndex = 0;

    const length = bgItems.length;
    const cycle = () => {
      if (activeIndex < length - 1) {
        activeIndex += 1;
      } else {
        activeIndex = 0;
      }
      return activeIndex;
    };

    let timer: gsap.core.Tween | null = null;

    const setActive = (index: number) => {
      bgItems.forEach((item) => item.classList.remove("active"));
      nameItems.forEach((item) => item.classList.remove("active"));
      bgItems[index]?.classList.add("active");
      nameItems[index]?.classList.add("active");

      timer?.kill();
      timer = gsap.delayedCall(1.5, () => {
        setActive(cycle());
      });
    };

    introBtn?.addEventListener("mouseenter", () => {
      setActive(cycle());
    });

    introBtn?.addEventListener("mouseleave", () => {
      timer?.kill();
      timer = null;
    });
  });
}
