import { create } from 'zustand';
import type { Usuario, PapelUsuario } from '../types';

// Simple predefined users for demo
const USUARIOS: Usuario[] = [
  { id: 'user-1', nome: 'Admin', email: 'admin@estoque.com', papel: 'admin' },
  { id: 'user-2', nome: 'Gerente', email: 'gerente@estoque.com', papel: 'gerente' },
  { id: 'user-3', nome: 'Operador', email: 'operador@estoque.com', papel: 'operador' },
];

interface AuthState {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => boolean;
  logout: () => void;
}

const STORAGE_KEY = 'sge:auth';

function loadAuth(): Usuario | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: loadAuth(),
  isAuthenticated: !!loadAuth(),

  login: (email: string, _senha: string) => {
    const usuario = USUARIOS.find((u) => u.email === email);
    if (!usuario) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    set({ usuario, isAuthenticated: true });
    return true;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ usuario: null, isAuthenticated: false });
  },
}));

export function useUsuarioId(): string {
  return useAuthStore((s) => s.usuario?.id ?? 'anonimo');
}

export function usePapel(): PapelUsuario | null {
  return useAuthStore((s) => s.usuario?.papel ?? null);
}
