# 🐍 Classic Snake Game

A feature-rich snake game built with HTML5 Canvas and vanilla JavaScript. Control the snake, eat food, avoid obstacles, and survive as long as possible with progressive difficulty!

## 🎮 How to Play

1. Open `index.html` in your web browser
2. Click "Start Game" to begin
3. Use **Arrow Keys** or **WASD** to control the snake:
   - ⬆️ Arrow Up / W - Move Up
   - ⬇️ Arrow Down / S - Move Down
   - ⬅️ Arrow Left / A - Move Left
   - ➡️ Arrow Right / D - Move Right
4. Eat the red food (circles) to grow longer and score points
5. Avoid hitting obstacles or your own body!

## ✨ Features

### Core Gameplay
- 🎨 Beautiful gradient UI with modern design
- 🏆 High score tracking (saved in browser using Local Storage)
- ⏸️ Pause/Resume functionality
- 📱 Dual controls (Arrow keys + WASD)
- 🎯 Grid-based classic gameplay
- 💫 Smooth animations and visual effects

### Advanced Features
- 🌀 **Wall Wrap-Around**: Snake teleports to opposite side when crossing walls
- ⚡ **Progressive Speed**: Game starts slow (250ms) and speeds up with each food eaten (minimum 50ms)
- � **Dynamic Obstacles**: Red obstacles appear and increase difficulty over time
- 🔄 **Moving Obstacles**: Obstacles start moving randomly after score 200

## 🎮 Difficulty Progression

The game features **4 difficulty levels** based on your score:

### Level 1: Beginner (Score 0-49)
- ✅ Slower starting speed (250ms delay)
- ✅ No obstacles
- ✅ Wall wrap-around enabled
- ✅ Perfect for learning controls

### Level 2: Intermediate (Score 50-199)
- ⚡ Speed increases with each food (5ms faster per food)
- 🚧 Static red obstacles appear every 50 points
  - First obstacle at score 50
  - Second at 100, third at 150, etc.
- ✅ Wall wrap-around still enabled

### Level 3: Advanced (Score 200-299)
- ⚡⚡ Game speed near maximum (50ms minimum)
- 🚧 4+ static obstacles on screen
- 🔄 **Obstacles start moving randomly!**
  - 20% chance to move each frame
  - Moves one square in random direction
  - Obstacles can wrap around walls too

### Level 4: Expert (Score 300+)
- ⚡⚡⚡ Maximum speed (50ms)
- 🚧🚧 6+ obstacles
- 🔄🔄 Multiple moving obstacles creating dynamic hazards
- 🏆 True test of skill!

## 🚀 Getting Started

### Option 1: Open Directly
```bash
open index.html
# or double-click the file
```

### Option 2: Use Local Server (Recommended)
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with npx)
npx http-server

# Then visit http://localhost:8000
```

## 📁 Project Structure

```
snake-game/
├── index.html    # Main HTML structure and game container
├── style.css     # Styling, layout, and animations
├── snake.js      # Complete game logic and mechanics
└── README.md     # This documentation file
```

## 🎯 Game Rules

### Scoring
- Each piece of food eaten = **+10 points**
- High score is automatically saved in browser

### Growth & Speed
- Snake grows by 1 segment for each food eaten
- Game speed increases by 5ms (gets faster) with each food
- Speed caps at 50ms (maximum difficulty)

### Obstacles
- **First obstacle**: Appears at score 50
- **Additional obstacles**: Every 50 points (100, 150, 200...)
- **Moving obstacles**: Activated at score 200+
- Hitting an obstacle = Game Over

### Game Over Conditions
- ❌ Collision with your own body
- ❌ Collision with any obstacle
- ✅ Walls do NOT cause game over (wrap-around enabled)

## 🛠️ Technologies Used

- **HTML5 Canvas** - Game rendering
- **CSS3** - UI styling with gradients and flexbox
- **Vanilla JavaScript (ES6+)** - Game logic
- **Local Storage API** - High score persistence

## 🎨 Customization Guide

### Speed Settings (`snake.js` lines 17-19)
```javascript
let gameSpeed = 250;           // Starting speed (higher = slower)
const minSpeed = 50;            // Maximum speed cap
const speedIncrement = 5;       // Speed increase per food
```

### Grid Size (`snake.js` lines 6-7)
```javascript
const gridSize = 20;            // Size of each grid cell in pixels
const tileCount = 20;           // Number of tiles (20x20 grid)
```

### Colors

**Snake Color** (`snake.js` lines 338-340):
```javascript
ctx.fillStyle = '#4ecca3';  // Head color (bright teal)
ctx.fillStyle = '#16213e';  // Body color (dark blue)
```

**Food Color** (`snake.js` line 376):
```javascript
ctx.fillStyle = '#ff6b6b';  // Red apple
```

**Obstacle Colors** (`snake.js` lines 355, 364):
```javascript
ctx.fillStyle = '#e74c3c';   // Red fill
ctx.strokeStyle = '#c0392b';  // Dark red X pattern
```

**Background Colors** (`style.css` and `snake.js` line 309):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 📊 Code Structure

### Main Game Loop
1. **Update Function** - Called every frame
   - Move snake
   - Check collisions
   - Check food collision
   - Move obstacles (if score >= 200)
   - Render frame

### Key Functions
- `moveSnake()` - Updates snake position with wall wrap
- `checkCollision()` - Detects body and obstacle collisions
- `eatFood()` - Handles scoring, growth, speed increase
- `spawnFood()` - Generates food in valid positions
- `spawnObstacle()` - Creates obstacles at 50-point intervals
- `moveObstacles()` - Randomly moves obstacles (score 200+)
- `draw()` - Renders all game elements

## 🎮 Tips & Strategy

1. **Early Game (0-49)**: Learn the controls, practice movement
2. **Mid Game (50-199)**: Plan routes around static obstacles
3. **Late Game (200+)**: Stay alert! Moving obstacles require quick reactions
4. **Wall Strategy**: Use wall wrap-around to escape tight situations
5. **Speed Management**: Game gets harder fast - focus on survival over high scores

## 🐛 Known Behaviors

- Obstacles have a 20% chance to move each frame (after score 200)
- Obstacles won't move onto snake, food, or other obstacles
- Maximum of 10 attempts per obstacle per frame to find valid position
- Snake can move through walls but not through itself or obstacles

## 📝 Version History

**v1.0** - Initial release
- Basic snake gameplay
- Food spawning
- Collision detection

**v2.0** - Current version
- Added wall wrap-around
- Progressive speed system
- Dynamic obstacles at 50-point intervals
- Moving obstacles at score 200+
- Enhanced visual design
- Improved collision system

## � License

Feel free to use and modify this code for your own projects!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

### Ideas for Future Enhancements
- Power-ups (speed boost, invincibility, etc.)
- Multiple difficulty modes
- Sound effects and music
- Mobile touch controls
- Leaderboard system
- Different game modes (timed, endless, etc.)

---

**Enjoy playing! 🎮🐍**

*Created with HTML5 Canvas and vanilla JavaScript*
