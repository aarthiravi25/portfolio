/**
 * ActivitiesPanel.jsx
 * Diagnostic-log-style display for co-curricular activities.
 * Each activity renders as [CATEGORY] → Title with tags.
 */
import React from 'react';
import { motion } from 'framer-motion';
import data from '../data/data.json';

const categoryColors = {
  HACKATHON:     { color: '#ff6b6b', bg: '#ff6b6b11', border: '#ff6b6b44' },
  IDEATHON:      { color: '#c084fc', bg: '#c084fc11', border: '#c084fc44' },
  CLUB:          { color: '#4ade80', bg: '#4ade8011', border: '#4ade8044' },
  WORKSHOP:      { color: '#60a5fa', bg: '#60a5fa11', border: '#60a5fa44' },
  'OPEN-SOURCE': { color: '#c084fc', bg: '#c084fc11', border: '#c084fc44' },
  CERTIFICATION: { color: '#fbbf24', bg: '#fbbf2411', border: '#fbbf2444' },
};

const defaultIcons = {
  HACKATHON:     '🏆',
  IDEATHON:      '💡',
  CLUB:          '💻',
  WORKSHOP:      '📜',
  'OPEN-SOURCE': '🌐',
  CERTIFICATION: '📜',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
};

export default function ActivitiesPanel() {
  const activities = data.achievement_logs || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 16,
      }}
    >
      {activities.map((act, i) => {
        const catStyle = categoryColors[act.category] ?? {
          color: 'var(--accent-primary)',
          bg: 'var(--bg-glass)',
          border: 'var(--border-color)',
        };

        const icon = act.icon || defaultIcons[act.category] || '🌐';

        // Parse tags and Prize dynamically into the tags list
        const tags = [];
        if (act.Prize) {
          tags.push(`🏆 ${act.Prize}`);
        }
        if (act.tags) {
          if (Array.isArray(act.tags)) {
            tags.push(...act.tags);
          } else {
            tags.push(act.tags);
          }
        }

        return (
          <motion.div
            key={i}
            variants={cardVariants}
            className="activity-card"
            whileHover={{ y: -4 }}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 14,
              padding: '20px 22px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
            }}
          >
            {/* Left accent stripe */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 3,
              height: '100%',
              background: catStyle.color,
              opacity: 0.7,
              borderRadius: '3px 0 0 3px',
            }} />

            {/* Header: Category badge + icon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
            }}>
              <span style={{
                padding: '3px 10px',
                borderRadius: 6,
                fontSize: 10,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: catStyle.color,
                background: catStyle.bg,
                border: `1px solid ${catStyle.border}`,
              }}>
                {act.category}
              </span>
              <span style={{ fontSize: 18 }}>{icon}</span>
            </div>

            {/* Title */}
            <h4 style={{
              margin: '0 0 8px',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
            }}>
              {act.title}
            </h4>

            {/* Description with arrow prefix */}
            <div style={{
              display: 'flex',
              gap: 8,
              marginBottom: 14,
              fontSize: 12,
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
            }}>
              <span style={{ color: catStyle.color, fontWeight: 700, flexShrink: 0 }}>→</span>
              <span>{act.description}</span>
            </div>

            {/* Tags & Prizes */}
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {tags.map((tag, j) => (
                  <motion.span
                    key={j}
                    whileHover={{ scale: 1.06, y: -1 }}
                    style={{
                      padding: '3px 10px',
                      borderRadius: 6,
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--accent-secondary)',
                      cursor: 'default',
                    }}
                  >
                    # {tag}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
