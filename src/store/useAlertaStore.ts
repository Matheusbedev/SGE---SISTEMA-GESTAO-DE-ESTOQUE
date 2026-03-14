import { create } from 'zustand';
import type { Alerta } from '../types';
import * as alertaService from '../services/alertaService';

interface AlertaState {
  alertas: Alerta[];
  naoLidos: number;
  carregar: () => void;
  marcarComoLido: (id: string) => void;
  marcarTodosComoLido: () => void;
}

export const useAlertaStore = create<AlertaState>((set) => ({
  alertas: alertaService.listarAlertasAtivos(),
  naoLidos: alertaService.contarAlertasNaoLidos(),

  carregar: () => {
    const alertas = alertaService.listarAlertasAtivos();
    set({ alertas, naoLidos: alertas.length });
  },

  marcarComoLido: (id) => {
    alertaService.marcarComoLido(id);
    const alertas = alertaService.listarAlertasAtivos();
    set({ alertas, naoLidos: alertas.length });
  },

  marcarTodosComoLido: () => {
    alertaService.marcarTodosComoLido();
    set({ alertas: [], naoLidos: 0 });
  },
}));
