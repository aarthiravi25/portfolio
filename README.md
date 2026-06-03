# TerminalOS — Interactive Developer Portfolio

A dual-mode, fully responsive developer portfolio with a terminal interface (CLI) and visual dashboard (GUI). Built with React, Vite, and Framer Motion.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── App.jsx         # Main app
│   ├── Terminal.jsx    # CLI interface
│   ├── GuiLayout.jsx   # GUI dashboard
│   ├── WindowManager.jsx
│   ├── BottomDock.jsx
│   └── ...
├── lib/                # Utilities
│   ├── CommandParser.js
│   └── ThemeEngine.js
├── store/
│   └── useStore.js     # Zustand state
├── data/
│   └── data.json       # Portfolio content
└── index.css           # Global styles
```

## 🎮 Usage

### Terminal Mode
```bash
help              # Show commands
projects          # List projects
about             # About me
gui               # Switch to GUI
theme matrix      # Change theme
```

### Mobile
- **Bottom Dock** for navigation (< 768px)
- **Swipe** to switch between CLI/GUI
- Touch-optimized 44px+ targets

### Desktop
- Full terminal interface
- Draggable windows (GUI mode)
- Advanced animations & effects

## 📱 Responsive Design

- **Mobile**: < 768px (1 column, Bottom Dock)
- **Tablet**: 768-1023px (2 columns, balanced)
- **Desktop**: 1024px+ (multi-panel, full effects)

## 🛠 Tech Stack

- **React 18** + Vite
- **Framer Motion** (animations)
- **xterm.js** (terminal)
- **Zustand** (state management)
- **CSS Grid/Flexbox** (responsive layout)



## 🔧 Customization

### Add a Project
Edit `src/data/data.json`:
```json
{
  "projects": [
    {
      "id": 1,
      "name": "My Project",
      "description": "...",
      "link": "...",
      "tags": ["React", "TypeScript"]
    }
  ]
}
```

### Add CLI Commands
Edit `src/lib/CommandParser.js` and add your command handler.

## 🌐 Deployment

```bash
# Build
npm run build

# Deploy to GitHub Pages, Vercel, or Docker
```

## 📝 License

MIT License
