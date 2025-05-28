const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 1;
let dy = 0;
let gameInterval = null;

function gameLoop() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Wrap around edges
  head.x = (head.x + tileCount) % tileCount;
  head.y = (head.y + tileCount) % tileCount;

  // Check collision with self
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  // Eat food or remove tail
  if (head.x === food.x && head.y === food.y) {
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = "#d7d77d";
  for (const segment of snake) {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
  }

  // Draw food
  ctx.fillStyle = "#ff6";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function endGame() {
  clearInterval(gameInterval);
  alert("Game Over! Press OK to close this tab.");
  window.close(); // Try to close if it was opened via JS
}

function changeDirection(e) {
  switch (e.key) {
    case "ArrowUp":
    case "w":
      if (dy === 0) { dx = 0; dy = -1; }
      break;
    case "ArrowDown":
    case "s":
      if (dy === 0) { dx = 0; dy = 1; }
      break;
    case "ArrowLeft":
    case "a":
      if (dx === 0) { dx = -1; dy = 0; }
      break;
    case "ArrowRight":
    case "d":
      if (dx === 0) { dx = 1; dy = 0; }
      break;
    case "Escape":
      endGame();
      break;
  }
}

document.addEventListener("keydown", changeDirection);
placeFood();
gameInterval = setInterval(gameLoop, 150);
