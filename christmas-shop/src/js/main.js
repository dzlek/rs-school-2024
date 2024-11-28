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
    let currentPosition = 0;
    window.onload = () => {
      const sliderContainer = document.querySelector(".slider-container");
      const sliderContainerWidth = sliderContainer.scrollWidth;

      const sliderItems = document.querySelector(".slider-items");
      let sliderItemsWidth = sliderItems.offsetWidth;

      let screenWidth = window.innerWidth;
      let numberOfClicks = screenWidth >= 768 ? 3 : 6;
      let step = (sliderContainerWidth - sliderItemsWidth) / numberOfClicks;

      window.addEventListener("resize", () => {
        currentPosition = 0; //if remove working correctly, added according task
        sliderItems.style.transform = `translateX(-${currentPosition})`; //if remove working correctly, added according task
        screenWidth = window.innerWidth;
        numberOfClicks = screenWidth >= 768 ? 3 : 6;
        sliderItemsWidth = sliderItems.offsetWidth;
        step = (sliderContainerWidth - sliderItemsWidth) / numberOfClicks;
        updateButtons();
      });

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
      const response = await fetch("public/data/gifts.json");

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
      card.addEventListener("click", () => openModal(gift, type));
      container.appendChild(card);
    });
  }

  fetchData();
  //Modal start
  function openModal(gift, type) {
    document.body.classList.add("no-scroll");

    const modal = document.getElementById("modal");
    modal.style.display = "flex";

    modal.innerHTML = `
    <div class="modal-content">
    <span class="close-btn"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 10L10 30" stroke="#181C29" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 10L30 30" stroke="#181C29" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg></span>
        <div class="modal-image-container">
            <img src="./public/images/gift-for-${type}.png" alt="gift-for-${type}">
        </div>
        <div class="modal-information">
            <div class="modal-text">
              <p class="header4 ${type}">${gift.category}</p>
              <p class="header3">${gift.name}</p>
              <p class="paragraph">${gift.description}</p>
            </div>
            <div class="modal-superpowers">
                <p class="header4">Adds superpowers to:</p>
                <div class="modal-stars">
                    <p class="stars-container paragraph">Live<span>${gift.superpowers.live}</span><span class="stars" id="starsLive"></span></p>
                    <p class="stars-container paragraph">Create<span>${gift.superpowers.create}</span><span class="stars" id="starsCreate"></span></p>
                    <p class="stars-container paragraph">Love<span>${gift.superpowers.love}</span><span class="stars" id="starsLove"></span></p>
                    <p class="stars-container paragraph">Dream<span>${gift.superpowers.dream}</span><span class="stars" id="starsDream"></span></p>
                </div> 
            </div>
      </div>
    </div>
    `;

    insertStars(gift);

    function insertStars(gift) {
      const numberOfStarsLive = Number(gift.superpowers.live) / 100;
      const numberOfStarsCreate = Number(gift.superpowers.create) / 100;
      const numberOfStarsLove = Number(gift.superpowers.love) / 100;
      const numberOfStarsDream = Number(gift.superpowers.dream) / 100;

      const starsLive = document.getElementById("starsLive");
      const starsCreate = document.getElementById("starsCreate");
      const starsLove = document.getElementById("starsLove");
      const starsDream = document.getElementById("starsDream");

      starsLive.innerHTML = ``;
      for (let i = 0; i < numberOfStarsLive; i++) {
        const star = document.createElement("span");
        star.classList.add("star");
        star.innerHTML = "&nbsp;";
        starsLive.appendChild(star);
      }

      starsCreate.innerHTML = ``;
      for (let i = 0; i < numberOfStarsCreate; i++) {
        const star = document.createElement("span");
        star.classList.add("star");
        star.innerHTML = "&nbsp;";
        starsCreate.appendChild(star);
      }

      starsLove.innerHTML = ``;
      for (let i = 0; i < numberOfStarsLove; i++) {
        const star = document.createElement("span");
        star.classList.add("star");
        star.innerHTML = "&nbsp;";
        starsLove.appendChild(star);
      }

      starsDream.innerHTML = ``;
      for (let i = 0; i < numberOfStarsDream; i++) {
        const star = document.createElement("span");
        star.classList.add("star");
        star.innerHTML = "&nbsp;";
        starsDream.appendChild(star);
      }
    }

    modal.querySelector(".close-btn").addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    function closeModal() {
      document.body.classList.remove("no-scroll");
      modal.style.display = "none";
    }
  }

  //Modal end

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
