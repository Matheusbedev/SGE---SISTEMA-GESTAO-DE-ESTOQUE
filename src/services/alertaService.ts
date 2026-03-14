import type { Alerta, TipoAlerta } from '../types';
import { getAll, save } from '../store/storage';
import { generateId, now } from '../utils/uuid';

export function emitirAlerta(produtoId: string, quantidadeAtual: number, quantidadeMinima: number): Alerta | null {
  let tipo: TipoAlerta;
  if (quantidadeAtual === 0) {
    tipo = 'ESTOQUE_ZERADO';
  } else if (quantidadeAtual <= quantidadeMinima) {
    tipo = 'ESTOQUE_BAIXO';
  } else {
    return null;
  }

  // Avoid duplicate active alerts of same type
  const existente = getAll<Alerta>('alertas').find(
    (a) => a.produtoId === produtoId && a.tipo === tipo && !a.lido
  );
  if (existente) return existente;

  const alerta: Alerta = {
    id: generateId(),
    produtoId,
    tipo,
    quantidadeAtual,
    quantidadeMinima,
    lido: false,
    criadoEm: now(),
  };
  save('alertas', alerta);
  return alerta;
}

export function listarAlertasAtivos(): Alerta[] {
  return getAll<Alerta>('alertas').filter((a) => !a.lido);
}

export function marcarComoLido(alertaId: string): void {
  const alertas = getAll<Alerta>('alertas');
  const alerta = alertas.find((a) => a.id === alertaId);
  if (alerta) {
    save('alertas', { ...alerta, lido: true });
  }
}

export function marcarTodosComoLido(): void {
  const alertas = getAll<Alerta>('alertas');
  alertas.forEach((a) => {
    if (!a.lido) save('alertas', { ...a, lido: true });
  });
}

export function contarAlertasNaoLidos(): number {
  return listarAlertasAtivos().length;
}
