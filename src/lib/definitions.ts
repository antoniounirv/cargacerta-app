
export type Company = {
  id: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  planoId: string;
  dataCadastro: string;
};

export type Plan = {
  id: string;
  nome: string;
  preco: number;
  limite_motoristas: number | null;
  limite_cargas: number | null;
  descricao: string;
};

export type Driver = {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  empresaId: string;
  avatarUrl?: string;
};

export type LoadStatus = 'Pendente' | 'Em Trânsito' | 'Entregue' | 'Cancelada';

export type Load = {
  id: string;
  origem: string;
  destino: string;
  status: LoadStatus;
  motoristaId: string | null;
  empresaId: string;
  data_saida: string;
  data_entrega_prevista: string;
};

export type Document = {
  id: string;
  nome_arquivo: string;
  url: string;
  motoristaId: string;
  empresaId: string;
};
