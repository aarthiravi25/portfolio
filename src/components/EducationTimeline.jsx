/**
 * EducationTimeline.jsx
 * Vertical "Cyber-Timeline" with Framer Motion whileInView animations.
 * Lines draw dynamically, nodes pulse on hover, achievements stagger in.
 */
import React from 'react';
import { motion } from 'framer-motion';
import data from '../data/data.json';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

const achievementVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.3 },
  }),
};

export default function EducationTimeline() {
  const { education } = data;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      style={{ position: 'relative', paddingLeft: 40 }}
    >
      {/* Animated vertical line */}
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: 14,
          top: 0,
          width: 2,
          background: `linear-gradient(180deg, var(--accent-primary), var(--accent-secondary), transparent)`,
          borderRadius: 2,
          zIndex: 1,
        }}
      />

      {education.map((entry, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          style={{
            position: 'relative',
            marginBottom: i < education.length - 1 ? 48 : 0,
            paddingLeft: 20,
          }}
        >
          {/* Timeline node */}
          <motion.div
            whileHover={{
              scale: 1.4,
              boxShadow: '0 0 20px var(--accent-primary), 0 0 40px var(--accent-glow)',
            }}
            style={{
              position: 'absolute',
              left: -33,
              top: 4,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'var(--bg-primary)',
              border: '3px solid var(--accent-primary)',
              boxShadow: '0 0 8px var(--accent-glow)',
              zIndex: 2,
              cursor: 'pointer',
              animation: 'node-pulse 3s ease-in-out infinite',
            }}
          />

          {/* Year badge */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              background: 'var(--bg-glass)',
              border: '1px solid var(--accent-primary)',
              color: 'var(--accent-primary)',
              marginBottom: 12,
              letterSpacing: '0.06em',
              boxShadow: '0 0 10px var(--accent-glow)',
            }}
          >
            {entry.year}
          </motion.div>

          {/* Content card */}
          <motion.div
            whileHover={{ y: -3, boxShadow: 'var(--shadow-glow)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 14,
              padding: '20px 24px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), transparent)',
              opacity: 0.6,
            }} />

            <h3 style={{
              margin: '0 0 4px',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
            }}>
              {entry.title}
            </h3>

            <div style={{
              fontSize: 12,
              color: 'var(--accent-secondary)',
              fontFamily: 'var(--font-mono)',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{ opacity: 0.7 }}>⌂</span>
              {entry.institution}
            </div>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: 13,
              lineHeight: 1.7,
              margin: '0 0 16px',
            }}>
              {entry.description}
            </p>

            {/* Achievements & Metrics */}
            {(entry.achievements || entry.CGPA || entry.percentage) && (
              <div>
                <div style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--text-muted)',
                  marginBottom: 8,
                  fontFamily: 'var(--font-mono)',
                }}>
                  Key Metrics & Achievements
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {entry.CGPA && (
                    <motion.div
                      variants={achievementVariants}
                      custom={0}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-color)',
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span style={{ color: 'var(--accent-primary)', fontSize: 10, fontWeight: 700 }}>▸</span>
                      <span><strong>CGPA:</strong> {entry.CGPA}</span>
                    </motion.div>
                  )}
                  {entry.percentage && (
                    <motion.div
                      variants={achievementVariants}
                      custom={0}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-color)',
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span style={{ color: 'var(--accent-primary)', fontSize: 10, fontWeight: 700 }}>▸</span>
                      <span><strong>Percentage:</strong> {entry.percentage}</span>
                    </motion.div>
                  )}
                  {entry.achievements && entry.achievements.map((ach, j) => (
                    <motion.div
                      key={j}
                      custom={j + 1}
                      variants={achievementVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-color)',
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span style={{ color: 'var(--accent-primary)', fontSize: 10, fontWeight: 700 }}>▸</span>
                      <span>{ach}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
