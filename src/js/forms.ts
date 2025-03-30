import Validator from "./classes/Validator";
import axios from "axios";

export default function forms() {
  const forms = Array.from<HTMLFormElement>(
    document.querySelectorAll(".js-form")
  );
  forms.forEach((form) => {
    const formValidator = new Validator(form);
    const controller = new AbortController();
    const submitBtn = form.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    );
    const handleFormSubmit = (event: SubmitEvent) => {
      event.preventDefault();
      if (!formValidator || !form) return;
      formValidator.validate();

      if (formValidator.valid) {
        const formData = new FormData(form);
        if (submitBtn) submitBtn.disabled = true;
        axios
          .post(form.action, formData, {
            signal: controller.signal,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.status !== "mail_sent")
              throw new Error("Form has not been sent");
            if (!document.startViewTransition) {
              form.classList.add("form-sent");
            } else {
              document.startViewTransition(() =>
                form.classList.add("form-sent")
              );
            }
            form.reset();
            // setTimeout(() => {
            //   if (!document.startViewTransition) {
            //     form.classList.remove("form-sent");
            //   } else {
            //     document.startViewTransition(() =>
            //       form.classList.remove("form-sent")
            //     );
            //   }
            // }, 4000);
          })
          .catch((err) => {
            console.error(err);
            window.alert("Не удалось отправить форму");
          })
          .finally(() => {
            if (submitBtn) submitBtn.disabled = false;
          });
      }
    };
    form.addEventListener("submit", handleFormSubmit);
  });
}
