console.log("Started...");

let gameState = {
  level: "Easy", // Default level
  sequence: [],
  userInput: [],
  currentRound: 0,
  maxRounds: 5,
  inputEnabled: false,
  attempts: 0,
  difficultySymbols: {
    Easy: "0123456789",
    Medium: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    Hard: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  },
};

function initializeGame() {
  const container = document.createElement("div");
  container.className = "container";
  document.body.appendChild(container);

  const title = document.createElement("h1");
  title.textContent = "Simon Says";
  title.className = "title";
  container.appendChild(title);

  const levelSelector = document.createElement("select");
  levelSelector.id = "level-selector";
  Object.keys(gameState.difficultySymbols).forEach((level) => {
    const option = document.createElement("option");
    option.value = level;
    option.textContent = level;
    levelSelector.appendChild(option);
  });
  levelSelector.value = gameState.level; // Устанавливаем "Easy" как выбранный уровень
  container.appendChild(levelSelector);

  levelSelector.addEventListener("change", () => {
    if (!gameState.inputEnabled) {
      // Перерендерить только если игра не идет
      gameState.level = levelSelector.value; // Обновляем уровень в состоянии игры
      renderKeyboard(); // Перерисовываем клавиатуру
    }
  });

  const startButton = document.createElement("button");
  startButton.id = "start-button";
  startButton.textContent = "Start";
  container.appendChild(startButton);

  startButton.addEventListener("click", startGame);

  const newGameButton = document.createElement("button");
  newGameButton.id = "new-game-button";
  newGameButton.className = "new-game-button";
  newGameButton.textContent = "New Game";
  container.appendChild(newGameButton);

  const roundButton = document.createElement("button");
  roundButton.disabled = true;
  roundButton.id = "round-button";
  roundButton.className = "round-button";
  roundButton.textContent = "Round: " + (gameState.currentRound + 1);
  container.appendChild(roundButton);

  newGameButton.addEventListener("click", () => {
    const levelSelector = document.getElementById("level-selector");
    levelSelector.disabled = false; // Разблокируем выбор уровня сложности
    document.getElementById("start-button").disabled = false; // Разблокируем кнопку Start
    const feedback = document.getElementById("feedback");
    feedback.textContent = ""; // Очищаем сообщение обратной связи
    gameState = {
      ...gameState,
      sequence: [],
      userInput: [],
      currentRound: 0,
      inputEnabled: false,
    }; // Сбрасываем состояние
    renderKeyboard(); // Обновляем клавиатуру в соответствии с текущим уровнем
  });

  const keyboard = document.createElement("div");
  keyboard.id = "keyboard";
  keyboard.className = "keyboard";
  container.appendChild(keyboard);

  const feedback = document.createElement("div");
  feedback.id = "feedback";
  feedback.className = "feedback";
  container.appendChild(feedback);

  const nextButton = document.createElement("button");
  nextButton.id = "next-button";
  nextButton.textContent = "Next";
  nextButton.style.display = "none";
  container.appendChild(nextButton);

  nextButton.addEventListener("click", handleNextRound);

  const repeatButton = document.createElement("button");
  repeatButton.id = "repeat-button";
  repeatButton.textContent = "Repeat the sequence";
  repeatButton.disabled = true;
  container.appendChild(repeatButton);

  repeatButton.addEventListener("click", repeatSequence);

  document.addEventListener("keydown", handleKeyboardInput);
  renderKeyboard(); // Рендерим клавиатуру по умолчанию ("Easy")
}

function startGame() {
  const startButton = document.getElementById("start-button");
  startButton.disabled = true; // Блокируем кнопку Start

  const levelSelector = document.getElementById("level-selector");
  levelSelector.disabled = true; // Блокируем выбор уровня сложности после старта

  gameState.level = levelSelector.value; // Сохраняем текущий уровень сложности
  gameState.currentRound = 0;
  gameState.sequence = [];
  gameState.userInput = [];

  renderKeyboard(); // Рендерим клавиатуру в соответствии с уровнем сложности
  nextRound(); // Начинаем первый раунд
}

function nextRound() {
  gameState.currentRound++;
  gameState.userInput = [];
  gameState.inputEnabled = false;

  if (gameState.currentRound > gameState.maxRounds) {
    displayFeedback("You won! Congratulations!", "correct");
    return;
  }

  generateSequence();
  // displayFeedback(`Round ${gameState.currentRound}`, "correct");
  const roundButton = document.getElementById("round-button");
  roundButton.textContent = "Round: " + gameState.currentRound;
  simulateSequence();

  const nextButton = document.getElementById("next-button");
  nextButton.style.display = "none";
}

function generateSequence() {
  const symbols = gameState.difficultySymbols[gameState.level];
  const newLength = gameState.currentRound * 2;
  gameState.sequence = Array.from({ length: newLength }, () => {
    return symbols[Math.floor(Math.random() * symbols.length)];
  });
  console.log("sequence:", gameState.sequence);
}

function simulateSequence() {
  const keys = document.querySelectorAll(".key");
  gameState.sequence.forEach((symbol, index) => {
    const key = Array.from(keys).find((k) => k.textContent === symbol);
    setTimeout(() => {
      key.classList.add("active");
      setTimeout(() => key.classList.remove("active"), 300);
    }, index * 500);
  });

  setTimeout(() => {
    gameState.inputEnabled = true;
    document.getElementById("repeat-button").disabled = false;
  }, gameState.sequence.length * 500);
}

function handleKeyboardInput(event) {
  if (!gameState.inputEnabled) return;

  const key = event.key.toUpperCase();
  const symbols = gameState.difficultySymbols[gameState.level];
  if (!symbols.includes(key)) return;

  processInput(key);
}

function handleScreenInput(event) {
  if (!gameState.inputEnabled) return;

  const key = event.target.textContent;
  processInput(key);
}

function processInput(input) {
  const keys = document.querySelectorAll(".key");
  const keyElement = Array.from(keys).find((k) => k.textContent === input);
  keyElement.classList.add("active");
  setTimeout(() => keyElement.classList.remove("active"), 300);

  gameState.userInput.push(input);

  const currentIndex = gameState.userInput.length - 1;
  if (gameState.userInput[currentIndex] !== gameState.sequence[currentIndex]) {
    gameState.attempts++;
    if (gameState.attempts === 2) {
      displayFeedback("Game over! Click 'New Game' to restart.", "incorrect");
      disableInputs();
      return;
    }
    displayFeedback("Incorrect! Try again.", "incorrect");
    return;
  }

  if (gameState.userInput.length === gameState.sequence.length) {
    displayFeedback("Correct! Click 'Next' to continue.", "correct");
    document.getElementById("repeat-button").disabled = true;
    gameState.inputEnabled = false;
    document.getElementById("next-button").style.display = "block";
  }
}

function repeatSequence() {
  document.getElementById("repeat-button").disabled = true;
  gameState.userInput = [];
  displayFeedback("", "");
  simulateSequence();
}

function handleNextRound() {
  const nextButton = document.getElementById("next-button");
  nextButton.style.display = "none";
  nextRound();
}

function renderKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";

  const symbols = gameState.difficultySymbols[gameState.level];
  symbols.split("").forEach((symbol) => {
    const key = document.createElement("div");
    key.className = "key";
    key.textContent = symbol;
    key.addEventListener("click", handleScreenInput);
    keyboard.appendChild(key);
  });
}

function displayFeedback(message, type) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.className = `feedback ${type}`;
}

function disableInputs() {
  gameState.inputEnabled = false;
  document.getElementById("repeat-button").disabled = true;
}

initializeGame();
