/**
 * ThemeEngine.js
 * CSS-variable-based theming system.
 * Themes are defined here and injected into :root on demand.
 */

export const THEMES = {
  matrix: {
    '--bg-primary':      '#0a0f0a',
    '--bg-secondary':    '#0d150d',
    '--bg-surface':      '#111a11',
    '--bg-glass':        'rgba(0, 255, 65, 0.04)',
    '--border-color':    'rgba(0, 255, 65, 0.18)',
    '--accent-primary':  '#00ff41',
    '--accent-secondary':'#00cc34',
    '--accent-glow':     'rgba(0, 255, 65, 0.35)',
    '--text-primary':    '#00ff41',
    '--text-secondary':  '#00cc34',
    '--text-muted':      '#1a6b1a',
    '--text-inverse':    '#0a0f0a',
    '--terminal-bg':     '#050a05',
    '--cursor-color':    '#00ff41',
    '--scrollbar-color': 'rgba(0, 255, 65, 0.28)',
    '--shadow-glow':     '0 0 30px rgba(0, 255, 65, 0.2)',
    '--font-mono':       '"JetBrains Mono", "Fira Code", monospace',
    '--bg-nav':          'rgba(10, 15, 10, 0.85)',
  },
  cyberpunk: {
    '--bg-primary':      '#09010f',
    '--bg-secondary':    '#110222',
    '--bg-surface':      '#1a0535',
    '--bg-glass':        'rgba(255, 0, 255, 0.05)',
    '--border-color':    'rgba(255, 0, 255, 0.25)',
    '--accent-primary':  '#ff00ff',
    '--accent-secondary':'#00e5ff',
    '--accent-glow':     'rgba(255, 0, 255, 0.4)',
    '--text-primary':    '#ff00ff',
    '--text-secondary':  '#00e5ff',
    '--text-muted':      '#6b1a6b',
    '--text-inverse':    '#09010f',
    '--terminal-bg':     '#05000a',
    '--cursor-color':    '#ff00ff',
    '--scrollbar-color': 'rgba(255, 0, 255, 0.28)',
    '--shadow-glow':     '0 0 40px rgba(255, 0, 255, 0.25), 0 0 80px rgba(0, 229, 255, 0.1)',
    '--font-mono':       '"JetBrains Mono", "Fira Code", monospace',
    '--bg-nav':          'rgba(9, 1, 15, 0.85)',
  },
  dark: {
    '--bg-primary':      '#0e1117',
    '--bg-secondary':    '#161b22',
    '--bg-surface':      '#21262d',
    '--bg-glass':        'rgba(139, 92, 246, 0.06)',
    '--border-color':    'rgba(48, 54, 61, 0.8)',
    '--accent-primary':  '#8b5cf6',
    '--accent-secondary':'#06b6d4',
    '--accent-glow':     'rgba(139, 92, 246, 0.3)',
    '--text-primary':    '#e6edf3',
    '--text-secondary':  '#8b949e',
    '--text-muted':      '#484f58',
    '--text-inverse':    '#0e1117',
    '--terminal-bg':     '#090c10',
    '--cursor-color':    '#8b5cf6',
    '--scrollbar-color': 'rgba(139, 92, 246, 0.28)',
    '--shadow-glow':     '0 0 25px rgba(139, 92, 246, 0.15)',
    '--font-mono':       '"JetBrains Mono", "Fira Code", monospace',
    '--bg-nav':          'rgba(14, 17, 23, 0.85)',
  },
  light: {
    '--bg-primary':      '#f6f8fa',
    '--bg-secondary':    '#ffffff',
    '--bg-surface':      '#eaeef2',
    '--bg-glass':        'rgba(9, 105, 218, 0.05)',
    '--border-color':    'rgba(208, 215, 222, 0.9)',
    '--accent-primary':  '#0969da',
    '--accent-secondary':'#8250df',
    '--accent-glow':     'rgba(9, 105, 218, 0.2)',
    '--text-primary':    '#1f2328',
    '--text-secondary':  '#636c76',
    '--text-muted':      '#9198a1',
    '--text-inverse':    '#ffffff',
    '--terminal-bg':     '#ffffff',
    '--cursor-color':    '#0969da',
    '--scrollbar-color': 'rgba(9, 105, 218, 0.28)',
    '--shadow-glow':     '0 0 20px rgba(9, 105, 218, 0.1)',
    '--font-mono':       '"JetBrains Mono", "Fira Code", monospace',
    '--bg-nav':          'rgba(246, 248, 250, 0.85)',
  },
};

export function applyTheme(themeName) {
  const theme = THEMES[themeName];
  if (!theme) return;
  const root = document.documentElement;
  root.setAttribute('data-theme', themeName);
  for (const [key, val] of Object.entries(theme)) {
    root.style.setProperty(key, val);
  }
}

export function getXtermTheme(themeName) {
  const map = {
    matrix: {
      background: '#050a05',
      foreground: '#00ff41',
      cursor: '#00ff41',
      cursorAccent: '#050a05',
      selectionBackground: 'rgba(0,255,65,0.25)',
      black: '#0a0f0a', red: '#ff0000', green: '#00ff41',
      yellow: '#ffff00', blue: '#0066ff', magenta: '#cc00ff',
      cyan: '#00ffff', white: '#ccffcc',
      brightBlack: '#1a3a1a', brightRed: '#ff4444', brightGreen: '#66ff88',
      brightYellow: '#ffff66', brightBlue: '#4499ff', brightMagenta: '#dd44ff',
      brightCyan: '#44ffff', brightWhite: '#ffffff',
    },
    cyberpunk: {
      background: '#05000a',
      foreground: '#ff00ff',
      cursor: '#ff00ff',
      cursorAccent: '#05000a',
      selectionBackground: 'rgba(255,0,255,0.25)',
      black: '#09010f', red: '#ff0055', green: '#00ff88',
      yellow: '#ffee00', blue: '#0088ff', magenta: '#ff00ff',
      cyan: '#00e5ff', white: '#eebbff',
      brightBlack: '#3a0055', brightRed: '#ff4488', brightGreen: '#44ffaa',
      brightYellow: '#ffff44', brightBlue: '#44aaff', brightMagenta: '#ff44ff',
      brightCyan: '#44eeff', brightWhite: '#ffffff',
    },
    dark: {
      background: '#090c10',
      foreground: '#e6edf3',
      cursor: '#8b5cf6',
      cursorAccent: '#090c10',
      selectionBackground: 'rgba(139,92,246,0.3)',
      black: '#0e1117', red: '#ff6b6b', green: '#4ade80',
      yellow: '#ffd166', blue: '#60a5fa', magenta: '#8b5cf6',
      cyan: '#06b6d4', white: '#e6edf3',
      brightBlack: '#484f58', brightRed: '#ff8787', brightGreen: '#86efac',
      brightYellow: '#ffe884', brightBlue: '#93c5fd', brightMagenta: '#a78bfa',
      brightCyan: '#22d3ee', brightWhite: '#ffffff',
    },
    light: {
      background: '#ffffff',
      foreground: '#1f2328',
      cursor: '#0969da',
      cursorAccent: '#ffffff',
      selectionBackground: 'rgba(9,105,218,0.2)',
      black: '#24292f', red: '#cf222e', green: '#116329',
      yellow: '#9a6700', blue: '#0969da', magenta: '#8250df',
      cyan: '#1b7c83', white: '#6e7781',
      brightBlack: '#57606a', brightRed: '#a40e26', brightGreen: '#1a7f37',
      brightYellow: '#633c01', brightBlue: '#218bff', brightMagenta: '#a475f9',
      brightCyan: '#3192aa', brightWhite: '#8c959f',
    },
  };
  return map[themeName] ?? map.matrix;
}
