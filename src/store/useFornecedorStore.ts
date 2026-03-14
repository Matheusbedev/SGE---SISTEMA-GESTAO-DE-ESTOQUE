import { create } from 'zustand';
import type { Fornecedor } from '../types';
import * as fornecedorService from '../services/fornecedorService';
import type { DadosFornecedor } from '../services/fornecedorService';

interface FornecedorState {
  fornecedores: Fornecedor[];
  carregar: () => void;
  cadastrar: (dados: DadosFornecedor) => Fornecedor;
  atualizar: (id: string, dados: Partial<DadosFornecedor>) => Fornecedor;
  desativar: (id: string) => void;
}

export const useFornecedorStore = create<FornecedorState>((set) => ({
  fornecedores: fornecedorService.listarFornecedores(),

  carregar: () => {
    set({ fornecedores: fornecedorService.listarFornecedores() });
  },

  cadastrar: (dados) => {
    const fornecedor = fornecedorService.cadastrarFornecedor(dados);
    set({ fornecedores: fornecedorService.listarFornecedores() });
    return fornecedor;
  },

  atualizar: (id, dados) => {
    const fornecedor = fornecedorService.atualizarFornecedor(id, dados);
    set({ fornecedores: fornecedorService.listarFornecedores() });
    return fornecedor;
  },

  desativar: (id) => {
    fornecedorService.desativarFornecedor(id);
    set({ fornecedores: fornecedorService.listarFornecedores() });
  },
}));
