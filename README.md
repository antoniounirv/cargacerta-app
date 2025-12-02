# CargaCerta - Sistema de Gestão Logística

Bem-vindo ao CargaCerta, um sistema de gestão de logística robusto e moderno, construído com Next.js e Firebase. Esta plataforma foi desenvolvida como uma solução multiempresa (multi-tenant), permitindo que diferentes empresas gerenciem suas frotas, motoristas e cargas de forma segura e isolada.

## ✨ Recursos Principais

- **Gestão Multiempresa:** Dados totalmente isolados por empresa, garantindo privacidade e segurança com regras do Firestore.
- **Autenticação Segura:** Sistema de cadastro e login por e-mail e senha.
- **Dashboard Intuitivo:** Uma visão geral da operação com gráficos e estatísticas sobre cargas e motoristas.
- **Gerenciamento de Motoristas:** Adicione, edite e remova motoristas associados à sua empresa.
- **Rastreamento de Cargas:** Monitore o status das suas cargas (Pendente, Em Trânsito, Entregue, Cancelada).
- **Planos e Assinaturas:** Visualize os diferentes planos que a plataforma oferece.
- **Design Responsivo:** Interface adaptável para uso em desktops e dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - [**Next.js**](https://nextjs.org/) (com App Router)
  - [**React**](https://react.dev/)
  - [**TypeScript**](https://www.typescriptlang.org/)
  - [**Tailwind CSS**](https://tailwindcss.com/)
  - [**Shadcn/UI**](https://ui.shadcn.com/) para componentes de UI
  - [**Recharts**](https://recharts.org/) para gráficos no dashboard

- **Backend & Banco de Dados:**
  - [**Firebase**](https://firebase.google.com/)
    - **Firestore** como banco de dados NoSQL
    - **Firebase Authentication** para gerenciamento de usuários
    - **Firebase Security Rules** para garantir o isolamento de dados por empresa

- **Inteligência Artificial:**
  - [**Genkit**](https://firebase.google.com/docs/genkit) para funcionalidades de IA, como o preenchimento automático de cidades.

## 🚀 Como Rodar o Projeto Localmente

Para executar este projeto em seu ambiente de desenvolvimento, siga os passos abaixo:

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/antoniounirv/cargacerta-app.git
    cd cargacerta-app
    ```

2.  **Instale as Dependências:**
    Certifique-se de ter o Node.js (versão 18 ou superior) instalado.
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Este projeto se conecta ao Firebase. Você precisará de uma configuração do Firebase para rodá-lo. Geralmente, as credenciais ficam em um arquivo `.env.local`, mas como este projeto usa a inicialização automática do Firebase App Hosting, pode ser necessário configurar um projeto Firebase e obter as credenciais para o desenvolvimento local.

4.  **Execute o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  **Abra no Navegador:**
    Abra [http://localhost:9002](http://localhost:9002) em seu navegador para ver o aplicativo em ação.
