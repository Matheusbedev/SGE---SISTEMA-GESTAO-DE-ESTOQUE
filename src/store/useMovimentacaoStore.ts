import { create } from 'zustand';
import type { Movimentacao, FiltroMovimentacao } from '../types';
import * as movimentacaoService from '../services/movimentacaoService';

interface MovimentacaoState {
  movimentacoes: Movimentacao[];
  filtros: FiltroMovimentacao;
  carregar: (filtros?: FiltroMovimentacao) => void;
  registrarEntrada: (produtoId: string, quantidade: number, usuarioId: string, fornecedorId?: string, observacao?: string) => Movimentacao;
  registrarSaida: (produtoId: string, quantidade: number, usuarioId: string, observacao?: string) => Movimentacao;
}

export const useMovimentacaoStore = create<MovimentacaoState>((set, get) => ({
  movimentacoes: movimentacaoService.listarMovimentacoes(),
  filtros: {},

  carregar: (filtros) => {
    const f = filtros ?? get().filtros;
    set({ filtros: f, movimentacoes: movimentacaoService.listarMovimentacoes(f) });
  },

  registrarEntrada: (produtoId, quantidade, usuarioId, fornecedorId, observacao) => {
    const mov = movimentacaoService.registrarEntrada(produtoId, quantidade, usuarioId, fornecedorId, observacao);
    set({ movimentacoes: movimentacaoService.listarMovimentacoes(get().filtros) });
    return mov;
  },

  registrarSaida: (produtoId, quantidade, usuarioId, observacao) => {
    const mov = movimentacaoService.registrarSaida(produtoId, quantidade, usuarioId, observacao);
    set({ movimentacoes: movimentacaoService.listarMovimentacoes(get().filtros) });
    return mov;
  },
}));
