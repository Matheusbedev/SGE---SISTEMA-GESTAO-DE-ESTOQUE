import type { Produto, FiltroProduto } from '../types';
import { getAll, save, getById } from '../store/storage';
import { generateId, now } from '../utils/uuid';
import { initEstoqueParaProduto } from './estoqueService';

export interface DadosProduto {
  nome: string;
  descricao?: string;
  codigoBarras: string;
  categoriaId?: string;
  fornecedorPadraoId?: string;
  precoCusto: number;
  precoVenda: number;
  unidadeMedida: string;
}



export function cadastrarProduto(dados: DadosProduto): Produto {
  if (!dados.nome.trim()) throw new Error('Nome do produto é obrigatório');
  if (dados.precoVenda < dados.precoCusto)
    throw new Error('Preço de venda não pode ser menor que o preço de custo');

  const existente = buscarPorCodigoBarras(dados.codigoBarras);
  if (existente) throw new Error(`Código de barras já cadastrado para o produto: ${existente.nome}`);

  const produto: Produto = {
    id: generateId(),
    nome: dados.nome.trim(),
    descricao: dados.descricao,
    codigoBarras: dados.codigoBarras,
    categoriaId: dados.categoriaId,
    fornecedorPadraoId: dados.fornecedorPadraoId,
    precoCusto: dados.precoCusto,
    precoVenda: dados.precoVenda,
    unidadeMedida: dados.unidadeMedida,
    ativo: true,
    criadoEm: now(),
    atualizadoEm: now(),
  };

  save('produtos', produto);
  initEstoqueParaProduto(produto.id);
  return produto;
}

export function atualizarProduto(id: string, dados: Partial<DadosProduto>): Produto {
  const produto = buscarPorId(id);
  if (!produto) throw new Error('Produto não encontrado');

  if (dados.nome !== undefined && !dados.nome.trim())
    throw new Error('Nome do produto é obrigatório');

  const precoCusto = dados.precoCusto ?? produto.precoCusto;
  const precoVenda = dados.precoVenda ?? produto.precoVenda;
  if (precoVenda < precoCusto)
    throw new Error('Preço de venda não pode ser menor que o preço de custo');

  if (dados.codigoBarras && dados.codigoBarras !== produto.codigoBarras) {
    const existente = buscarPorCodigoBarras(dados.codigoBarras);
    if (existente) throw new Error(`Código de barras já cadastrado para o produto: ${existente.nome}`);
  }

  const atualizado: Produto = {
    ...produto,
    ...dados,
    nome: dados.nome?.trim() ?? produto.nome,
    atualizadoEm: now(),
  };

  save('produtos', atualizado);
  return atualizado;
}

export function buscarPorId(id: string): Produto | null {
  return getById<Produto>('produtos', id);
}

export function buscarPorCodigoBarras(codigo: string): Produto | null {
  const produtos = getAll<Produto>('produtos');
  return produtos.find((p) => p.ativo && p.codigoBarras === codigo) ?? null;
}

export function listarProdutos(filtros?: FiltroProduto): Produto[] {
  let produtos = getAll<Produto>('produtos').filter((p) => p.ativo);

  if (filtros?.nome) {
    const nome = filtros.nome.toLowerCase();
    produtos = produtos.filter((p) => p.nome.toLowerCase().includes(nome));
  }
  if (filtros?.categoriaId) {
    produtos = produtos.filter((p) => p.categoriaId === filtros.categoriaId);
  }
  if (filtros?.fornecedorId) {
    produtos = produtos.filter((p) => p.fornecedorPadraoId === filtros.fornecedorId);
  }

  return produtos;
}

export function removerProduto(id: string): boolean {
  const produto = buscarPorId(id);
  if (!produto) return false;
  const inativo: Produto = { ...produto, ativo: false, atualizadoEm: now() };
  save('produtos', inativo);
  return true;
}
