import React, { useEffect, useRef, useCallback } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { parseCommand, autocomplete, COMMAND_NAMES } from '../lib/CommandParser';
import { useStore } from '../store/useStore';
import { getXtermTheme } from '../lib/ThemeEngine';

const PROMPT = '\r\n\x1b[32m❯\x1b[0m \x1b[36m~\x1b[0m \x1b[32m$\x1b[0m ';

export default function Terminal() {
  const termRef      = useRef(null);
  const xtermRef     = useRef(null);
  const fitAddon     = useRef(null);
  const inputBuffer  = useRef('');
  const isStreaming  = useRef(false);

  const { theme, setTheme, setView, openWindow, addToHistory, navigateHistory } = useStore();

  // ── Actions passed into command handlers ──────────────────────────────────
  const actions = useCallback(() => ({
    setTheme,
    setView,
    openProjectWindow: (project) => {
      openWindow({
        id: `project-${project.id}`,
        type: 'project',
        title: project.name,
        data: project,
      });
      setView('gui');
    },
    clearTerminal: () => {
      xtermRef.current?.clear();
      writePrompt();
    },
  }), [setTheme, setView, openWindow]);  // eslint-disable-line

  const writePrompt = useCallback(() => {
    xtermRef.current?.write(PROMPT);
    inputBuffer.current = '';
  }, []);

  // ── Run a command string ───────────────────────────────────────────────────
  const runCommand = useCallback(async (input) => {
    if (isStreaming.current) return;
    const term = xtermRef.current;
    if (!term) return;

    term.write('\r\n');
    if (!input.trim()) { writePrompt(); return; }

    addToHistory(input);
    isStreaming.current = true;

    try {
      for await (const chunk of parseCommand(input, actions())) {
        term.write(chunk);
      }
    } catch (err) {
      term.write(`\r\n\x1b[31m  Runtime error: ${err.message}\x1b[0m\r\n`);
    } finally {
      isStreaming.current = false;
      writePrompt();
    }
  }, [actions, addToHistory, writePrompt]);

  // ── Boot sequence ─────────────────────────────────────────────────────────
  const runBoot = useCallback(async () => {
    const term = xtermRef.current;
    if (!term) return;

    const bootLines = [
      '\x1b[32m  ████████╗ ███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗      ██████╗ ███████╗\x1b[0m',
      '\x1b[32m     ██╔══╝ ██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     ██╔═══██╗██╔════╝\x1b[0m',
      '\x1b[32m     ██║    █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     ██║   ██║███████╗\x1b[0m',
      '\x1b[32m     ██║    ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     ██║   ██║╚════██║\x1b[0m',
      '\x1b[32m     ██║    ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗╚██████╔╝███████║\x1b[0m',
      '\x1b[32m     ╚═╝    ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚══════╝\x1b[0m',
      '',
      '\x1b[36m         Interactive Portfolio OS  ·  v2.4.1-LTS  ·  Kernel: TerminalOS\x1b[0m',
      '',
    ];

    const modules = [
      ['KERNEL',   'Loading core modules'],
      ['MEMORY',   'Allocating heap space'],
      ['FS',       'Mounting project filesystem'],
      ['NETWORK',  'Establishing connection'],
      ['RENDERER', 'Initialising display engine'],
      ['CLI',      'Registering command dispatcher'],
      ['THEME',    'Applying colour profile'],
      ['READY',    'System operational'],
    ];

    term.clear();
    await new Promise((r) => setTimeout(r, 300));
    for (const line of bootLines) {
      term.writeln(line);
      await new Promise((r) => setTimeout(r, 55));
    }
    await new Promise((r) => setTimeout(r, 200));

    for (const [mod, msg] of modules) {
      term.write(`\r  \x1b[2m[\x1b[0m\x1b[33m ${mod.padEnd(8)} \x1b[0m\x1b[2m]\x1b[0m  ${msg}...`);
      await new Promise((r) => setTimeout(r, 120 + Math.random() * 180));
      term.writeln(`  \x1b[32m✓\x1b[0m`);
    }

    await new Promise((r) => setTimeout(r, 350));
    term.writeln('');
    term.writeln('\x1b[2m  ──────────────────────────────────────────────────────────\x1b[0m');
    term.writeln('  Type \x1b[32mhelp\x1b[0m to see available commands.');
    term.writeln('  Type \x1b[36mgui\x1b[0m to switch to graphical mode.');
    term.writeln('\x1b[2m  ──────────────────────────────────────────────────────────\x1b[0m');
    writePrompt();
  }, [writePrompt]);

  // ── Initialise xterm.js ───────────────────────────────────────────────────
  useEffect(() => {
    if (!termRef.current) return;

    // Calculate responsive font size based on viewport width
    const getResponsiveFontSize = () => {
      const width = window.innerWidth;
      if (width < 480) return 10;      // Mobile: 10px
      if (width < 768) return 11;      // Small mobile: 11px
      if (width < 1024) return 12;     // Tablet: 12px
      if (width < 1440) return 13;     // Desktop: 13px
      return 14;                       // Large desktop: 14px
    };

    const term = new XTerm({
      fontSize: getResponsiveFontSize(),
      fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
      theme: getXtermTheme(theme),
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 5000,
      convertEol: false,
      allowTransparency: true,
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(termRef.current);
    fit.fit();

    xtermRef.current = term;
    fitAddon.current = fit;

    // ── Key handler ───────────────────────────────────────────────────────
    term.onData((data) => {
      if (isStreaming.current) return;

      const code = data.charCodeAt(0);

      // Enter
      if (data === '\r') {
        const cmd = inputBuffer.current;
        runCommand(cmd);
        return;
      }

      // Ctrl+C
      if (data === '\x03') {
        term.write('^C');
        writePrompt();
        return;
      }

      // Ctrl+L — clear
      if (data === '\x0c') {
        term.clear();
        writePrompt();
        return;
      }

      // Backspace
      if (data === '\x7f' || data === '\b') {
        if (inputBuffer.current.length > 0) {
          inputBuffer.current = inputBuffer.current.slice(0, -1);
          term.write('\b \b');
        }
        return;
      }

      // Tab autocomplete
      if (data === '\t') {
        const result = autocomplete(inputBuffer.current);
        if (typeof result === 'string') {
          const diff = result.slice(inputBuffer.current.length);
          inputBuffer.current = result;
          term.write(diff);
        } else if (result?.suggestions) {
          term.write('\r\n  ' + result.suggestions.join('   ') + '\r\n');
          term.write(PROMPT + inputBuffer.current);
        }
        return;
      }

      // Arrow Up
      if (data === '\x1b[A') {
        const val = navigateHistory('up');
        const clearLen = inputBuffer.current.length;
        term.write('\b \b'.repeat(clearLen));
        inputBuffer.current = val;
        term.write(val);
        return;
      }

      // Arrow Down
      if (data === '\x1b[B') {
        const val = navigateHistory('down');
        const clearLen = inputBuffer.current.length;
        term.write('\b \b'.repeat(clearLen));
        inputBuffer.current = val;
        term.write(val);
        return;
      }

      // Printable characters
      if (code >= 32) {
        inputBuffer.current += data;
        term.write(data);
      }
    });

    runBoot();

    // ── Responsive resize handler ────────────────────────────────────────
    const handleResize = () => {
      xtermRef.current.options.fontSize = getResponsiveFontSize();
      fit.fit();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, []); // eslint-disable-line

  // ── Re-apply theme when it changes ───────────────────────────────────────
  useEffect(() => {
    if (xtermRef.current) {
      xtermRef.current.options.theme = getXtermTheme(theme);
    }
  }, [theme]);

  return (
    <div
      ref={termRef}
      className="terminal-wrapper"
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--terminal-bg)',
        padding: '8px',
        boxSizing: 'border-box',
      }}
    />
  );
}
