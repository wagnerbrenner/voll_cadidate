<div align="center">
<img width="1200" height="475" alt="VOLL Candidate" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# VOLL Candidate

Um CRM simples e elegante para gestão de alunos em studios de Pilates. Desenvolvido com React, TypeScript, Supabase e integração com IA (Gemini) para geração de conteúdo e mensagens.

---

## Links

| Item | URL |
|------|-----|
| **Repositório GitHub (público)** | https://github.com/wagnerbrenner/voll_cadidate |
| **App publicado** | [URL do app em produção – configurar após deploy] |
| **Google AI Studio – compartilhamento** | https://ai.studio/apps/28c6ff34-9f45-488b-864f-52b2d8cc72df |

---

## Funcionalidades

- **Dashboard** – visão geral de alunos ativos e experimentais
- **Alunos** – cadastro, edição, exclusão, exportação CSV
- **Agenda** – agendamento de aulas com descrição gerada por IA
- **Financeiro** – lançamentos a pagar/receber, parcelas automáticas por plano
- **Gerador de mensagens WhatsApp** – widget flutuante com IA para criar mensagens personalizadas

---

## Tecnologias

- React 19 + TypeScript
- Vite
- Supabase (banco de dados)
- Google Gemini (IA)
- Tailwind CSS
- Sonner (toasts)

---

## Como lidamos com chaves de API

### GEMINI_API_KEY

- **Uso:** geração de descrições de aula (IA), conteúdo para redes sociais e mensagens WhatsApp.
- **Configuração:** injetada em build via `vite.config.ts` (`process.env.GEMINI_API_KEY`).
- **Ambiente local:** definida em `.env` ou `.env.local` (arquivo ignorado pelo Git).
- **Google AI Studio:** configurada no painel de Segredos e injetada em runtime.
- **Segurança:** nunca é commitada; `.env` está no `.gitignore`.

### VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

- **Uso:** conexão com Supabase (alunos, agenda, lançamentos financeiros).
- **Configuração:** variáveis de ambiente com prefixo `VITE_` para exposição no cliente.
- **Segurança:** usa a chave anônima (anon key), com permissões controladas por Row Level Security (RLS) no Supabase.

---

## Testes de segurança planejados

1. **Validação de entrada** – sanitização e validação de dados antes de enviar ao banco e à IA.
2. **RLS no Supabase** – políticas para restringir acesso por usuário/projeto.
3. **Rate limiting** – limites de requisições para APIs e endpoints sensíveis.
4. **Auditoria de dependências** – `npm audit` e atualização de pacotes vulneráveis.
5. **Revisão de exposição de chaves** – garantir que nenhuma chave secreta seja exposta no bundle ou em logs.
6. **HTTPS** – uso exclusivo de conexões seguras em produção.

---

## Executar localmente

**Pré-requisitos:** Node.js 18+

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   - Copie `.env.example` para `.env`
   - Preencha:
     - `GEMINI_API_KEY` – chave da API Gemini
     - `VITE_SUPABASE_URL` – URL do projeto Supabase
     - `VITE_SUPABASE_ANON_KEY` – chave anônima do Supabase

3. **Executar:**
   ```bash
   npm run dev
   ```

4. Acesse: http://localhost:3000

---

## Scripts

| Comando | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Verificação TypeScript |
