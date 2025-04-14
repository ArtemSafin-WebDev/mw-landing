console.log("Hi");

document.addEventListener("DOMContentLoaded", function () {
  console.log("Backend js");
  // Images lazyloading
  const images = Array.from(document.querySelectorAll("img[loading='lazy']"));

  images.forEach((image) => {
    image.classList.add("lazyload");
    function loaded() {
      image.classList.add("loaded");
    }
    if (image.complete) {
      loaded();
    } else {
      image.addEventListener("load", loaded);
    }
  });
  const soundBtns = Array.from(
    document.querySelectorAll(".stories__modal-slider-card-sound")
  );

  console.log("Sound btns", soundBtns);

  const toggleSound = () => {
    const cards = Array.from(
      document.querySelectorAll(".stories__modal-slider-card")
    );
    console.log("Traversing all cards", cards);
    cards.forEach((card) => {
      const videos = Array.from(card.querySelectorAll("video"));
      videos.forEach((video) => {
        video.muted = !video.muted;
      });
      const soundBtns = Array.from(
        card.querySelectorAll(".stories__modal-slider-card-sound")
      );
      soundBtns.forEach((soundBtn) => {
        soundBtn.classList.toggle("active");
      });
    });
  };

  soundBtns.forEach((soundBtn) =>
    soundBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      console.log("Sound button clicked");
      toggleSound();
    })
  );
});
