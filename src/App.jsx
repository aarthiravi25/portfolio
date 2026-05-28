import React, { lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import { applyTheme } from './lib/ThemeEngine';
import Terminal from './components/Terminal';
import { WindowManager } from './components/WindowManager';
import StatusIndicator from './components/StatusIndicator';

// Lazy-load the heavy GUI layout
const GuiLayout = lazy(() => import('./components/GuiLayout'));

// Apply stored theme on mount
const storedTheme = JSON.parse(localStorage.getItem('terminalos-state') || '{}')?.state?.theme ?? 'matrix';
applyTheme(storedTheme);

export default function App() {
  const { view, setView, theme } = useStore();

  // Sync theme CSS vars whenever theme changes
  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Sync scrollability via class on HTML element depending on CLI vs GUI mode
  React.useEffect(() => {
    if (view === 'gui') {
      document.documentElement.classList.add('gui-mode');
    } else {
      document.documentElement.classList.remove('gui-mode');
    }
  }, [view]);

  return (
    <>
      {/* Always render the Window Manager overlay */}
      <WindowManager />

      <AnimatePresence mode="wait">
        {view === 'cli' ? (
          <motion.div
            key="cli"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            style={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--terminal-bg)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top status bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 16px',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-muted)',
              userSelect: 'none',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  boxShadow: '0 0 6px var(--accent-primary)',
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
                <span style={{ color: 'var(--accent-primary)' }}>TerminalOS</span>
                <span>·</span>
                <span>tsh v1.0.0</span>
                <span>·</span>
                <StatusIndicator variant="inline" />
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <ThemeButton theme={theme} />
                <button
                  onClick={() => setView('gui')}
                  style={{
                    background: 'none', border: '1px solid var(--border-color)',
                    color: 'var(--accent-primary)', borderRadius: 4,
                    padding: '2px 10px', cursor: 'pointer', fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  GUI ↗
                </button>
              </div>
            </div>

            {/* Terminal fills remaining space */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <Terminal />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="gui"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}
          >
            <Suspense fallback={<LoadingScreen />}>
              <GuiLayout />
            </Suspense>

            {/* Floating CLI button */}
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: 'var(--shadow-glow)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('cli')}
              style={{
                position: 'fixed',
                bottom: 28,
                right: 28,
                zIndex: 200,
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                boxShadow: '0 4px 20px var(--accent-glow)',
                color: 'var(--bg-primary)',
              }}
              title="Switch to CLI Mode"
            >
              ⌨
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ThemeButton({ theme }) {
  const { setTheme } = useStore();
  const next = { matrix: 'cyberpunk', cyberpunk: 'dark', dark: 'light', light: 'matrix' };
  const icons = { matrix: '🟩', cyberpunk: '🟣', dark: '⚫', light: '⚪' };
  return (
    <button
      onClick={() => setTheme(next[theme])}
      style={{
        background: 'none', border: 'none',
        cursor: 'pointer', fontSize: 12,
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
      }}
      title={`Current: ${theme} · Click to cycle`}
    >
      {icons[theme]} {theme}
    </button>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', color: 'var(--accent-primary)',
      fontFamily: 'var(--font-mono)', fontSize: 14,
    }}>
      Loading GUI...
    </div>
  );
}
