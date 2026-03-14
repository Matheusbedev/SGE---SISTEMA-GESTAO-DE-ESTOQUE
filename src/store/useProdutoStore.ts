import { create } from 'zustand';
import type { Produto, FiltroProduto } from '../types';
import * as produtoService from '../services/produtoService';
import type { DadosProduto } from '../services/produtoService';

interface ProdutoState {
  produtos: Produto[];
  filtros: FiltroProduto;
  carregar: () => void;
  setFiltros: (filtros: FiltroProduto) => void;
  cadastrar: (dados: DadosProduto) => Produto;
  atualizar: (id: string, dados: Partial<DadosProduto>) => Produto;
  remover: (id: string) => void;
}

export const useProdutoStore = create<ProdutoState>((set, get) => ({
  produtos: produtoService.listarProdutos(),
  filtros: {},

  carregar: () => {
    set({ produtos: produtoService.listarProdutos(get().filtros) });
  },

  setFiltros: (filtros) => {
    set({ filtros, produtos: produtoService.listarProdutos(filtros) });
  },

  cadastrar: (dados) => {
    const produto = produtoService.cadastrarProduto(dados);
    set({ produtos: produtoService.listarProdutos(get().filtros) });
    return produto;
  },

  atualizar: (id, dados) => {
    const produto = produtoService.atualizarProduto(id, dados);
    set({ produtos: produtoService.listarProdutos(get().filtros) });
    return produto;
  },

  remover: (id) => {
    produtoService.removerProduto(id);
    set({ produtos: produtoService.listarProdutos(get().filtros) });
  },
}));
