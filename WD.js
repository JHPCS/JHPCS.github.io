document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
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
  menuLinks.classList.toggle("open"); 
}
