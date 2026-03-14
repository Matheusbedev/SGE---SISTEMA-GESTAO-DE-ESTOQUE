import type { Periodo, ProdutoVenda, Movimentacao } from '../types';
import { getAll } from '../store/storage';
import { buscarPorId } from './produtoService';
import { listarTodoEstoque } from './estoqueService';

export function obterProdutosMaisVendidos(periodo: Periodo, limite: number): ProdutoVenda[] {
  if (limite <= 0) throw new Error('Limite deve ser maior que zero');
  if (periodo.dataInicio > periodo.dataFim)
    throw new Error('Data de início não pode ser posterior à data de fim');

  const movs = getAll<Movimentacao>('movimentacoes').filter(
    (m) =>
      m.tipo === 'SAIDA' &&
      m.criadoEm >= periodo.dataInicio &&
      m.criadoEm <= periodo.dataFim
  );

  const mapa = new Map<string, number>();
  for (const mov of movs) {
    mapa.set(mov.produtoId, (mapa.get(mov.produtoId) ?? 0) + mov.quantidade);
  }

  const sorted = [...mapa.entries()].sort((a, b) => b[1] - a[1]).slice(0, limite);

  const result: ProdutoVenda[] = [];
  for (const [produtoId, totalVendido] of sorted) {
    const produto = buscarPorId(produtoId);
    if (produto) result.push({ produto, totalVendido });
  }
  return result;
}

export function obterMovimentacoesPorPeriodo(periodo: Periodo) {
  if (periodo.dataInicio > periodo.dataFim)
    throw new Error('Data de início não pode ser posterior à data de fim');

  const movs = getAll<Movimentacao>('movimentacoes').filter(
    (m) => m.criadoEm >= periodo.dataInicio && m.criadoEm <= periodo.dataFim
  );

  const entradas = movs.filter((m) => m.tipo === 'ENTRADA').reduce((s, m) => s + m.quantidade, 0);
  const saidas = movs.filter((m) => m.tipo === 'SAIDA').reduce((s, m) => s + m.quantidade, 0);

  return { total: movs.length, entradas, saidas, movimentacoes: movs };
}

export function obterValorTotalEstoque(): number {
  const estoque = listarTodoEstoque();
  let total = 0;
  for (const item of estoque) {
    const produto = buscarPorId(item.produtoId);
    if (produto) total += produto.precoCusto * item.quantidadeAtual;
  }
  return total;
}
