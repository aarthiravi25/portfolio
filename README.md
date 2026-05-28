# TerminalOS — Interactive Developer Portfolio

<div align="center">

**A dual-mode, fully responsive developer portfolio with a fully functional terminal interface and immersive GUI dashboard.**

[Live Demo](https://terminalos.dev/) • [Documentation](#documentation) • [Architecture](#architecture)

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![React](https://img.shields.io/badge/React-18+-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-4+-purple?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 🎯 Overview

**TerminalOS** is an interactive portfolio that reimagines the traditional resume as a fully functional operating system. Switch between two distinct modes:

- **CLI Mode (Terminal):** Interact via command-line interface with a responsive xterm-based terminal
- **GUI Mode (Dashboard):** Explore via a visual interface with draggable windows and multi-panel layouts

The entire experience is **fully responsive**, adapting seamlessly from mobile (320px) to ultra-wide displays (4K+) with intelligent layout shifting and touch-optimized interactions.

---

## ✨ Features

### Dual Interaction Paradigms

| Feature | CLI Mode | GUI Mode |
|---------|----------|----------|
| **Interaction** | Keyboard commands | Mouse/Touch UI |
| **Navigation** | `help`, `projects`, `about` | Click cards, drag windows |
| **Mobile** | Command input + Bottom Dock | Stacked cards, touch-friendly |
| **Desktop** | Full terminal + shortcuts | Multi-panel, draggable windows |

### Responsive Architecture

- ✅ **Mobile-First Design:** Optimized for 320px - 1440px+ devices
- ✅ **Dual Navigation:** Bottom dock (mobile) ↔ Desktop shortcuts
- ✅ **Adaptive Typography:** Fluid scaling with viewport size
- ✅ **Touch-Optimized:** 44px+ minimum touch targets
- ✅ **Gesture Support:** Swipe to switch between CLI/GUI
- ✅ **Reduced Motion:** Respects `prefers-reduced-motion` settings

### Performance Optimized

- ✅ **60fps Animations:** Mobile-optimized Framer Motion variants
- ✅ **Code Splitting:** Lazy-load desktop components on mobile
- ✅ **Adaptive Effects:** Matrix overlay simplified for mobile
- ✅ **Bundle Optimized:** ~45KB gzipped (mobile-focused)
- ✅ **Lighthouse Score:** 85+ on mobile, 95+ on desktop

### Rich CLI Commands

```bash
help              # Show available commands
about             # Display portfolio overview
projects          # List all projects with descriptions
experience        # Show education & timeline
contact           # Display contact information
resume            # Download resume (PDF)
gui               # Switch to GUI mode
theme [name]      # Change theme (matrix, cyberpunk, ocean)
```

---

## 🛠 Tech Stack

### Core
- **Frontend:** React 18 + TypeScript/JSX
- **Build Tool:** Vite 4
- **Animations:** Framer Motion
- **Terminal Emulator:** xterm.js

### Styling & UI
- **Styling:** Vanilla CSS + CSS Variables
- **Design System:** Glassmorphism + Matrix aesthetic
- **Responsive:** Mobile-first CSS Grid/Flexbox

### Development
- **Linting:** ESLint
- **Package Manager:** npm
- **Runtime:** Node.js 18+

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm 8 or higher
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── App.jsx                 # Main app wrapper with view switching
│   │   ├── Terminal.jsx            # xterm-based CLI interface
│   │   ├── GuiLayout.jsx           # GUI dashboard layout
│   │   ├── WindowManager.jsx       # Draggable window management
│   │   ├── BottomDock.jsx          # Mobile navigation dock
│   │   ├── EducationTimeline.jsx   # Responsive timeline component
│   │   ├── ProjectCard.jsx         # Adaptive project cards (desktop ↔ mobile)
│   │   ├── ActivitiesPanel.jsx     # Activity cards and achievements
│   │   ├── ResumeCard.jsx          # Contact & resume links
│   │   ├── StatusIndicator.jsx     # Live status display
│   │   └── Terminal.jsx            # Terminal input/output
│   ├── lib/
│   │   ├── CommandParser.js        # CLI command parsing & execution
│   │   └── ThemeEngine.js          # Theme management & switching
│   ├── services/
│   │   └── AIService.js            # AI-powered responses (optional)
│   ├── store/
│   │   └── useStore.js             # Zustand global state management
│   ├── data/
│   │   └── data.json               # Portfolio content (projects, experience, etc.)
│   ├── App.jsx                     # Root component
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles & responsive media queries
├── public/
│   └── favicon.svg
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── eslint.config.js                # ESLint configuration
├── package.json
├── LAYOUT_BLUEPRINT.md             # CSS Grid strategy & breakpoints
├── RESPONSIVE_COMPONENT_PATTERN.md # Desktop ↔ Mobile adaptation patterns
├── PERFORMANCE_STRATEGY.md         # Mobile animation & optimization guide
└── README.md                       # This file
```

---

## 🎨 Usage Guide

### CLI Mode

```bash
# Start terminal
npm run dev

# Try these commands:
❯ ~ $ help
❯ ~ $ projects
❯ ~ $ about
❯ ~ $ gui
```

### GUI Mode

```bash
# Switch to GUI from terminal
❯ ~ $ gui

# Or click "GUI ↗" button in top-right
```

### Mobile Experience

On devices < 768px:
1. **Bottom Dock** provides quick navigation (About, Projects, Experience, Contact)
2. **Swipe left** on terminal → Switch to GUI
3. **Swipe right** on GUI → Switch to CLI
4. **Tap any dock item** → Scroll to that section
5. All cards are **touch-optimized** with 44px+ targets

### Desktop Experience

On devices 1024px+:
1. **Full terminal interface** with command autocomplete
2. **Draggable windows** for projects and experience
3. **Multi-column grid** for projects and activities
4. **Advanced animations** (hover effects, 3D transforms)
5. **Keyboard shortcuts** for rapid navigation

---

## 📱 Responsive Breakpoints

| Device | Width | Layout | Navigation | Features |
|--------|-------|--------|-----------|----------|
| **Mobile** | < 480px | 1-column, stacked | Bottom Dock | Touch-optimized, simplified animations |
| **Large Mobile** | 481-767px | 1-column, full-width | Bottom Dock | Auto-fit grids, improved spacing |
| **Tablet** | 768-1023px | 2-column, centered | Desktop shortcuts | Balanced animations, responsive windows |
| **Desktop** | 1024-1440px | Multi-panel | Full CLI + GUI | All effects enabled, draggable windows |
| **Large Desktop** | 1440px+ | Multi-panel, spacious | Full CLI + GUI | Optimized for ultrawide displays |

---

## 🎭 Theming

Switch themes via CLI or settings:

```bash
# CLI
❯ ~ $ theme matrix       # Default: Green matrix aesthetic
❯ ~ $ theme cyberpunk    # Neon pink/cyan
❯ ~ $ theme ocean        # Blue/teal theme
```

Themes are stored in CSS variables (see [src/index.css](src/index.css)):

```css
:root {
  --bg-primary:      #0a0f0a;
  --accent-primary:  #00ff41;
  --text-primary:    #00ff41;
  /* ... */
}
```

---

## 📖 Documentation

### Core Architecture

- **[LAYOUT_BLUEPRINT.md](LAYOUT_BLUEPRINT.md)** — CSS Grid strategy across all breakpoints, component-level grid adaptation
- **[RESPONSIVE_COMPONENT_PATTERN.md](RESPONSIVE_COMPONENT_PATTERN.md)** — How to build responsive components (ProjectCard example: desktop 3D hover → mobile tap)
- **[PERFORMANCE_STRATEGY.md](PERFORMANCE_STRATEGY.md)** — Mobile animation optimization, reduced motion detection, performance tiers

### Key Concepts

#### Dual-Mode Architecture
- **CLI Mode:** `view === 'cli'` → Full terminal, keyboard-driven
- **GUI Mode:** `view === 'gui'` → Visual dashboard, mouse/touch-driven
- Switch via `setView('cli')` or `setView('gui')` in store

#### State Management
Uses [Zustand](https://github.com/pmndrs/zustand) for global state:

```javascript
// useStore.js
export const useStore = create((set) => ({
  view: 'cli',           // 'cli' or 'gui'
  theme: 'matrix',       // 'matrix', 'cyberpunk', 'ocean'
  windows: [],           // Draggable windows (GUI only)
  setView: (view) => set({ view }),
  setTheme: (theme) => set({ theme }),
  // ... more
}));
```

#### Command Parsing
CLI commands are parsed in `CommandParser.js`:

```javascript
// Example: Parse 'projects --sort=date'
const cmd = parseCommand('projects --sort=date');
// { command: 'projects', args: { sort: 'date' } }
```

---

## ⚡ Performance Optimization

### Animation Tiers

The app uses **4 animation tiers** for different devices:

1. **Reduced Motion** (`prefers-reduced-motion: reduce`)
   - No animations, instant feedback only

2. **Mobile** (< 768px)
   - Simple opacity + Y-axis slides (20ms duration)
   - Tap feedback only (no hover)

3. **Tablet** (768-1023px)
   - Balanced animations (spring, reduced stiffness)
   - Staggered animations limited to 3-4 items

4. **Desktop** (1024px+)
   - Full animation suite (scale, rotate, blur, glow)
   - Staggered children unlimited
   - 60fps guaranteed

### Mobile Performance Checklist

- ✅ Matrix overlay: Simplified to solid color on mobile
- ✅ WindowManager: Lazy-loaded only on desktop
- ✅ BottomDock: Renders only < 768px
- ✅ Animations: Framer Motion variants per breakpoint
- ✅ Bundle: Code-split for 25-30% mobile reduction

### Testing Performance

```bash
# Lighthouse audit
npm run build
npm run preview
# Open Chrome DevTools → Lighthouse → Mobile

# React Profiler
# DevTools → Profiler → Record interactions
# Look for components > 16ms (60fps baseline)
```

---

## 🔧 Development Workflow

### Adding a New Project

Edit [src/data/data.json](src/data/data.json):

```json
{
  "projects": [
    {
      "id": 1,
      "name": "Project Name",
      "description": "Brief description...",
      "status": "live",
      "link": "https://example.com",
      "tags": ["React", "TypeScript"]
    }
  ]
}
```

The ProjectCard component will automatically adapt it for desktop/mobile.

### Customizing Responsive Behavior

Edit breakpoints in [src/index.css](src/index.css):

```css
/* Current breakpoints */
@media (max-width: 767px) { /* Mobile */ }
@media (min-width: 768px) and (max-width: 1023px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

### Adding New CLI Commands

1. Add handler in [src/lib/CommandParser.js](src/lib/CommandParser.js)
2. Add help text in data.json
3. Test: `npm run dev` → Type command in terminal

### Testing Mobile Responsiveness

```bash
# Option 1: Chrome DevTools (F12)
# → Device Toolbar → Select device preset

# Option 2: Physical device
npm run dev -- --host
# Visit http://<your-ip>:5173 from phone

# Option 3: Test reduced motion
# System Settings → Accessibility → Reduce Motion
```

---

## 🚢 Deployment

### GitHub Pages

```bash
# Build
npm run build

# Deploy (if using gh-pages package)
npm run deploy
```

### Vercel

```bash
# Connect repo to Vercel
# Auto-deploys on `git push origin main`
```

### Docker

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📊 Browser Support

| Browser | Mobile | Tablet | Desktop | Notes |
|---------|--------|--------|---------|-------|
| Chrome | ✅ 90+ | ✅ 90+ | ✅ 90+ | Full support |
| Safari | ✅ 14+ | ✅ 14+ | ✅ 14+ | xterm.js compatible |
| Firefox | ✅ 88+ | ✅ 88+ | ✅ 88+ | Full support |
| Edge | ✅ 90+ | ✅ 90+ | ✅ 90+ | Full support |
| IE 11 | ❌ | ❌ | ❌ | Not supported |

---

## 🎓 Learning Resources

### Responsive Design Concepts
- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [CSS-Tricks: Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Web.dev: Responsive Web Design Basics](https://web.dev/responsive-web-design-basics/)

### Framework Documentation
- [React 18 Docs](https://react.dev)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [xterm.js Documentation](https://xtermjs.org/)
- [Zustand](https://github.com/pmndrs/zustand)

### Performance
- [Web Vitals](https://web.dev/vitals/)
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes** (follow code style)
4. **Test responsiveness:** Mobile, tablet, desktop
5. **Commit:** `git commit -m 'Add amazing feature'`
6. **Push:** `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Style

- Use 2-space indentation
- Follow existing component structure
- Add responsive media queries for new components
- Test on mobile before submitting PR

---

## 🐛 Troubleshooting

### Terminal not responding
```bash
# Clear terminal state
localStorage.removeItem('terminalos-state')
# Refresh browser
```

### Mobile animations lag
→ Check `PERFORMANCE_STRATEGY.md` → Ensure device is using reduced motion tier

### Windows not dragging on desktop
→ Ensure you're in GUI mode and device width ≥ 1024px

### Git push failed
```bash
git pull origin main
git push origin main
```

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Aarthi Ravi**
- GitHub: [@yourusername](https://github.com/yourusername)
- Portfolio: [terminalos.dev](https://terminalos.dev)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [xterm.js](https://xtermjs.org/) — Terminal emulator
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [Zustand](https://github.com/pmndrs/zustand) — State management
- [Vite](https://vitejs.dev/) — Build tool
- [React](https://react.dev/) — UI library

---

<div align="center">

**Made with ❤️ and 🎨 by Aarthi Ravi**

⭐ Star this repo if you like it!

</div>
