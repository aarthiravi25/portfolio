import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

const MIN_W = 280;
const MIN_H = 200;

function DraggableWindow({ win }) {
  const { closeWindow, focusWindow, minimizeWindow } = useStore();
  const constraintsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Keep a stable, randomly offset coordinate computed once on mount so it never jumps around!
  const positionRef = useRef({
    top: 80 + Math.random() * 60,
    left: 80 + Math.random() * 80,
  });

  const statusColor = {
    live: '#00ff41',
    beta: '#ffcc00',
    archived: '#888888',
  };

  // ── Handle responsive window sizing ──────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Calculate responsive dimensions ──────────────────────────────────────
  const getWindowDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < 480) {
      // Mobile: full-width, responsive height
      return {
        position: 'static',
        width: '100%',
        height: 'auto',
        maxHeight: Math.max(height - 40, MIN_H),
        margin: '8px auto',
      };
    } else if (width < 768) {
      // Small mobile/large mobile: 90vw, responsive height
      return {
        position: 'absolute',
        width: 'min(90vw, 500px)',
        height: 'auto',
        maxHeight: `${Math.max(height * 0.75, MIN_H)}px`,
        top: `${positionRef.current.top}px`,
        left: `${Math.max(5, positionRef.current.left - 40)}px`,
      };
    } else {
      // Tablet and above: absolute positioning
      return {
        position: 'absolute',
        width: 480,
        height: 'auto',
        maxHeight: 'none',
        top: `${positionRef.current.top}px`,
        left: `${positionRef.current.left}px`,
      };
    }
  };

  const windowDimensions = getWindowDimensions();

  return (
    <motion.div
      key={win.id}
      className="window-frame"
      initial={{ scale: 0.8, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      drag={!isMobile}
      dragMomentum={false}
      style={{
        ...windowDimensions,
        zIndex: win.zIndex,
        minWidth: MIN_W,
        minHeight: MIN_H,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: isMobile ? '8px' : '12px',
        boxShadow: 'var(--shadow-glow)',
        overflow: 'hidden',
        display: win.minimized ? 'none' : 'flex',
        flexDirection: 'column',
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            style={{
              width: 12, height: 12, borderRadius: '50%',
              background: '#ff5f57', border: 'none', cursor: 'pointer',
            }}
          />
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            style={{
              width: 12, height: 12, borderRadius: '50%',
              background: '#ffbd2e', border: 'none', cursor: 'pointer',
            }}
          />
          <div style={{
            width: 12, height: 12, borderRadius: '50%',
            background: '#28c840', border: 'none',
          }} />
        </div>
        <span style={{
          color: 'var(--text-secondary)',
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.05em',
        }}>
          {win.title}
        </span>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            closeWindow(win.id);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '2px 8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            transition: 'color 0.2s',
          }}
        >
          ✕
        </button>
      </div>

      {/* Window content */}
      <div style={{ padding: '20px', overflowY: 'auto', flex: 1, color: 'var(--text-primary)' }}>
        {win.type === 'project' && <ProjectWindowContent project={win.data} closeWindow={closeWindow} winId={win.id} statusColor={statusColor} />}
      </div>
    </motion.div>
  );
}

function ProjectWindowContent({ project, closeWindow, winId, statusColor }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: 'var(--accent-primary)', fontFamily: 'inherit' }}>
            {project.name}
          </h2>
          <div style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 4 }}>
            {project.category} · {project.year}
          </div>
        </div>
        <span style={{
          padding: '2px 10px',
          borderRadius: 20,
          fontSize: 11,
          background: `${statusColor[project.status]}22`,
          color: statusColor[project.status],
          border: `1px solid ${statusColor[project.status]}44`,
        }}>
          {project.status}
        </span>
      </div>

      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16, fontSize: 13 }}>
        {project.description}
      </p>

      <div style={{ marginBottom: 16 }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Tech Stack
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {project.tech.map((t) => (
            <span key={t} style={{
              padding: '3px 10px',
              borderRadius: 6,
              fontSize: 11,
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-color)',
              color: 'var(--accent-secondary)',
            }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
        {project.live && (
          <motion.a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.03, boxShadow: 'var(--shadow-glow)' }}
            whileTap={{ scale: 0.97 }}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              padding: '8px 16px',
              background: 'var(--accent-primary)',
              color: 'var(--bg-primary)',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 12,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ↗ Live Demo
          </motion.a>
        )}
        <motion.a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.03, borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
          whileTap={{ scale: 0.97 }}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            padding: '8px 16px',
            background: 'var(--bg-glass)',
            color: 'var(--accent-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 12,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
          }}
        >
          ⌥ GitHub
        </motion.a>
      </div>
    </div>
  );
}

export function WindowManager() {
  const { windows } = useStore();

  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100,
    }}>
      <AnimatePresence>
        {windows.map((win) => (
          <div key={win.id} style={{ pointerEvents: 'auto' }}>
            <DraggableWindow win={win} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
