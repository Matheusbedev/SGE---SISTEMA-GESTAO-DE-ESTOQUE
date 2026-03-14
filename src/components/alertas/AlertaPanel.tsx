import React from 'react';
import { useAlertaStore } from '../../store/useAlertaStore';
import { useProdutoStore } from '../../store/useProdutoStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface AlertaPanelProps {
  compact?: boolean;
}

export function AlertaPanel({ compact = false }: AlertaPanelProps) {
  const { alertas, marcarComoLido, marcarTodosComoLido } = useAlertaStore();
  const produtos = useProdutoStore((s) => s.produtos);

  const getProduto = (id: string) => produtos.find((p) => p.id === id);
  const lista = compact ? alertas.slice(0, 5) : alertas;

  if (alertas.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 gap-2">
        <span className="text-3xl">✅</span>
        <p className="text-sm text-gray-500">Nenhum alerta ativo</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {!compact && (
        <div className="flex justify-end mb-3">
          <Button size="xs" variant="ghost" onClick={marcarTodosComoLido}>✓ Marcar todos como lido</Button>
        </div>
      )}
      {lista.map((alerta) => {
        const produto = getProduto(alerta.produtoId);
        const isZerado = alerta.tipo === 'ESTOQUE_ZERADO';
        return (
          <div
            key={alerta.id}
            className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
              isZerado ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base flex-shrink-0">{isZerado ? '🔴' : '🟡'}</span>
              <div className="min-w-0">
                <p className={`text-sm font-semibold truncate ${isZerado ? 'text-red-800' : 'text-amber-800'}`}>
                  {produto?.nome ?? alerta.produtoId}
                </p>
                <p className={`text-xs mt-0.5 ${isZerado ? 'text-red-500' : 'text-amber-600'}`}>
                  {isZerado ? 'Estoque zerado' : `${alerta.quantidadeAtual} un (mín: ${alerta.quantidadeMinima})`}
                </p>
              </div>
            </div>
            <Button size="xs" variant="ghost" onClick={() => marcarComoLido(alerta.id)}
              className={`flex-shrink-0 ml-2 ${isZerado ? 'hover:bg-red-100 text-red-600' : 'hover:bg-amber-100 text-amber-600'}`}>
              ✓
            </Button>
          </div>
        );
      })}
      {compact && alertas.length > 5 && (
        <p className="text-xs text-center text-gray-400 pt-1">+{alertas.length - 5} alertas adicionais</p>
      )}
    </div>
  );
}
