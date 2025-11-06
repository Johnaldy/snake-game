// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Game variables
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let obstacles = []; // Array to store obstacles
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop = null;
let isPaused = false;
let gameSpeed = 250; // milliseconds - starting speed (slower)
const minSpeed = 50; // minimum speed (fastest)
const speedIncrement = 5; // speed increase per food eaten

// UI elements
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');

// Initialize high score display
highScoreElement.textContent = highScore;

// Keyboard controls
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
    // Prevent default arrow key behavior (scrolling)
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }

    // Arrow keys
    if (e.key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (e.key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (e.key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (e.key === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
    
    // WASD keys
    if (e.key === 'w' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (e.key === 's' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (e.key === 'a' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (e.key === 'd' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
}

// Button event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', resetGame);

function startGame() {
    if (!gameLoop) {
        gameSpeed = 150; // Reset to starting speed
        gameLoop = setInterval(update, gameSpeed);
        startBtn.textContent = 'Restart';
    } else {
        resetGame();
    }
}

function togglePause() {
    if (gameLoop) {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
    }
}

function resetGame() {
    // Reset game state
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    obstacles = []; // Clear obstacles
    gameSpeed = 150; // Reset to starting speed
    scoreElement.textContent = score;
    gameOverElement.classList.add('hidden');
    
    // Clear existing game loop
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    
    // Start new game
    spawnFood();
    gameLoop = setInterval(update, gameSpeed);
    isPaused = false;
    pauseBtn.textContent = 'Pause';
    startBtn.textContent = 'Restart';
}

function update() {
    if (isPaused) return;
    
    moveSnake();
    
    if (checkCollision()) {
        endGame();
        return;
    }
    
    if (checkFoodCollision()) {
        eatFood();
    }
    
    // Move obstacles randomly after score 200
    if (score >= 200) {
        moveObstacles();
    }
    
    draw();
}

function moveSnake() {
    // Create new head position
    let newX = snake[0].x + direction.x;
    let newY = snake[0].y + direction.y;
    
    // Wrap around walls (teleport to other side)
    if (newX < 0) newX = tileCount - 1;
    if (newX >= tileCount) newX = 0;
    if (newY < 0) newY = tileCount - 1;
    if (newY >= tileCount) newY = 0;
    
    const head = { x: newX, y: newY };
    
    // Add new head to front of snake
    snake.unshift(head);
    
    // Remove tail (unless we just ate food)
    snake.pop();
}

function checkCollision() {
    const head = snake[0];
    
    // No wall collision check - snake wraps around!
    
    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    // Check obstacle collision
    for (let obstacle of obstacles) {
        if (head.x === obstacle.x && head.y === obstacle.y) {
            return true;
        }
    }
    
    return false;
}

function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

function eatFood() {
    // Increase score
    score += 10;
    scoreElement.textContent = score;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
    
    // Grow snake (add segment at tail)
    const tail = snake[snake.length - 1];
    snake.push({ ...tail });
    
    // Add obstacles at score 50 and every 50 points after
    if (score >= 50 && score % 50 === 0) {
        spawnObstacle();
    }
    
    // Increase game speed gradually
    if (gameSpeed > minSpeed) {
        gameSpeed = Math.max(minSpeed, gameSpeed - speedIncrement);
        
        // Restart game loop with new speed
        clearInterval(gameLoop);
        gameLoop = setInterval(update, gameSpeed);
    }
    
    // Spawn new food
    spawnFood();
}

function spawnFood() {
    let newFood;
    let validPosition = false;
    
    // Keep trying until we find a position not occupied by snake or obstacles
    while (!validPosition) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        validPosition = !snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
        ) && !obstacles.some(obstacle =>
            obstacle.x === newFood.x && obstacle.y === newFood.y
        );
    }
    
    food = newFood;
}

function spawnObstacle() {
    let newObstacle;
    let validPosition = false;
    
    // Keep trying until we find a position not occupied by snake, food, or other obstacles
    while (!validPosition) {
        newObstacle = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        validPosition = !snake.some(segment => 
            segment.x === newObstacle.x && segment.y === newObstacle.y
        ) && !(food.x === newObstacle.x && food.y === newObstacle.y)
          && !obstacles.some(obstacle =>
            obstacle.x === newObstacle.x && obstacle.y === newObstacle.y
        );
    }
    
    obstacles.push(newObstacle);
}

function moveObstacles() {
    // Move each obstacle randomly (20% chance per frame to move)
    obstacles.forEach(obstacle => {
        if (Math.random() < 0.2) { // 20% chance to move
            let newPosition;
            let validPosition = false;
            let attempts = 0;
            const maxAttempts = 10;
            
            // Try to find a valid adjacent position
            while (!validPosition && attempts < maxAttempts) {
                // Random direction: 0=up, 1=right, 2=down, 3=left
                const direction = Math.floor(Math.random() * 4);
                
                newPosition = { x: obstacle.x, y: obstacle.y };
                
                switch(direction) {
                    case 0: newPosition.y -= 1; break; // up
                    case 1: newPosition.x += 1; break; // right
                    case 2: newPosition.y += 1; break; // down
                    case 3: newPosition.x -= 1; break; // left
                }
                
                // Wrap around walls
                if (newPosition.x < 0) newPosition.x = tileCount - 1;
                if (newPosition.x >= tileCount) newPosition.x = 0;
                if (newPosition.y < 0) newPosition.y = tileCount - 1;
                if (newPosition.y >= tileCount) newPosition.y = 0;
                
                // Check if new position is valid
                validPosition = !snake.some(segment => 
                    segment.x === newPosition.x && segment.y === newPosition.y
                ) && !(food.x === newPosition.x && food.y === newPosition.y)
                  && !obstacles.some(other =>
                    other !== obstacle && other.x === newPosition.x && other.y === newPosition.y
                );
                
                attempts++;
            }
            
            // Move obstacle if valid position found
            if (validPosition) {
                obstacle.x = newPosition.x;
                obstacle.y = newPosition.y;
            }
        }
    });
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid (optional)
    ctx.strokeStyle = '#0f3460';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
        // Gradient effect for snake head
        if (index === 0) {
            ctx.fillStyle = '#4ecca3';
        } else {
            ctx.fillStyle = '#16213e';
        }
        
        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
        
        // Add border to segments
        ctx.strokeStyle = '#4ecca3';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
    });
    
    // Draw obstacles
    obstacles.forEach(obstacle => {
        // Draw obstacle as a red block with X pattern
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(
            obstacle.x * gridSize + 1,
            obstacle.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
        
        // Draw X pattern on obstacle
        ctx.strokeStyle = '#fefaf9ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(obstacle.x * gridSize + 3, obstacle.y * gridSize + 3);
        ctx.lineTo(obstacle.x * gridSize + gridSize - 3, obstacle.y * gridSize + gridSize - 3);
        ctx.moveTo(obstacle.x * gridSize + gridSize - 3, obstacle.y * gridSize + 3);
        ctx.lineTo(obstacle.x * gridSize + 3, obstacle.y * gridSize + gridSize - 3);
        ctx.stroke();
    });
    
    // Draw food (apple)
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Add shine effect to food
    ctx.fillStyle = '#ffaaaa';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2 - 3,
        food.y * gridSize + gridSize / 2 - 3,
        3,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function endGame() {
    clearInterval(gameLoop);
    gameLoop = null;
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
    startBtn.textContent = 'Start Game';
}

// Initial draw
draw();
