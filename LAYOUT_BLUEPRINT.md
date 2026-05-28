# TerminalOS — Responsive Layout Blueprint

## Architecture Overview

### Dual-Mode Grid System

The layout uses a **mobile-first CSS Grid strategy** that adapts the App container based on breakpoints:

```
┌─────────────────────────────────────────────────┐
│           DESKTOP (lg+ 1024px)                  │
├─────────────────────┬───────────────────────────┤
│  CLI (xterm)        │  Floating Windows         │
│  Grid: 1fr 1fr      │  (Draggable, multi-panel) │
│  Position: fixed    │  Position: absolute       │
├─────────────────────┴───────────────────────────┤
│  Status Bar (fixed bottom or inline)            │
└─────────────────────────────────────────────────┘

┌─────────────────────┐
│  MOBILE (< 768px)   │
├─────────────────────┤
│  Terminal (full)    │
│  Grid: 1fr          │
│  Position: static   │
├─────────────────────┤
│  Floating Windows   │
│  (stacked, 100vw)   │
├─────────────────────┤
│  BottomDock Nav     │
│  (persistent)       │
└─────────────────────┘
```

---

## Breakpoint Strategy

### Mobile (0px - 767px): Developer Console Mode
**Goal:** Maximize usable screen real estate for terminal input/output

- **Layout:** Single-column, vertical stacking
- **Window behavior:** Static positioning, full-width with margins
- **Terminal:** Occupies 70-80% of viewport
- **Navigation:** Bottom Dock (fixed, 44px height minimum)
- **Dragging:** Disabled to prevent accidental moves
- **Touch targets:** 44px minimum

**Grid CSS:**
```css
@media (max-width: 767px) {
  #root {
    display: grid;
    grid-template-rows: 1fr auto auto;
    grid-template-columns: 1fr;
    height: 100vh;
  }
  
  .terminal-wrapper {
    grid-row: 1;
    overflow-y: auto;
  }
  
  .window-stack {
    grid-row: 2;
    height: auto;
    max-height: 30vh;
    overflow-y: auto;
  }
  
  .bottom-dock {
    grid-row: 3;
    height: 60px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
}
```

### Tablet (768px - 1023px): Transitional Mode
**Goal:** Balance between mobile constraints and desktop features

- **Layout:** 90% viewport width, centered
- **Windows:** Responsive sizing (max 600px)
- **Dragging:** Enabled but constrained
- **Bottom Dock:** Optional, can be hidden
- **Grid columns:** 2 for multi-panel layouts

**Grid CSS:**
```css
@media (min-width: 768px) and (max-width: 1023px) {
  #root {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: 100vh;
  }
  
  .window-frame {
    width: min(90vw, 600px);
    height: 70vh;
    position: absolute;
    top: 50px;
    left: 5vw;
  }
}
```

### Desktop (1024px+): Hacker Workstation Mode
**Goal:** Immersive, high-complexity multi-panel experience

- **Layout:** Multi-column CSS Grid with flexible panels
- **Windows:** Draggable, overlapping, with z-index management
- **Positioning:** Absolute with CSS Grid fallback
- **Multi-panel:** 2-3 columns for dashboard feel
- **Advanced features:** Full terminal, floating windows, shortcuts

**Grid CSS:**
```css
@media (min-width: 1024px) {
  #root {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "header header"
      "terminal panels"
      "footer footer";
    height: 100vh;
    gap: 8px;
    padding: 8px;
  }
  
  .terminal-wrapper {
    grid-area: terminal;
    position: relative;
    overflow: hidden;
  }
  
  .window-manager {
    grid-area: panels;
    position: relative;
    overflow: hidden;
  }
  
  .bottom-status {
    grid-area: footer;
    height: 40px;
  }
  
  .window-frame {
    position: absolute;
    width: 480px;
    height: 480px;
    min-width: 280px;
    min-height: 200px;
    pointer-events: auto;
  }
}
```

---

## Component-Level Grid Strategy

### Timeline Component Adaptation
**Desktop:** 3-4 column grid, left/right alternating

**Tablet:** 2-column grid

**Mobile:** Single column, left-aligned, diagnostic log style

```css
/* Mobile */
@media (max-width: 767px) {
  .timeline-grid {
    grid-template-columns: 1fr;
    padding-left: 20px;
  }
}

/* Tablet */
@media (min-width: 768px) {
  .timeline-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .timeline-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Project Grid Adaptation
**Desktop:** Auto-fill with 300px cards

**Tablet:** 2-3 columns

**Mobile:** Single column, stacked

```css
/* Mobile */
@media (max-width: 767px) {
  .project-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .project-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }
}
```

---

## Z-Index Stacking Strategy

```
┌─────────────────────────────┐
│  BottomDock          (1000) │  Always on top
│  Floating Window     (500)  │  User interaction layer
│  Terminal Prompt     (100)  │  Base interaction
│  Background/Matrix  (0)     │  Foundation
└─────────────────────────────┘
```

---

## Performance Optimization

### Mobile Grid Performance
- Use `display: grid` sparingly on low-end devices
- Fallback to Flexbox for stacking
- Avoid `gap` property in deeply nested layouts
- Use `contain: layout` on grid children

### Desktop Grid Performance
- Use `grid-auto-flow: dense` for optimized packing
- Minimize reflow with fixed grid areas
- Use `will-change: transform` for dragging windows

---

## Responsive Gotchas & Solutions

| Problem | Desktop | Mobile |
|---------|---------|--------|
| Window overflow | Use `position: absolute` with containment | Use `position: static`, add scrolling |
| Keyboard blocking | N/A | Bottom dock stays above keyboard |
| Touch drag interference | Smooth dragging | Disable dragging, use BottomDock instead |
| Matrix background performance | Full 60fps animations | Reduced motion or simple overlay |

