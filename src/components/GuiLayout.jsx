import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import data from '../data/data.json';
import StatusIndicator from './StatusIndicator';
import EducationTimeline from './EducationTimeline';
import ActivitiesPanel from './ActivitiesPanel';
import ResumeCard from './ResumeCard';

const statusColor = { live: '#00ff41', beta: '#ffcc00', archived: '#888888' };
const statusBg    = { live: '#00ff4115', beta: '#ffcc0015', archived: '#88888815' };

// ── Skill Bar ──────────────────────────────────────────────────────────────
function SkillTag({ name }) {
  return (
    <motion.span
      whileHover={{ scale: 1.06, y: -2 }}
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        margin: '3px',
        borderRadius: 8,
        fontSize: 12,
        fontFamily: 'var(--font-mono)',
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-color)',
        color: 'var(--accent-secondary)',
        cursor: 'default',
        transition: 'box-shadow 0.2s',
      }}
    >
      {name}
    </motion.span>
  );
}

// ── Project Card ───────────────────────────────────────────────────────────
function ProjectCard({ project, onOpen }) {
  const formatUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: 'var(--shadow-glow)', borderColor: 'var(--accent-primary)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onClick={() => onOpen(project)}
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
      {/* Accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
        opacity: 0.8,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          {project.name}
        </h3>
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: 20,
          background: statusBg[project.status],
          color: statusColor[project.status],
          border: `1px solid ${statusColor[project.status]}44`,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          flexShrink: 0,
        }}>
          {project.status}
        </span>
      </div>

      <p style={{
        color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.6,
        margin: '0 0 16px', display: '-webkit-box',
        WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        flexGrow: 1,
      }}>
        {project.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 18 }}>
        {project.tech.slice(0, 4).map((t) => (
          <span key={t} style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 6,
            background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
            color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)',
          }}>{t}</span>
        ))}
        {project.tech.length > 4 && (
          <span style={{ fontSize: 10, color: 'var(--text-muted)', padding: '2px 4px', fontFamily: 'var(--font-mono)' }}>
            +{project.tech.length - 4}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 'auto', width: '100%' }}>
        {project.live && (
          <motion.a
            href={formatUrl(project.live)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.03, boxShadow: 'var(--shadow-glow)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--bg-primary)',
              background: 'var(--accent-primary)',
              border: '1px solid var(--accent-primary)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              transition: 'box-shadow 0.2s ease',
            }}
          >
            <span>↗</span> Live
          </motion.a>
        )}
        <motion.a
          href={formatUrl(project.github)}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          whileHover={{ scale: 1.03, borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            flex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-glass)',
            textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
            transition: 'border-color 0.2s ease, color 0.2s ease',
          }}
        >
          <span>⌥</span> GitHub
        </motion.a>
      </div>
    </motion.div>
  );
}

// ── Hero Terminal Simulation ──────────────────────────────────────────────
function HeroTerminal() {
  const [lines, setLines] = React.useState([]);
  const [currentCommand, setCurrentCommand] = React.useState('');
  const [phase, setPhase] = React.useState('typing'); // typing -> printing -> done

  React.useEffect(() => {
    let active = true;
    const runAnimation = async () => {
      await new Promise(r => setTimeout(r, 600));
      if (!active) return;

      const cmd = 'neofetch';
      for (let i = 0; i <= cmd.length; i++) {
        await new Promise(r => setTimeout(r, 90));
        if (!active) return;
        setCurrentCommand(cmd.slice(0, i));
      }

      await new Promise(r => setTimeout(r, 250));
      if (!active) return;

      setPhase('printing');
      setCurrentCommand('neofetch');

      const logoLines = [
        '  _____  ____   ____  ',
        ' |_   _|/ __ \\ / ____| ',
        '   | | | |  | | (___   ',
        '   | | | |  | |\\___ \\  ',
        '   | | | |__| |____) | ',
        '   |_|  \\____/|_____/  '
      ];

      const infoLines = [
        'aarthiravi@TerminalOS',
        '---------------------',
        'OS: TerminalOS v2.4.1-LTS',
        'Kernel: tsh v1.0.0',
        'Uptime: 42d 7h 12m',
        'Shell: React/Vite DualMode',
        'Status: OPEN FOR INTERNSHIPS',
        'Focus: Fullstack Development · AI/ML',
        'Location: Chennai, India'
      ];

      const maxLines = Math.max(logoLines.length, infoLines.length);
      for (let i = 0; i < maxLines; i++) {
        await new Promise(r => setTimeout(r, 100));
        if (!active) return;

        const logoPart = (logoLines[i] || '').padEnd(30);
        const infoPart = infoLines[i] || '';

        setLines(prev => [...prev, { logo: logoPart, info: infoPart }]);
      }

      setPhase('done');
    };

    runAnimation();
    return () => {
      active = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ y: -5, boxShadow: 'var(--shadow-glow)' }}
      style={{
        width: '100%',
        maxWidth: 480,
        background: 'var(--terminal-bg, #050a05)',
        border: '1px solid var(--border-color)',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        lineHeight: 1.5,
        color: 'var(--text-primary)',
        textAlign: 'left',
      }}
    >
      {/* Title bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'rgba(0, 0, 0, 0.25)',
        borderBottom: '1px solid var(--border-color)',
        opacity: 0.85,
      }} >
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-secondary)', opacity: 0.8 }}>guest@terminalos: ~</span>
        <div style={{ width: 38 }} />
      </div>

      {/* Content */}
      <div style={{ padding: '16px 20px', minHeight: 220, overflow: 'hidden' }}>
        {/* Command line */}
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
          <span style={{ color: 'var(--accent-primary)', marginRight: 8 }}>guest@terminalos:~$</span>
          <span>{currentCommand}</span>
          {phase === 'typing' && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'steps(2)' }}
              style={{
                display: 'inline-block',
                width: 7,
                height: 14,
                background: 'var(--cursor-color, #00ff41)',
                marginLeft: 2,
              }}
            />
          )}
        </div>

        {/* Logo and Info output */}
        {lines.map((line, idx) => (
          <div key={idx} style={{ display: 'flex', whiteSpace: 'pre', minHeight: 18 }}>
            <span style={{ color: 'var(--accent-primary)', marginRight: 10, flexShrink: 0 }}>
              {line.logo}
            </span>
            <span style={{
              color: idx === 0 ? 'var(--accent-primary)' : idx === 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
              fontWeight: idx === 0 ? 700 : 400
            }}>
              {line.info}
            </span>
          </div>
        ))}

        {/* Prompt line once done */}
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ marginTop: 12, display: 'flex', alignItems: 'center' }}
          >
            <span style={{ color: 'var(--accent-primary)', marginRight: 8 }}>guest@terminalos:~$</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'steps(2)' }}
              style={{
                display: 'inline-block',
                width: 7,
                height: 14,
                background: 'var(--cursor-color, #00ff41)',
              }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ── Experience Timeline ────────────────────────────────────────────────────
function ExperienceItem({ job, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.1 }}
      style={{
        display: 'flex', gap: 16, marginBottom: 24, position: 'relative',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 12 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-primary)', marginTop: 4 }} />
        <div style={{ width: 1, flex: 1, background: 'var(--border-color)', marginTop: 4 }} />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent-primary)' }}>{job.company}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{job.role} · {job.period}</div>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {job.highlights.map((h, idx) => (
            <li key={idx} style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>{h}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ── GUI Layout ─────────────────────────────────────────────────────────────
export default function GuiLayout() {
  const { setView, setTheme, theme, openWindow } = useStore();
  const { meta, about, skills, projects, experience } = data;

  const themes = ['matrix', 'cyberpunk', 'dark', 'light'];

  function handleOpenProject(project) {
    openWindow({
      id: `project-${project.id}`,
      type: 'project',
      title: project.name,
      data: project,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-nav, rgba(10, 15, 10, 0.85))',
        backdropFilter: 'blur(12px)',
        padding: '12px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: 'var(--bg-primary)',
          }}>T</div>
          <span style={{ color: 'var(--accent-primary)', fontSize: 15, fontWeight: 700 }}>TerminalOS</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>v2.4.1</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>·</span>
          <StatusIndicator variant="inline" />
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {themes.map((t) => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setTheme(t)}
              style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                background: theme === t ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: theme === t ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: `1px solid ${theme === t ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                textTransform: 'capitalize',
              }}
            >
              {t}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setView('cli')}
            style={{
              marginLeft: 8, padding: '6px 16px', borderRadius: 8, cursor: 'pointer',
              background: 'var(--bg-glass)',
              border: '1px solid var(--accent-primary)',
              color: 'var(--accent-primary)',
              fontSize: 12, fontFamily: 'var(--font-mono)',
            }}
          >
            ⌨ CLI Mode
          </motion.button>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>

        {/* ── Hero ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '40px',
            marginBottom: 80,
            textAlign: 'left',
            flexWrap: 'wrap',
          }}
        >
          {/* Hero text section */}
          <div style={{ flex: '1 1 500px', minWidth: 280 }}>
            <h1 style={{
              margin: '0 0 12px',
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
            }}>
              {meta.name}
            </h1>
            <h2 style={{
              margin: '0 0 24px', fontSize: 'clamp(16px, 2.5vw, 22px)',
              fontWeight: 400, color: 'var(--accent-primary)', letterSpacing: '0.02em',
            }}>
              {meta.title}
            </h2>
            <p style={{
              maxWidth: 640, color: 'var(--text-secondary)', lineHeight: 1.7,
              fontSize: 14, margin: '0 0 32px',
            }}>
              {about}
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <motion.a
                href={`mailto:${meta.email}`}
                whileHover={{ scale: 1.05, boxShadow: 'var(--shadow-glow)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '10px 24px', borderRadius: 10, fontSize: 13,
                  background: 'var(--accent-primary)',
                  color: 'var(--bg-primary)',
                  textDecoration: 'none', fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                ✉ Contact
              </motion.a>
              <motion.a
                href={meta.github}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05, borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '10px 24px', borderRadius: 10, fontSize: 13,
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  transition: 'border-color 0.2s ease, color 0.2s ease',
                }}
              >
                ⌥ GitHub
              </motion.a>
            </div>
          </div>

          {/* Hero neofetch terminal simulation */}
          <div style={{ flex: '1 1 380px', display: 'flex', justifyContent: 'center', minWidth: 280 }}>
            <HeroTerminal />
          </div>
        </motion.section>

        {/* ── Projects ── */}
        <section style={{ marginBottom: 80 }}>
          <SectionHeader title="Projects" count={projects.length} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 18,
          }}>
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <ProjectCard project={p} onOpen={handleOpenProject} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Skills ── */}
        <section style={{ marginBottom: 80 }}>
          <SectionHeader title="Skills" />
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}>
            {Object.entries(skills).map(([cat, items]) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12, padding: 18,
                }}
              >
                <div style={{
                  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em',
                  color: 'var(--accent-primary)', marginBottom: 12,
                }}>{cat}</div>
                <div>{items.map((s) => <SkillTag key={s} name={s} />)}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Experience ── */}
        {/* ── Experience ── */}
        {experience && experience.length > 0 && (
          <section style={{ marginBottom: 80 }}>
            <SectionHeader title="Experience" />
            {experience.map((job, i) => (
              <ExperienceItem key={job.company} job={job} i={i} />
            ))}
          </section>
        )}

        {/* ── Education ── */}
        <section style={{ marginBottom: 80 }}>
          <SectionHeader title="Education" count={data.education.length} />
          <EducationTimeline />
        </section>

        {/* ── Activities ── */}
        <section style={{ marginBottom: 80 }}>
          <SectionHeader title="Achievements" count={(data.achievement_logs || []).length} />
          <ActivitiesPanel />
        </section>

        {/* ── Contact & Resume ── */}
        <section style={{ marginBottom: 40 }}>
          <SectionHeader title="Contact & Resume" />
          <ResumeCard />
        </section>

      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '20px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'var(--text-muted)', fontSize: 11,
      }}>
        <span>© 2024 {meta.name} · Built with TerminalOS</span>
        <span>{meta.kernel}</span>
      </footer>
    </motion.div>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
    }}>
      <h2 style={{
        margin: 0, fontSize: 22, fontWeight: 700,
        color: 'var(--text-primary)', letterSpacing: '-0.01em',
      }}>
        {title}
      </h2>
      {count !== undefined && (
        <span style={{
          fontSize: 11, padding: '2px 8px', borderRadius: 20,
          background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
          color: 'var(--accent-primary)',
        }}>
          {count}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
    </div>
  );
}
