import "virtual:svg-icons-register";
import "../scss/style.scss";
import storiesBlockSlider from "./storiesBlockSlider";
import menu from "./menu";
import loader from "./loader";
import storiesModal from "./storiesModal";
import aboutUs from "./aboutUs";
import projects from "./projects";
import intro from "./intro";
import smoothScrolling from "./smoothScrolling";
import header from "./header";
import headingAnimation from "./headingAnimation";
import forms from "./forms";
import mobileCallback from "./mobileCallback";
import fancybox from "./fancybox";
import services from "./services";

document.addEventListener("DOMContentLoaded", () => {
  smoothScrolling();
  header();
  storiesBlockSlider();
  menu();
  storiesModal();
  aboutUs();
  projects();
  intro();
  headingAnimation();
  forms();
  mobileCallback();
  fancybox();
  services();
  loader();
  // Prevent default behavior for buttons inside swiper slides
  document.querySelectorAll(".swiper-slide button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
