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
  const sounds = Array.from(
    document.querySelectorAll(".stories__modal-slider-card-sound")
  );

  sounds.forEach((like) =>
    like.addEventListener("click", (event) => {
      event.preventDefault();
      like.classList.toggle("active");
    })
  );
});
