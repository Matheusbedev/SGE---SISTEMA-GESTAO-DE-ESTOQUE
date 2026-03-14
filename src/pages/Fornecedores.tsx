import React, { useState } from 'react';
import type { Fornecedor } from '../types';
import { useFornecedorStore } from '../store/useFornecedorStore';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { FornecedorForm } from '../components/fornecedores/FornecedorForm';

export function Fornecedores() {
  const { fornecedores, desativar } = useFornecedorStore();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Fornecedor | undefined>();
  const [confirmDelete, setConfirmDelete] = useState<Fornecedor | null>(null);
  const [busca, setBusca] = useState('');

  const formatCNPJ = (cnpj: string) =>
    cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');

  const filtrados = fornecedores.filter((f) =>
    !busca || f.nome.toLowerCase().includes(busca.toLowerCase()) || f.cnpj.includes(busca)
  );

  const handleDesativar = () => {
    if (!confirmDelete) return;
    desativar(confirmDelete.id);
    toast(`Fornecedor "${confirmDelete.nome}" removido`, 'success');
    setConfirmDelete(null);
  };

  const abrirNovo = () => { setEditando(undefined); setModalOpen(true); };
  const abrirEditar = (f: Fornecedor) => { setEditando(f); setModalOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fornecedores</h1>
          <p className="text-sm text-gray-500 mt-0.5">{fornecedores.length} fornecedor{fornecedores.length !== 1 ? 'es' : ''} cadastrado{fornecedores.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={abrirNovo} icon={<span>➕</span>}>Novo Fornecedor</Button>
      </div>

      <Card padding={false}>
        <div className="p-4 border-b border-gray-100">
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            className="max-w-sm"
          />
        </div>

        {filtrados.length === 0 ? (
          <EmptyState
            icon="🏭"
            title="Nenhum fornecedor encontrado"
            description="Cadastre fornecedores para vincular aos seus produtos"
            action={!busca ? <Button onClick={abrirNovo} icon={<span>➕</span>}>Adicionar Fornecedor</Button> : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">CNPJ</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Telefone</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtrados.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                          {f.nome[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{f.nome}</p>
                          {f.endereco && <p className="text-xs text-gray-400 truncate max-w-xs">{f.endereco}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs hidden md:table-cell">
                      {formatCNPJ(f.cnpj)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">{f.email ?? '—'}</td>
                    <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">{f.telefone ?? '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="xs" variant="ghost" onClick={() => abrirEditar(f)} title="Editar">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                        <Button size="xs" variant="ghost" onClick={() => setConfirmDelete(f)} title="Remover"
                          className="hover:bg-red-50 hover:text-red-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editando ? 'Editar Fornecedor' : 'Novo Fornecedor'}
        subtitle={editando ? `Editando: ${editando.nome}` : 'Preencha os dados do fornecedor'}
        size="md">
        <FornecedorForm
          fornecedor={editando}
          onSuccess={(msg) => { setModalOpen(false); toast(msg, 'success'); }}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDesativar}
        title="Remover fornecedor"
        message={`Tem certeza que deseja remover "${confirmDelete?.nome}"?`}
        confirmLabel="Remover"
        variant="danger"
      />
    </div>
  );
}
