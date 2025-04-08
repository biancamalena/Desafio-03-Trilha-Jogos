function openForm(formId) {
  const formToShow = document.getElementById(formId);
  const helpBox = document.querySelector(".box__ajuda");

  if (formToShow) {
    formToShow.style.display = "block";
  }

  if (helpBox) {
    helpBox.style.display = "none";
  }
}

function goBack() {
  const helpBox = document.querySelector(".box__ajuda");
  const helpForm = document.getElementById("help-form");
  const feedbackForm = document.getElementById("feedback-form");

  if (helpBox) {
    helpBox.style.display = "block";
  }

  if (helpForm) {
    helpForm.style.display = "none";
  }

  if (feedbackForm) {
    feedbackForm.style.display = "none";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const boxAjuda = document.querySelector(".box__ajuda");
  if (boxAjuda) {
    boxAjuda.style.display = "block";
  }
});