import type { Fornecedor, Produto } from '../types';
import { getAll, save, getById } from '../store/storage';
import { generateId, now } from '../utils/uuid';
import { listarProdutos } from './produtoService';

export interface DadosFornecedor {
  nome: string;
  cnpj: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}

function validarCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  const calc = (d: string, len: number) => {
    let sum = 0;
    let pos = len - 7;
    for (let i = len; i >= 1; i--) {
      sum += parseInt(d[len - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    return sum % 11 < 2 ? 0 : 11 - (sum % 11);
  };

  return (
    calc(digits, 12) === parseInt(digits[12]) &&
    calc(digits, 13) === parseInt(digits[13])
  );
}

export function cadastrarFornecedor(dados: DadosFornecedor): Fornecedor {
  if (!dados.nome.trim()) throw new Error('Nome do fornecedor é obrigatório');
  if (!validarCNPJ(dados.cnpj)) throw new Error('CNPJ inválido');

  const cnpjLimpo = dados.cnpj.replace(/\D/g, '');
  const existente = getAll<Fornecedor>('fornecedores').find(
    (f) => f.ativo && f.cnpj.replace(/\D/g, '') === cnpjLimpo
  );
  if (existente) throw new Error(`CNPJ já cadastrado para o fornecedor: ${existente.nome}`);

  const fornecedor: Fornecedor = {
    id: generateId(),
    nome: dados.nome.trim(),
    cnpj: cnpjLimpo,
    email: dados.email,
    telefone: dados.telefone,
    endereco: dados.endereco,
    ativo: true,
    criadoEm: now(),
  };
  save('fornecedores', fornecedor);
  return fornecedor;
}

export function atualizarFornecedor(id: string, dados: Partial<DadosFornecedor>): Fornecedor {
  const fornecedor = buscarPorId(id);
  if (!fornecedor) throw new Error('Fornecedor não encontrado');

  if (dados.cnpj && dados.cnpj !== fornecedor.cnpj) {
    if (!validarCNPJ(dados.cnpj)) throw new Error('CNPJ inválido');
    const cnpjLimpo = dados.cnpj.replace(/\D/g, '');
    const existente = getAll<Fornecedor>('fornecedores').find(
      (f) => f.ativo && f.id !== id && f.cnpj.replace(/\D/g, '') === cnpjLimpo
    );
    if (existente) throw new Error(`CNPJ já cadastrado para o fornecedor: ${existente.nome}`);
  }

  const atualizado: Fornecedor = {
    ...fornecedor,
    ...dados,
    cnpj: dados.cnpj ? dados.cnpj.replace(/\D/g, '') : fornecedor.cnpj,
    nome: dados.nome?.trim() ?? fornecedor.nome,
  };
  save('fornecedores', atualizado);
  return atualizado;
}

export function buscarPorId(id: string): Fornecedor | null {
  return getById<Fornecedor>('fornecedores', id);
}

export function listarFornecedores(): Fornecedor[] {
  return getAll<Fornecedor>('fornecedores').filter((f) => f.ativo);
}

export function listarProdutosFornecedor(fornecedorId: string): Produto[] {
  return listarProdutos({ fornecedorId });
}

export function desativarFornecedor(id: string): boolean {
  const fornecedor = buscarPorId(id);
  if (!fornecedor) return false;
  save('fornecedores', { ...fornecedor, ativo: false });
  return true;
}
