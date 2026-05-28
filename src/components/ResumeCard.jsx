/**
 * ResumeCard.jsx
 * Glassmorphism "Utility Panel" with contact links, resume buttons,
 * magnetic hover effects, and OS-file-style icons.
 */
import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import data from '../data/data.json';
import StatusIndicator from './StatusIndicator';

function MagneticButton({ children, href, download, onClick, variant = 'primary', style: extraStyle = {} }) {
  const isPrimary = variant === 'primary';

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 22px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    textDecoration: 'none',
    cursor: 'pointer',
    border: isPrimary
      ? '1px solid var(--accent-primary)'
      : '1px solid var(--border-color)',
    background: isPrimary
      ? 'var(--accent-primary)'
      : 'var(--bg-glass)',
    color: isPrimary
      ? 'var(--bg-primary)'
      : 'var(--accent-primary)',
    ...extraStyle,
  };

  const Tag = href ? motion.a : motion.button;
  const linkProps = href
    ? { href, target: download ? undefined : '_blank', rel: download ? undefined : 'noreferrer', download: download || undefined }
    : { onClick };

  return (
    <Tag
      whileHover={{ scale: 1.04, y: -2, boxShadow: 'var(--shadow-glow)' }}
      whileTap={{ scale: 0.96 }}
      className="magnetic-btn"
      style={baseStyle}
      {...linkProps}
    >
      {children}
    </Tag>
  );
}

function ContactRow({ icon, label, value, href }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 16px',
        borderRadius: 10,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        marginBottom: 8,
        cursor: 'default',
      }}
    >
      {/* OS-file icon */}
      <span style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        flexShrink: 0,
      }}>
        {icon}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          marginBottom: 2,
        }}>
          {label}
        </div>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: 13,
            color: 'var(--accent-primary)',
            fontFamily: 'var(--font-mono)',
            textDecoration: 'none',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </a>
      </div>

      {/* Arrow indicator */}
      <span style={{
        color: 'var(--text-muted)',
        fontSize: 14,
        flexShrink: 0,
      }}>
        ↗
      </span>
    </motion.div>
  );
}

export default function ResumeCard() {
  const { meta, contact } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-color)',
        borderRadius: 20,
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glass shimmer effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: 'linear-gradient(90deg, transparent, var(--accent-primary), var(--accent-secondary), transparent)',
        opacity: 0.5,
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>
          <h3 style={{
            margin: '0 0 6px',
            fontSize: 20,
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-primary)',
          }}>
            Get In Touch
          </h3>
          <p style={{
            margin: 0,
            fontSize: 13,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
          }}>
            Response time: {contact.response_time}
          </p>
        </div>
        <StatusIndicator variant="inline" />
      </div>

      {/* Contact links */}
      <div style={{ marginBottom: 24 }}>
        <ContactRow
          icon="📧"
          label="Email"
          value={contact.email}
          href={`mailto:${contact.email}`}
        />
        <ContactRow
          icon="🔗"
          label="GitHub"
          value={contact.github.replace('https://', '')}
          href={contact.github}
        />
        <ContactRow
          icon="💼"
          label="LinkedIn"
          value={contact.linkedin.replace('https://www.', '')}
          href={contact.linkedin}
        />
      </div>

      {/* Resume action buttons */}
      <div style={{
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        <MagneticButton
          href={meta.resumeUrl}
          variant="primary"
        >
          <span style={{ fontSize: 16 }}>📄</span>
          View Resume
        </MagneticButton>
        <MagneticButton
          href={meta.resumeUrl}
          download="Aarthi_Ravi_Resume.pdf"
          variant="secondary"
        >
          <span style={{ fontSize: 16 }}>⬇️</span>
          Download
        </MagneticButton>
      </div>

      {/* Footer decoration */}
      <div style={{
        marginTop: 20,
        paddingTop: 16,
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
      }}>
        <span style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--accent-primary)',
          boxShadow: '0 0 6px var(--accent-primary)',
          animation: 'status-dot-pulse 2s ease-in-out infinite',
        }} />
        Connection secure · Encrypted via TLS 1.3
      </div>
    </motion.div>
  );
}
