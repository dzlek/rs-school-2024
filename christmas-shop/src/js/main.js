console.log("Loaded...");

document.addEventListener("DOMContentLoaded", () => {
  // Burger switcher
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
  // Tabs switcher
  const tabItems = document.querySelectorAll(".btn-tab");
  const bestGiftCards = document.querySelectorAll(".bestGift-card");

  tabItems.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabItems.forEach((item) => item.classList.remove("active"));

      tab.classList.add("active");

      const tabType = tab.dataset.type;

      bestGiftCards.forEach((card) => {
        const header4Class = card.querySelector(".header4").classList[1];
        if (tabType === "all" || header4Class === tabType) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // New Year Timer
  function getNextNewYearDate() {
    const currentYear = new Date().getFullYear();
    return new Date(`January 1, ${currentYear + 1} 00:00:00`).getTime();
  }

  let newYearDate = getNextNewYearDate();

  function updateTimer() {
    const currentDate = new Date().getTime();
    const timeRemaining = newYearDate - currentDate;

    if (timeRemaining <= 0) {
      newYearDate = getNextNewYearDate();
      return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
  }
  if (document.body.dataset.page === "index") {
    setInterval(updateTimer, 1000);
    updateTimer();
  }
  // Slider items находятся внутри контейнера. Мы будем двигать items внутри контейнера

  const btnLeft = document.querySelector("#btn-left");
  const btnRight = document.querySelector("#btn-right");

  btnLeft.disabled = true;

  window.onload = () => {
    const sliderContainer = document.querySelector(".slider-container");
    const sliderContainerWidth = sliderContainer.scrollWidth; // общая длинна всех Items

    const sliderItems = document.querySelector(".slider-items");
    let sliderItemsWidth = sliderItems.offsetWidth; // видимые Items

    let screenWidth = window.innerWidth;
    let numberOfClicks = screenWidth >= 768 ? 3 : 6;
    let step = (sliderContainerWidth - sliderItemsWidth) / numberOfClicks;

    window.addEventListener("resize", () => {
      screenWidth = window.innerWidth;
      numberOfClicks = screenWidth >= 768 ? 3 : 6;
      sliderItemsWidth = sliderItems.offsetWidth; // видимые Items
      step = (sliderContainerWidth - sliderItemsWidth) / numberOfClicks;
      updateButtons();
    });

    let currentPosition = 0;

    function updateButtons() {
      btnLeft.disabled = currentPosition <= 0;
      btnRight.disabled =
        currentPosition >= sliderContainerWidth - sliderItemsWidth;
    }

    btnRight.addEventListener("click", () => {
      currentPosition += step;
      console.log(currentPosition);
      sliderItems.style.transform = `translateX(-${
        currentPosition >= sliderContainerWidth - sliderItemsWidth
          ? sliderContainerWidth - sliderItemsWidth
          : currentPosition
      }px)`;
      updateButtons();
    });

    btnLeft.addEventListener("click", () => {
      currentPosition -= step;
      currentPosition = currentPosition < 50 ? 0 : currentPosition;
      console.log(currentPosition);
      sliderItems.style.transform = `translateX(-${currentPosition}px)`;
      updateButtons();
    });
  };
});
