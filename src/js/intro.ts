import gsap from "gsap";

export default function intro() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".intro"));

  elements.forEach((element) => {
    const bgItems = Array.from(
      element.querySelectorAll<HTMLElement>(".intro__bg-item")
    );
    const nameItems = Array.from(
      element.querySelectorAll<HTMLElement>(".intro__project-name-item")
    );

    const cycle = (length: number) => {
      let activeIndex = 0;

      return () => {
        if (activeIndex < length - 1) {
          activeIndex += 1;
        } else {
          activeIndex = 0;
        }
        return activeIndex;
      };
    };

    const getIndex = cycle(bgItems.length);

    const setActive = (index: number) => {
      bgItems.forEach((item) => item.classList.remove("active"));
      nameItems.forEach((item) => item.classList.remove("active"));
      bgItems[index]?.classList.add("active");
      nameItems[index]?.classList.add("active");

      gsap.delayedCall(1, () => {
        setActive(getIndex());
      });
    };

    setActive(getIndex());
  });
}
