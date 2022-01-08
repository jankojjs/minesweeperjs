// Initial settings
const COLS = 10;
const ROWS = 10;
const PX = 40;
const COLORS = ["rainbow", "blue", "green", "red", "darkblue"];

let gameRunning = true;
let firstClick = true;
let second = 0;
let bombs = [];
let flagged = [];
let revealed = [];
let valued = [];

// Create canvas
const canvas = document.createElement("div");
canvas.setAttribute("id", "canvas");
document.body.appendChild(canvas);

// Create board
const board = document.createElement("div");
board.setAttribute("id", "board");
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
              winCheck() && endScreen("You Win!");
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
  alert(screenMsg);
  let unrevealeds = Array.from(document.querySelectorAll(".unrevealed"));
  unrevealeds.map((item) => {
    item.classList.remove("unrevealed");
  });
  gameRunning = false;
}

const topWrapper = document.createElement("div");
topWrapper.classList.add("floater-wrapper");
board.appendChild(topWrapper);

const bombCounterDiv = document.createElement("div");
bombCounterDiv.classList.add("floater");
bombCounterDiv.innerHTML = bombs.length;
topWrapper.appendChild(bombCounterDiv);

const refreshIconDiv = document.createElement("div");
refreshIconDiv.classList.add("floater-mid");
refreshIconDiv.innerHTML = "😃";
topWrapper.appendChild(refreshIconDiv);
refreshIconDiv.addEventListener("click", () => {
  window.top.location.reload(true);
});

const timerDiv = document.createElement("div");
timerDiv.classList.add("floater-right");
timerDiv.innerHTML = 999;
topWrapper.appendChild(timerDiv);

function changeSmileyOnClick() {
  refreshIconDiv.innerHTML = "😜";
  setTimeout(function () {
    refreshIconDiv.innerHTML = "😃";
  }, 300);
}

function timer() {
  timerDiv.innerHTML = parseInt(timerDiv.innerHTML) + 1;
  if (parseInt(timerDiv.innerHTML) < 10) {
    timerDiv.innerHTML = "00" + timerDiv.innerHTML;
    return;
  }
  if (parseInt(timerDiv.innerHTML) < 100) {
    timerDiv.innerHTML = "0" + timerDiv.innerHTML;
    return;
  }
}

canvas.addEventListener("click", () => {
  if (firstClick) {
    timerDiv.innerHTML = "000";
    setInterval(function () {
      firstClick = false;
      gameRunning && timer();
    }, 1000);
  }
});
