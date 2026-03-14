import React, { useState } from 'react';
import type { Produto } from '../../types';
import { useProdutoStore } from '../../store/useProdutoStore';
import { useFornecedorStore } from '../../store/useFornecedorStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { BarcodeScanner } from '../barcode/BarcodeScanner';

interface ProdutoFormProps {
  produto?: Produto;
  onSuccess: (msg: string) => void;
  onCancel: () => void;
}

export function ProdutoForm({ produto, onSuccess, onCancel }: ProdutoFormProps) {
  const { cadastrar, atualizar } = useProdutoStore();
  const fornecedores = useFornecedorStore((s) => s.fornecedores);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nome: produto?.nome ?? '',
    descricao: produto?.descricao ?? '',
    codigoBarras: produto?.codigoBarras ?? '',
    fornecedorPadraoId: produto?.fornecedorPadraoId ?? '',
    precoCusto: produto?.precoCusto?.toString() ?? '0',
    precoVenda: produto?.precoVenda?.toString() ?? '0',
    unidadeMedida: produto?.unidadeMedida ?? 'un',
  });

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(''); setLoading(true);
    try {
      const dados = {
        nome: form.nome,
        descricao: form.descricao || undefined,
        codigoBarras: form.codigoBarras,
        fornecedorPadraoId: form.fornecedorPadraoId || undefined,
        precoCusto: parseFloat(form.precoCusto) || 0,
        precoVenda: parseFloat(form.precoVenda) || 0,
        unidadeMedida: form.unidadeMedida,
      };
      if (produto) {
        atualizar(produto.id, dados);
        onSuccess(`Produto "${dados.nome}" atualizado com sucesso`);
      } else {
        cadastrar(dados);
        onSuccess(`Produto "${dados.nome}" cadastrado com sucesso`);
      }
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  const fornecedorOptions = fornecedores.map((f) => ({ value: f.id, label: f.nome }));
  const unidadeOptions = [
    { value: 'un', label: 'Unidade (un)' },
    { value: 'kg', label: 'Quilograma (kg)' },
    { value: 'L', label: 'Litro (L)' },
    { value: 'cx', label: 'Caixa (cx)' },
    { value: 'pç', label: 'Peça (pç)' },
    { value: 'm', label: 'Metro (m)' },
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nome *" value={form.nome} onChange={(e) => set('nome', e.target.value)} required placeholder="Nome do produto" />
        <Input label="Descrição" value={form.descricao} onChange={(e) => set('descricao', e.target.value)} placeholder="Descrição opcional" />
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input label="Código de Barras *" value={form.codigoBarras} onChange={(e) => set('codigoBarras', e.target.value)} required placeholder="EAN-13 ou outro" />
          </div>
          <Button type="button" variant="secondary" onClick={() => setScannerOpen(true)} title="Escanear código">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Preço de Custo (R$)" type="number" step="0.01" min="0" value={form.precoCusto} onChange={(e) => set('precoCusto', e.target.value)} />
          <Input label="Preço de Venda (R$)" type="number" step="0.01" min="0" value={form.precoVenda} onChange={(e) => set('precoVenda', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Unidade de Medida" options={unidadeOptions} value={form.unidadeMedida} onChange={(e) => set('unidadeMedida', e.target.value)} />
          <Select label="Fornecedor Padrão" options={fornecedorOptions} placeholder="Nenhum" value={form.fornecedorPadraoId} onChange={(e) => set('fornecedorPadraoId', e.target.value)} />
        </div>
        {erro && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            ⚠ {erro}
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1" loading={loading}>
            {produto ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        </div>
      </form>
      <BarcodeScanner open={scannerOpen} onClose={() => setScannerOpen(false)} onDetected={(c) => set('codigoBarras', c)} />
    </>
  );
}
