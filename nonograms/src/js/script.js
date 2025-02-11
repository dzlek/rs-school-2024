//////////////////////////////////
import { solutions } from "./solutions.js";

// let gameState = {
//   numberOfColumns: 5,
//   numberOfRows: 5,
//   deskSize: 5,
//   deskLevel: "l1",
//   isPlaying: false,
//   isSoundOn: false,
//   solution: solutions.tower,
// };

let numberOfColumns = 5;
let numberOfRows = 5;
let deskSize = 5;
let deskLevel = "l1";
let isPlaying = false;
let isSoundOn = false;
let solution = solutions.tower;

const h1 = document.createElement("h1");
h1.id = "headline";
h1.textContent = "nonogram";
document.body.appendChild(h1);

const section = document.createElement("section");

const deskSizeLabel = document.createElement("label");
deskSizeLabel.setAttribute("for", "deskSize");
deskSizeLabel.textContent = "Desk size:";
section.appendChild(deskSizeLabel);

const deskSizeSelect = document.createElement("select");
deskSizeSelect.id = "deskSize";
const deskSizeOptions = ["easy (5x5)", "medium (10x10)", "hard (15x15)"];
deskSizeOptions.forEach((optionText, index) => {
  const option = document.createElement("option");
  option.value = (index + 1) * 5;
  option.textContent = optionText;
  deskSizeSelect.appendChild(option);
});
section.appendChild(deskSizeSelect);

deskSizeSelect.addEventListener("change", changeDeskSize);
section.appendChild(document.createTextNode("\u00A0 \u00A0"));

const deskLevelLabel = document.createElement("label");
deskLevelLabel.setAttribute("for", "deskLevel");
deskLevelLabel.textContent = "Choose level:";
section.appendChild(deskLevelLabel);

const deskLevelSelect = document.createElement("select");
deskLevelSelect.id = "deskLevel";
const deskLevelOptions = [
  "Level 1",
  "Level 2",
  "Level 3",
  "Level 4",
  "Level 5",
];
deskLevelOptions.forEach((level, index) => {
  const option = document.createElement("option");
  option.value = `l${index + 1}`;
  option.textContent = level;
  deskLevelSelect.appendChild(option);
});
section.appendChild(deskLevelSelect);

deskLevelSelect.addEventListener("change", changeDeskLevel);

section.appendChild(document.createElement("br"));
document.body.appendChild(section);
document.body.appendChild(document.createElement("br"));

const randomButton = createButton(
  "random",
  "Random size&level",
  randomGameFunction
);
document.body.appendChild(randomButton);
document.body.appendChild(document.createElement("br"));

// =======puzzle-full DIV=================
let puzzleFullDiv = document.createElement("div");
puzzleFullDiv.setAttribute("id", "puzzle-full");

function createPuzzleFullDivContent(numberOfColumns, numberOfRows) {
  let topKeySection = document.createElement("section");
  topKeySection.setAttribute("class", "topkey");
  let puzzleBoardSection = document.createElement("section");
  puzzleBoardSection.id = "puzzleboard";

  const [rowCounts, columnCounts] = calcRowCountsColumnCounts();
  for (let row = 1; row <= numberOfRows; row++) {
    for (let col = 0; col <= numberOfColumns; col++) {
      let cellDiv = document.createElement("div");
      cellDiv.setAttribute("id", "c" + col + "r" + row);
      if (row > 0) {
        if (col === 0) {
          cellDiv.setAttribute("class", "leftkey");
          cellDiv.textContent = `${rowCounts[row - 1]
            .toString()
            .replace(new RegExp(",", "g"), "\u00A0\u00A0")}`;
        } else {
          cellDiv.setAttribute("class", "cell");
        }
      }
      puzzleBoardSection.appendChild(cellDiv);
    }
  }
  for (let col = 0; col <= numberOfColumns; col++) {
    let leftKeyDiv = document.createElement("div");

    leftKeyDiv.setAttribute("id", "c" + col + "r0");
    if (col > 0) {
      leftKeyDiv.innerHTML = `${columnCounts[col - 1]
        .toString()
        .replace(new RegExp(",", "g"), "</br>")}`;

      for (let i = 1; i <= col; i++) {
        i++;
      }
    }
    topKeySection.appendChild(leftKeyDiv);
  }
  topKeySection.style.gridTemplateColumns = `auto repeat(${numberOfColumns}, 23px)`;
  puzzleBoardSection.style.gridTemplateColumns = `auto repeat(${numberOfColumns}, 23px)`;
  puzzleBoardSection.style.gridTemplateRows = `auto repeat(${
    numberOfRows - 1
  }, 23px)`;
  puzzleFullDiv.appendChild(topKeySection);
  puzzleFullDiv.appendChild(puzzleBoardSection);
}
createPuzzleFullDivContent(5, 5);
document.body.appendChild(puzzleFullDiv);

// =============DIV END===========

document.body.appendChild(document.createElement("br"));
function createButton(id, text, onClick) {
  let button = document.createElement("button");
  button.setAttribute("id", id);
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}
function createSelect(id, options, onChange) {
  let select = document.createElement("select");
  select.setAttribute("id", id);
  select.addEventListener("change", onChange);
  for (let i = 0; i < options.length; i++) {
    let option = document.createElement("option");
    option.value = options[i].value;
    option.textContent = options[i].label;
    select.appendChild(option);
  }
  return select;
}

function createLabel(forAttribute, text) {
  let label = document.createElement("label");
  label.setAttribute("for", forAttribute);
  label.textContent = text;
  return label;
}
let restartButton = createButton("restart", "Reset game", () => {});
let saveButton = createButton("save", "Save game", saveGameFunction);
let continueButton = createButton("continue", "Continue", continueFunction);
let buttonSection = document.createElement("section");
buttonSection.appendChild(saveButton);
buttonSection.appendChild(
  document.createTextNode("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0")
);
buttonSection.appendChild(continueButton);
let soundColorSection = document.createElement("section");
soundColorSection.appendChild(createLabel("deskSound", "Sound:"));
soundColorSection.appendChild(
  createSelect(
    "deskSound",
    [
      { value: "soundOff", label: "Off" },
      { value: "soundOn", label: "On" },
    ],
    changeDeskSound
  )
);
soundColorSection.appendChild(document.createTextNode("\u00A0\u00A0"));
soundColorSection.appendChild(createLabel("deskColor", "Color theme:"));
soundColorSection.appendChild(
  createSelect(
    "deskColor",
    [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
    ],
    changeDeskColor
  )
);
let solutionButton = createButton("solution", "Solution", solutionFunction);
document.body.appendChild(restartButton);
document.body.appendChild(document.createElement("br"));
let formElement = document.createElement("form");
formElement.setAttribute("name", "MyForm");
let inputElement = document.createElement("input");
inputElement.setAttribute("name", "stopwatch");
inputElement.setAttribute("size", "1");
inputElement.setAttribute("value", "00:00");
inputElement.setAttribute("disabled", "true");
formElement.appendChild(inputElement);
document.body.appendChild(formElement);
document.body.appendChild(document.createElement("br"));
document.body.appendChild(buttonSection);
document.body.appendChild(document.createElement("br"));
document.body.appendChild(soundColorSection);
document.body.appendChild(document.createElement("br"));
document.body.appendChild(solutionButton);
document.body.appendChild(document.createElement("br"));

let winTable = document.createElement("table");
winTable.setAttribute("id", "winTable");
let headerRow = winTable.insertRow(0);
let headerCell1 = headerRow.insertCell(0);
let headerCell2 = headerRow.insertCell(1);
let headerCell3 = headerRow.insertCell(2);

headerCell1.textContent = "Desk Size";
headerCell2.innerHTML = "&nbsp;&nbsp;Level&nbsp;&nbsp;";
headerCell3.innerHTML = "&nbsp;&nbsp;Time&nbsp;&nbsp;";

for (let i = 1; i <= 5; i++) {
  let row = winTable.insertRow(i);

  let sizeCell = row.insertCell(0);
  sizeCell.setAttribute("id", "winSize" + i);
  sizeCell.innerHTML = "&nbsp;";

  let levelCell = row.insertCell(1);
  levelCell.setAttribute("id", "winLevel" + i);
  levelCell.innerHTML = "&nbsp;";

  let timeCell = row.insertCell(2);
  timeCell.setAttribute("id", "winTime" + i);
  timeCell.innerHTML = "&nbsp;";
}
let tableTitle = document.createElement("strong");
tableTitle.textContent = " Latest 5 win results";
document.body.appendChild(tableTitle);
document.body.appendChild(winTable);

// ============================LAYOUT CREATED============

let board;
let cells = document.querySelectorAll("div");
let headline = document.getElementById("headline");
let puzzleBoard = document.getElementById("puzzleboard");
restartButton = document.getElementById("restart");
let fullPuzzle = document.getElementById("puzzle-full");

function changeDeskSize() {
  numberOfColumns = document.getElementById("deskSize").value;
  numberOfRows = document.getElementById("deskSize").value;
  numberOfColumns = Number(numberOfColumns);
  numberOfRows = Number(numberOfRows);

  changeDeskLevel();
  fullPuzzle.innerHTML = "";
  createPuzzleFullDivContent(numberOfColumns, numberOfRows);

  cleanBoard();
  deskSize = document.getElementById("deskSize").value;
  cells = document.querySelectorAll("div");

  puzzleBoard = document.getElementById("puzzleboard"); //recalculate
  puzzleBoard.addEventListener("mousedown", handleClick);
  puzzleBoard.addEventListener("contextmenu", (e) => e.preventDefault());
}

document
  .getElementById("puzzleboard")
  .addEventListener("mousedown", handleClick);
puzzleBoard.addEventListener("contextmenu", (e) => e.preventDefault());

restartButton.addEventListener("click", cleanBoard);

function changeDeskLevel() {
  deskLevel = document.getElementById("deskLevel").value;
  if (numberOfColumns === 5) {
    if (deskLevel === "l1") {
      solution = solutions.tower;
    }

    if (deskLevel === "l2") {
      solution = solutions.plane;
    }
    if (deskLevel === "l3") {
      solution = solutions.snow;
    }
    if (deskLevel === "l4") {
      solution = solutions.chess;
    }
    if (deskLevel === "l5") {
      solution = solutions.hash;
    }
  }

  if (numberOfColumns === 10) {
    if (deskLevel === "l1") {
      solution = solutions.smile;
    }

    if (deskLevel === "l2") {
      solution = solutions.postCard;
    }
    if (deskLevel === "l3") {
      solution = solutions.tree;
    }
    if (deskLevel === "l4") {
      solution = solutions.home;
    }
    if (deskLevel === "l5") {
      solution = solutions.cup;
    }
  }

  if (numberOfColumns === 15) {
    if (deskLevel === "l1") {
      solution = solutions.deer;
    }

    if (deskLevel === "l2") {
      solution = solutions.castle;
    }

    if (deskLevel === "l3") {
      solution = solutions.duck;
    }

    if (deskLevel === "l4") {
      solution = solutions.clover;
    }

    if (deskLevel === "l5") {
      solution = solutions.house;
    }
  }

  fullPuzzle.innerHTML = "";
  createPuzzleFullDivContent(numberOfColumns, numberOfRows);
  puzzleBoard = document.getElementById("puzzleboard");
  puzzleBoard.addEventListener("mousedown", handleClick);
  puzzleBoard.addEventListener("contextmenu", (e) => e.preventDefault());

  cleanBoard();
}

let r = document.querySelector(":root");

function changeDeskColor() {
  let deskColor = document.getElementById("deskColor").value;

  if (deskColor === "dark") {
    r.style.setProperty("--background", "#000000");
    r.style.setProperty("--cell-color", "darkgoldenrod");
    r.style.setProperty("--border-color", "#FFFFFF");
    r.style.setProperty("--wrong-color", "green");
    r.style.setProperty("--text-color", "#FFFFFF");
  } else {
    r.style.setProperty("--background", "#FFFFFF");
    r.style.setProperty("--cell-color", "grey");
    r.style.setProperty("--border-color", "#000000");
    r.style.setProperty("--wrong-color", "pink");
    r.style.setProperty("--text-color", "black");
  }
}

function randomGameFunction() {
  deskLevel = document.getElementById("deskLevel").value;
  deskLevel = "l" + Number(Math.floor(Math.random() * 5) + 1);
  document.getElementById("deskLevel").value = deskLevel;

  deskSize = document.getElementById("deskSize").value;
  deskSize = Number((Math.floor(Math.random() * 3) + 1) * 5);
  document.getElementById("deskSize").value = deskSize;

  changeDeskSize();
}

function changeDeskSound() {
  let deskSound = document.getElementById("deskSound").value;
  if (deskSound === "soundOn") {
    isSoundOn = true;
  } else {
    isSoundOn = false;
  }
}

function solutionFunction() {
  cleanBoard();
  let cell = document.querySelectorAll(".cell");
  cell.forEach(function (el) {
    const rowId = el.id.split("r")[1];
    const colId = el.id.split("r")[0].substring(1);

    if (1 === solution[rowId][colId]) {
      el.style.backgroundColor = "var(--cell-color)";
    }
  });
}

initialize();

function cleanBoard() {
  initialize();
  isPlaying = false;
  Stop();
  ClearСlock();
  cells = document.querySelectorAll(".cell");
  cells.forEach(function (el) {
    el.style.backgroundColor = "";

    if (
      el.id !== "puzzle-full" &&
      el.id.split("r")[1] !== "0" &&
      el.id[1] !== "0"
    ) {
      el.innerHTML = "";
    }
  });

  headline.innerHTML = "nonogram";
}

function handleClick(evt) {
  if (!isPlaying) {
    Start();
  }
  isPlaying = true;

  const marker = evt.target;
  let markerString = marker.id;
  let rowArr = markerString.split("r");
  let rowIdx = rowArr[rowArr.length - 1];
  rowArr.pop();
  let colIdx = rowArr.join("").replace("c", "");

  if (colIdx != 0) {
    if (!(evt.button === 2)) {
      if (!marker.style.backgroundColor) {
        marker.style.backgroundColor = "var(--cell-color)";
        board[rowIdx][colIdx] = 1;
        if (isSoundOn === true) {
          beep(50, 0.05);
        }
      } else if (
        marker.style.backgroundColor === "var(--cell-color)" ||
        marker.style.backgroundColor === "var(--wrong-color)"
      ) {
        marker.style.backgroundColor = "";
        marker.innerHTML = "";
        board[rowIdx][colIdx] = 0;
        if (isSoundOn === true) {
          beep(70, 0.05);
        }
      }
    } else {
      marker.style.backgroundColor = "var(--wrong-color)";
      marker.innerHTML = "X";
      board[rowIdx][colIdx] = 0;
      if (isSoundOn === true) {
        beep(400, 0.01);
      }
    }
  }
  checkWin();
}

function checkWin() {
  if (board.toString() == solution.toString()) {
    Stop();
    if (isSoundOn === true) {
      beep(261.63, 0.1);
      beep(20.88, 0.4);
    }
    headline.innerHTML = `Great!Solved in ${readout}!`;
    updateWinTableContent(deskSize, deskLevel, readout);
  } else if (board.toString() !== solution.toString()) {
    headline.innerHTML = "nonogram";
  }
}

function initialize() {
  board = Array.from({ length: +numberOfColumns + 1 }, () =>
    Array(+numberOfRows + 1).fill(0)
  );
}
// ========================STOPWATCH==Секундомер на js==========
let base = 60;
let clocktimer,
  dateObj,
  dh,
  dm = "00",
  ds = "00",
  ms = 0;
let readout = "";
let hours = 1,
  minutes = 1,
  tm = 1,
  s = 0,
  ts = 0,
  init = 0;

function ClearСlock() {
  clearTimeout(clocktimer);
  hours = 1;
  minutes = 1;
  tm = 1;
  s = 0;
  ts = 0;
  ms = 0;
  init = 0;

  readout = "00:00";
  document.MyForm.stopwatch.value = readout;
}

let addMinutes = 0;
let addSeconds = 0;

function StartTime() {
  let cdateObj = new Date();

  cdateObj.setMinutes(cdateObj.getMinutes() + addMinutes);
  cdateObj.setSeconds(cdateObj.getSeconds() + addSeconds);
  // let isContinue = false;

  let t = cdateObj.getTime() - dateObj.getTime() - s * 1000;

  if (t > 999) {
    s++;
  }

  if (s >= minutes * base) {
    ts = 0;
    minutes++;
  } else {
    ts = parseInt(ms / 100 + s);
    if (ts >= base) {
      ts = ts - (minutes - 1) * base;
    }
  }
  if (minutes > hours * base) {
    tm = 1;
    hours++;
  } else {
    tm = parseInt(ms / 100 + minutes);
    if (tm >= base) {
      tm = tm - (hours - 1) * base;
    }
  }

  ms = Math.round(t / 10);
  if (ms > 99) {
    ms = 0;
  }
  if (ms == 0) {
    ms = "00";
  }
  if (ms > 0 && ms <= 9) {
    ms = "0" + ms;
  }

  if (ts > 0) {
    ds = ts;
    if (ts < 10) {
      ds = "0" + ts;
    }
  } else {
    ds = "00";
  }
  dm = tm - 1;
  if (dm > 0) {
    if (dm < 10) {
      dm = "0" + dm;
    }
  } else {
    dm = "00";
  }
  dh = hours - 1;
  if (dh > 0) {
    if (dh < 10) {
      dh = "0" + dh;
    }
  } else {
    dh = "00";
  }
  readout = dm + ":" + ds;
  document.MyForm.stopwatch.value = readout;
  clocktimer = setTimeout(StartTime, 1);
}

// function StartStop() {
//   if (init == 0) {
//     ClearСlock();
//     dateObj = new Date();
//     StartTime();
//     init = 1;
//   } else {
//     clearTimeout(clocktimer);
//     init = 0;
//   }
// }

function Start() {
  if (init == 0) {
    ClearСlock();

    dateObj = new Date();
    StartTime();
    init = 1;
  }
}

function Stop() {
  if (init == 1) {
    clearTimeout(clocktimer);
    addMinutes = 0;
    addSeconds = 0;
    init = 0;
  }
}

function beep(f, d) {
  let volume = 10000,
    u1 = -volume,
    u2 = volume,
    u = u1,
    samples = [],
    titlestring = decodeURIComponent(
      escape(
        window.atob("UklGRgAAAABXQVZFZm10IBAAAAABAAIARMKsAAAQwrECAAQAEABkYXRh")
      )
    ),
    title = [];
  for (let i = 0; i < titlestring.length; i++)
    title[i] = titlestring.charCodeAt(i);
  for (let i = 0; i < d * 44100; i++) {
    u += f;
    if (u > u2) u = u1;
    samples[i] = u;
  }
  let outbuffer = new Int16Array(title.length / 2 + samples.length * 2);
  for (let i = 0; i < title.length; i += 2)
    outbuffer[i / 2] = title[i] + title[i + 1] * 256;
  for (let i = 0; i < samples.length * 2; i++)
    outbuffer[i * 2 + 44] = outbuffer[i * 2 + 45] = samples[i];
  let audio = new Audio(URL.createObjectURL(new Blob([outbuffer])));
  audio.play();
}

function calcRowCountsColumnCounts() {
  function countUninterrupted(arr) {
    let counts = [];
    let currentCount = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === 1) {
        currentCount++;
      } else if (currentCount > 0) {
        counts.push(currentCount);
        currentCount = 0;
      }
    }

    if (currentCount > 0) {
      counts.push(currentCount);
    }

    return counts;
  }

  const rowCounts = solution
    .slice(1)
    .map((row) => countUninterrupted(row.slice(1)));

  const columnCounts = solution[0]
    .slice(1)
    .map((col, index) =>
      countUninterrupted(solution.map((row) => row[index + 1]))
    );
  return [rowCounts, columnCounts];
}

function saveGameFunction() {
  localStorage.setItem("solution", JSON.stringify(solution));
  localStorage.setItem("board", JSON.stringify(board));
  localStorage.setItem("deskLevel", JSON.stringify(deskLevel));
  localStorage.setItem("deskSize", deskSize);

  localStorage.setItem("numberOfColumns", JSON.stringify(numberOfColumns));
  localStorage.setItem("numberOfRows", JSON.stringify(numberOfRows));

  localStorage.setItem("addSeconds", JSON.stringify(Number(ds)));
  localStorage.setItem("addMinutes", JSON.stringify(Number(dm)));

  localStorage.setItem("addSecondsString", JSON.stringify(ds));
  localStorage.setItem("addMinutesString", JSON.stringify(dm));

  headline = document.getElementById("headline");
  headline.innerHTML = "saved";
}

function reDrawFunction() {
  let cell = document.querySelectorAll(".cell");
  cell.forEach(function (el) {
    const rowId = el.id.split("r")[1];
    const colId = el.id.split("r")[0].substring(1);

    if (1 === board[rowId][colId]) {
      el.style.backgroundColor = "var(--cell-color)";
    }
  });
}

function continueFunction() {
  cleanBoard();

  let fullPuzzle = document.getElementById("puzzle-full");
  fullPuzzle.innerHTML = "";

  solution = JSON.parse(localStorage.getItem("solution"));
  board = JSON.parse(localStorage.getItem("board"));
  numberOfColumns = JSON.parse(localStorage.getItem("numberOfColumns"));
  numberOfRows = JSON.parse(localStorage.getItem("numberOfRows"));
  deskSize = JSON.parse(localStorage.getItem("deskSize"));
  deskLevel = JSON.parse(localStorage.getItem("deskLevel"));

  createPuzzleFullDivContent(numberOfColumns, numberOfRows);
  document.getElementById("deskLevel").value = deskLevel;
  document.getElementById("deskSize").value = `${deskSize}`;

  reDrawFunction();

  addSeconds = JSON.parse(localStorage.getItem("addSeconds"));
  addMinutes = JSON.parse(localStorage.getItem("addMinutes"));

  let addSecondsString = JSON.parse(localStorage.getItem("addSecondsString"));
  let addMinutesString = JSON.parse(localStorage.getItem("addMinutesString"));

  readout = addMinutesString + ":" + addSecondsString;
  document.MyForm.stopwatch.value = readout;

  puzzleBoard = document.getElementById("puzzleboard"); //recalculate
  puzzleBoard.addEventListener("mousedown", handleClick);
  puzzleBoard.addEventListener("contextmenu", (e) => e.preventDefault());

  headline = document.getElementById("headline");
  headline.innerHTML = "continued";
}

let winTableContent = [
  [5, "l4", "08:55"], // row 0
  [5, "l1", "00:55"], // row 1
  [15, "l5", "199:55"], // row 2
  [15, "l3", "21:55"], // row 3
  [10, "l2", "02:05"], // row 4
];

if (localStorage.getItem("winTableContent") !== null) {
  winTableContent = JSON.parse(localStorage.getItem("winTableContent"));
}

function updateWinTableContent(deskSize, deskLevel, readout) {
  winTableContent.push([deskSize, deskLevel, readout]);
  winTableContent.sort((a, b) => {
    return convertTimeToSeconds(a[2]) - convertTimeToSeconds(b[2]);
  });
  for (let i = 0; i < 5; i++) {
    let row = winTable.rows[i + 1];
    let sizeCell = row.cells[0];
    let levelCell = row.cells[1];
    let timeCell = row.cells[2];

    if (i < winTableContent.length) {
      sizeCell.textContent =
        winTableContent[i][0] + " x " + winTableContent[i][0];
      levelCell.textContent = "Leve" + winTableContent[i][1];
      timeCell.textContent = winTableContent[i][2];
    } else {
      sizeCell.innerHTML = "&nbsp;";
      levelCell.innerHTML = "&nbsp;";
      timeCell.innerHTML = "&nbsp;";
    }
  }
  localStorage.setItem("winTableContent", JSON.stringify(winTableContent));
}
function convertTimeToSeconds(time) {
  let [minutes, seconds] = time.split(":");
  return parseInt(minutes) * 60 + parseInt(seconds);
}

updateWinTableContent(10, "l3", "199:99");
document.body.appendChild(document.createElement("br"));
let clearLC = createButton(
  "ClearLC",
  "Carefully Clear Local Storage Keys",
  carefullyClearLocalStorageKeys
);

document.body.appendChild(clearLC);

function carefullyClearLocalStorageKeys() {
  localStorage.removeItem("addMinutes");
  localStorage.removeItem("numberOfRows");
  localStorage.removeItem("deskSize");
  localStorage.removeItem("winTableContent");
  localStorage.removeItem("addMinutesString");
  localStorage.removeItem("addSeconds");
  localStorage.removeItem("numberOfColumns");
  localStorage.removeItem("addSecondsString");
  localStorage.removeItem("board");
  localStorage.removeItem("solution");
  localStorage.removeItem("deskLevel");
}
