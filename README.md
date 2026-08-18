# Portal de Chamados da Saúde

Sistema web full stack para registrar e acompanhar solicitações de suporte das
unidades de saúde. Solicitantes abrem ocorrências e conversam com a equipe de
atendimento, enquanto técnicos e administradores realizam a triagem, assumem os
chamados e mantêm todo o histórico da resolução.

## Funcionalidades

- Cadastro e autenticação de usuários.
- Sessões protegidas por cookie `HttpOnly`.
- Perfis de solicitante, técnico e administrador.
- Abertura de chamados com unidade, categoria e prioridade.
- Protocolos sequenciais para identificação dos chamados.
- Filtros, acompanhamento e histórico de atendimento.
- Atribuição de técnicos e atualização controlada de status.
- Respostas públicas e notas internas da equipe.
- Anexos privados em PDF, JPG, PNG e TXT, com limite de 5 MB.
- Administração de usuários, perfis e unidades de saúde.
- Layout responsivo para computadores, tablets e celulares.

## Tecnologias

### Front-end

- React
- TypeScript
- Vite
- React Router
- CSS
- Lucide React
- Vitest

### Back-end

- Node.js
- Express
- TypeScript
- PostgreSQL
- `pg`
- Zod
- Helmet e CORS
- Multer
- Vitest

### Infraestrutura

- Docker Compose
- Nginx
- Volumes persistentes para banco de dados e anexos

## Perfis de acesso

| Perfil | Acesso |
| --- | --- |
| Solicitante | Abre chamados, acompanha os próprios registros e responde ao atendimento. |
| Técnico | Visualiza a fila, assume chamados, responde e altera o andamento. |
| Administrador | Possui acesso completo e gerencia usuários e unidades. |

## Fluxo do chamado

```text
Aberto -> Em atendimento -> Aguardando usuário -> Resolvido -> Fechado
```

Um chamado pode ser cancelado durante o atendimento. Um chamado resolvido também
pode ser reaberto antes do fechamento definitivo.

## Estrutura do projeto

```text
portal-chamados-saude/
├── public/                         # Arquivos públicos da interface
├── src/
│   ├── components/                 # Componentes de interface e navegação
│   ├── contexts/                   # Estado global de autenticação
│   ├── domain/                     # Regras de negócio do front-end
│   ├── pages/                      # Páginas da aplicação
│   ├── services/                   # Comunicação com a API
│   ├── styles/                     # Estilos por área da interface
│   ├── types/                      # Tipos e permissões
│   └── utils/                      # Formatação e rótulos
├── server/
│   ├── database/migrations/        # Estrutura e evoluções do PostgreSQL
│   ├── src/
│   │   ├── config/                 # Variáveis e configurações
│   │   ├── controllers/            # Entrada e saída das requisições
│   │   ├── database/               # Conexão com o PostgreSQL
│   │   ├── domain/                 # Regras de negócio da API
│   │   ├── middlewares/            # Autenticação, upload e erros
│   │   ├── repositories/           # Consultas ao banco de dados
│   │   ├── routes/                 # Rotas HTTP
│   │   ├── schemas/                # Validação com Zod
│   │   ├── scripts/                # Utilitários administrativos
│   │   └── services/               # Senhas e sessões
│   └── storage/uploads/            # Anexos locais fora do Docker
├── docker-compose.yml              # Interface, API e PostgreSQL
├── Dockerfile                      # Imagem da interface
└── nginx.conf                      # SPA e proxy reverso para a API
```

## Executando tudo com Docker

### Requisitos

- Docker Desktop em execução
- Docker Compose

Na pasta principal do projeto, execute:

```bash
docker compose up --build -d
```

Depois que os serviços estiverem saudáveis, acesse:

```text
http://localhost:8080
```

Para conferir os serviços:

```bash
docker compose ps
```

Para acompanhar os registros:

```bash
docker compose logs -f
```

Para encerrar sem apagar os dados:

```bash
docker compose down
```

O banco e os anexos permanecem nos volumes `portal_chamados_data` e
`portal_uploads`. O parâmetro `--volumes` remove esses dados e deve ser usado
somente quando a intenção for reiniciar completamente o ambiente.

## Executando em modo de desenvolvimento

### Requisitos

- Node.js 24 LTS ou superior
- Docker Desktop
- npm

Instale as dependências da interface e da API:

```bash
npm.cmd install
npm.cmd --prefix server install
```

Crie a configuração local da API:

```powershell
Copy-Item server\.env.example server\.env
```

Inicie somente o PostgreSQL:

```bash
docker compose up -d database
```

Use dois terminais na pasta principal.

Terminal da interface:

```bash
npm.cmd run dev:web
```

Terminal da API:

```bash
npm.cmd run dev:api
```

A interface ficará em `http://localhost:5173` e a API em
`http://localhost:3333`. A rota `GET /api/health` verifica a API e
`GET /api/health/database` verifica a conexão com o PostgreSQL.

## Banco de dados e migrações

Em um banco novo, os arquivos de `server/database/migrations` são aplicados
automaticamente na primeira criação do volume do PostgreSQL.

Se o volume foi criado durante uma etapa anterior do projeto, aplique somente as
migrações que ainda não foram executadas:

```bash
docker compose exec database psql -U portal_admin -d portal_chamados -f /docker-entrypoint-initdb.d/002_auth_sessions.sql
docker compose exec database psql -U portal_admin -d portal_chamados -f /docker-entrypoint-initdb.d/003_ticket_workflow.sql
docker compose exec database psql -U portal_admin -d portal_chamados -f /docker-entrypoint-initdb.d/004_attachment_indexes.sql
```

## Primeiro administrador

Crie uma conta pela tela de cadastro. Em seguida, promova esse usuário pelo
terminal. O projeto não cria uma senha administrativa padrão.

No modo de desenvolvimento:

```bash
npm.cmd --prefix server run user:promote -- seu-email@exemplo.com
```

Com toda a aplicação no Docker:

```bash
docker compose exec api npm run user:promote:prod -- seu-email@exemplo.com
```

## Testes e validação

Executar todos os testes:

```bash
npm.cmd run test:all
```

Executar a análise do front-end:

```bash
npm.cmd run lint
```

Gerar as versões de produção da interface e da API:

```bash
npm.cmd run build:all
```

Os testes cobrem as permissões, as mudanças de status, a validação das entradas
e a proteção de senhas.

## Segurança

- Senhas protegidas com `scrypt` e salt individual.
- Comparação de senha resistente a ataques de temporização.
- Tokens de sessão aleatórios; somente o hash é armazenado no banco.
- Cookie de sessão `HttpOnly` e `SameSite=Strict`.
- Limite de tentativas nas rotas de cadastro e login.
- Validação de entradas com Zod.
- Cabeçalhos de segurança com Helmet e Nginx.
- Verificação de perfil e propriedade do chamado nas rotas protegidas.
- Validação do tipo, tamanho e assinatura dos anexos.
- Arquivos disponibilizados somente após autenticação e autorização.

No ambiente Docker local, `COOKIE_SECURE=false` permite o uso por HTTP. Em uma
publicação com HTTPS, altere essa variável para `true`.

## Autor

Desenvolvido por Marcus Bomfim.
