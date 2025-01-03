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

let currentWord;
function createHangmanHTML() {
  const body = document.querySelector("body");
  body.innerHTML = `
  <header class="header"><h1>Guess the Capital</h1></header>
  <main class="main">
    <section class="gallows">
        <div class="incorrect-count" id="incorrect-count"></div>
        <div class="gallows-man" id="gallows-man"></div>
    </section>
    <section class="alphabet" id="alphabet"></section>
    <section class="answer">
      <div class="question-text" id="question-text"></div>
      <div class="answer-text" id="answer-text"></div>
    </section>
    <div class="modal" id="modal">
      <div class="modal-content" id="modal-content"></div>
      <button class="play-again" id="play-again">Play Again</button>
    </div>
  </main>
          `;
}

createHangmanHTML();

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

    questionWordFormatted.split("").map((letter) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.className = "question-text-letter";
      questionElement.appendChild(span);
    });
  }

  function chooseRandomWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    console.log("answer:", currentWord.answer);
  }

  function renderWord() {
    wordElement.innerHTML = "";
    let placeholders = new Array(currentWord.answer.length).fill("_");

    placeholders.map((letter) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.className = "answer-text-letter";
      wordElement.appendChild(span);
    });
  }

  function handleKeyPress(event) {
    const pressedKey = event.key.toUpperCase();
    if (isLetter(pressedKey) && !isButtonDisabled(pressedKey)) {
      handleGuess(pressedKey);
    }
  }

  function updateGallows() {
    gallows.style.backgroundImage = `url("public/images/man-${incorrectGuesses}.png")`;
    document.getElementById("incorrect-count").innerHTML =
      `${incorrectGuesses}/${maxIncorrectGuesses}${"&nbsp;".repeat(7)} incorrect`;
  }

  function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }

  function isButtonDisabled(letter) {
    const buttons = Array.from(alphabetElement.children);
    for (let btn of buttons) {
      if (btn.textContent === letter) {
        return btn.disabled;
      }
    }
    return false;
  }

  function handleGuess(letter) {
    const answerArray = currentWord.answer.toUpperCase().split("");
    const placeholders = Array.from(wordElement.children);

    let isCorrectGuess = false;

    answerArray.forEach((char, index) => {
      if (char === letter) {
        placeholders[index].textContent = letter;
        isCorrectGuess = true;
      }
    });

    if (isCorrectGuess) {
      const currentWordState = placeholders
        .map((span) => span.textContent)
        .join("");
      if (currentWordState === currentWord.answer.toUpperCase()) {
        endGame(true);
      }
    } else {
      incorrectGuesses++;
      updateGallows();

      if (incorrectGuesses === maxIncorrectGuesses) {
        endGame(false);
      }
    }

    disableButton(letter);
  }

  function disableButton(letter) {
    const buttons = Array.from(alphabetElement.children);
    for (let btn of buttons) {
      if (btn.textContent === letter) {
        btn.disabled = true;
        break;
      }
    }
  }

  function endGame(isWinner) {
    const message = isWinner ? "Congratulations! You won!" : "Sorry, you lost.";
    const modalMessage = `${message} The word was: ${currentWord.answer}`;

    modalContent.innerHTML = modalMessage;
    showModal();

    playAgainButton.addEventListener("click", () => {
      hideModal();
      initializeGame();
    });
  }

  function showModal() {
    modalElement.style.display = "flex";
  }

  function hideModal() {
    modalElement.style.display = "none";
  }

  initializeGame();
});
