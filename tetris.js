const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

// Skala agar kotak terlihat besar
ctx.scale(20, 20);

// Ukuran arena
const arena = createMatrix(12, 20);

// Warna blok
const colors = [
  null,
  "#ff0d72",
  "#0dc2ff",
  "#0dff72",
  "#f538ff",
  "#ff8e0d",
  "#ffe138",
  "#3877ff"
];

// Player
const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0
};

// ==================== FUNGSI DASAR ====================
function createMatrix(w, h) {
  cons
