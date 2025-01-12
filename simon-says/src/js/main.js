console.log("Started...");

let gameState = {
  level: "Easy",
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
  levelSelector.value = gameState.level;
  container.appendChild(levelSelector);

  levelSelector.addEventListener("change", () => {
    if (!gameState.inputEnabled) {
      gameState.level = levelSelector.value;
      renderKeyboard();
    }
  });

  const startButton = document.createElement("button");
  startButton.id = "start-button";
  startButton.textContent = "Start";
  container.appendChild(startButton);

  startButton.addEventListener("click", startGame);

  const repeatButton = document.createElement("button");
  repeatButton.id = "repeat-button";
  repeatButton.textContent = "Repeat the sequence";
  repeatButton.disabled = true;
  repeatButton.style.display = "none";
  container.appendChild(repeatButton);

  repeatButton.addEventListener("click", repeatSequence);

  const nextButton = document.createElement("button");
  nextButton.id = "next-button";
  nextButton.textContent = "Next";
  nextButton.style.display = "none";
  container.appendChild(nextButton);

  nextButton.addEventListener("click", handleNextRound);

  const newGameButton = document.createElement("button");
  newGameButton.id = "new-game-button";
  newGameButton.className = "new-game-button";
  newGameButton.textContent = "New Game";
  container.appendChild(newGameButton);

  const roundButton = document.createElement("button");
  roundButton.disabled = true;
  roundButton.id = "round-button";
  roundButton.className = "round-button";
  roundButton.textContent = "Round counter: " + (gameState.currentRound + 1);
  container.appendChild(roundButton);

  newGameButton.addEventListener("click", () => {
    const levelSelector = document.getElementById("level-selector");
    levelSelector.disabled = false;
    document.getElementById("start-button").disabled = false;
    document.getElementById("start-button").style.display = "block";
    document.getElementById("new-game-button").disabled = true;
    document.getElementById("repeat-button").style.display = "none";
    document.getElementById("next-button").style.display = "none";
    const feedback = document.getElementById("feedback");
    feedback.textContent = "";
    gameState = {
      ...gameState,
      sequence: [],
      userInput: [],
      currentRound: 0,
      inputEnabled: false,
      attempts: 0,
    };
    renderKeyboard();
  });

  const keyboard = document.createElement("div");
  keyboard.id = "keyboard";
  keyboard.className = "keyboard";
  container.appendChild(keyboard);

  const feedback = document.createElement("div");
  feedback.id = "feedback";
  feedback.className = "feedback";
  container.appendChild(feedback);

  document.addEventListener("keydown", handleKeyboardInput);
  renderKeyboard();
}

function startGame() {
  const startButton = document.getElementById("start-button");
  startButton.disabled = true;
  startButton.style.display = "none";
  document.getElementById("new-game-button").disabled = false;
  document.getElementById("repeat-button").style.display = "block";

  const levelSelector = document.getElementById("level-selector");
  levelSelector.disabled = true;

  gameState.level = levelSelector.value;
  gameState.currentRound = 0;
  gameState.sequence = [];
  gameState.userInput = [];

  renderKeyboard();
  nextRound();
}

function nextRound() {
  gameState.currentRound++;
  gameState.userInput = [];
  gameState.inputEnabled = false;
  gameState.attempts = 0;

  if (gameState.currentRound > gameState.maxRounds) {
    displayFeedback("You won! Congratulations!", "correct");
    return;
  }

  generateSequence();
  displayFeedback(
    `Round ${gameState.currentRound} of ${gameState.maxRounds} started`,
    "correct"
  );
  const roundButton = document.getElementById("round-button");
  roundButton.textContent = "Round counter: " + gameState.currentRound;
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
  }, gameState.sequence.length * 500);

  document.getElementById("repeat-button").disabled = false;
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
  displayFeedback("Your input: " + gameState.userInput.join("-"), "processing");

  const currentIndex = gameState.userInput.length - 1;
  if (gameState.userInput[currentIndex] !== gameState.sequence[currentIndex]) {
    gameState.inputEnabled = false;
    document.getElementById("repeat-button").style.display = "block";
    gameState.attempts++;
    displayFeedback(
      "Your input: " +
        gameState.userInput.join("-") +
        " is INCORRECT! Try to repeat. Attempt " +
        gameState.attempts +
        " failed",
      "incorrect"
    );

    if (gameState.attempts === 2) {
      displayFeedback(
        gameState.attempts +
          "  atempts failed. Game over! Click 'New Game' to restart.",
        "incorrect"
      );
      disableInputs();
      return;
    }
    return;
  }

  if (gameState.userInput.length === gameState.sequence.length) {
    gameState.inputEnabled = false;
    document.getElementById("repeat-button").style.display = "none";
    displayFeedback(
      "Correct! Click 'Next' to continue. The answer was: " +
        gameState.userInput.join("-"),
      "correct"
    );
    document.getElementById("repeat-button").disabled = true;
    gameState.inputEnabled = false;
    document.getElementById("next-button").style.display = "block";
  }
}

function repeatSequence() {
  gameState.userInput = [];
  displayFeedback(" ", "correct");
  simulateSequence();
  document.getElementById("repeat-button").disabled = true;
}

function handleNextRound() {
  const nextButton = document.getElementById("next-button");
  nextButton.style.display = "none";
  document.getElementById("repeat-button").style.display = "block";
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
