# Responsive Component Pattern: ProjectCard

## Objective
Transform a complex desktop component with 3D hover effects into a touch-optimized mobile card using **Graceful Degradation** and **Progressive Enhancement**.

---

## Desktop Variant (lg+ 1024px): "Cinematic Card"

### Visual Behavior
- **3D Perspective Hover:** Full z-index elevation, glow effect, scale animation
- **Interaction Model:** Keyboard + Mouse, click → open modal or navigate
- **Layout:** Multi-column grid, side-by-side layout
- **Animation:** Staggered entrance, complex easing curves

```jsx
// Desktop Implementation
<motion.div
  layout
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ 
    y: -6, 
    boxShadow: 'var(--shadow-glow)', 
    borderColor: 'var(--accent-primary)',
    scale: 1.02,
  }}
  transition={{ 
    type: 'spring', 
    stiffness: 300, 
    damping: 24 
  }}
  style={{
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: 16,
    padding: '24px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
  }}
>
  {/* Accent bar at top */}
  <div style={{
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    height: 3,
    background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
    opacity: 0.8,
  }} />

  {/* Content with typography hierarchy */}
  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
    {project.name}
  </h3>
  <p style={{ 
    fontSize: 12, 
    color: 'var(--text-secondary)', 
    lineHeight: 1.6,
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    flexGrow: 1,
  }}>
    {project.description}
  </p>

  {/* Action buttons */}
  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
    <a href={project.link} style={{ flex: 1 }}>
      View Project
    </a>
  </div>
</motion.div>
```

### Desktop Grid Layout
```css
@media (min-width: 1024px) {
  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }
}
```

---

## Mobile Variant (< 768px): "Touch-Optimized Card"

### Visual Behavior
- **No Hover:** Tap/press feedback instead of hover effects
- **Interaction Model:** Touch only, tap → expand inline or navigate
- **Layout:** Single column, stacked, full-width
- **Animation:** Simplified, 60fps optimized (no scale, use opacity + y-shift)
- **Reduced Motion:** Respect `prefers-reduced-motion: reduce`

```jsx
// Mobile Implementation
<motion.div
  layout
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileTap={{ 
    scale: 0.98,  // Minimal scale for performance
    backgroundColor: 'var(--bg-secondary)',
  }}
  transition={{ 
    type: 'tween',  // Simpler animation
    duration: 0.2,
  }}
  style={{
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: 8,  // Smaller radius on mobile
    padding: '12px',  // Reduced padding
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: 100,  // Ensure 44px+ touch target
  }}
>
  {/* No accent bar on mobile to save space */}

  {/* Simplified typography */}
  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
    {project.name}
  </h3>
  <p style={{ 
    fontSize: 11, 
    color: 'var(--text-secondary)', 
    lineHeight: 1.4,
    WebkitLineClamp: 2,  // Reduce text clamp
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    marginBottom: 8,
  }}>
    {project.description}
  </p>

  {/* Single action button for mobile */}
  <a 
    href={project.link}
    style={{
      alignSelf: 'flex-start',
      padding: '8px 12px',
      fontSize: 10,
      minHeight: 44,  // Touch-friendly
      minWidth: 44,
    }}
  >
    View →
  </a>
</motion.div>
```

### Mobile Grid Layout
```css
@media (max-width: 767px) {
  .project-grid {
    display: grid;
    grid-template-columns: 1fr;  /* Single column */
    gap: 8px;  /* Tighter spacing */
    padding: 0 12px;  /* Safe margins */
  }
  
  .project-card {
    width: 100% !important;
    max-width: 100%;
  }
}
```

---

## Responsive Component Pattern (React Hook)

```jsx
/**
 * useResponsiveCard
 * Returns motion animation variants based on breakpoint
 */

function useResponsiveCard() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    variants: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      whileHover: isMobile 
        ? { scale: 0.98 }  // Mobile: minimal effect
        : { y: -6, scale: 1.02 },  // Desktop: full effect
    },
    transition: isMobile
      ? { type: 'tween', duration: 0.2 }  // Mobile: fast, simple
      : { type: 'spring', stiffness: 300, damping: 24 },  // Desktop: spring
    isMobile,
  };
}

// Usage in ProjectCard component
function ProjectCard({ project }) {
  const card = useResponsiveCard();

  return (
    <motion.div
      variants={card.variants}
      initial="initial"
      animate="animate"
      whileHover="whileHover"
      transition={card.transition}
      style={{
        padding: card.isMobile ? '12px' : '24px',
        borderRadius: card.isMobile ? '8px' : '16px',
      }}
    >
      {/* Card content */}
    </motion.div>
  );
}
```

---

## Adaptive Typography Pattern

| Element | Desktop (lg+) | Mobile (< 768px) | Breakpoint |
|---------|---------------|------------------|-----------|
| Title (h3) | 16px, 700 weight | 14px, 700 weight | @media (max-width: 767px) |
| Description | 12px, line-clamp 3 | 11px, line-clamp 2 | @media (max-width: 767px) |
| Status Badge | 9px, visible | 8px or hidden | @media (max-width: 767px) |
| Button Text | 12px | 10px | @media (max-width: 767px) |

---

## Reduced Motion Handling

```jsx
// Detect user preference for reduced motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Disable expensive animations on low-motion preference
const transition = prefersReducedMotion
  ? { duration: 0 }  // Instant, no animation
  : { type: 'spring', stiffness: 300, damping: 24 };
```

```css
/* CSS approach */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance Optimization Checklist

- ✅ **Desktop**: GPU-accelerated transforms (y, scale)
- ✅ **Mobile**: Simplified animations (opacity, background-color only)
- ✅ **Touch**: No hover pseudo-classes, use whileTap instead
- ✅ **Reduced Motion**: Disabled animations, instant feedback
- ✅ **Z-Index**: Single-digit values to avoid layer bloat
- ✅ **Paint**: Minimize box-shadow changes (desktop only)
- ✅ **Composite**: Use will-change sparingly

---

## Integration with App

```jsx
// In GuiLayout.jsx
import ProjectCard from './ProjectCard';

export default function GuiLayout() {
  return (
    <div style={{ padding: window.innerWidth < 768 ? '12px' : '24px' }}>
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
```

---

## Testing Responsive Behavior

1. **Desktop (1440px+):** 
   - Hover → Smooth glow, elevation, scale
   - Click → Modal or navigate
   - Multi-column grid

2. **Tablet (768px - 1023px):** 
   - Tap → Visual feedback, scale to 0.98
   - Single/double column grid
   - Transition animations enabled

3. **Mobile (< 768px):** 
   - Tap → Visual feedback only (no scale)
   - Single column, stacked
   - Simplified animations, 60fps

4. **Reduced Motion:** 
   - All animations disabled
   - Instant visual feedback only
   - No transitions

