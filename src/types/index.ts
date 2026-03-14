export type TipoMovimentacao = 'ENTRADA' | 'SAIDA';
export type TipoAlerta = 'ESTOQUE_BAIXO' | 'ESTOQUE_ZERADO';
export type PapelUsuario = 'operador' | 'gerente' | 'admin';

export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  codigoBarras: string;
  categoriaId?: string;
  fornecedorPadraoId?: string;
  precoCusto: number;
  precoVenda: number;
  unidadeMedida: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ItemEstoque {
  id: string;
  produtoId: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeMaxima?: number;
  localizacao?: string;
  atualizadoEm: string;
}

export interface Movimentacao {
  id: string;
  produtoId: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  fornecedorId?: string;
  usuarioId: string;
  observacao?: string;
  criadoEm: string;
}

export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  ativo: boolean;
  criadoEm: string;
}

export interface Alerta {
  id: string;
  produtoId: string;
  tipo: TipoAlerta;
  quantidadeAtual: number;
  quantidadeMinima: number;
  lido: boolean;
  criadoEm: string;
}

export interface Periodo {
  dataInicio: string;
  dataFim: string;
}

export interface ProdutoVenda {
  produto: Produto;
  totalVendido: number;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
}

export interface FiltroProduto {
  nome?: string;
  categoriaId?: string;
  fornecedorId?: string;
}

export interface FiltroMovimentacao {
  produtoId?: string;
  tipo?: TipoMovimentacao;
  dataInicio?: string;
  dataFim?: string;
}
