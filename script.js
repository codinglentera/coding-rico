const grid = document.getElementById("grid");
const movesDisplay = document.getElementById("moves");

let size = 6;
let moves = 15;
let start = 0;
let finish = size * size - 1;

let cells = [];

// buat grid
function createGrid() {
  grid.innerHTML = "";
  cells = [];

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if (i === start) cell.classList.add("start");
    if (i === finish) cell.classList.add("finish");

    // random block
    if (Math.random() < 0.2 && i !== start && i !== finish) {
      cell.classList.add("block");
    }

    cell.addEventListener("click", () => handleClick(i));
    grid.appendChild(cell);
    cells.push(cell);
  }
}

// klik untuk bikin jalur
function handleClick(index) {
  if (moves <= 0) return;

  const cell = cells[index];

  if (cell.classList.contains("block") ||
      cell.classList.contains("start") ||
      cell.classList.contains("finish")) return;

  if (!cell.classList.contains("path")) {
    cell.classList.add("path");
    moves--;
    movesDisplay.textContent = moves;
  }

  checkWin();
}

// cek jalur nyambung
function checkWin() {
  let visited = new Set();

  function dfs(index) {
    if (index === finish) return true;
    if (visited.has(index)) return false;

    visited.add(index);

    let neighbors = [
      index - 1,
      index + 1,
      index - size,
      index + size
    ];

    for (let n of neighbors) {
      if (n >= 0 && n < size * size) {
        let cell = cells[n];

        if (
          cell.classList.contains("path") ||
          cell.classList.contains("finish")
        ) {
          if (dfs(n)) return true;
        }
      }
    }

    return false;
  }

  if (dfs(start)) {
    setTimeout(() => {
      alert("🎉 Kamu Menang!");
      resetGame();
    }, 100);
  }
}

// reset game
function resetGame() {
  moves = 15;
  movesDisplay.textContent = moves;
  createGrid();
}

createGrid();
