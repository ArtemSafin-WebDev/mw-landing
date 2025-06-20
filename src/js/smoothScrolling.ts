import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { isTouch } from "./utils";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function smoothScrolling() {
  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }

  let lenis: Lenis | null = null;

  if (!isTouch() || false) {
    lenis = new Lenis({
      smoothWheel: true,
    });

    if (window.sessionStorage.getItem("loaderShown") !== "Y") {
      lenis.on("scroll", ScrollTrigger.update);
      lenis.stop();
    }

    document.addEventListener("loader:hidden", () => {
      lenis?.start();
    });

    gsap.ticker.add((time) => {
      if (lenis) {
        lenis.raf(time * 1000);
      }
    });

    gsap.ticker.lagSmoothing(0);
  }
}
