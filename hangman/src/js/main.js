let currentWord;
let incorrectGuesses = 0;
const maxIncorrectGuesses = 6;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const words = [
  { question: "France", answer: "Paris" },
  { question: "China", answer: "Beijing" },
  { question: "Japan", answer: "Tokyo" },
  { question: "Brazil", answer: "Brasilia" },
  { question: "Australia", answer: "Canberra" },
  { question: "Belarus", answer: "Minsk" },
  { question: "Poland", answer: "Warsaw" },
  { question: "Germany", answer: "Berlin" },
  { question: "Canada", answer: "Ottawa" },
  { question: "Ukraine", answer: "Kyiv" },
  { question: "Czech", answer: "Prague" },
  { question: "Italy", answer: "Rome" },
  { question: "Spain", answer: "Madrid" },
  { question: "Egypt", answer: "Cairo" },
  { question: "Nigeria", answer: "Abuja" },
  { question: "Turkey", answer: "Ankara" },
  { question: "Thailand", answer: "Bangkok" },
];

function createHangmanHTML() {
  const body = document.querySelector("body");
  body.innerHTML = `
  <main class="main">
        <section class="gallows">
            <div class="gallows-man" id="gallows-man"></div>
        </section>
        <section class="alphabet" id="alphabet"></section>
        <section class="answer">
          <div class="question-text" id="question-text"></div>
          <div class="answer-text" id="answer-text"></div>
        </section>
        <div id="modal">
          <div id="modal-content"></div>
          <button id="play-again">Play Again</button>
          </div>
          </main>
          `;
}

createHangmanHTML();

//NOTE: запуск игры
document.addEventListener("DOMContentLoaded", () => {
  const questionElement = document.getElementById("question-text");
  const wordElement = document.getElementById("answer-text");
  const alphabetElement = document.getElementById("alphabet");
  const gallows = document.getElementById("gallows-man");

  const modalElement = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const playAgainButton = document.getElementById("play-again");

  function initializeGame() {
    incorrectGuesses = 0;
    updateGallows();
    chooseRandomWord();
    renderQuestion(currentWord.question);
    renderWord();
    renderKeyboard();
    document.addEventListener("keypress", handleKeyPress);
    playAgainButton.addEventListener("click", () => {
      hideModal();
      initializeGame();
    });
  }

  function renderKeyboard() {
    const alphabetElement = document.getElementById("alphabet");
    alphabetElement.innerHTML = "";
    alphabet.split("").map((letter) => {
      const button = document.createElement("button");
      button.textContent = letter;
      button.disabled = false;
      button.className = "btn alphabet-keyboard";
      button.addEventListener("click", () => handleGuess(letter));
      alphabetElement.appendChild(button);
    });

    // for (const letter of alphabet) {
    //   const button = document.createElement("button");
    //   button.textContent = letter;
    //   button.addEventListener("click", () => {});
    //   alphabetElement.appendChild(button);
    // }

    document.addEventListener("keypress", (event) => {
      const pressedKey = event.key.toUpperCase();
      if (isLetter(pressedKey) && !isButtonDisabled(pressedKey)) {
        handleGuess(pressedKey);
      }
    });
  }

  function renderQuestion(questionWord) {
    questionElement.innerHTML = "";
    let questionWordFormatted = questionWord.toUpperCase();
    const [paddingLeft, paddingRight] =
      questionWordFormatted.length % 2 === 0
        ? [
            (9 - questionWordFormatted.length) / 2 + 1,
            (9 - questionWordFormatted.length) / 2,
          ]
        : [
            (9 - questionWordFormatted.length) / 2,
            (9 - questionWordFormatted.length) / 2,
          ];
    questionWordFormatted =
      " ".repeat(paddingLeft) +
      questionWordFormatted +
      " ".repeat(paddingRight);

    console.log(questionWordFormatted);

    questionWordFormatted.split("").map((letter) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.className = "question-text-letter";
      questionElement.appendChild(span);
    });
  }

  function chooseRandomWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    //FIX:
    currentWord = { question: "Brazil", answer: "Brasilia" };
  }

  function renderWord() {
    let placeholders = new Array(currentWord.answer.length).fill("_");
    placeholders = placeholders.join("");
    placeholders.split("").map((letter) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.className = "answer-text-letter";
      wordElement.appendChild(span);
    });
  }

  //NOTE: обработка нажатия
  function handleKeyPress(event) {
    const pressedKey = event.key.toUpperCase();
    if (isLetter(pressedKey) && !isButtonDisabled(pressedKey)) {
      handleGuess(pressedKey);
    }
  }

  //NOTE: обновляем виселицу
  function updateGallows() {
    gallows.style.backgroundImage = `url("public/images/man-${incorrectGuesses}.png")`;
  }

  //NOTE: проверяем что это буква
  function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }

  //NOTE: отключаем кнопку

  function isButtonDisabled(letter) {
    const button = Array.from(alphabetElement.children).find(
      (btn) => btn.textContent === letter
    );
    return button.disabled;
  }

  //NOTE: обработка нажатия

  function handleGuess(letter) {
    console.log("handle");

    const answerArray = currentWord.answer.toUpperCase().split("");
    console.log("answerArray", answerArray);
    const placeholders = wordElement.textContent.split(" ");
    console.log("placeholders", placeholders);

    if (answerArray.includes(letter)) {
      answerArray.forEach((char, index) => {
        if (char === letter) {
          placeholders[index] = letter;
        }
      });
      console.log("placeholders", placeholders);
      //TODO:
      wordElement.innerHTML = "";
      placeholders.map((letter) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.className = "answer-text-letter";
        wordElement.appendChild(span);
      });
      // wordElement.textContent = placeholders.join(" ");

      if (!wordElement.textContent.includes("_")) {
        endGame(true);
      }
    } else {
      if (incorrectGuesses < maxIncorrectGuesses) {
        incorrectGuesses++;
        updateGallows();
      }

      if (incorrectGuesses === maxIncorrectGuesses) {
        endGame(false);
      }
    }

    disableButton(letter);
  }

  //NOTE: отключаем кнопку
  function disableButton(letter) {
    const button = Array.from(alphabetElement.children).find(
      (btn) => btn.textContent === letter
    );
    button.disabled = true;
  }

  //NOTE: конец игры

  function endGame(isWinner) {
    const message = isWinner ? "Congratulations! You won!" : "Sorry, you lost.";
    const modalMessage = `${message} The word was: ${currentWord.answer}`;

    modalContent.textContent = modalMessage;
    showModal();

    playAgainButton.addEventListener("click", () => {
      hideModal();
      initializeGame();
    });
  }

  function showModal() {
    modalElement.style.display = "block";
  }

  //NOTE: скрываем модалку
  function hideModal() {
    modalElement.style.display = "none";
  }

  initializeGame();
});
