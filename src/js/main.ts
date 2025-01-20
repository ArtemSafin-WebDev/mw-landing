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

document.addEventListener("DOMContentLoaded", () => {
  smoothScrolling();
  storiesBlockSlider();
  menu();
  storiesModal();
  aboutUs();
  projects();
  intro();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  loader();
});
