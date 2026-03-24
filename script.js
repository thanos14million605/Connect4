const ROWS = 6;
const COLS = 7;

let board = [];
let currentPlayer = 1;
let gameOver = false;

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");

// Initialize board
function initBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  boardEl.innerHTML = "";

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.className =
        "w-12 h-12 md:w-16 md:h-16 bg-white rounded-full cursor-pointer flex items-center justify-center";
      cell.dataset.col = c;
      cell.addEventListener("click", handleMove);
      boardEl.appendChild(cell);
    }
  }
}

// Handle player move
function handleMove(e) {
  if (gameOver) return;

  const col = parseInt(e.target.dataset.col);

  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) {
      board[r][col] = currentPlayer;
      updateUI();

      if (checkWin(r, col)) {
        statusEl.textContent = `Player ${currentPlayer} Wins! 🎉`;
        gameOver = true;
        return;
      }

      if (board.flat().every((cell) => cell !== 0)) {
        statusEl.textContent = "It's a Draw!";
        gameOver = true;
        return;
      }

      currentPlayer = currentPlayer === 1 ? 2 : 1;
      statusEl.textContent = `Player ${currentPlayer}'s Turn (${
        currentPlayer === 1 ? "Red" : "Yellow"
      })`;
      return;
    }
  }
}

// Update UI
function updateUI() {
  const cells = boardEl.children;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const index = r * COLS + c;
      const cell = cells[index];

      cell.classList.remove("bg-red-500", "bg-yellow-400", "bg-white");

      if (board[r][c] === 1) {
        cell.classList.add("bg-red-500");
      } else if (board[r][c] === 2) {
        cell.classList.add("bg-yellow-400");
      } else {
        cell.classList.add("bg-white");
      }
    }
  }
}

// Check win condition
function checkWin(row, col) {
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal \
    [1, -1], // diagonal /
  ];

  for (let [dr, dc] of directions) {
    let count = 1;

    count += countDirection(row, col, dr, dc);
    count += countDirection(row, col, -dr, -dc);

    if (count >= 4) return true;
  }

  return false;
}

// Count consecutive discs
function countDirection(row, col, dr, dc) {
  let r = row + dr;
  let c = col + dc;
  let count = 0;

  while (
    r >= 0 &&
    r < ROWS &&
    c >= 0 &&
    c < COLS &&
    board[r][c] === currentPlayer
  ) {
    count++;
    r += dr;
    c += dc;
  }

  return count;
}

// Reset game
function resetGame() {
  currentPlayer = 1;
  gameOver = false;
  statusEl.textContent = "Player 1's Turn (Red)";
  initBoard();
}

// Start game
initBoard();
