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

  function tabSwitcher() {
    const tabItems = document.querySelectorAll(".btn-tab");
    const bestGiftCards = document.querySelectorAll(".bestGift-card");

    tabItems.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabItems.forEach((item) => item.classList.remove("active"));
        tab.classList.add("active");

        const tabType = tab.dataset.type;

        bestGiftCards.forEach((card) => {
          const header4 = card.querySelector(".header4");
          const header4Class =
            header4.classList.length > 1 ? header4.classList[1] : "";

          if (tabType === "all" || header4Class === tabType) {
            card.hidden = false;
          } else {
            card.hidden = true;
          }
        });
      });
    });
  }

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

  if (document.body.dataset.page === "index") {
    const btnLeft = document.querySelector("#btn-left");
    const btnRight = document.querySelector("#btn-right");

    btnLeft.disabled = true;
    window.onload = () => {
      const sliderContainer = document.querySelector(".slider-container");
      const sliderContainerWidth = sliderContainer.scrollWidth;

      const sliderItems = document.querySelector(".slider-items");
      let sliderItemsWidth = sliderItems.offsetWidth;

      let screenWidth = window.innerWidth;
      let numberOfClicks = screenWidth >= 768 ? 3 : 6;
      let step = (sliderContainerWidth - sliderItemsWidth) / numberOfClicks;

      window.addEventListener("resize", () => {
        screenWidth = window.innerWidth;
        numberOfClicks = screenWidth >= 768 ? 3 : 6;
        sliderItemsWidth = sliderItems.offsetWidth;
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
        sliderItems.style.transform = `translateX(-${
          currentPosition >= sliderContainerWidth - sliderItemsWidth
            ? sliderContainerWidth - sliderItemsWidth
            : currentPosition
        }px)`;
        updateButtons();
      });

      btnLeft.addEventListener("click", () => {
        currentPosition -= step;
        currentPosition = currentPosition <= 0 ? 0 : currentPosition;
        sliderItems.style.transform = `translateX(-${currentPosition}px)`;
        updateButtons();
      });
    };
  }

  //Random gifts

  async function fetchData() {
    try {
      const response = await fetch("/public/data/gifts.json");
      //тоже можно https://api.github.com/repos/rolling-scopes-school/tasks/contents/tasks/christmas-shop/gifts.json
      if (!response.ok) {
        throw new Error("Error fetching data...");
      }
      const data = await response.json();
      const numberOfGifts =
        document.body.dataset.page === "index" ? 4 : data.length;

      const gifts = getRandomGifts(data, numberOfGifts);
      renderGifts(gifts); // для отображения данных
      tabSwitcher(); // для запуска табов
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function getRandomGifts(data, numberOfGifts) {
    const selectedGifts = [];
    const usedIndices = new Set();

    while (selectedGifts.length < numberOfGifts) {
      const randomIndex = Math.floor(Math.random() * data.length);
      if (!usedIndices.has(randomIndex)) {
        selectedGifts.push(data[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }
    return selectedGifts;
  }

  function renderGifts(gifts) {
    const container = document.querySelector(".bestGifts-items");

    gifts.forEach((gift) => {
      const card = document.createElement("div");
      card.classList.add("bestGift-card");
      const type = (gift.category.split(" ")[1] || "").toLowerCase();

      card.innerHTML = `
      <img class="bestGift-image" src="./public/images/gift-for-${type}.png" alt="gift-for-${type}">
      <div class="card-text">
          <p class="header4 ${type}">${gift.category}</p>
          <p class="header3">${gift.name}</p>
      </div>
 `;
      container.appendChild(card);
    });
  }

  fetchData();

  //Scroll-to-Top
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  window.addEventListener("scroll", () => {
    if (window.innerWidth <= 768 && window.scrollY > 300) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
