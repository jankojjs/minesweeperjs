// Create top controls
const topWrapper = document.createElement("div");
topWrapper.classList.add("floater-wrapper");
canvas.prepend(topWrapper);

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

board.addEventListener("click", () => {
  if (firstClick) {
    timerDiv.innerHTML = "000";
    firstClick = false;
    setInterval(function () {
      gameRunning && timer();
    }, 1000);
  }
});

//  Create bottom controls div
const bottomWrapper = document.createElement("div");
bottomWrapper.classList.add("floater-wrapper");
bottomWrapper.classList.add("floater-wrapper-bottom");
canvas.appendChild(bottomWrapper);

const versionDiv2 = document.createElement("div");
// versionDiv2.classList.add("floater");
// versionDiv2.classList.add("floater-small");
// versionDiv2.innerHTML = "version 1.32";
bottomWrapper.appendChild(versionDiv2);

const versionDiv = document.createElement("div");
versionDiv.classList.add("floater-mid");
versionDiv.classList.add("floater-small");
versionDiv.innerHTML = "ver 1.0.2";
bottomWrapper.appendChild(versionDiv);

const settingsDiv = document.createElement("a");
settingsDiv.classList.add("floater-right");
settingsDiv.href = "settings.html";
settingsDiv.innerHTML = "⚙️";
bottomWrapper.appendChild(settingsDiv);
