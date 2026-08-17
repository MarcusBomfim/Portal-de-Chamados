# Portal de Chamados

Sistema web para registrar e acompanhar solicitações de suporte das unidades de saúde de São Vicente. Os usuários poderão abrir ocorrências e acompanhar o atendimento, enquanto técnicos e administradores farão a triagem, responderão e atualizarão os chamados.

## Tecnologias

### Interface

- React
- TypeScript
- Vite
- React Router
- CSS
- Lucide React

### API e banco de dados

- Node.js
- Express
- PostgreSQL
- Driver `pg`
- Zod
- Helmet e CORS
- Docker Compose

## Perfis de acesso

- **Solicitante:** abre chamados, acompanha os próprios registros e responde ao atendimento.
- **Técnico:** visualiza a fila, assume chamados, responde e altera o andamento.
- **Administrador:** possui acesso completo e gerencia usuários e unidades.

## Fluxo de um chamado

```text
Aberto -> Em atendimento -> Aguardando usuário -> Resolvido -> Fechado
```

Um chamado também pode ser cancelado enquanto ainda estiver em atendimento. Chamados resolvidos podem ser reabertos antes do fechamento.

## Etapas concluídas

- [x] Criação da base React com TypeScript
- [x] Modelagem dos usuários, unidades, chamados, mensagens e anexos
- [x] Definição das permissões e regras de mudança de status
- [x] Layout responsivo e navegação entre as páginas-base
- [x] Estrutura inicial da API e do PostgreSQL
- [ ] Cadastro, login e controle de acesso
- [ ] Abertura, acompanhamento e respostas dos chamados
- [ ] Testes, containerização completa e documentação final

## Preparando o projeto

Instale as dependências da interface e da API:

```bash
npm.cmd install
cd server
npm.cmd install
cd ..
```

Crie o arquivo local de configuração da API:

```powershell
Copy-Item server\.env.example server\.env
```

Inicie o PostgreSQL:

```bash
docker compose up -d database
```

## Executando

Use dois terminais na pasta principal do projeto.

Terminal da interface:

```bash
npm.cmd run dev:web
```

Terminal da API:

```bash
npm.cmd run dev:api
```

A API será executada em `http://localhost:3333`. A rota
`GET /api/health` confirma se o servidor está funcionando e
`GET /api/health/database` verifica a conexão com o PostgreSQL.
