
import type { Plan, Driver, Load } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

const avatar1 = PlaceHolderImages.find(p => p.id === 'avatar1')?.imageUrl;
const avatar2 = PlaceHolderImages.find(p => p.id === 'avatar2')?.imageUrl;

export const plans: Plan[] = [
  {
    id: 'plan_starter',
    nome: 'Starter',
    preco: 99,
    limite_motoristas: 5,
    limite_cargas: 50,
    descricao: 'Ideal para pequenas empresas e autônomos iniciando na gestão de frotas.',
  },
  {
    id: 'plan_pro',
    nome: 'Pro',
    preco: 249,
    limite_motoristas: 20,
    limite_cargas: 200,
    descricao: 'Para empresas em crescimento que precisam de mais recursos e relatórios avançados.',
  },
  {
    id: 'plan_enterprise',
    nome: 'Enterprise',
    preco: 499,
    limite_motoristas: null,
    limite_cargas: null,
    descricao: 'Solução completa para grandes operações com necessidades ilimitadas e suporte premium.',
  },
];

export const drivers: Driver[] = [
  {
    id: '1',
    nome: 'João Silva',
    cpf: '111.222.333-44',
    telefone: '(11) 98765-4321',
    empresaId: '1',
    avatarUrl: avatar1,
  },
  {
    id: '2',
    nome: 'Carlos Pereira',
    cpf: '222.333.444-55',
    telefone: '(21) 91234-5678',
    empresaId: '1',
    avatarUrl: avatar2,
  },
  {
    id: '3',
    nome: 'Mariana Costa',
    cpf: '333.444.555-66',
    telefone: '(31) 95678-1234',
    empresaId: '1',
  },
  {
    id: '4',
    nome: 'Pedro Martins',
    cpf: '444.555.666-77',
    telefone: '(41) 98765-8765',
    empresaId: '1',
  },
];

export const loads: Load[] = [
    {
        id: 'L001',
        origem: 'São Paulo, SP',
        destino: 'Rio de Janeiro, RJ',
        status: 'Em Trânsito',
        motoristaId: '1',
        empresaId: '1',
        data_saida: '2024-07-28',
        data_entrega_prevista: '2024-07-29',
    },
    {
        id: 'L002',
        origem: 'Curitiba, PR',
        destino: 'Porto Alegre, RS',
        status: 'Entregue',
        motoristaId: '2',
        empresaId: '1',
        data_saida: '2024-07-25',
        data_entrega_prevista: '2024-07-27',
    },
    {
        id: 'L003',
        origem: 'Belo Horizonte, MG',
        destino: 'Salvador, BA',
        status: 'Pendente',
        motoristaId: null,
        empresaId: '1',
        data_saida: '2024-08-01',
        data_entrega_prevista: '2024-08-04',
    },
    {
        id: 'L004',
        origem: 'Fortaleza, CE',
        destino: 'Recife, PE',
        status: 'Cancelada',
        motoristaId: '3',
        empresaId: '1',
        data_saida: '2024-07-29',
        data_entrega_prevista: '2024-07-30',
    },
     {
        id: 'L005',
        origem: 'Goiânia, GO',
        destino: 'Brasília, DF',
        status: 'Em Trânsito',
        motoristaId: '4',
        empresaId: '1',
        data_saida: '2024-07-28',
        data_entrega_prevista: '2024-07-28',
    },
];

export const company = {
  id: '1',
  razao_social: 'Transportes Rápidos Ltda.',
  cnpj: '12.345.678/0001-99',
  email: 'contato@transportesrapidos.com',
  plan_id: 'plan_pro',
  data_cadastro: '2023-01-15'
}
