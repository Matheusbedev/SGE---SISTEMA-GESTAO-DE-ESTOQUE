import React, { useState } from 'react';
import type { Fornecedor } from '../../types';
import { useFornecedorStore } from '../../store/useFornecedorStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface FornecedorFormProps {
  fornecedor?: Fornecedor;
  onSuccess: (msg: string) => void;
  onCancel: () => void;
}

export function FornecedorForm({ fornecedor, onSuccess, onCancel }: FornecedorFormProps) {
  const { cadastrar, atualizar } = useFornecedorStore();
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: fornecedor?.nome ?? '',
    cnpj: fornecedor?.cnpj ?? '',
    email: fornecedor?.email ?? '',
    telefone: fornecedor?.telefone ?? '',
    endereco: fornecedor?.endereco ?? '',
  });

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(''); setLoading(true);
    try {
      if (fornecedor) {
        atualizar(fornecedor.id, form);
        onSuccess(`Fornecedor "${form.nome}" atualizado com sucesso`);
      } else {
        cadastrar(form);
        onSuccess(`Fornecedor "${form.nome}" cadastrado com sucesso`);
      }
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao salvar fornecedor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nome *" value={form.nome} onChange={(e) => set('nome', e.target.value)} required placeholder="Razão social" />
      <Input label="CNPJ *" value={form.cnpj} onChange={(e) => set('cnpj', e.target.value)} placeholder="00.000.000/0000-00" required hint="Digite apenas os números ou com formatação" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="contato@empresa.com" />
        <Input label="Telefone" value={form.telefone} onChange={(e) => set('telefone', e.target.value)} placeholder="(00) 00000-0000" />
      </div>
      <Input label="Endereço" value={form.endereco} onChange={(e) => set('endereco', e.target.value)} placeholder="Rua, número, cidade" />
      {erro && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          ⚠ {erro}
        </div>
      )}
      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1" loading={loading}>
          {fornecedor ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
