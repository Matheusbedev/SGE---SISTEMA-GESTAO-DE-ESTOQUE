import React, { useState } from 'react';
import { useMovimentacaoStore } from '../../store/useMovimentacaoStore';
import { useEstoqueStore } from '../../store/useEstoqueStore';
import { useAlertaStore } from '../../store/useAlertaStore';
import { useProdutoStore } from '../../store/useProdutoStore';
import { useFornecedorStore } from '../../store/useFornecedorStore';
import { useUsuarioId } from '../../store/useAuthStore';
import { useToast } from '../ui/Toast';
import { buscarPorCodigoBarras } from '../../services/produtoService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { BarcodeScanner } from '../barcode/BarcodeScanner';

interface EntradaFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function EntradaForm({ onSuccess, onCancel }: EntradaFormProps) {
  const { registrarEntrada } = useMovimentacaoStore();
  const { carregar: recarregarEstoque } = useEstoqueStore();
  const { carregar: recarregarAlertas } = useAlertaStore();
  const produtos = useProdutoStore((s) => s.produtos);
  const fornecedores = useFornecedorStore((s) => s.fornecedores);
  const usuarioId = useUsuarioId();
  const { toast } = useToast();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ produtoId: '', quantidade: '1', fornecedorId: '', observacao: '' });

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleBarcode = (codigo: string) => {
    const produto = buscarPorCodigoBarras(codigo);
    if (produto) { set('produtoId', produto.id); setErro(''); }
    else setErro(`Produto com código "${codigo}" não encontrado`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(''); setLoading(true);
    try {
      const produto = produtos.find((p) => p.id === form.produtoId);
      registrarEntrada(form.produtoId, parseInt(form.quantidade), usuarioId, form.fornecedorId || undefined, form.observacao || undefined);
      recarregarEstoque();
      recarregarAlertas();
      toast(`Entrada de ${form.quantidade}x "${produto?.nome}" registrada`, 'success');
      onSuccess();
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao registrar entrada');
    } finally {
      setLoading(false);
    }
  };

  const produtoOptions = produtos.map((p) => ({ value: p.id, label: p.nome }));
  const fornecedorOptions = fornecedores.map((f) => ({ value: f.id, label: f.nome }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Select label="Produto *" options={produtoOptions} placeholder="Selecione um produto" value={form.produtoId} onChange={(e) => set('produtoId', e.target.value)} required />
        </div>
        <Button type="button" variant="secondary" onClick={() => setScannerOpen(true)} title="Escanear código">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </Button>
      </div>
      <Input label="Quantidade *" type="number" min="1" value={form.quantidade} onChange={(e) => set('quantidade', e.target.value)} required />
      <Select label="Fornecedor" options={fornecedorOptions} placeholder="Selecione um fornecedor (opcional)" value={form.fornecedorId} onChange={(e) => set('fornecedorId', e.target.value)} />
      <Input label="Observação" value={form.observacao} onChange={(e) => set('observacao', e.target.value)} placeholder="Nota fiscal, lote, etc." />
      {erro && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          ⚠ {erro}
        </div>
      )}
      <div className="flex gap-2 pt-2">
        <Button type="submit" variant="success" className="flex-1" loading={loading} icon={<span>⬆️</span>}>
          Registrar Entrada
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
      <BarcodeScanner open={scannerOpen} onClose={() => setScannerOpen(false)} onDetected={handleBarcode} />
    </form>
  );
}
