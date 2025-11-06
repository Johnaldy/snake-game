# 🐍 Classic Snake Game

A classic snake game built with HTML5 Canvas and vanilla JavaScript. Control the snake, eat food, and grow as long as possible without crashing!

## 🎮 How to Play

1. Open `index.html` in your web browser
2. Click "Start Game" to begin
3. Use **Arrow Keys** or **WASD** to control the snake:
   - ⬆️ Arrow Up / W - Move Up
   - ⬇️ Arrow Down / S - Move Down
   - ⬅️ Arrow Left / A - Move Left
   - ➡️ Arrow Right / D - Move Right
4. Eat the red food to grow longer and score points
5. Avoid hitting the walls or your own body!

## ✨ Features

- 🎨 Beautiful gradient UI with modern design
- 🏆 High score tracking (saved in browser)
- ⏸️ Pause/Resume functionality
- 📱 Responsive controls (Arrow keys + WASD)
- 🎯 Grid-based classic gameplay
- 💫 Smooth animations and visual effects

## 🚀 Getting Started

Simply open the `index.html` file in any modern web browser:

```bash
# Option 1: Open directly
open index.html

# Option 2: Use a local server (recommended)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## 📁 Project Structure

```
snake-game/
├── index.html    # Main HTML structure
├── style.css     # Styling and layout
├── snake.js      # Game logic and mechanics
└── README.md     # This file
```

## 🎯 Game Rules

- Each piece of food eaten = **10 points**
- Snake grows by 1 segment for each food eaten
- Game ends if snake hits:
  - The wall boundaries
  - Its own body
- High score is saved automatically

## 🛠️ Technologies Used

- HTML5 Canvas
- CSS3 (Gradients, Flexbox)
- Vanilla JavaScript (ES6+)
- Local Storage API

## 🎨 Customization

You can easily customize the game by modifying these variables in `snake.js`:

```javascript
const gridSize = 20;        // Size of each grid cell
let gameSpeed = 100;        // Game speed in milliseconds (lower = faster)
```

Colors can be changed in `snake.js` and `style.css`.

## 📝 License

Feel free to use and modify this code for your own projects!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Enjoy playing! 🎮🐍**
