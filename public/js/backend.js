document.addEventListener("DOMContentLoaded", () => {
  const likes = Array.from(
    document.querySelectorAll(".stories__modal-slider-card-like")
  );

  likes.forEach((like) =>
    like.addEventListener("click", (event) => {
      event.preventDefault();
      like.classList.toggle("active");
    })
  );
  const soundBtns = Array.from(
    document.querySelectorAll(".stories__modal-slider-card-sound")
  );

  soundBtns.forEach((soundBtn) =>
    soundBtn.addEventListener("click", (event) => {
      event.preventDefault();
      soundBtn.classList.toggle("active");
      const parentCard = soundBtn.closest(".stories__modal-slider-card");
      if (!parentCard) return;
      // const videos = Array.from(parentCard.querySelectorAll("video"));
      // videos.forEach((video) => {
      //   video.muted = !video.muted;
      // });
    })
  );
});
