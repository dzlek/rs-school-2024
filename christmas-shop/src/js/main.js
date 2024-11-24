console.log("Loaded...");

document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");
  const btnBurger = document.querySelector(".menu-btn-burger");
  const menu = document.querySelector(".menu");
  const navItem = menu.querySelectorAll("a");

  btnBurger.addEventListener("click", () => {
    btnBurger.classList.toggle("active");
    menu.classList.toggle("active");
    body.classList.toggle("no-scroll");
  });

  navItem.forEach((item) => {
    item.addEventListener("click", () => {
      btnBurger.classList.remove("active");
      menu.classList.remove("active");
      body.classList.remove("no-scroll");
    });
  });
});
