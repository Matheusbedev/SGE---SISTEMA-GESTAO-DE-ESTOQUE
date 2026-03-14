import { create } from 'zustand';
import type { ItemEstoque } from '../types';
import * as estoqueService from '../services/estoqueService';

interface EstoqueState {
  itens: ItemEstoque[];
  carregar: () => void;
  definirMinimo: (produtoId: string, minimo: number) => void;
  definirMaximo: (produtoId: string, maximo: number) => void;
  definirLocalizacao: (produtoId: string, localizacao: string) => void;
}

export const useEstoqueStore = create<EstoqueState>((set) => ({
  itens: estoqueService.listarTodoEstoque(),

  carregar: () => {
    set({ itens: estoqueService.listarTodoEstoque() });
  },

  definirMinimo: (produtoId, minimo) => {
    estoqueService.definirEstoqueMinimo(produtoId, minimo);
    set({ itens: estoqueService.listarTodoEstoque() });
  },

  definirMaximo: (produtoId, maximo) => {
    estoqueService.definirEstoqueMaximo(produtoId, maximo);
    set({ itens: estoqueService.listarTodoEstoque() });
  },

  definirLocalizacao: (produtoId, localizacao) => {
    estoqueService.definirLocalizacao(produtoId, localizacao);
    set({ itens: estoqueService.listarTodoEstoque() });
  },
}));
