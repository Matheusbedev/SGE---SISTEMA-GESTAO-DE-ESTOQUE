import type { ItemEstoque } from '../types';
import { getAll, save } from '../store/storage';
import { generateId, now } from '../utils/uuid';

export function initEstoqueParaProduto(produtoId: string): ItemEstoque {
  const existing = getAll<ItemEstoque>('estoque').find((e) => e.produtoId === produtoId);
  if (existing) return existing;

  const item: ItemEstoque = {
    id: generateId(),
    produtoId,
    quantidadeAtual: 0,
    quantidadeMinima: 0,
    atualizadoEm: now(),
  };
  save('estoque', item);
  return item;
}

export function obterEstoque(produtoId: string): ItemEstoque | null {
  return getAll<ItemEstoque>('estoque').find((e) => e.produtoId === produtoId) ?? null;
}

export function atualizarEstoque(produtoId: string, delta: number): ItemEstoque {
  const item = obterEstoque(produtoId);
  if (!item) throw new Error('Estoque não encontrado para o produto');

  const novaQtd = item.quantidadeAtual + delta;
  if (novaQtd < 0) throw new Error(`Estoque insuficiente: disponível=${item.quantidadeAtual}`);

  const atualizado: ItemEstoque = { ...item, quantidadeAtual: novaQtd, atualizadoEm: now() };
  save('estoque', atualizado);
  return atualizado;
}

export function definirEstoqueMinimo(produtoId: string, minimo: number): void {
  const item = obterEstoque(produtoId);
  if (!item) throw new Error('Estoque não encontrado para o produto');
  save('estoque', { ...item, quantidadeMinima: minimo, atualizadoEm: now() });
}

export function definirEstoqueMaximo(produtoId: string, maximo: number): void {
  const item = obterEstoque(produtoId);
  if (!item) throw new Error('Estoque não encontrado para o produto');
  save('estoque', { ...item, quantidadeMaxima: maximo, atualizadoEm: now() });
}

export function definirLocalizacao(produtoId: string, localizacao: string): void {
  const item = obterEstoque(produtoId);
  if (!item) throw new Error('Estoque não encontrado para o produto');
  save('estoque', { ...item, localizacao, atualizadoEm: now() });
}

export function listarEstoqueBaixo(): ItemEstoque[] {
  return getAll<ItemEstoque>('estoque').filter(
    (e) => e.quantidadeAtual <= e.quantidadeMinima
  );
}

export function listarTodoEstoque(): ItemEstoque[] {
  return getAll<ItemEstoque>('estoque');
}
