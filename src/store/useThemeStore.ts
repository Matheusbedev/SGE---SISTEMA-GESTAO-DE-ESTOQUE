import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem('sge:theme') as Theme | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('sge:theme', theme);
}

const initial = loadTheme();
applyTheme(initial);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initial,

  toggle: () => {
    const next: Theme = get().theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    set({ theme: next });
  },

  setTheme: (t) => {
    applyTheme(t);
    set({ theme: t });
  },
}));
