const boardElement = document.getElementById("chessboard");
const turnText = document.getElementById("turn");

let selectedSquare = null;
let currentTurn = "white";

const pieces = {
  r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",
  R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙"
};

let board = [
  ["r","n","b","q","k","b","n","r"],
  ["p","p","p","p","p","p","p","p"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["P","P","P","P","P","P","P","P"],
  ["R","N","B","Q","K","B","N","R"]
];

// ================= RENDER =================
function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((row, y) => {
    row.forEach((piece, x) => {
      const square = document.createElement("div");
      square.classList.add("square");
      square.classList.add((x + y) % 2 === 0 ? "white" : "black");
      square.dataset.x = x;
      square.dataset.y = y;
      square.textContent = pieces[piece] || "";
      square.addEventListener("click", () => onSquareClick(x, y));
      boardElement.appendChild(square);
    });
  });
}

// ================= LOGIC =================
function onSquareClick(x, y) {
  const piece = board[y][x];

  if (selectedSquare) {
    if (isValidMove(selectedSquare.x, selectedSquare.y, x, y)) {
      movePiece(selectedSquare.x, selectedSquare.y, x, y);
      currentTurn = currentTurn === "white" ? "black" : "white";
      turnText.textContent = "Giliran: " + (currentTurn === "white" ? "Putih" : "Hitam");
    }
    selectedSquare = null;
    renderBoard();
  } else if (piece && isCorrectTurn(piece)) {
    selectedSquare = { x, y };
    highlightSquare(x, y);
  }
}

function isCorrectTurn(piece) {
  return currentTurn === "white"
    ? piece === piece.toUpperCase()
    : piece === piece.toLowerCase();
}

function movePiece(fromX, fromY, toX, toY) {
  board[toY][toX] = board[fromY][fromX];
  board[fromY][fromX] = "";
}

// ================= MOVE VALIDATION =================
function isValidMove(fx, fy, tx, ty) {
  const piece = board[fy][fx];
  if (!piece) return false;

  const dx = tx - fx;
  const dy = ty - fy;
  const target = board[ty][tx];

  if (target && isSameColor(piece, target)) return false;

  switch (piece.toLowerCase()) {
    case "p": return pawnMove(piece, fx, fy, tx, ty);
    case "r": return rookMove(fx, fy, tx, ty);
    case "n": return knightMove(dx, dy);
    case "b": return bishopMove(fx, fy, tx, ty);
    case "q": return rookMove(fx, fy, tx, ty) || bishopMove(fx, fy, tx, ty);
    case "k": return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
  }
  return false;
}

function pawnMove(piece, fx, fy, tx, ty) {
  const dir = piece === piece.toUpperCase() ? -1 : 1;
  if (fx === tx && board[ty][tx] === "" && ty === fy + dir) return true;
  return false;
}

function rookMove(fx, fy, tx, ty) {
  if (fx !== tx && fy !== ty) return false;
  return clearPath(fx, fy, tx, ty);
}

function bishopMove(fx, fy, tx, ty) {
  if (Math.abs(tx - fx) !== Math.abs(ty - fy)) return false;
  return clearPath(fx, fy, tx, ty);
}

function knightMove(dx, dy) {
  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
         (Math.abs(dx) === 1 && Math.abs(dy) === 2);
}

function clearPath(fx, fy, tx, ty) {
  const stepX = Math.sign(tx - fx);
  const stepY = Math.sign(ty - fy);
  let x = fx + stepX;
  let y = fy + stepY;
  while (x !== tx || y !== ty) {
    if (board[y][x] !== "") return false;
    x += stepX;
    y += stepY;
  }
  return true;
}

function isSameColor(a, b) {
  return (a === a.toUpperCase()) === (b === b.toUpperCase());
}

// ================= UI =================
function highlightSquare(x, y) {
  renderBoard();
  const squares = document.querySelectorAll(".square");
  squares.forEach(s => {
    if (s.dataset.x == x && s.dataset.y == y) {
      s.classList.add("selected");
    }
  });
}

// ================= START =================
renderBoard();
