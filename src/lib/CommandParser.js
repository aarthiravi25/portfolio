/**
 * CommandParser.js
 * Modular, extensible command system with fuzzy matching and autocomplete.
 */

import data from '../data/data.json';
import { AIService } from '../services/AIService';

// ── Fuzzy Matcher ──────────────────────────────────────────────────────────
function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[a.length][b.length];
}

export function fuzzyMatch(input, commands) {
  const lower = input.toLowerCase();
  let best = null;
  let bestScore = Infinity;
  for (const cmd of commands) {
    const score = levenshtein(lower, cmd);
    if (score < bestScore && score <= 3) {
      bestScore = score;
      best = cmd;
    }
  }
  return best;
}

// ── ANSI-style colour helpers (interpreted by the Printer) ──────────────────
const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  magenta: (s) => `\x1b[35m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  white: (s) => `\x1b[37m${s}\x1b[0m`,
};

// ── Delay helper ────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Command Definitions ─────────────────────────────────────────────────────
export const COMMANDS = {
  help: {
    description: 'Show available commands',
    usage: 'help',
    handler: async function* () {
      yield c.cyan('╔══════════════════════════════════════════════════╗\r\n');
      yield c.cyan('║') + c.bold('          TerminalOS Command Reference           ') + c.cyan('║\r\n');
      yield c.cyan('╚══════════════════════════════════════════════════╝\r\n');
      yield '\r\n';
      const cmds = [
        ['help',           'Show this help menu'],
        ['about',          'Display personal bio'],
        ['projects',       'List all projects'],
        ['projects --open <id>', 'Open project in GUI window'],
        ['skills',         'Show skill matrix'],
        ['experience',     'Work history timeline'],
        ['education',      'Education timeline'],
        ['achievements',   'Personal achievement logs'],
        ['logs',           'System growth / career log'],
        ['contact',        'Contact information'],
        ['resume',         'Download / view resume'],
        ['neofetch',       'System stats (like Linux neofetch)'],
        ['theme <name>',   'Switch theme: matrix | cyberpunk | dark | light'],
        ['ask <query>',    'Ask the AI assistant a question'],
        ['gui',            'Switch to GUI / graphical mode'],
        ['github',         'Open GitHub profile in new tab'],
        ['clear',          'Clear terminal output'],
      ];
      for (const [cmd, desc] of cmds) {
        yield `  ${c.green(cmd.padEnd(28))} ${c.dim(desc)}\r\n`;
      }
      yield '\r\n';
      yield c.dim('  Tip: Use ↑/↓ arrows to navigate history • TAB to autocomplete\r\n');
    },
  },

  about: {
    description: 'Personal bio',
    usage: 'about',
    handler: async function* () {
      const { meta, about, professionalStatus } = data;
      yield '\r\n';
      yield c.cyan('  ┌─ WHO AM I ──────────────────────────────────────┐\r\n');
      yield `  │  ${c.bold(c.green(meta.name))}\r\n`;
      yield `  │  ${c.yellow(meta.title)}\r\n`;
      yield `  │  ${c.dim(meta.location)}\r\n`;
      yield `  │  ${meta.available ? c.green('● Available for hire') : c.red('● Not available')}\r\n`;
      if (professionalStatus) {
        yield `  │  ${c.cyan(`Status: [${professionalStatus.icon} ${professionalStatus.status}]`)}\r\n`;
      }
      yield c.cyan('  └────────────────────────────────────────────────┘\r\n');
      yield '\r\n';
      // Stream bio word-by-word for effect
      const words = about.split(' ');
      let currentLineLength = 2;
      yield '  ';
      for (const word of words) {
        await delay(18);
        if (currentLineLength + word.length + 1 > 70) {
          yield '\r\n  ' + word + ' ';
          currentLineLength = 2 + word.length + 1;
        } else {
          yield word + ' ';
          currentLineLength += word.length + 1;
        }
      }
      yield '\r\n\r\n';
    },
  },

  projects: {
    description: 'List all projects',
    usage: 'projects [--open <id>]',
    handler: async function* (args, actions) {
      const openIdx = args.indexOf('--open');
      if (openIdx !== -1) {
        const id = args[openIdx + 1];
        const project = data.projects.find((p) => p.id === id);
        if (!project) {
          yield c.red(`  Error: No project found with id "${id}"\r\n`);
          yield c.dim(`  Available IDs: ${data.projects.map((p) => p.id).join(', ')}\r\n`);
          return;
        }
        actions?.openProjectWindow(project);
        yield c.green(`  ✓ Opening "${project.name}" in GUI window...\r\n`);
        return;
      }

      yield '\r\n';
      yield c.cyan(`  ┌─ PROJECTS (${data.projects.length}) ────────────────────────────────┐\r\n`);
      for (const p of data.projects) {
        const statusColor = p.status === 'live' ? c.green : p.status === 'beta' ? c.yellow : c.dim;
        yield '\r\n';
        yield `  ${c.bold(c.white(p.name))}  ${statusColor(`[${p.status}]`)}  ${c.dim(p.year + '')}\r\n`;
        yield `  ${c.dim(p.id)}  •  ${c.cyan(p.category || 'Development')}\r\n`;
        yield `  ${p.description.slice(0, 72)}...\r\n`;
        yield `  ${c.dim('Tech:')} ${p.tech.join(', ')}\r\n`;
        if (p.live) yield `  ${c.dim('Live:')} ${c.green(p.live)}\r\n`;
        yield `  ${c.dim('GitHub:')} ${c.cyan(p.github)}\r\n`;
        yield `  ${c.dim('─'.repeat(52))}\r\n`;
      }
      yield '\r\n';
      yield c.dim('  Tip: projects --open <id> to open in GUI window\r\n\r\n');
    },
  },

  skills: {
    description: 'Show skill matrix',
    usage: 'skills',
    handler: async function* () {
      const { skills } = data;
      yield '\r\n';
      yield c.cyan('  ┌─ SKILL MATRIX ─────────────────────────────────┐\r\n');
      for (const [category, items] of Object.entries(skills)) {
        yield '\r\n';
        yield `  ${c.yellow('▸ ' + category.toUpperCase())}\r\n`;
        yield `  ${items.map((s) => c.green('  ' + s)).join('  ')}\r\n`;
      }
      yield '\r\n';
    },
  },

  experience: {
    description: 'Work history timeline',
    usage: 'experience',
    handler: async function* () {
      yield '\r\n';
      yield c.cyan('  ┌─ EXPERIENCE ───────────────────────────────────┐\r\n');
      if (!data.experience || data.experience.length === 0) {
        yield '\r\n';
        yield c.dim('  [ SYSTEM MESSAGE ]\r\n');
        yield `  No corporate work history logged yet. Focused on academic\r\n`;
        yield `  achievements, co-curricular logs, and full-stack projects.\r\n`;
        yield '\r\n';
        return;
      }
      for (const job of data.experience) {
        yield '\r\n';
        yield `  ${c.bold(c.green(job.company))}  ${c.dim(job.period)}\r\n`;
        yield `  ${c.yellow(job.role)}\r\n`;
        for (const h of job.highlights) {
          yield `  ${c.dim('•')} ${h}\r\n`;
        }
      }
      yield '\r\n';
    },
  },

  // ── EDUCATION TIMELINE ────────────────────────────────────────────────────
  education: {
    description: 'Education timeline',
    usage: 'education [details]',
    handler: async function* (args) {
      yield '\r\n';
      yield c.cyan('  ┌─ EDUCATION TIMELINE ───────────────────────────┐\r\n');
      yield '\r\n';

      for (let i = 0; i < data.education.length; i++) {
        const entry = data.education[i];

        // Glowing separator
        yield `  ${c.cyan('═'.repeat(54))}\r\n`;
        await delay(80);

        // Year node
        yield `  ${c.bold(c.green('◆'))} ${c.bold(c.yellow(entry.year))}\r\n`;
        await delay(40);

        // Title
        yield `  ${c.cyan('║')} ${c.bold(c.white(entry.title))}\r\n`;
        await delay(30);

        // Institution
        yield `  ${c.cyan('║')} ${c.magenta(entry.institution)}\r\n`;
        await delay(30);

        yield `  ${c.cyan('║')}\r\n`;

        // Description — progressive typing
        const words = entry.description.split(' ');
        let line = `  ${c.cyan('║')} `;
        let lineLen = 4;
        for (const word of words) {
          if (lineLen + word.length + 1 > 56) {
            yield line + '\r\n';
            line = `  ${c.cyan('║')} ${word} `;
            lineLen = 4 + word.length + 1;
          } else {
            line += word + ' ';
            lineLen += word.length + 1;
          }
          await delay(15);
        }
        yield line + '\r\n';

        yield `  ${c.cyan('║')}\r\n`;

        // CGPA or Percentage
        if (entry.CGPA) {
          yield `  ${c.cyan('║')} ${c.green('▸')} ${c.bold('CGPA:')} ${entry.CGPA}\r\n`;
          await delay(50);
        }
        if (entry.percentage) {
          yield `  ${c.cyan('║')} ${c.green('▸')} ${c.bold('Percentage:')} ${entry.percentage}\r\n`;
          await delay(50);
        }
        // Achievements
        if (entry.achievements && entry.achievements.length > 0) {
          for (const ach of entry.achievements) {
            yield `  ${c.cyan('║')} ${c.green('▸')} ${ach}\r\n`;
            await delay(50);
          }
        }

        if (i < data.education.length - 1) {
          yield `  ${c.cyan('║')}\r\n`;
        }
      }

      yield `  ${c.cyan('═'.repeat(54))}\r\n`;
      yield '\r\n';
    },
  },

  activities: {
    description: 'Personal achievement logs',
    usage: 'activities',
    handler: async function* () {
      yield* COMMANDS.achievements.handler();
    },
  },

  achievements: {
    description: 'Personal achievement logs',
    usage: 'achievements',
    handler: async function* () {
      yield '\r\n';
      yield c.cyan('  ┌─ ACHIEVEMENT LOGS ─────────────────────────────┐\r\n');
      yield '\r\n';

      const activitiesList = data.achievement_logs || [];
      const catColor = {
        HACKATHON:     c.red,
        IDEATHON:      c.magenta,
        CLUB:          c.green,
        WORKSHOP:      c.cyan,
        'OPEN-SOURCE': c.magenta,
        CERTIFICATION: c.yellow,
      };

      const defaultIcons = {
        HACKATHON:     '🏆',
        IDEATHON:      '💡',
        CLUB:          '💻',
        WORKSHOP:      '📜',
        'OPEN-SOURCE': '🌐',
        CERTIFICATION: '📜',
      };

      for (const act of activitiesList) {
        const colorFn = catColor[act.category] ?? c.white;
        const padCat = act.category.padEnd(14);
        const icon = act.icon || defaultIcons[act.category] || '🌐';

        // Category + title
        yield `  ${c.dim('[')}${colorFn(padCat)}${c.dim(']')} ${icon} ${c.bold(c.white(act.title))}\r\n`;
        await delay(60);

        // Description
        yield `  ${''.padEnd(18)}${c.dim('→')} ${act.description}\r\n`;
        await delay(30);

        // Map Prize and tags
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

        if (tags.length > 0) {
          const tagStr = tags.map((t) => c.cyan(`# ${t}`)).join('  ');
          yield `  ${''.padEnd(18)}${tagStr}\r\n`;
        }

        yield '\r\n';
        await delay(40);
      }
    },
  },

  // ── SYSTEM GROWTH LOG (BOOT DIAGNOSTIC) ───────────────────────────────────
  logs: {
    description: 'System growth / career log',
    usage: 'logs',
    handler: async function* () {
      yield '\r\n';
      yield c.cyan('  ┌─ SYSTEM GROWTH LOG ────────────────────────────┐\r\n');
      yield c.dim('  │  Boot Diagnostic · Career Progression Trace     │\r\n');
      yield c.cyan('  └────────────────────────────────────────────────┘\r\n');
      yield '\r\n';

      const eventColor = {
        SYSTEM_INIT:       c.green,
        MODULE_LOAD:       c.cyan,
        UPGRADE:           c.yellow,
        KERNEL_PATCH:      c.magenta,
        NETWORK_SYNC:      c.cyan,
        THREAT_NEUTRALIZED: c.red,
        DRIVER_INSTALL:    c.yellow,
        SYSTEM_UPGRADE:    c.green,
        DEPLOYMENT:        c.bold,
      };

      await delay(200);

      for (const entry of data.growthLog) {
        const colorFn = eventColor[entry.event] ?? c.white;
        const padEvent = entry.event.padEnd(18);

        // Timestamp
        yield `  ${c.dim('[')}${c.yellow(entry.timestamp)}${c.dim(']')} `;
        await delay(40);

        // Event type
        yield `${colorFn(padEvent)} `;
        await delay(30);

        // Message — progressive reveal
        for (let j = 0; j < entry.message.length; j++) {
          yield entry.message[j];
          if (j % 3 === 0) await delay(8);
        }

        // Checkmark
        await delay(60);
        yield `  ${c.green('✓')}\r\n`;
        await delay(80);
      }

      yield '\r\n';
      yield c.dim('  ─────────────────────────────────────────────────\r\n');
      yield `  ${c.green('  All systems operational.')} ${c.dim(`${data.growthLog.length} events logged.`)}\r\n`;
      yield '\r\n';
    },
  },

  // ── CONTACT (ENHANCED) ────────────────────────────────────────────────────
  contact: {
    description: 'Contact information',
    usage: 'contact',
    handler: async function* () {
      const { contact, professionalStatus } = data;
      yield '\r\n';
      yield c.cyan('  ┌─ CONTACT ──────────────────────────────────────┐\r\n');
      yield '\r\n';

      // Status line
      if (professionalStatus) {
        yield `  ${c.bold(c.green(`  ${professionalStatus.icon} Status: ${professionalStatus.status}`))}\r\n`;
        yield `  ${c.dim('  Focus:')} ${professionalStatus.focus.join(' · ')}\r\n`;
        yield '\r\n';
      }

      // Contact table
      const rows = [
        ['Email',    contact.email],
        ['GitHub',   contact.github],
        ['LinkedIn', contact.linkedin],
      ];

      yield `  ${c.dim('  ┌──────────┬────────────────────────────────────────┐')}\r\n`;
      for (const [label, val] of rows) {
        yield `  ${c.dim('  │')} ${c.cyan(label.padEnd(8))} ${c.dim('│')} ${c.green(val.padEnd(40))}${c.dim('│')}\r\n`;
      }
      yield `  ${c.dim('  └──────────┴────────────────────────────────────────┘')}\r\n`;
      yield '\r\n';
      yield `  ${c.yellow(`  Response time: ${contact.response_time}`)}\r\n`;
      yield '\r\n';
    },
  },

  // ── RESUME (FILE RETRIEVAL ANIMATION) ─────────────────────────────────────
  resume: {
    description: 'Download / view resume',
    usage: 'resume',
    handler: async function* () {
      yield '\r\n';
      yield c.cyan('  ┌─ FILE RETRIEVAL ───────────────────────────────┐\r\n');
      yield '\r\n';

      // Locate file
      yield `  ${c.dim('Locating:')} /usr/share/portfolio/Resume.pdf\r\n`;
      await delay(400);

      // Checksum
      yield `  ${c.dim('Verifying checksum...')}`;
      await delay(600);
      yield ` ${c.green('OK')}\r\n`;
      await delay(200);

      // Progress bar animation
      yield `  ${c.dim('Retrieving Resume.pdf...')} `;
      const barLen = 30;
      for (let i = 0; i <= barLen; i++) {
        const filled = '█'.repeat(i);
        const empty = '░'.repeat(barLen - i);
        const pct = Math.round((i / barLen) * 100);
        yield `\r  ${c.dim('Retrieving Resume.pdf...')} ${c.green(`[${filled}${empty}]`)} ${c.yellow(pct + '%')}`;
        await delay(40 + Math.random() * 40);
      }
      yield '\r\n\r\n';

      await delay(200);
      yield `  ${c.green('✓')} ${c.bold('File ready.')} Opening in new tab...\r\n`;
      yield '\r\n';

      // Actually open the PDF
      const url = data.meta.resumeUrl || '/resume.pdf';
      window.open(url, '_blank');
    },
  },

  neofetch: {
    description: 'System stats display',
    usage: 'neofetch',
    handler: async function* () {
      const { meta, professionalStatus } = data;
      const logo = [
        '  _____  ____   ____  ',
        ' |_   _|/ __ \\ / ____| ',
        '   | | | |  | | (___   ',
        '   | | | |  | |\\___ \\  ',
        '   | | | |__| |____) | ',
        '   |_|  \\____/|_____/  ',
      ];
      const info = [
        [meta.name, ''],
        ['─'.repeat(meta.name.length), ''],
        ['OS', meta.kernel],
        ['Shell', meta.shell],
        ['Uptime', meta.uptime],
        ['Resolution', meta.resolution],
        ['CPU', meta.cpu],
        ['Email', meta.email],
        ['Location', meta.location],
        ['Status', professionalStatus ? `${professionalStatus.icon} ${professionalStatus.status}` : (meta.available ? 'Available for hire' : 'Not available')],
      ];

      yield '\r\n';
      const rows = Math.max(logo.length, info.length);
      for (let i = 0; i < rows; i++) {
        const logoLine = (logo[i] ?? '').padEnd(32);
        const infoItem = info[i];
        let infoLine = '';
        if (infoItem) {
          const [key, val] = infoItem;
          infoLine = key === meta.name
            ? c.bold(c.green(key))
            : key.startsWith('─')
            ? c.green(key)
            : `${c.cyan(key.padEnd(12))}${c.white(val)}`;
        }
        yield `  ${c.green(logoLine)}  ${infoLine}\r\n`;
      }
      yield '\r\n';
      // Colour palette
      yield '  ';
      const colours = ['\x1b[40m', '\x1b[41m', '\x1b[42m', '\x1b[43m', '\x1b[44m', '\x1b[45m', '\x1b[46m', '\x1b[47m'];
      for (const col of colours) yield `${col}   \x1b[0m`;
      yield '\r\n\r\n';
    },
  },

  theme: {
    description: 'Switch colour theme',
    usage: 'theme <matrix|cyberpunk|dark|light>',
    handler: async function* (args, actions) {
      const name = args[0]?.toLowerCase();
      const valid = ['matrix', 'cyberpunk', 'dark', 'light'];
      if (!name || !valid.includes(name)) {
        yield c.red(`  Usage: theme <${valid.join('|')}>\r\n`);
        yield c.dim(`  Current themes: ${valid.join(', ')}\r\n`);
        return;
      }
      actions?.setTheme(name);
      yield c.green(`  ✓ Theme switched to "${name}"\r\n`);
    },
  },

  gui: {
    description: 'Switch to graphical mode',
    usage: 'gui',
    handler: async function* (args, actions) {
      yield c.green('  ✓ Launching GUI mode...\r\n');
      await delay(600);
      actions?.setView('gui');
    },
  },

  github: {
    description: 'Open GitHub profile',
    usage: 'github',
    handler: async function* () {
      window.open(data.meta.github, '_blank');
      yield c.green(`  ✓ Opened ${data.meta.github} in new tab\r\n`);
    },
  },

  ask: {
    description: 'Ask the AI assistant',
    usage: 'ask <your question>',
    handler: async function* (args) {
      const query = args.join(' ').trim();
      if (!query) {
        yield c.red('  Usage: ask <your question>\r\n');
        return;
      }
      yield c.dim(`  AI › Processing "${query}"...\r\n\r\n`);
      yield '  ';
      for await (const chunk of AIService.ask(query)) {
        yield chunk;
      }
      yield '\r\n\r\n';
    },
  },

  clear: {
    description: 'Clear the terminal',
    usage: 'clear',
    handler: async function* (args, actions) {
      actions?.clearTerminal();
    },
  },
};

export const COMMAND_NAMES = Object.keys(COMMANDS);

// ── Tab Autocomplete ────────────────────────────────────────────────────────
export function autocomplete(partial) {
  const lower = partial.toLowerCase();
  const matches = COMMAND_NAMES.filter((c) => c.startsWith(lower));
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) return { suggestions: matches };
  return null;
}

// ── Main Parser ─────────────────────────────────────────────────────────────
export async function* parseCommand(input, actions) {
  const trimmed = input.trim();
  if (!trimmed) return;

  const [rawCmd, ...args] = trimmed.split(' ');
  const cmd = rawCmd.toLowerCase();

  if (COMMANDS[cmd]) {
    yield* COMMANDS[cmd].handler(args, actions);
    return;
  }

  // Fuzzy match suggestion
  const suggestion = fuzzyMatch(cmd, COMMAND_NAMES);
  if (suggestion) {
    yield c.red(`  Command not found: "${cmd}"\r\n`);
    yield c.yellow(`  Did you mean: ${c.bold(suggestion)} ?\r\n`);
    yield c.dim('  Type "help" to list all commands.\r\n');
  } else {
    yield c.red(`  Command not found: "${cmd}"\r\n`);
    yield c.dim('  Type "help" to list all commands.\r\n');
  }
}
