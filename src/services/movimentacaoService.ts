import type { Movimentacao, FiltroMovimentacao } from '../types';
import { getAll, save } from '../store/storage';
import { generateId, now } from '../utils/uuid';
import { buscarPorId } from './produtoService';
import { obterEstoque, atualizarEstoque } from './estoqueService';
import { emitirAlerta } from './alertaService';

export function registrarEntrada(
  produtoId: string,
  quantidade: number,
  usuarioId: string,
  fornecedorId?: string,
  observacao?: string
): Movimentacao {
  if (quantidade <= 0) throw new Error('Quantidade deve ser maior que zero');

  const produto = buscarPorId(produtoId);
  if (!produto) throw new Error('Produto não encontrado');
  if (!produto.ativo) throw new Error('Produto inativo não pode receber entrada');

  atualizarEstoque(produtoId, quantidade);

  const mov: Movimentacao = {
    id: generateId(),
    produtoId,
    tipo: 'ENTRADA',
    quantidade,
    fornecedorId,
    usuarioId,
    observacao,
    criadoEm: now(),
  };
  save('movimentacoes', mov);
  return mov;
}

export function registrarSaida(
  produtoId: string,
  quantidade: number,
  usuarioId: string,
  observacao?: string
): Movimentacao {
  if (quantidade <= 0) throw new Error('Quantidade deve ser maior que zero');

  const estoque = obterEstoque(produtoId);
  if (!estoque) throw new Error('Estoque não encontrado para o produto');
  if (estoque.quantidadeAtual < quantidade)
    throw new Error(`Estoque insuficiente: disponível=${estoque.quantidadeAtual}`);

  const estoqueAtualizado = atualizarEstoque(produtoId, -quantidade);

  // Check and emit alert after stock update
  emitirAlerta(produtoId, estoqueAtualizado.quantidadeAtual, estoqueAtualizado.quantidadeMinima);

  const mov: Movimentacao = {
    id: generateId(),
    produtoId,
    tipo: 'SAIDA',
    quantidade,
    usuarioId,
    observacao,
    criadoEm: now(),
  };
  save('movimentacoes', mov);
  return mov;
}

export function listarMovimentacoes(filtros?: FiltroMovimentacao): Movimentacao[] {
  let movs = getAll<Movimentacao>('movimentacoes');

  if (filtros?.produtoId) movs = movs.filter((m) => m.produtoId === filtros.produtoId);
  if (filtros?.tipo) movs = movs.filter((m) => m.tipo === filtros.tipo);
  if (filtros?.dataInicio) movs = movs.filter((m) => m.criadoEm >= filtros.dataInicio!);
  if (filtros?.dataFim) movs = movs.filter((m) => m.criadoEm <= filtros.dataFim!);

  return movs.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
}

export function obterHistoricoProduto(produtoId: string): Movimentacao[] {
  return listarMovimentacoes({ produtoId });
}
