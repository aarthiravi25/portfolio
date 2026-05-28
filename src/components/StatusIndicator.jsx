/**
 * StatusIndicator.jsx
 * Reusable "System Status" badge component.
 * Variants: 'inline' (compact badge) | 'full' (card with focus areas)
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function StatusIndicator({ variant = 'inline' }) {
  const { professionalStatus } = useStore();
  const { status, focus, availability, icon } = professionalStatus;

  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '3px 10px',
          borderRadius: 20,
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          background: 'var(--bg-glass)',
          border: '1px solid var(--border-color)',
          color: 'var(--accent-primary)',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          className="status-dot"
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            boxShadow: '0 0 6px var(--accent-primary)',
          }}
        />
        <span>{status}</span>
      </motion.div>
    );
  }

  // Full variant — card with focus areas
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 20px',
        borderRadius: 12,
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-color)',
        backdropFilter: 'blur(8px)',
        marginBottom: 20,
      }}
    >
      {/* Pulsing status dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          className="status-dot"
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            boxShadow: '0 0 8px var(--accent-primary)',
          }}
        />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--accent-primary)',
          letterSpacing: '0.04em',
        }}>
          {icon} {status}
        </span>
      </div>

      {/* Separator */}
      <div style={{
        width: 1,
        height: 28,
        background: 'var(--border-color)',
      }} />

      {/* Focus areas */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {focus.map((f) => (
          <span
            key={f}
            style={{
              padding: '3px 10px',
              borderRadius: 6,
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--accent-secondary)',
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Availability */}
      <span style={{
        marginLeft: 'auto',
        fontSize: 10,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>
        {availability}
      </span>
    </motion.div>
  );
}
