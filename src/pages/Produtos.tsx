import React, { useState } from 'react';
import type { Produto } from '../types';
import { useProdutoStore } from '../store/useProdutoStore';
import { useEstoqueStore } from '../store/useEstoqueStore';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { ProdutoForm } from '../components/produtos/ProdutoForm';

export function Produtos() {
  const { produtos, setFiltros, remover } = useProdutoStore();
  const { itens } = useEstoqueStore();
  const { toast } = useToast();
  const [busca, setBusca] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Produto | undefined>();
  const [confirmDelete, setConfirmDelete] = useState<Produto | null>(null);

  const handleBusca = (v: string) => { setBusca(v); setFiltros({ nome: v }); };
  const handleRemover = () => {
    if (!confirmDelete) return;
    remover(confirmDelete.id);
    toast(`"${confirmDelete.nome}" removido`, 'success');
    setConfirmDelete(null);
  };
  const getEstoque = (id: string) => itens.find((i) => i.produtoId === id);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Produtos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{produtos.length} produto{produtos.length !== 1 ? 's' : ''} no catálogo</p>
        </div>
        <Button onClick={() => { setEditando(undefined); setModalOpen(true); }}
          icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
          Novo Produto
        </Button>
      </div>

      <Card padding={false}>
        <div className="px-5 py-4 border-b border-gray-100">
          <Input placeholder="Buscar produto..." value={busca} onChange={(e) => handleBusca(e.target.value)}
            leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            className="max-w-xs" />
        </div>

        {produtos.length === 0 ? (
          <EmptyState icon={<span>📦</span>} title="Nenhum produto cadastrado"
            description="Adicione produtos ao catálogo para começar a gerenciar seu estoque"
            action={<Button onClick={() => { setEditando(undefined); setModalOpen(true); }}
              icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
              Adicionar Produto
            </Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produto</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Código</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Custo</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Venda</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estoque</th>
                  <th className="px-5 py-3 w-20" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {produtos.map((p) => {
                  const est = getEstoque(p.id);
                  const zerado = est?.quantidadeAtual === 0;
                  const baixo = est && est.quantidadeAtual <= est.quantidadeMinima;
                  return (
                    <tr key={p.id} className="group hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                            {p.nome[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{p.nome}</p>
                            {p.descricao && <p className="text-xs text-gray-400 truncate max-w-[200px]">{p.descricao}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{p.codigoBarras}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-sm text-gray-500 hidden lg:table-cell">
                        R$ {p.precoCusto.toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="text-sm font-bold text-gray-900">R$ {p.precoVenda.toFixed(2)}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`text-sm font-bold ${zerado ? 'text-red-600' : baixo ? 'text-amber-600' : 'text-gray-900'}`}>
                            {est?.quantidadeAtual ?? 0}
                            <span className="text-xs font-normal text-gray-400 ml-1">{p.unidadeMedida}</span>
                          </span>
                          {zerado && <Badge variant="danger" dot size="sm">Zerado</Badge>}
                          {!zerado && baixo && <Badge variant="warning" dot size="sm">Baixo</Badge>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditando(p); setModalOpen(true); }}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Editar">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => setConfirmDelete(p)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Remover">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editando ? 'Editar Produto' : 'Novo Produto'}
        subtitle={editando ? editando.nome : 'Preencha os dados do produto'} size="lg">
        <ProdutoForm produto={editando}
          onSuccess={(msg) => { setModalOpen(false); toast(msg, 'success'); }}
          onCancel={() => setModalOpen(false)} />
      </Modal>

      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleRemover}
        title="Remover produto" message={`Deseja remover "${confirmDelete?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover" variant="danger" />
    </div>
  );
}
