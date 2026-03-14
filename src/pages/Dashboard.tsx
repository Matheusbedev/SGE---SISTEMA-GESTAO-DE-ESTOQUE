import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProdutoStore } from '../store/useProdutoStore';
import { useEstoqueStore } from '../store/useEstoqueStore';
import { useMovimentacaoStore } from '../store/useMovimentacaoStore';
import { useAlertaStore } from '../store/useAlertaStore';
import { useFornecedorStore } from '../store/useFornecedorStore';
import { obterValorTotalEstoque } from '../services/relatorioService';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { AlertaPanel } from '../components/alertas/AlertaPanel';

export function Dashboard() {
  const navigate = useNavigate();
  const produtos = useProdutoStore((s) => s.produtos);
  const { itens } = useEstoqueStore();
  const movimentacoes = useMovimentacaoStore((s) => s.movimentacoes);
  const naoLidos = useAlertaStore((s) => s.naoLidos);
  const fornecedores = useFornecedorStore((s) => s.fornecedores);

  const hoje = new Date().toISOString().split('T')[0];
  const movsHoje = movimentacoes.filter((m) => m.criadoEm.startsWith(hoje));
  const entradasHoje = movsHoje.filter((m) => m.tipo === 'ENTRADA').reduce((s, m) => s + m.quantidade, 0);
  const saidasHoje = movsHoje.filter((m) => m.tipo === 'SAIDA').reduce((s, m) => s + m.quantidade, 0);
  const valorTotal = obterValorTotalEstoque();

  const estoqueBaixo = itens.filter((i) => i.quantidadeAtual <= i.quantidadeMinima)
    .sort((a, b) => a.quantidadeAtual - b.quantidadeAtual).slice(0, 5);
  const ultimasMovs = movimentacoes.slice(0, 6);
  const getProduto = (id: string) => produtos.find((p) => p.id === id);

  // Activity last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('pt-BR', { weekday: 'short' });
    const count = movimentacoes.filter((m) => m.criadoEm.startsWith(key)).length;
    return { label, count, key };
  });
  const maxCount = Math.max(...last7.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5 capitalize">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => navigate('/movimentacoes')}
            icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>}>
            Movimentação
          </Button>
          <Button size="sm" onClick={() => navigate('/produtos')}
            icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
            Novo Produto
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Produtos Ativos" value={produtos.length} icon="📦" color="blue"
          subtitle={`${fornecedores.length} fornecedor${fornecedores.length !== 1 ? 'es' : ''}`}
          onClick={() => navigate('/produtos')} />
        <StatCard title="Valor em Estoque" value={`R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon="💰" color="emerald" subtitle="preço de custo" onClick={() => navigate('/estoque')} />
        <StatCard title="Hoje" value={movsHoje.length}
          icon="↕️" color="indigo"
          subtitle={`+${entradasHoje} entradas · -${saidasHoje} saídas`}
          onClick={() => navigate('/movimentacoes')} />
        <StatCard title="Alertas" value={naoLidos}
          icon="🔔" color={naoLidos > 0 ? 'red' : 'emerald'}
          subtitle={naoLidos > 0 ? 'requerem atenção' : 'tudo em ordem'}
          onClick={() => navigate('/alertas')} />
      </div>

      {/* Activity + Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity chart */}
        <Card title="Atividade — 7 dias" subtitle="Movimentações por dia"
          className="lg:col-span-2">
          <div className="flex items-end gap-2 h-28">
            {last7.map((d) => (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs font-semibold text-gray-700">{d.count > 0 ? d.count : ''}</span>
                <div className="w-full rounded-t-lg transition-all duration-500 bg-gradient-to-t from-blue-600 to-indigo-500 min-h-[4px]"
                  style={{ height: `${Math.max(4, (d.count / maxCount) * 80)}px` }} />
                <span className="text-xs text-gray-400 capitalize">{d.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Alertas */}
        <Card title="Alertas Ativos"
          action={<Button size="xs" variant="ghost" onClick={() => navigate('/alertas')}
            iconRight={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}>
            Ver todos
          </Button>}>
          <AlertaPanel compact />
        </Card>
      </div>

      {/* Estoque crítico + Últimas movs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Estoque Crítico" subtitle="Produtos abaixo do mínimo"
          action={<Button size="xs" variant="ghost" onClick={() => navigate('/estoque')}
            iconRight={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}>
            Ver estoque
          </Button>}>
          {estoqueBaixo.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">✅</div>
              <p className="text-sm text-gray-500 font-medium">Estoque saudável</p>
              <p className="text-xs text-gray-400">Todos os produtos estão adequados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {estoqueBaixo.map((item) => {
                const produto = getProduto(item.produtoId);
                const zerado = item.quantidadeAtual === 0;
                const pct = item.quantidadeMinima > 0 ? Math.min(100, (item.quantidadeAtual / item.quantidadeMinima) * 100) : 0;
                return (
                  <div key={item.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800 truncate">{produto?.nome ?? '—'}</span>
                      <Badge variant={zerado ? 'danger' : 'warning'} dot size="sm">
                        {zerado ? 'Zerado' : `${item.quantidadeAtual} / ${item.quantidadeMinima}`}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${zerado ? 'bg-red-500' : 'bg-amber-500'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card title="Últimas Movimentações" padding={false}
          action={<Button size="xs" variant="ghost" onClick={() => navigate('/movimentacoes')}
            iconRight={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}>
            Ver todas
          </Button>}>
          {ultimasMovs.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">Nenhuma movimentação ainda</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {ultimasMovs.map((m) => {
                const produto = getProduto(m.produtoId);
                const isEntrada = m.tipo === 'ENTRADA';
                return (
                  <div key={m.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isEntrada ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isEntrada ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{produto?.nome ?? m.produtoId}</p>
                      <p className="text-xs text-gray-400">{new Date(m.criadoEm).toLocaleString('pt-BR')}</p>
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ${isEntrada ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isEntrada ? '+' : '-'}{m.quantidade}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
