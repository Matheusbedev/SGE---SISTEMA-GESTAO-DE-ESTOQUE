import React from 'react';
import { useAlertaStore } from '../store/useAlertaStore';
import { useProdutoStore } from '../store/useProdutoStore';
import { useEstoqueStore } from '../store/useEstoqueStore';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';

export function Alertas() {
  const { alertas, marcarComoLido, marcarTodosComoLido } = useAlertaStore();
  const produtos = useProdutoStore((s) => s.produtos);
  const { itens } = useEstoqueStore();
  const { toast } = useToast();

  const getProduto = (id: string) => produtos.find((p) => p.id === id);
  const getEstoque = (id: string) => itens.find((i) => i.produtoId === id);

  const handleMarcarTodos = () => {
    marcarTodosComoLido();
    toast('Todos os alertas foram marcados como lidos', 'success');
  };

  const handleMarcar = (id: string) => {
    marcarComoLido(id);
    toast('Alerta marcado como lido', 'info');
  };

  const zerados = alertas.filter((a) => a.tipo === 'ESTOQUE_ZERADO');
  const baixos = alertas.filter((a) => a.tipo === 'ESTOQUE_BAIXO');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {alertas.length === 0 ? 'Nenhum alerta ativo' : `${alertas.length} alerta${alertas.length > 1 ? 's' : ''} ativo${alertas.length > 1 ? 's' : ''}`}
          </p>
        </div>
        {alertas.length > 0 && (
          <Button variant="secondary" size="sm" onClick={handleMarcarTodos}>
            ✓ Marcar todos como lido
          </Button>
        )}
      </div>

      {alertas.length === 0 ? (
        <Card>
          <EmptyState
            icon="✅"
            title="Nenhum alerta ativo"
            description="Todos os produtos estão com estoque adequado. Continue monitorando!"
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {zerados.length > 0 && (
            <Card title="🔴 Estoque Zerado" subtitle={`${zerados.length} produto${zerados.length > 1 ? 's' : ''} sem estoque`} padding={false}>
              <div className="divide-y divide-gray-50">
                {zerados.map((alerta) => {
                  const produto = getProduto(alerta.produtoId);
                  const estoque = getEstoque(alerta.produtoId);
                  return (
                    <div key={alerta.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">
                          {produto?.nome?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{produto?.nome ?? alerta.produtoId}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="danger" dot>Estoque Zerado</Badge>
                            <span className="text-xs text-gray-400">
                              Mínimo: {estoque?.quantidadeMinima ?? alerta.quantidadeMinima}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">
                          {new Date(alerta.criadoEm).toLocaleDateString('pt-BR')}
                        </span>
                        <Button size="xs" variant="secondary" onClick={() => handleMarcar(alerta.id)}>
                          ✓ Lido
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {baixos.length > 0 && (
            <Card title="🟡 Estoque Baixo" subtitle={`${baixos.length} produto${baixos.length > 1 ? 's' : ''} abaixo do mínimo`} padding={false}>
              <div className="divide-y divide-gray-50">
                {baixos.map((alerta) => {
                  const produto = getProduto(alerta.produtoId);
                  const estoque = getEstoque(alerta.produtoId);
                  const pct = alerta.quantidadeMinima > 0
                    ? Math.round((alerta.quantidadeAtual / alerta.quantidadeMinima) * 100)
                    : 0;
                  return (
                    <div key={alerta.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm flex-shrink-0">
                          {produto?.nome?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">{produto?.nome ?? alerta.produtoId}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="warning" dot>Estoque Baixo</Badge>
                            <span className="text-xs text-gray-500">
                              {alerta.quantidadeAtual} / {estoque?.quantidadeMinima ?? alerta.quantidadeMinima} (mín)
                            </span>
                          </div>
                          <div className="mt-2 w-32 bg-gray-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${Math.min(100, pct)}%` }} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-gray-400">
                          {new Date(alerta.criadoEm).toLocaleDateString('pt-BR')}
                        </span>
                        <Button size="xs" variant="secondary" onClick={() => handleMarcar(alerta.id)}>
                          ✓ Lido
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
