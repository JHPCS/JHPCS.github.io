document.addEventListener("DOMContentLoaded", function () {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach(function (question) {
    question.addEventListener("click", function () {
      const answer = this.nextElementSibling;

      if (answer.style.display === "block") {
        answer.style.display = "none";
      } else {
        answer.style.display = "block";
      }
    });
  });
});

const menuIcon = document.querySelector(".menu-icon");
  const menuLinks = document.querySelector(".menu-links");

  menuIcon.addEventListener("click", () => {
      menuLinks.classList.toggle("show-menu");
  });
;
function toggleMenu() {
  const menuLinks = document.querySelector(".menu-links");
  menuLinks.classList.toggle("open"); // Toggle the "open" class
}
