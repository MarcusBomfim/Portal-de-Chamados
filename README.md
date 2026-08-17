# Portal de Chamados

Sistema web para registrar e acompanhar solicitações de suporte das unidades de saúde de São Vicente. Os usuários poderão abrir ocorrências e acompanhar o atendimento, enquanto técnicos e administradores farão a triagem, responderão e atualizarão os chamados.

## Tecnologias iniciais

- React
- TypeScript
- Vite
- React Router
- CSS
- Lucide React

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
- [ ] Cadastro, login e controle de acesso
- [ ] Abertura, acompanhamento e respostas dos chamados
- [ ] Integração com PostgreSQL
- [ ] Testes, Docker e documentação final

## Executando o projeto

```bash
npm.cmd install
npm.cmd run dev
```
