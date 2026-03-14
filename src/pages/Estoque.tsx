import React, { useState } from 'react';
import { useEstoqueStore } from '../store/useEstoqueStore';
import { useProdutoStore } from '../store/useProdutoStore';
import { useToast } from '../components/ui/Toast';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';

type Filtro = 'todos' | 'baixo' | 'zerado' | 'ok';

export function Estoque() {
  const { itens, definirMinimo, definirMaximo, definirLocalizacao } = useEstoqueStore();
  const produtos = useProdutoStore((s) => s.produtos);
  const { toast } = useToast();
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState({ minimo: '', maximo: '', localizacao: '' });
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const getProduto = (id: string) => produtos.find((p) => p.id === id);

  const abrirEdicao = (item: typeof itens[0]) => {
    setEditandoId(item.produtoId);
    setForm({
      minimo: item.quantidadeMinima.toString(),
      maximo: item.quantidadeMaxima?.toString() ?? '',
      localizacao: item.localizacao ?? '',
    });
  };

  const salvar = (produtoId: string) => {
    if (form.minimo !== '') definirMinimo(produtoId, parseInt(form.minimo));
    if (form.maximo !== '') definirMaximo(produtoId, parseInt(form.maximo));
    definirLocalizacao(produtoId, form.localizacao);
    setEditandoId(null);
    toast('Configurações de estoque salvas', 'success');
  };

  const itensFiltrados = itens.filter((item) => {
    const produto = getProduto(item.produtoId);
    if (!produto) return false;
    if (busca && !produto.nome.toLowerCase().includes(busca.toLowerCase())) return false;
    if (filtro === 'zerado') return item.quantidadeAtual === 0;
    if (filtro === 'baixo') return item.quantidadeAtual > 0 && item.quantidadeAtual <= item.quantidadeMinima;
    if (filtro === 'ok') return item.quantidadeAtual > item.quantidadeMinima;
    return true;
  });

  const counts = {
    todos: itens.length,
    zerado: itens.filter((i) => i.quantidadeAtual === 0).length,
    baixo: itens.filter((i) => i.quantidadeAtual > 0 && i.quantidadeAtual <= i.quantidadeMinima).length,
    ok: itens.filter((i) => i.quantidadeAtual > i.quantidadeMinima).length,
  };

  const tabs: { key: Filtro; label: string; color: string }[] = [
    { key: 'todos', label: 'Todos', color: 'text-gray-600' },
    { key: 'zerado', label: 'Zerado', color: 'text-red-600' },
    { key: 'baixo', label: 'Estoque Baixo', color: 'text-amber-600' },
    { key: 'ok', label: 'Normal', color: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
        <p className="text-sm text-gray-500 mt-0.5">{itens.length} item{itens.length !== 1 ? 'ns' : ''} no estoque</p>
      </div>

      <Card padding={false}>
        <div className="p-4 border-b border-gray-100 space-y-3">
          <Input
            placeholder="Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            className="max-w-sm"
          />
          <div className="flex gap-1 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFiltro(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filtro === tab.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs ${filtro === tab.key ? 'text-gray-300' : tab.color}`}>
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {itensFiltrados.length === 0 ? (
          <EmptyState icon="🏪" title="Nenhum item encontrado" description="Tente ajustar os filtros de busca" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Produto</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Atual</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Mínimo</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Máximo</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Localização</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {itensFiltrados.map((item) => {
                  const produto = getProduto(item.produtoId);
                  if (!produto) return null;
                  const zerado = item.quantidadeAtual === 0;
                  const baixo = item.quantidadeAtual <= item.quantidadeMinima;
                  const editando = editandoId === item.produtoId;
                  const pct = item.quantidadeMaxima
                    ? Math.min(100, (item.quantidadeAtual / item.quantidadeMaxima) * 100)
                    : null;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{produto.nome}</p>
                          <p className="text-xs text-gray-400">{produto.unidadeMedida}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className={`font-bold text-base ${zerado ? 'text-red-600' : baixo ? 'text-amber-600' : 'text-gray-900'}`}>
                            {item.quantidadeAtual}
                          </span>
                          {pct !== null && (
                            <div className="w-16 bg-gray-100 rounded-full h-1">
                              <div
                                className={`h-1 rounded-full ${zerado ? 'bg-red-500' : baixo ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {editando ? (
                          <Input type="number" min="0" value={form.minimo}
                            onChange={(e) => setForm((f) => ({ ...f, minimo: e.target.value }))}
                            className="w-20 text-right" />
                        ) : item.quantidadeMinima}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600 hidden lg:table-cell">
                        {editando ? (
                          <Input type="number" min="0" value={form.maximo}
                            onChange={(e) => setForm((f) => ({ ...f, maximo: e.target.value }))}
                            className="w-20 text-right" />
                        ) : (item.quantidadeMaxima ?? '—')}
                      </td>
                      <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">
                        {editando ? (
                          <Input value={form.localizacao}
                            onChange={(e) => setForm((f) => ({ ...f, localizacao: e.target.value }))}
                            placeholder="Ex: Prateleira A3" className="w-36" />
                        ) : (item.localizacao ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-md">
                            📍 {item.localizacao}
                          </span>
                        ) : '—')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {zerado
                          ? <Badge variant="danger" dot>Zerado</Badge>
                          : baixo
                          ? <Badge variant="warning" dot>Baixo</Badge>
                          : <Badge variant="success" dot>Normal</Badge>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {editando ? (
                          <div className="flex gap-1 justify-center">
                            <Button size="xs" variant="success" onClick={() => salvar(item.produtoId)}>Salvar</Button>
                            <Button size="xs" variant="secondary" onClick={() => setEditandoId(null)}>Cancelar</Button>
                          </div>
                        ) : (
                          <Button size="xs" variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => abrirEdicao(item)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
