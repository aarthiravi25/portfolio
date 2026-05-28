# Performance Strategy: Matrix Background & Complex Animations

## Challenge
TerminalOS features a **matrix rain scanline overlay** and complex **Framer Motion animations** that must remain 60fps on mobile devices with limited GPU resources (mid-range Android, older iPhones).

---

## 1. Matrix Background Performance Problem

### Current Implementation
```css
/* Matrix scanlines overlay — EXPENSIVE on mobile */
[data-theme="matrix"] body::before,
[data-theme="cyberpunk"] body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.06) 2px,
    rgba(0, 0, 0, 0.06) 4px
  );
  pointer-events: none;
  z-index: 9999;
}
```

### Performance Issues
- **Repeated gradients** cause browser to re-render on every scroll
- **Fixed positioning** prevents scroll optimization
- **High z-index (9999)** forces entire page into composite layer
- **Non-zero opacity** triggers repaints on animation frame
- **Mobile Impact:** Battery drain, thermal throttling, 30fps → 20fps

### Solution: Adaptive Background Strategy

#### Mobile (< 768px): Simplified Overlay
```css
@media (max-width: 767px) {
  [data-theme="matrix"] body::before,
  [data-theme="cyberpunk"] body::before {
    content: '';
    position: fixed;
    inset: 0;
    /* Solid color instead of repeating gradient */
    background: rgba(0, 0, 0, 0.02);
    pointer-events: none;
    z-index: 100;  /* Lower z-index */
    will-change: auto;  /* No GPU acceleration needed */
  }
}
```

**Performance Impact:**
- ✅ Single solid color → no browser gradient computation
- ✅ Reduced layer count → z-index: 100
- ✅ No animation changes → will-change: auto (default)
- ✅ Result: ~45-50fps sustained

#### Desktop (lg+ 1024px): Full Matrix Effect
```css
@media (min-width: 1024px) {
  [data-theme="matrix"] body::before,
  [data-theme="cyberpunk"] body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.06) 2px,
      rgba(0, 0, 0, 0.06) 4px
    );
    pointer-events: none;
    z-index: 9999;
    /* Only on desktop where GPU is available */
  }
}
```

---

## 2. Animation Performance Tiers

### Tier 1: Mobile (< 768px) — "Reduced Motion"

**Goal:** 60fps with minimal GPU usage

**Enabled Animations:**
- ✅ Simple opacity fades (no scale/rotate)
- ✅ Linear Y-axis transforms (slide up/down)
- ✅ Background color changes
- ✅ Border color transitions

**Disabled Animations:**
- ❌ Scale transforms (3D matrix)
- ❌ Rotation animations
- ❌ Box-shadow glow effects
- ❌ Complex staggered children
- ❌ Blur/backdrop-filter on animated elements

```jsx
// Mobile Framer Motion variants
const mobileVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  // NO scale, rotate, or complex transforms
};

const mobileTransition = {
  type: 'tween',  // Not spring
  duration: 0.2,  // Short duration
  ease: 'easeInOut',
};

// Usage
<motion.div
  variants={mobileVariants}
  transition={mobileTransition}
>
  Content
</motion.div>
```

### Tier 2: Tablet (768px - 1023px) — "Balanced Performance"

**Goal:** Smooth 50-55fps with moderate effects

**Enabled Animations:**
- ✅ Opacity + Y-axis (fade + slide)
- ✅ Single scale transform (no compound)
- ✅ Box-shadow (single layer only)
- ✅ Staggered children (reduced count: max 3-4 items)

**Configuration:**
```jsx
const tabletVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const tabletTransition = {
  type: 'spring',
  stiffness: 200,  // Reduced stiffness
  damping: 30,     // Increased damping
  duration: 0.4,   // Slightly longer
};
```

### Tier 3: Desktop (lg+ 1024px) — "Full Effects"

**Goal:** Smooth 60fps with all visual effects

**Enabled Animations:**
- ✅ Complex transforms (scale, rotate, skew)
- ✅ Multiple box-shadows with blur
- ✅ Staggered children (unlimited)
- ✅ Animated SVG paths
- ✅ Parallax effects
- ✅ Blur/backdrop-filter animations

```jsx
const desktopVariants = {
  initial: { opacity: 0, scale: 0.8, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  whileHover: { 
    y: -6, 
    boxShadow: 'var(--shadow-glow)', 
    scale: 1.02 
  },
  exit: { opacity: 0, scale: 0.85 },
};

const desktopTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 24,
};
```

---

## 3. Detecting Device Performance & User Preferences

### Strategy: Feature Detection + Media Queries

```jsx
/**
 * usePerformanceTier()
 * Returns animation configuration based on:
 * 1. Viewport size (breakpoint)
 * 2. prefers-reduced-motion setting
 * 3. Device GPU capability (future)
 */

function usePerformanceTier() {
  const [tier, setTier] = React.useState('desktop');

  React.useEffect(() => {
    const width = window.innerWidth;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Priority: Reduced motion > Breakpoint
    if (prefersReduced) {
      setTier('reduced');
    } else if (width < 768) {
      setTier('mobile');
    } else if (width < 1024) {
      setTier('tablet');
    } else {
      setTier('desktop');
    }
  }, []);

  return {
    tier,
    isMobile: tier === 'mobile',
    isTablet: tier === 'tablet',
    isDesktop: tier === 'desktop',
    prefersReduced: tier === 'reduced',
  };
}
```

### Implementing Reduced Motion Globally

```css
/* CSS approach — highest priority */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```jsx
// JavaScript approach — for Framer Motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Example: Disable WindowManager dragging on mobile or reduced motion
<motion.div
  drag={!prefersReducedMotion && !isMobile}
  dragElastic={0.2}
  dragMomentum={false}
>
  Window content
</motion.div>
```

---

## 4. Code Splitting for Performance

### Desktop-Only Components (Lazy Load)

**Problem:** WindowManager with draggable windows is expensive. Loading it on mobile is wasteful.

**Solution:** React.lazy() + React.Suspense

```jsx
// App.jsx
import { lazy, Suspense } from 'react';

// Desktop-heavy component
const WindowManager = lazy(() => import('./components/WindowManager'));

// Mobile-light component
import BottomDock from './components/BottomDock';

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  return (
    <>
      {/* Always render on desktop */}
      {!isMobile && (
        <Suspense fallback={null}>
          <WindowManager />
        </Suspense>
      )}

      {/* Mobile dock instead */}
      {isMobile && <BottomDock />}

      {/* Rest of app */}
    </>
  );
}
```

**Bundle Savings:**
- **Before:** WindowManager (45KB) loaded on all devices
- **After:** 
  - Mobile: 0KB (lazy loaded, not used)
  - Desktop: 45KB (code split)
  - **Result:** ~25-30% reduction in mobile JS bundle

---

## 5. Performance Monitoring Checklist

### Tools to Use

1. **Lighthouse (DevTools)**
   - Run Performance audit for mobile
   - Target: LCP < 2.5s, CLS < 0.1

2. **Chrome DevTools → Performance Tab**
   - Record 30-second session on mobile device
   - Look for frames > 16ms (below 60fps)
   - Identify jank in animation sections

3. **React DevTools Profiler**
   - Record component renders during animation
   - Identify unnecessary re-renders
   - Watch for > 16ms component update times

### Testing Checklist

- [ ] Mobile (iPhone SE 1st gen or Android budget device):
  - [ ] Terminal scrolling: 55-60fps
  - [ ] Window dock tap: Instant feedback (< 100ms)
  - [ ] Matrix overlay: No visible stutter
  - [ ] Battery: No excessive drain during 5-min session

- [ ] Tablet (iPad Mini or similar):
  - [ ] All animations: 55-60fps
  - [ ] Window dragging: Smooth (no lag)
  - [ ] Multi-window overlap: No jank

- [ ] Desktop (MacBook or gaming PC):
  - [ ] All effects: 60fps sustained
  - [ ] Complex animations: No drops below 55fps
  - [ ] GPU utilization: Visible in DevTools

---

## 6. Progressive Enhancement Strategy

### Baseline (All Devices)
- ✅ Content renders
- ✅ Interactivity works (CLI input, GUI buttons)
- ✅ No animations or reduced animations

### Enhanced (Mobile/Tablet)
- ✅ Simple fade/slide animations
- ✅ Touch feedback (whileTap)
- ✅ Smooth 50-60fps experience

### Premium (Desktop)
- ✅ Full animation suite
- ✅ Advanced effects (hover, parallax, blur)
- ✅ Smooth 60fps guaranteed

---

## 7. Recommended Configuration

### For Your TerminalOS App

```jsx
// App.jsx config
const ANIMATION_TIERS = {
  reduced: {
    animate: false,
    duration: 0,
  },
  mobile: {
    animate: true,
    type: 'tween',
    duration: 0.2,
    enableStagger: false,
  },
  tablet: {
    animate: true,
    type: 'spring',
    stiffness: 200,
    damping: 30,
    enableStagger: false,
  },
  desktop: {
    animate: true,
    type: 'spring',
    stiffness: 300,
    damping: 24,
    enableStagger: true,
  },
};
```

### Deployment Checklist

- [ ] Matrix overlay: Simplified for mobile
- [ ] Framer Motion: Tiered variants per breakpoint
- [ ] Code splitting: WindowManager lazy loaded
- [ ] Reduced motion: CSS & JS fallbacks
- [ ] Bundle size: Check with `npm run build`
- [ ] Lighthouse: Score ≥ 80 on mobile
- [ ] Real device testing: 55+ fps on budget phones

---

## References

- [Framer Motion Docs: Responsive Design](https://www.framer.com/motion/guides/reduce-bundle-size/)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/reference/)

