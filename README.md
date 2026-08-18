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
- Multer
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
- [x] Cadastro, login, sessão e controle de acesso por perfil
- [x] Abertura, acompanhamento, respostas e atualização dos chamados
- [x] Anexos protegidos e administração de usuários e unidades
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

Se o banco já tiver sido criado nas etapas anteriores, aplique as migrações
incrementais:

```bash
docker compose exec database psql -U portal_admin -d portal_chamados -f /docker-entrypoint-initdb.d/002_auth_sessions.sql
docker compose exec database psql -U portal_admin -d portal_chamados -f /docker-entrypoint-initdb.d/003_ticket_workflow.sql
docker compose exec database psql -U portal_admin -d portal_chamados -f /docker-entrypoint-initdb.d/004_attachment_indexes.sql
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

## Autenticação

- As senhas são armazenadas somente como hash `scrypt` com salt individual.
- A sessão utiliza um token aleatório armazenado no navegador em cookie
  `HttpOnly` e `SameSite=Strict`.
- No banco de dados é salvo somente o hash do token da sessão.
- As tentativas de cadastro e login possuem limite por intervalo de tempo.
- Novos cadastros recebem apenas o perfil de solicitante.
- As rotas administrativas verificam o perfil do usuário.

## Chamados

- O solicitante escolhe a unidade, categoria e prioridade da ocorrência.
- Cada chamado recebe um protocolo sequencial.
- Solicitantes visualizam somente os próprios chamados.
- Técnicos e administradores visualizam a fila completa.
- Técnicos podem assumir atendimentos e atualizar o status.
- Solicitantes e equipe podem conversar pelo histórico do chamado.
- A equipe pode registrar notas internas invisíveis para o solicitante.
- Chamados fechados ou cancelados não recebem novas respostas.

## Anexos

- São aceitos arquivos PDF, JPG, PNG e TXT de até 5 MB.
- Os nomes físicos são aleatórios para evitar conflitos e exposição de caminhos.
- Os arquivos ficam em `server/storage/uploads` e não são publicados diretamente.
- O download passa pela autenticação e pela permissão de acesso ao chamado.
- Os metadados dos anexos são armazenados no PostgreSQL.

## Primeiro administrador

Depois de criar uma conta pela tela de cadastro, promova esse usuário pelo
terminal. Nenhuma senha administrativa padrão é criada pelo projeto.

```bash
npm.cmd --prefix server run user:promote -- seu-email@exemplo.com
```

O administrador pode alterar perfis, vincular usuários às unidades, bloquear
acessos e cadastrar ou desativar unidades de saúde.
