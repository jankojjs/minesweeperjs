const { ipcRenderer } = require('electron');
let COLS, ROWS;
const GAMEMODE = localStorage.getItem('gamemode');
switch (GAMEMODE) {
  case 'medium':
    COLS = 20;
    ROWS = 10;
    ipcRenderer.send('resize-window', 940, 595)
    break;
  case 'hard':
    COLS = 30;
    ROWS = 15;
    ipcRenderer.send('resize-window', 1380, 800)
    break;
  default:
    COLS = 10;
    ROWS = 10;
    ipcRenderer.send('resize-window', 520, 595)
}

// Initial settings
const PX = 40;
const COLORS = ["rainbow", "blue", "green", "red", "darkblue"];

let gameRunning = true;
let firstClick = true;
let second = 0;
let bombs = [];
let flagged = [];
let revealed = [];
let valued = [];

// Create card
const card = document.createElement("div");
card.classList.add("card");
document.body.appendChild(card);

// Create canvas
const canvas = document.createElement("div");
canvas.setAttribute("id", "canvas");
card.appendChild(canvas);

// Create board
const board = document.createElement("div");
board.setAttribute("id", "board");
board.style = `grid-template-columns: repeat(${COLS}, 1fr)`;
canvas.appendChild(board);

// Style board
board.classList.add("board");

// Create fields
for (let i = 0; i < ROWS; i++) {
  for (let j = 0; j < COLS; j++) {
    let row = i + 1;
    let column = j + 1;
    let fieldId = "r" + row + "c" + column;

    // Random number 💣🚩
    let randomNumber = Math.floor(Math.random() * 10) + 1;
    let isBomb = randomNumber === 9;
    if (isBomb) {
      bombs.push(fieldId);
    }

    let fieldValue = 0;

    // Create field
    let field = document.createElement("div");

    // Style field
    field.classList.add("field", "unrevealed");

    field.setAttribute("id", fieldId);
    if (isBomb) {
      field.innerHTML = "💣";
    } else {
      fieldValue === 0
        ? (field.innerHTML = "")
        : (field.innerHTML = fieldValue);
    }

    // Flag logic
    field.addEventListener(
      "contextmenu",
      function (ev) {
        ev.preventDefault();
        if (field.classList.contains("unrevealed")) {
          if (field.classList.contains("flagged") === false) {
            if (flagged.length < bombs.length) {
              field.classList.add("flagged");
              flagged.push(field.getAttribute("id"));
              bombCounterDiv.innerHTML = parseInt(bombCounterDiv.innerHTML) - 1;
              if (winCheck()) {
                showYouWin();
                createFireworks();
              }
            }
          } else {
            let classIndex = flagged.indexOf(field.getAttribute("id"));
            flagged.splice(classIndex, 1);
            bombCounterDiv.innerHTML = parseInt(bombCounterDiv.innerHTML) + 1;
            field.classList.remove("flagged");
          }
        }
        return false;
      },
      false
    );

    board.appendChild(field);
  }
}

function getNeighbours(fieldId) {
  const fieldRow = parseInt(
    fieldId.substring(fieldId.indexOf("r") + 1, fieldId.lastIndexOf("c"))
  );
  const fieldCol = parseInt(fieldId.substring(fieldId.indexOf("c") + 1));
  const neightbour1 = "r" + (fieldRow - 1) + "c" + (fieldCol - 1);
  const neightbour2 = "r" + (fieldRow - 1) + "c" + fieldCol;
  const neightbour3 = "r" + (fieldRow - 1) + "c" + (fieldCol + 1);
  const neightbour4 = "r" + fieldRow + "c" + (fieldCol - 1);
  const neightbour5 = "r" + fieldRow + "c" + (fieldCol + 1);
  const neightbour6 = "r" + (fieldRow + 1) + "c" + (fieldCol - 1);
  const neightbour7 = "r" + (fieldRow + 1) + "c" + fieldCol;
  const neightbour8 = "r" + (fieldRow + 1) + "c" + (fieldCol + 1);
  const neightbours = [
    neightbour1,
    neightbour2,
    neightbour3,
    neightbour4,
    neightbour5,
    neightbour6,
    neightbour7,
    neightbour8,
  ];
  return neightbours;
}

bombs.forEach((bomb) => {
  getNeighbours(bomb).forEach((item) => {
    valued.push(item);
  });
});

calcValues(valued);

function calcValues(valued) {
  valued.map((valueItem) => {
    let valueDiv = document.querySelector("#" + valueItem);
    if (valueDiv && valueDiv.innerHTML !== "💣") {
      if (valueDiv.innerHTML === "") {
        valueDiv.innerHTML = 1;
      } else {
        valueDiv.innerHTML = parseInt(valueDiv.innerHTML) + 1;
      }
      valueDiv.style.color = COLORS[valueDiv.innerHTML];
    }
  });
}

let unrevealeds = Array.from(document.querySelectorAll(".unrevealed"));
unrevealeds.forEach((item) => {
  item.addEventListener("click", function () {
    reveal(item);
    changeSmileyOnClick();
    // Game over action
    item.innerHTML === "💣" && gameRunning && endScreen("Game Over");
  });
});

function reveal(key) {
  if (key) {
    key.classList.remove("unrevealed");
    if (flagged.includes(key.getAttribute("id"))) {
      var classIndex2 = flagged.indexOf(key.getAttribute("id"));
      flagged.splice(classIndex2, 1);
      bombCounterDiv.innerHTML = parseInt(bombCounterDiv.innerHTML) + 1;
      key.classList.remove("flagged");
    }
    if (!revealed.includes(key.getAttribute("id"))) {
      addToRevealed(key);
    }
  }
}

function addToRevealed(key) {
  revealed.push(key.getAttribute("id"));
  if (key.innerHTML === "") {
    let itemNeighbours = getNeighbours(key.getAttribute("id"));
    itemNeighbours.map((item) => {
      reveal(document.getElementById(item));
    });
  }
}

function winCheck() {
  if (bombs.length === flagged.length) {
    let conditionMet = 0;
    for (let k = 0; k < bombs.length; k++) {
      bombs.includes(flagged[k]) && (conditionMet = conditionMet + 1);
    }
    return conditionMet === bombs.length;
  }
}

function endScreen(screenMsg) {
  screenMsg && alert(screenMsg);
  let unrevealeds = Array.from(document.querySelectorAll(".unrevealed"));
  unrevealeds.map((item) => {
    item.classList.remove("unrevealed");
  });
  gameRunning = false;
}

/** Set theme */
function setTheme() {
  let currentTheme = localStorage.getItem('theme');
  if (!currentTheme) currentTheme = 'light';
  if (currentTheme === 'light') document.querySelector(":root").classList.add("dark");
  if (currentTheme === 'dark') document.querySelector(":root").classList.remove("dark");
}

setTheme();

function showYouWin() {
  const youWin = document.createElement('div');
  youWin.innerHTML = "You Win";
  youWin.classList.add('you-win');
  document.body.appendChild(youWin);
  endScreen();
}

function createFireworks() {
  const pyro = document.createElement('div');
  pyro.classList.add('pyro');
  const pyroBefore = document.createElement('div');
  pyroBefore.classList.add('before');
  const pyroAfter = document.createElement('div');
  pyroAfter.classList.add('after');
  document.body.appendChild(pyro);
  pyro.appendChild(pyroBefore);
  pyro.appendChild(pyroAfter);
}