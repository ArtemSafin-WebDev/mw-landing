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
  loader();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
