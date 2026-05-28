import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import data from '../data/data.json';

const DEFAULT_THEME = 'matrix';

export const useStore = create(
  persist(
    (set, get) => ({
      // ── View ─────────────────────────────────────────────
      view: 'cli',               // 'cli' | 'gui'
      setView: (view) => set({ view }),
      toggleView: () => set((s) => ({ view: s.view === 'cli' ? 'gui' : 'cli' })),

      // ── Professional Status (from data) ──────────────────
      professionalStatus: data.professionalStatus ?? {
        status: 'AVAILABLE',
        focus: [],
        availability: 'Open',
        icon: '🟢',
      },

      // ── Active GUI Section ───────────────────────────────
      activeGuiSection: 'hero',
      setActiveGuiSection: (section) => set({ activeGuiSection: section }),

      // ── Theme ─────────────────────────────────────────────
      theme: DEFAULT_THEME,      // 'matrix' | 'cyberpunk' | 'dark' | 'light'
      setTheme: (theme) => {
        const validThemes = ['matrix', 'cyberpunk', 'dark', 'light'];
        if (!validThemes.includes(theme)) return false;
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
        return true;
      },

      // ── Command History ────────────────────────────────────
      commandHistory: [],
      historyIndex: -1,
      addToHistory: (cmd) =>
        set((s) => ({
          commandHistory: [cmd, ...s.commandHistory].slice(0, 100),
          historyIndex: -1,
        })),
      navigateHistory: (direction) => {
        const { commandHistory, historyIndex } = get();
        if (direction === 'up') {
          const next = Math.min(historyIndex + 1, commandHistory.length - 1);
          set({ historyIndex: next });
          return commandHistory[next] ?? '';
        } else {
          const next = Math.max(historyIndex - 1, -1);
          set({ historyIndex: next });
          return next === -1 ? '' : commandHistory[next] ?? '';
        }
      },

      // ── Windows (Window Manager) ───────────────────────────
      windows: [],
      openWindow: (win) =>
        set((s) => ({
          windows: s.windows.find((w) => w.id === win.id)
            ? s.windows.map((w) => (w.id === win.id ? { ...w, minimized: false } : w))
            : [...s.windows, { ...win, minimized: false, zIndex: Date.now() }],
        })),
      closeWindow: (id) =>
        set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),
      focusWindow: (id) =>
        set((s) => ({
          windows: s.windows.map((w) =>
            w.id === id ? { ...w, zIndex: Date.now(), minimized: false } : w
          ),
        })),
      minimizeWindow: (id) =>
        set((s) => ({
          windows: s.windows.map((w) =>
            w.id === id ? { ...w, minimized: true } : w
          ),
        })),
      closeAllWindows: () => set({ windows: [] }),

      // ── Boot ──────────────────────────────────────────────
      bootComplete: false,
      setBootComplete: (v) => set({ bootComplete: v }),
    }),
    {
      name: 'terminalos-state',
      partialize: (s) => ({ theme: s.theme, commandHistory: s.commandHistory }),
    }
  )
);
