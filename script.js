const grid = document.getElementById("grid");

const size = 6;
let cells = [];

// tipe jalur
const types = [
  "│", // vertical
  "─", // horizontal
  "└",
  "┘",
  "┌",
  "┐",
  "┼"
];

// buat grid random
function generate() {
  grid.innerHTML = "";
  cells = [];

  for (let i = 0; i < size * size; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");

    let type = types[Math.floor(Math.random() * types.length)];

    let pipe = document.createElement("div");
    pipe.classList.add("pipe");
    pipe.textContent = type;

    cell.appendChild(pipe);

    cell.addEventListener("click", () => rotate(pipe));

    grid.appendChild(cell);
    cells.push(pipe);
  }

  checkPower();
}

// rotasi jalur
function rotate(pipe) {
  let order = ["│","└","─","┐","│","┘","─","┌"];

  let current = pipe.textContent;
  let next = order[(order.indexOf(current) + 1) % order.length];

  pipe.textContent = next;

  checkPower();
}

// cek koneksi listrik (DFS)
function checkPower() {
  cells.forEach(c => c.parentElement.classList.remove("powered"));

  let visited = new Set();

  function dfs(index) {
    if (visited.has(index)) return;
    visited.add(index);

    let cell = cells[index];
    cell.parentElement.classList.add("powered");

    let x = index % size;
    let y = Math.floor(index / size);

    let neighbors = [
      {i: index-1, cond: x>0},
      {i: index+1, cond: x<size-1},
      {i: index-size, cond: y>0},
      {i: index+size, cond: y<size-1}
    ];

    neighbors.forEach(n => {
      if (n.cond) dfs(n.i);
    });
  }

  dfs(0);

  if (visited.size === size * size) {
    setTimeout(() => {
      alert("⚡ Semua terhubung! Kamu jenius!");
    }, 100);
  }
}

generate();
