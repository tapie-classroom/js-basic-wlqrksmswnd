const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const BestScoreDisplay = document.getElementById("BestScore");
const BestScore = localStorage.getItem("BestScore") || 0;
let tiles = [];
let score = 0;
BestScoreDisplay.textContent = BestScore;

function init() {
  for (let i = 0; i < 16; i++) {
    const tile = document.createElement("div");
    tile.classList.add("cell");
    tile.textContent = "";
    tiles.push(tile);
    grid.appendChild(tile);
  }


  generateTile();
  generateTile();
  updateUI();
}


function generateTile() {
  const emptyTiles = tiles.filter(tile => tile.textContent === "");
  if (emptyTiles.length === 0) return;

  const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  randomTile.textContent = Math.random() < 0.9 ? "2" : "4";
}

function updateUI() {
  tiles.forEach(tile => {
    const value = tile.textContent;
    tile.className = "cell";
    if (value) {
      tile.classList.add("tile-" + value); 
    }
  });
  scoreDisplay.textContent = score;
}


document.addEventListener("keydown", handleKey);

function handleKey(e) {
  switch (e.key) {
    case "ArrowLeft":
      move("left");
      break;
    case "ArrowRight":
      move("right");
      break;
    case "ArrowUp":
      move("up");
      break;
    case "ArrowDown":
      move("down");
      break;
  }
}


init();

function move(direction) {
    let moved = false;
    const getIndex = (row, col) => row * 4 + col;
  
    for (let i = 0; i < 4; i++) {
      let values = [];
  

      for (let j = 0; j < 4; j++) {
        let row = i, col = j;
        if (direction === "right") col = 3 - j;
        if (direction === "up") [row, col] = [j, i];
        if (direction === "down") [row, col] = [3 - j, i];
  
        const index = getIndex(row, col);
        const value = tiles[index].textContent;
        if (value !== "") values.push(Number(value));
      }
  

      for (let k = 0; k < values.length - 1; k++) {
        if (values[k] === values[k + 1]) {
          values[k] *= 2;
          score += values[k];
          values.splice(k + 1, 1);
        }
      }
  
      while (values.length < 4) {
        values.push("");
      }
  

      for (let j = 0; j < 4; j++) {
        let row = i, col = j;
        if (direction === "right") col = 3 - j;
        if (direction === "up") [row, col] = [j, i];
        if (direction === "down") [row, col] = [3 - j, i];
  
        const index = getIndex(row, col);
        if (tiles[index].textContent != values[j]) {
          moved = true;
          tiles[index].textContent = values[j] ? values[j] : "";
        }
      }
    }
  
    if (moved) {
      generateTile();
      updateUI();
      checkGameOver();
    }
  }
  
  function checkGameOver() {

    if (tiles.some(tile => tile.textContent === "")) return;
  

    const getValue = (row, col) => {
      if (row < 0 || row >= 4 || col < 0 || col >= 4) return null;
      return tiles[row * 4 + col].textContent;
    };
  
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = getValue(row, col);
        const right = getValue(row, col + 1);
        const down = getValue(row + 1, col);
  
        if (current === right || current === down) return;
      }
    }
  
    setTimeout(() => {
      alert("Game Over!");
    }, 100);
  }
  
  document.getElementById("restart").addEventListener("click", restartGame);

function restartGame() {

    if (score > BestScore) {
        localStorage.setItem("BestScore", score);
        BestScoreDisplay.textContent = localStorage.getItem(BestScore);

    }
  score = 0;
  scoreDisplay.textContent = score;
  
  
  tiles.forEach(tile => {
    tile.textContent = "";
  });

  generateTile();
  generateTile();
  updateUI();
}
