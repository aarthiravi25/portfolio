/**
 * BottomDock.jsx
 * Mobile-first Bottom Navigation Dock
 * 
 * Renders a persistent touch-friendly dock for rapid CLI/GUI switching
 * and quick access to portfolio sections on mobile (< 768px).
 * 
 * Desktop (lg+): Hidden via display: none
 * Mobile/Tablet: Fixed bottom, 60px height, 44px+ touch targets
 */

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const DOCK_ITEMS = [
  { id: 'about', icon: '👤', label: 'About', action: 'scroll-about' },
  { id: 'projects', icon: '💻', label: 'Projects', action: 'scroll-projects' },
  { id: 'experience', icon: '🎓', label: 'Experience', action: 'scroll-experience' },
  { id: 'contact', icon: '📧', label: 'Contact', action: 'scroll-contact' },
];

function DockItem({ item, isActive, onSelect, isMobile }) {
  const handlePress = () => {
    onSelect(item);
  };

  if (!isMobile) {
    return null; // Hide on desktop
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ y: -4 }}
      onClick={handlePress}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        flex: 1,
        minHeight: 60,
        minWidth: 60,
        background: isActive ? 'var(--accent-glow)' : 'transparent',
        border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
        borderRadius: 8,
        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 600,
        transition: 'all 0.2s ease',
        padding: 0,
      }}
    >
      <span style={{ fontSize: 20 }}>{item.icon}</span>
      <span>{item.label}</span>
    </motion.button>
  );
}

export default function BottomDock() {
  const { view, setView } = useStore();
  const [activeDock, setActiveDock] = React.useState('about');
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  // Track mobile breakpoint
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle swipe-to-switch between CLI and GUI (gesture support)
  const touchStartX = useRef(0);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // Swipe left: switch to GUI
    if (diff > 50) {
      setView('gui');
    }
    // Swipe right: switch to CLI
    else if (diff < -50) {
      setView('cli');
    }
  };

  const handleDockSelect = (item) => {
    setActiveDock(item.id);

    // Scroll to section or trigger action
    const targetId = item.action.replace('scroll-', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Only render on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        gap: 4,
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Navigation Items */}
      <div style={{ display: 'flex', flex: 1, gap: 4 }}>
        {DOCK_ITEMS.map((item) => (
          <DockItem
            key={item.id}
            item={item}
            isActive={activeDock === item.id}
            onSelect={handleDockSelect}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Mode Toggle (CLI/GUI) */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ y: -4 }}
        onClick={() => setView(view === 'cli' ? 'gui' : 'cli')}
        style={{
          minHeight: 44,
          minWidth: 44,
          padding: '8px 12px',
          borderRadius: 8,
          background: view === 'gui' ? 'var(--accent-glow)' : 'transparent',
          border: view === 'gui' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
          color: view === 'gui' ? 'var(--accent-primary)' : 'var(--text-secondary)',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 600,
          transition: 'all 0.2s ease',
        }}
        title={view === 'cli' ? 'Switch to GUI' : 'Switch to CLI'}
      >
        {view === 'cli' ? '⚡ GUI' : '$ CLI'}
      </motion.button>
    </motion.div>
  );
}
