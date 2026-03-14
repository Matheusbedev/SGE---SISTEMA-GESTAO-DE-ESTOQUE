import React, { useState } from 'react';
import { useMovimentacaoStore } from '../store/useMovimentacaoStore';
import { useProdutoStore } from '../store/useProdutoStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { EntradaForm } from '../components/movimentacoes/EntradaForm';
import { SaidaForm } from '../components/movimentacoes/SaidaForm';
import type { TipoMovimentacao } from '../types';

export function Movimentacoes() {
  const { movimentacoes, carregar } = useMovimentacaoStore();
  const produtos = useProdutoStore((s) => s.produtos);
  const [modalEntrada, setModalEntrada] = useState(false);
  const [modalSaida, setModalSaida] = useState(false);
  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<'' | TipoMovimentacao>('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const getProduto = (id: string) => produtos.find((p) => p.id === id);

  const filtradas = movimentacoes.filter((m) => {
    if (tipoFiltro && m.tipo !== tipoFiltro) return false;
    if (dataInicio && m.criadoEm < dataInicio) return false;
    if (dataFim && m.criadoEm > dataFim + 'T23:59:59') return false;
    if (busca) {
      const produto = getProduto(m.produtoId);
      if (!produto?.nome.toLowerCase().includes(busca.toLowerCase())) return false;
    }
    return true;
  });

  const totalEntradas = filtradas.filter((m) => m.tipo === 'ENTRADA').reduce((s, m) => s + m.quantidade, 0);
  const totalSaidas = filtradas.filter((m) => m.tipo === 'SAIDA').reduce((s, m) => s + m.quantidade, 0);

  const limparFiltros = () => {
    setBusca(''); setTipoFiltro(''); setDataInicio(''); setDataFim('');
    carregar({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Movimentações</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtradas.length} registro{filtradas.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="success" onClick={() => setModalEntrada(true)} icon={<span>⬆️</span>}>Entrada</Button>
          <Button variant="danger" onClick={() => setModalSaida(true)} icon={<span>⬇️</span>}>Saída</Button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg">⬆️</div>
          <div>
            <p className="text-xs text-emerald-600 font-medium">Total Entradas</p>
            <p className="text-xl font-bold text-emerald-700">{totalEntradas}</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-lg">⬇️</div>
          <div>
            <p className="text-xs text-red-600 font-medium">Total Saídas</p>
            <p className="text-xl font-bold text-red-700">{totalSaidas}</p>
          </div>
        </div>
      </div>

      <Card padding={false}>
        {/* Filtros */}
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
              className="w-48"
            />
            <Select
              options={[{ value: 'ENTRADA', label: 'Entradas' }, { value: 'SAIDA', label: 'Saídas' }]}
              placeholder="Todos os tipos"
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value as '' | TipoMovimentacao)}
              className="w-40"
            />
            <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="w-40" />
            <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="w-40" />
            {(busca || tipoFiltro || dataInicio || dataFim) && (
              <Button size="sm" variant="ghost" onClick={limparFiltros}>✕ Limpar</Button>
            )}
          </div>
        </div>

        {filtradas.length === 0 ? (
          <EmptyState icon="↕️" title="Nenhuma movimentação encontrada" description="Registre entradas e saídas de produtos" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data/Hora</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Produto</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Qtd</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Observação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtradas.map((m) => {
                  const produto = getProduto(m.produtoId);
                  return (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(m.criadoEm).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-gray-900">{produto?.nome ?? m.produtoId}</td>
                      <td className="px-6 py-3.5 text-center">
                        <Badge variant={m.tipo === 'ENTRADA' ? 'success' : 'danger'} dot>
                          {m.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <span className={`font-bold ${m.tipo === 'ENTRADA' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {m.tipo === 'ENTRADA' ? '+' : '-'}{m.quantidade}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-gray-400 text-xs hidden md:table-cell">
                        {m.observacao ?? '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalEntrada} onClose={() => setModalEntrada(false)} title="Registrar Entrada" subtitle="Adicionar produtos ao estoque" size="md">
        <EntradaForm onSuccess={() => setModalEntrada(false)} onCancel={() => setModalEntrada(false)} />
      </Modal>
      <Modal open={modalSaida} onClose={() => setModalSaida(false)} title="Registrar Saída" subtitle="Retirar produtos do estoque" size="md">
        <SaidaForm onSuccess={() => setModalSaida(false)} onCancel={() => setModalSaida(false)} />
      </Modal>
    </div>
  );
}
