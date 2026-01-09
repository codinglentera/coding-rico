// Tetris — Vanilla JS
(() => {
  const width = 10;
  const height = 20;
  const gridSize = width * height;
  const grid = document.getElementById('grid');
  const nextGrid = document.getElementById('next-grid');
  const scoreEl = document.getElementById('score');
  const levelEl = document.getElementById('level');
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  const message = document.getElementById('message');

  let squares = [];
  let miniSquares = [];
  let currentPosition = 3;
  let currentRotation = 0;
  let timerId = null;
  let score = 0;
  let level = 1;
  let linesCleared = 0;
  let isPaused = false;
  let gameOver = false;

  // create main grid cells
  for (let i = 0; i < gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    grid.appendChild(cell);
    squares.push(cell);
  }

  // create mini-grid for next piece (4x4)
  for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    nextGrid.appendChild(cell);
    miniSquares.push(cell);
  }

  // Tetrominoes (indexes relative to top-left of 4x)
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, 1, 2],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, 1, 2]
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ];

  const jTetromino = [
    [2, width + 2, width * 2 + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ];

  const sTetromino = [
    [1, width + 1, width + 2, width * 2 + 2],
    [width + 1, width * 2 + 1, 0 + width * 1, 1],
    [1, width + 1, width + 2, width * 2 + 2],
    [width + 1, width * 2 + 1, 0 + width * 1, 1]
  ];

  const theTetrominoes = [
    { shapes: lTetromino, class: 'tet-l' },
    { shapes: zTetromino, class: 'tet-z' },
    { shapes: tTetromino, class: 'tet-t' },
    { shapes: oTetromino, class: 'tet-o' },
    { shapes: iTetromino, class: 'tet-i' },
    { shapes: jTetromino, class: 'tet-j' },
    { shapes: sTetromino, class: 'tet-s' }
  ];

  // next and current indexes
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let nextRandom = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random].shapes[currentRotation];
  let currentClass = theTetrominoes[random].class;

  function draw() {
    current.forEach(index => {
      const pos = currentPosition + index;
      if (squares[pos]) {
        squares[pos].classList.add(currentClass);
      }
    });
  }

  function undraw() {
    current.forEach(index => {
      const pos = currentPosition + index;
      if (squares[pos]) {
        squares[pos].classList.remove(currentClass);
      }
    });
  }

  function validMove(position = currentPosition, rotation = currentRotation) {
    const shape = theTetrominoes[random].shapes[rotation];
    return shape.every(i => {
      const pos = position + i;
      const x = (pos % width + width) % width;
      const y = Math.floor(pos / width);
      // out of bounds bottom
      if (y >= height) return false;
      // collision with merged block
      return !squares[pos] || !squares[pos].classList.contains('merged');
    });
  }

  function moveDown() {
    if (gameOver || isPaused) return;
    undraw();
    currentPosition += width;
    if (!validMove()) {
      currentPosition -= width;
      freeze();
    } else {
      draw();
    }
  }

  function freeze() {
    current.forEach(i => {
      const pos = currentPosition + i;
      if (!squares[pos]) return;
      squares[pos].classList.add('merged');
      squares[pos].classList.add(currentClass);
    });

    // check for game over: pieces at top
    if (currentPosition <= 3) {
      endGame();
      return;
    }

    // clear full rows
    for (let row = 0; row < height; row++) {
      const rowStart = row * width;
      const rowIndices = Array.from({ length: width }, (_, i) => rowStart + i);
      const isFull = rowIndices.every(idx => squares[idx].classList.contains('merged'));
      if (isFull) {
        // remove classes and shift
        rowIndices.forEach(idx => {
          squares[idx].className = 'cell';
        });
        // move everything above down
        const removed = squares.splice(rowStart, width);
        const newCells = removed.map(() => {
          const cell = document.createElement('div');
          cell.className = 'cell';
          return cell;
        });
        // insert empty row at top
        squares = newCells.concat(squares);
        // re-render grid DOM
        grid.innerHTML = '';
        squares.forEach(s => grid.appendChild(s));
        // rebind merged classes might be lost; ensure merged class persistence was handled by recreating empty cells
        // (we recreated exact structure so pieces moved down)
        // update score
        linesCleared++;
        score += 100 * level;
        if (linesCleared % 10 === 0) {
          level++;
        }
        scoreEl.textContent = score;
        levelEl.textContent = level;
      }
    }

    // next piece
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    currentRotation = 0;
    currentPosition = 3;
    current = theTetrominoes[random].shapes[currentRotation];
    currentClass = theTetrominoes[random].class;

    draw();
    displayNext();
  }

  function moveLeft() {
    if (gameOver || isPaused) return;
    undraw();
    const atLeftEdge = current.some(i => (currentPosition + i) % width === 0);
    if (!atLeftEdge) currentPosition -= 1;
    if (!validMove()) currentPosition += 1;
    draw();
  }

  function moveRight() {
    if (gameOver || isPaused) return;
    undraw();
    const atRightEdge = current.some(i => (currentPosition + i) % width === width - 1);
    if (!atRightEdge) currentPosition += 1;
    if (!validMove()) currentPosition -= 1;
    draw();
  }

  function rotate() {
    if (gameOver || isPaused) return;
    undraw();
    const nextRotation = (currentRotation + 1) % 4;
    if (validMove(currentPosition, nextRotation)) {
      currentRotation = nextRotation;
      current = theTetrominoes[random].shapes[currentRotation];
    } else {
      // try wall kick (simple)
      if (validMove(currentPosition - 1, nextRotation)) {
        currentPosition -= 1;
        currentRotation = nextRotation;
        current = theTetrominoes[random].shapes[currentRotation];
      } else if (validMove(currentPosition + 1, nextRotation)) {
        currentPosition += 1;
        currentRotation = nextRotation;
        current = theTetrominoes[random].shapes[currentRotation];
      }
    }
    draw();
  }

  function hardDrop() {
    if (gameOver || isPaused) return;
    undraw();
    while (true) {
      currentPosition += width;
      if (!validMove()) {
        currentPosition -= width;
        break;
      }
    }
    draw();
    freeze();
  }

  function displayNext() {
    // clear mini-grid
    miniSquares.forEach(cell => {
      cell.className = 'cell';
    });
    // draw nextRandom shape in mini grid (4x4)
    const shape = theTetrominoes[nextRandom].shapes[0];
    const cls = theTetrominoes[nextRandom].class;
    // center in mini grid: use offset 5 to center shapes roughly
    const offset = 1;
    shape.forEach(idx => {
      const pos = offset + idx;
      if (miniSquares[pos]) miniSquares[pos].classList.add(cls);
    });
  }

  function startGame() {
    resetGrid();
    score = 0;
    level = 1;
    linesCleared = 0;
    isPaused = false;
    gameOver = false;
    scoreEl.textContent = score;
    levelEl.textContent = level;
    random = Math.floor(Math.random() * theTetrominoes.length);
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    currentRotation = 0;
    currentPosition = 3;
    current = theTetrominoes[random].shapes[currentRotation];
    currentClass = theTetrominoes[random].class;
    draw();
    displayNext();
    clearInterval(timerId);
    timerId = setInterval(moveDown, 800 - (level - 1) * 60);
    message.classList.add('hidden');
  }

  function resetGrid() {
    // rebuild grid cells
    grid.innerHTML = '';
    squares = [];
    for (let i = 0; i < gridSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      grid.appendChild(cell);
      squares.push(cell);
    }
  }

  function pauseResume() {
    if (gameOver) return;
    isPaused = !isPaused;
    if (isPaused) {
      clearInterval(timerId);
      message.textContent = 'Paused';
      message.classList.remove('hidden');
    } else {
      timerId = setInterval(moveDown, Math.max(100, 800 - (level - 1) * 60));
      message.classList.add('hidden');
    }
  }

  function endGame() {
    gameOver = true;
    clearInterval(timerId);
    message.textContent = `Game Over — Score: ${score}`;
    message.classList.remove('hidden');
  }

  // controls
  document.addEventListener('keydown', e => {
    if (gameOver) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveLeft();
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveRight();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      // soft drop (faster)
      undraw();
      currentPosition += width;
      if (!validMove()) {
        currentPosition -= width;
        freeze();
      }
      draw();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      rotate();
    }
    if (e.code === 'Space') {
      e.preventDefault();
      hardDrop();
    }
    if (e.key.toLowerCase() === 'p') {
      pauseResume();
    }
  });

  startBtn.addEventListener('click', () => {
    startGame();
    startBtn.blur();
  });
  pauseBtn.addEventListener('click', () => {
    pauseResume();
    pauseBtn.blur();
  });

  // initial display
  displayNext();
})();
