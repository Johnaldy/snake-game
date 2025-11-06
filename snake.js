/*
 * CLASSIC SNAKE GAME WITH PROGRESSIVE DIFFICULTY
 * 
 * Features:
 * - Wall wrap-around (snake teleports to opposite side)
 * - Progressive speed increase (starts slow, gets faster)
 * - Dynamic obstacles (appear every 50 points starting at score 50)
 * - Moving obstacles (obstacles move randomly after score 200)
 * - High score tracking (saved in browser)
 * - Sound effects (eating food, game over)
 * 
 * Controls: Arrow Keys or WASD
 */

// ==================== GAME SETUP ====================

// Get canvas element and 2D rendering context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings - defines the grid size
const gridSize = 20;                              // Size of each grid cell in pixels
const tileCount = canvas.width / gridSize;        // Number of tiles in grid (20x20)

// ==================== SOUND EFFECTS ====================

// Create audio context for sound effects
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

/**
 * Play a beep sound for eating food
 * Creates a short, pleasant tone
 */
function playEatSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;  // High pitch tone
    oscillator.type = 'sine';           // Smooth sine wave
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

/**
 * Play a "duh" sound for game over
 * Creates a descending tone to indicate failure
 */
function playGameOverSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);  // Start high
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);  // Drop down
    oscillator.type = 'sawtooth';  // Harsh sound for failure
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// ==================== GAME STATE VARIABLES ====================

// Snake - array of position objects, first element is the head
let snake = [{ x: 10, y: 10 }];                   // Start in middle of grid

// Direction - current movement direction of snake
let direction = { x: 0, y: 0 };                   // Start stationary (no movement)

// Food - current position of food on grid
let food = { x: 15, y: 15 };                      // Initial food position

// Obstacles - array of obstacle positions (appears at score 50+)
let obstacles = [];                                // Empty at game start

// Score tracking
let score = 0;                                     // Current game score
let highScore = localStorage.getItem('snakeHighScore') || 0;  // Best score (saved)

// Game loop control
let gameLoop = null;                               // Interval ID for game loop
let isPaused = false;                              // Pause state flag

// Speed settings - controls game difficulty progression
let gameSpeed = 250;                               // Current game speed in ms (starts slow)
const minSpeed = 50;                               // Fastest possible speed (difficulty cap)
const speedIncrement = 5;                          // Speed increase per food eaten

// ==================== UI ELEMENT REFERENCES ====================

// Get references to HTML elements for score display and buttons
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');

// Initialize high score display from saved value
highScoreElement.textContent = highScore;

// ==================== KEYBOARD INPUT HANDLING ====================

// Listen for keyboard input
document.addEventListener('keydown', handleKeyPress);

/**
 * Handle keyboard input for snake movement
 * Supports both Arrow Keys and WASD
 * Prevents snake from reversing into itself (e.g., can't go left if moving right)
 */
function handleKeyPress(e) {
    // Prevent default arrow key behavior (page scrolling)
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }

    // Arrow keys - check current direction to prevent 180-degree turns
    if (e.key === 'ArrowUp' && direction.y === 0) {       // Can only go up if not moving vertically
        direction = { x: 0, y: -1 };
    } else if (e.key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (e.key === 'ArrowLeft' && direction.x === 0) {  // Can only go left if not moving horizontally
        direction = { x: -1, y: 0 };
    } else if (e.key === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
    
    // WASD keys - alternative controls
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

// ==================== BUTTON EVENT LISTENERS ====================

// Attach click handlers to game control buttons
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', resetGame);

/**
 * Start or restart the game
 * Creates a game loop that runs at intervals defined by gameSpeed
 */
function startGame() {
    if (!gameLoop) {
        gameSpeed = 150;  // Reset to starting speed
        gameLoop = setInterval(update, gameSpeed);  // Start game loop
        startBtn.textContent = 'Restart';
    } else {
        resetGame();  // If already running, restart instead
    }
}

/**
 * Toggle pause state of the game
 * Game loop continues running but update() returns early when paused
 */
function togglePause() {
    if (gameLoop) {
        isPaused = !isPaused;  // Flip pause state
        pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
    }
}

/**
 * Reset game to initial state
 * Clears snake, obstacles, score, and restarts with fresh game loop
 */
function resetGame() {
    // Reset all game state variables to initial values
    snake = [{ x: 10, y: 10 }];      // Single segment snake in middle
    direction = { x: 0, y: 0 };       // No movement at start
    score = 0;                        // Reset score
    obstacles = [];                   // Clear all obstacles
    gameSpeed = 150;                  // Reset to starting speed
    scoreElement.textContent = score;
    gameOverElement.classList.add('hidden');  // Hide game over screen
    
    // Clear existing game loop if running
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    
    // Initialize new game
    spawnFood();                              // Place first food
    gameLoop = setInterval(update, gameSpeed); // Start game loop
    isPaused = false;
    pauseBtn.textContent = 'Pause';
    startBtn.textContent = 'Restart';
}

// ==================== MAIN GAME LOOP ====================

/**
 * Main game update function - called every frame
 * Handles snake movement, collision detection, food eating, obstacle movement, and rendering
 */
function update() {
    if (isPaused) return;  // Skip update if game is paused
    
    moveSnake();  // Move snake one step in current direction
    
    // Check for collisions (with self or obstacles)
    if (checkCollision()) {
        endGame();
        return;  // Stop further updates
    }
    
    // Check if snake ate food
    if (checkFoodCollision()) {
        eatFood();  // Handle scoring, growth, and speed increase
    }
    
    // PROGRESSIVE DIFFICULTY: Move obstacles randomly after score 200
    if (score >= 200) {
        moveObstacles();
    }
    
    draw();  // Render current game state
}

// ==================== SNAKE MOVEMENT ====================

/**
 * Move snake in current direction with wall wrap-around
 * Snake teleports to opposite side when crossing walls (no wall collision)
 */
function moveSnake() {
    // Create new head position based on current direction
    let newX = snake[0].x + direction.x;
    let newY = snake[0].y + direction.y;
    
    // WALL WRAP-AROUND: Teleport to opposite side when crossing edges
    if (newX < 0) newX = tileCount - 1;           // Left edge -> right side
    if (newX >= tileCount) newX = 0;               // Right edge -> left side
    if (newY < 0) newY = tileCount - 1;           // Top edge -> bottom
    if (newY >= tileCount) newY = 0;               // Bottom edge -> top
    
    const head = { x: newX, y: newY };
    
    // Add new head position to front of snake array
    snake.unshift(head);
    
    // Remove tail segment (snake "moves forward")
    // Note: If food was just eaten, tail isn't removed (snake grows)
    snake.pop();
}

// ==================== COLLISION DETECTION ====================

/**
 * Check if snake has collided with itself or an obstacle
 * Returns true if game should end
 * Note: Wall collisions are disabled (wrap-around enabled)
 */
function checkCollision() {
    const head = snake[0];
    
    // Check self-collision (snake running into its own body)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;  // Game over
        }
    }
    
    // Check obstacle collision
    for (let obstacle of obstacles) {
        if (head.x === obstacle.x && head.y === obstacle.y) {
            return true;  // Game over
        }
    }
    
    return false;  // No collision detected
}

/**
 * Check if snake head is on same position as food
 */
function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

// ==================== FOOD & SCORING ====================

/**
 * Handle food consumption
 * Increases score, grows snake, spawns obstacles, increases speed
 */
function eatFood() {
    // Play eating sound effect
    playEatSound();
    
    // Increase score by 10 points
    score += 10;
    scoreElement.textContent = score;
    
    // Update high score if current score is higher
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);  // Save to browser
    }
    
    // Grow snake by adding new segment at tail position
    const tail = snake[snake.length - 1];
    snake.push({ ...tail });  // Duplicate tail position
    
    // PROGRESSIVE DIFFICULTY: Add obstacle every 50 points starting at score 50
    if (score >= 50 && score % 50 === 0) {
        spawnObstacle();
    }
    
    // PROGRESSIVE DIFFICULTY: Increase game speed (make it faster)
    if (gameSpeed > minSpeed) {
        gameSpeed = Math.max(minSpeed, gameSpeed - speedIncrement);
        
        // Restart game loop with new faster speed
        clearInterval(gameLoop);
        gameLoop = setInterval(update, gameSpeed);
    }
    // Spawn new food at random valid location
    spawnFood();
}

/**
 * Spawn food at a random position not occupied by snake or obstacles
 * Keeps generating random positions until valid one is found
 */
function spawnFood() {
    let newFood;
    let validPosition = false;
    
    // Loop until we find an empty position
    while (!validPosition) {
        // Generate random grid position
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // Check position is not occupied by snake or obstacles
        validPosition = !snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
        ) && !obstacles.some(obstacle =>
            obstacle.x === newFood.x && obstacle.y === newFood.y
        );
    }
    
    food = newFood;
}

// ==================== OBSTACLE SYSTEM ====================

/**
 * Spawn a new obstacle at a random valid position
 * Called every 50 points starting at score 50
 */
function spawnObstacle() {
    let newObstacle;
    let validPosition = false;
    
    // Loop until we find an empty position
    while (!validPosition) {
        // Generate random grid position
        newObstacle = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // Ensure position is not occupied by snake, food, or other obstacles
        validPosition = !snake.some(segment => 
            segment.x === newObstacle.x && segment.y === newObstacle.y
        ) && !(food.x === newObstacle.x && food.y === newObstacle.y)
          && !obstacles.some(obstacle =>
            obstacle.x === newObstacle.x && obstacle.y === newObstacle.y
        );
    }
    
    obstacles.push(newObstacle);
}

/**
 * Move obstacles randomly (activated at score 200+)
 * Each obstacle has 20% chance per frame to move one square in random direction
 * This creates dynamic hazards that increase difficulty significantly
 */
function moveObstacles() {
    obstacles.forEach(obstacle => {
        // 20% chance each frame for obstacle to move
        if (Math.random() < 0.2) {
            let newPosition;
            let validPosition = false;
            let attempts = 0;
            const maxAttempts = 10;  // Limit attempts to prevent infinite loops
            
            // Try to find a valid adjacent position to move to
            while (!validPosition && attempts < maxAttempts) {
                // Pick random direction: 0=up, 1=right, 2=down, 3=left
                const direction = Math.floor(Math.random() * 4);
                
                // Start from current obstacle position
                newPosition = { x: obstacle.x, y: obstacle.y };
                
                // Move one square in chosen direction
                switch(direction) {
                    case 0: newPosition.y -= 1; break;  // Move up
                    case 1: newPosition.x += 1; break;  // Move right
                    case 2: newPosition.y += 1; break;  // Move down
                    case 3: newPosition.x -= 1; break;  // Move left
                }
                
                // Wrap around walls (same as snake behavior)
                if (newPosition.x < 0) newPosition.x = tileCount - 1;
                if (newPosition.x >= tileCount) newPosition.x = 0;
                if (newPosition.y < 0) newPosition.y = tileCount - 1;
                if (newPosition.y >= tileCount) newPosition.y = 0;
                
                // Validate new position (can't move onto snake, food, or other obstacles)
                validPosition = !snake.some(segment => 
                    segment.x === newPosition.x && segment.y === newPosition.y
                ) && !(food.x === newPosition.x && food.y === newPosition.y)
                  && !obstacles.some(other =>
                    other !== obstacle && other.x === newPosition.x && other.y === newPosition.y
                );
                
                attempts++;
            }
            
            // Update obstacle position if valid position was found
            if (validPosition) {
                obstacle.x = newPosition.x;
                obstacle.y = newPosition.y;
            }
        }
    });
}

// ==================== RENDERING ====================

/**
 * Draw all game elements on canvas
 * Renders grid, snake, obstacles, and food
 */
function draw() {
    // Clear canvas with dark background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines (optional visual aid)
    ctx.strokeStyle = '#0f3460';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < tileCount; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
    
    // Draw snake - iterate through all segments
    snake.forEach((segment, index) => {
        // Different color for head vs body
        if (index === 0) {
            ctx.fillStyle = '#4ecca3';  // Bright teal for head
        } else {
            ctx.fillStyle = '#16213e';  // Dark blue for body
        }
        
        // Fill snake segment (slightly inset from grid cell)
        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
        
        // Add border around each segment
        ctx.strokeStyle = '#4ecca3';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
    });
    
    // Draw obstacles - red blocks with X pattern
    obstacles.forEach(obstacle => {
        // Red fill for obstacle
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(
            obstacle.x * gridSize + 1,
            obstacle.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
        
        // Draw X pattern for visual clarity
        ctx.strokeStyle = '#fefaf9ff';  // Light color for contrast
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Draw diagonal line from top-left to bottom-right
        ctx.moveTo(obstacle.x * gridSize + 3, obstacle.y * gridSize + 3);
        ctx.lineTo(obstacle.x * gridSize + gridSize - 3, obstacle.y * gridSize + gridSize - 3);
        // Draw diagonal line from top-right to bottom-left
        ctx.moveTo(obstacle.x * gridSize + gridSize - 3, obstacle.y * gridSize + 3);
        ctx.lineTo(obstacle.x * gridSize + 3, obstacle.y * gridSize + gridSize - 3);
        ctx.stroke();
    });
    
    // Draw food as circular "apple"
    ctx.fillStyle = '#ff6b6b';  // Red color
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,      // Center X
        food.y * gridSize + gridSize / 2,      // Center Y
        gridSize / 2 - 2,                       // Radius
        0,
        Math.PI * 2                             // Full circle
    );
    ctx.fill();
    
    // Add shine effect to food for 3D appearance
    ctx.fillStyle = '#ffaaaa';  // Lighter red
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2 - 3,  // Offset from center
        food.y * gridSize + gridSize / 2 - 3,  // Creates highlight
        3,                                      // Small radius
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// ==================== GAME END ====================

/**
 * End the game and show game over screen
 * Stops game loop and displays final score
 */
function endGame() {
    // Play game over sound effect
    playGameOverSound();
    
    clearInterval(gameLoop);  // Stop game loop
    gameLoop = null;
    finalScoreElement.textContent = score;  // Display final score
    gameOverElement.classList.remove('hidden');  // Show game over overlay
    startBtn.textContent = 'Start Game';
}

// ==================== INITIALIZATION ====================

// Draw initial game state (before game starts)
draw();
