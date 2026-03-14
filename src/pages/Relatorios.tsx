import React, { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { obterProdutosMaisVendidos, obterMovimentacoesPorPeriodo, obterValorTotalEstoque } from '../services/relatorioService';
import { usePapel } from '../store/useAuthStore';
import { useEstoqueStore } from '../store/useEstoqueStore';
import { useProdutoStore } from '../store/useProdutoStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import type { ProdutoVenda } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function primeiroDiaMes() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
}
function hoje() { return new Date().toISOString().split('T')[0]; }

export function Relatorios() {
  const papel = usePapel();
  const [dataInicio, setDataInicio] = useState(primeiroDiaMes());
  const [dataFim, setDataFim] = useState(hoje());
  const [limite, setLimite] = useState('10');
  const [dados, setDados] = useState<ProdutoVenda[]>([]);
  const [resumo, setResumo] = useState<{ total: number; entradas: number; saidas: number } | null>(null);
  const [erro, setErro] = useState('');
  const [carregado, setCarregado] = useState(false);
  const [loading, setLoading] = useState(false);

  const { itens } = useEstoqueStore();
  const produtos = useProdutoStore((s) => s.produtos);
  const valorTotal = obterValorTotalEstoque();

  const zerados = itens.filter((i) => i.quantidadeAtual === 0).length;
  const baixos = itens.filter((i) => i.quantidadeAtual > 0 && i.quantidadeAtual <= i.quantidadeMinima).length;
  const normais = itens.filter((i) => i.quantidadeAtual > i.quantidadeMinima).length;

  if (papel === 'operador') {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl">🔒</div>
        <p className="text-base font-semibold text-gray-700">Acesso restrito</p>
        <p className="text-sm text-gray-400">Apenas gerentes e administradores</p>
      </div>
    );
  }

  const buscar = () => {
    setErro(''); setLoading(true);
    try {
      const periodo = { dataInicio: dataInicio + 'T00:00:00.000Z', dataFim: dataFim + 'T23:59:59.999Z' };
      setDados(obterProdutosMaisVendidos(periodo, parseInt(limite) || 10));
      setResumo(obterMovimentacoesPorPeriodo(periodo));
      setCarregado(true);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao gerar relatório');
    } finally { setLoading(false); }
  };

  const barData = {
    labels: dados.map((d) => d.produto.nome.length > 18 ? d.produto.nome.slice(0, 18) + '…' : d.produto.nome),
    datasets: [{
      label: 'Qtd Vendida',
      data: dados.map((d) => d.totalVendido),
      backgroundColor: dados.map((_, i) => `hsla(${220 + i * 18}, 75%, 58%, 0.85)`),
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const donutData = {
    labels: ['Normal', 'Baixo', 'Zerado'],
    datasets: [{
      data: [normais, baixos, zerados],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500 mt-0.5">Análise de desempenho e movimentações</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Valor em Estoque" value={`R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon="💰" color="emerald" />
        <StatCard title="Produtos" value={produtos.length} icon="📦" color="blue" />
        {resumo ? <>
          <StatCard title="Entradas (período)" value={resumo.entradas} icon="⬆️" color="indigo" />
          <StatCard title="Saídas (período)" value={resumo.saidas} icon="⬇️" color="red" />
        </> : <>
          <StatCard title="Itens Normais" value={normais} icon="✅" color="emerald" />
          <StatCard title="Alertas" value={zerados + baixos} icon="⚠️" color={zerados + baixos > 0 ? 'amber' : 'emerald'} />
        </>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut */}
        <Card title="Status do Estoque" subtitle="Distribuição atual">
          <div className="flex flex-col items-center gap-4">
            <div style={{ width: 160, height: 160 }}>
              <Doughnut data={donutData} options={{
                cutout: '70%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` ${c.label}: ${c.parsed}` } } },
              }} />
            </div>
            <div className="w-full space-y-2">
              {[
                { label: 'Normal', value: normais, color: 'bg-emerald-500' },
                { label: 'Estoque Baixo', value: baixos, color: 'bg-amber-500' },
                { label: 'Zerado', value: zerados, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-gray-600">{item.label}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Filtros + resultado */}
        <Card title="Produtos Mais Vendidos" subtitle="Filtrar por período" className="lg:col-span-2">
          <div className="flex flex-wrap gap-3 items-end mb-5">
            <Input label="De" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="w-36" />
            <Input label="Até" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="w-36" />
            <Input label="Top" type="number" min="1" max="50" value={limite} onChange={(e) => setLimite(e.target.value)} className="w-20" />
            <Button onClick={buscar} loading={loading}
              icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}>
              Gerar
            </Button>
          </div>

          {erro && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-4">⚠ {erro}</div>}

          {carregado && dados.length === 0 && (
            <div className="text-center py-10">
              <div className="text-3xl mb-2">📭</div>
              <p className="text-sm text-gray-500">Nenhuma venda no período</p>
            </div>
          )}

          {dados.length > 0 && (
            <div style={{ height: 220 }}>
              <Bar data={barData} options={{
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` ${c.parsed.x} unidades` } } },
                scales: { x: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 } } }, y: { grid: { display: false }, ticks: { font: { size: 11 } } } },
              }} />
            </div>
          )}
        </Card>
      </div>

      {dados.length > 0 && (
        <Card title="Detalhamento" subtitle={`Top ${dados.length} produtos no período`} padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produto</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qtd Vendida</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Receita Est.</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Margem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dados.map((d, i) => {
                  const receita = d.totalVendido * d.produto.precoVenda;
                  const custo = d.totalVendido * d.produto.precoCusto;
                  const margem = receita > 0 ? ((receita - custo) / receita * 100) : 0;
                  return (
                    <tr key={d.produto.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{d.produto.nome}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-blue-600">{d.totalVendido}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                        R$ {receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3.5 text-right hidden lg:table-cell">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${margem >= 30 ? 'bg-emerald-100 text-emerald-700' : margem >= 10 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {margem.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
