const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20, tileSize = canvas.width / gridSize;
let snake = [{x: 10, y: 10}], direction = 'right', food = {}, score = 0, playing = false;

// Place food randomly
function placeFood() {
  food.x = Math.floor(Math.random() * gridSize);
  food.y = Math.floor(Math.random() * gridSize);
}

// Draw everything
function draw() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = 'lime';
  snake.forEach(cell =>
    ctx.fillRect(cell.x * tileSize, cell.y * tileSize, tileSize, tileSize)
  );

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

// Move snake
function move() {
  if (!playing) return;
  let head = {...snake};
  if (direction === 'right') head.x++;
  if (direction === 'left') head.x--;
  if (direction === 'up') head.y--;
  if (direction === 'down') head.y++;

  // Game over?
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || snake.some(c => c.x === head.x && c.y === head.y)) {
    playing = false;
    alert('Game Over! Score: ' + score);
    return;
  }

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').textContent = `Score: ${score}`;
    snake.unshift(head);
    placeFood();
  } else {
    snake.pop();
    snake.unshift(head);
  }
}

placeFood();
draw();
setInterval(() => { if (playing) { move(); draw(); } }, 120);

// Start/pause, double-click logic, swipe logic
let clickTimeout;
canvas.addEventListener('click', function(e) {
  clickTimeout = setTimeout(function() {
    playing = !playing; // Single click starts or pauses
  }, 250);
});

canvas.addEventListener('dblclick', function(e) {
  clearTimeout(clickTimeout);
  // Double click: Speed boost
  if (playing) {
    for (let i = 0; i < 2; i++) move();
    draw();
  }
});

// Swipe support (touch)
let startX, startY;
canvas.addEventListener('touchstart', function(e) {
  const t = e.touches;
  startX = t.clientX;
  startY = t.clientY;
});

canvas.addEventListener('touchend', function(e) {
  const t = e.changedTouches;
  const dx = t.clientX - startX, dy = t.clientY - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) direction = 'right';
    else if (dx < -30) direction = 'left';
  } else {
    if (dy > 30) direction = 'down';
    else if (dy < -30) direction = 'up';
  }
});

// Allow arrow key controls too
document.addEventListener('keydown', function(e) {
  if (!playing) return;
  if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
  if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
  if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
  if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});
