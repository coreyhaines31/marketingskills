# Zapier

Plataforma de automação de workflows que conecta mais de 8.000 apps. O Zapier SDK oferece aos agentes de IA acesso direto às ações de qualquer app sem construir fluxos OAuth ou fazer engenharia reversa de APIs.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | API REST para Zaps, tarefas e webhooks |
| MCP | ✓ | Disponível via servidor MCP do Zapier |
| CLI | ✓ | `@zapier/zapier-sdk-cli` para descoberta de apps e geração de tipos |
| SDK | ✓ | `@zapier/zapier-sdk` — SDK TipoScript para mais de 8.000 integrações de apps |

## Autenticação

### API Legada (gerenciamento de Zaps)

- **Tipo**: API Key
- **Header**: `X-API-Key: {api_key}`
- **Obter chave**: Settings > API na conta Zapier

### Autenticação do SDK

**Browser-based login (development):**
```bash
npx zapier-sdk login
```

**Server-side (production):**
- Client Credentials — store as environment variables
- Token direto — definir env var `ZAPIER_CREDENTIALS`

Login via browser só funciona localmente. Use Client Credentials para qualquer deploy server-side.

## Início Rápido do SDK

### Instalar

```bash
npm install @zapier/zapier-sdk
npm install -D @zapier/zapier-sdk-cli @types/node typescript
npm pkg set type=module
```

### Inicializar

```typescript
import { createZapierSdk } from "@zapier/zapier-sdk";
const zapier = createZapierSdk();
```

### Comandos CLI

| Comando | Objetivo |
|---------|---------|
| `npx zapier-sdk login` | Autenticar (apenas dev) |
| `npx zapier-sdk list-apps --search "query"` | Buscar apps disponíveis |
| `npx zapier-sdk list-actions APP_KEY` | Listar ações de um app |
| `npx zapier-sdk add [app-key]` | Generate TipoScript types |

### Métodos do SDK

| Método | Objetivo |
|--------|---------|
| `zapier.listConnections()` | Listar conexões autenticadas de apps |
| `zapier.findFirstConnection()` | Find a specific connection |
| `zapier.runAction()` | Execute an action on a connected app |
| `zapier.apps.slack()` | Padrão de app proxy para sintaxe limpa |
| `zapier.fetch()` | Custom authenticated API calls |

### Exemplo: Enviar uma mensagem no Slack

```typescript
import { createZapierSdk } from "@zapier/zapier-sdk";

const zapier = createZapierSdk();
const slack = await zapier.apps.slack();

await slack.sendChannelMessage({
  channel: "#marketing",
  message: "Campaign launched!"
});
```

### Exemplo: Criar um contato no HubSpot

```typescript
const hubspot = await zapier.apps.hubspot();

await hubspot.createContact({
  email: "lead@example.com",
  firstName: "Jane",
  lastName: "Doe"
});
```

### Paginação

Use `.items()` para datasets grandes:

```typescript
const contacts = await hubspot.listContacts({ maxItems: 100 });
for await (const contact of contacts.items()) {
  console.log(contact.email);
}
```

### Nota de Governança

Chamadas diretas de API via `zapier.fetch()` não estão sujeitas às políticas de restrição de app/ação da organização. Use ações pré-construídas sempre que possível se sua organização tiver requisitos de governança.

---

## API de Zaps (Legado)

### Listar Zaps

```bash
GET https://api.zapier.com/v1/zaps
```

### Obter detalhes do Zap

```bash
GET https://api.zapier.com/v1/zaps/{zap_id}
```

### Ligar/desligar Zap

```bash
POST https://api.zapier.com/v1/zaps/{zap_id}/on
POST https://api.zapier.com/v1/zaps/{zap_id}/off
```

### Obter histórico de tarefas

```bash
GET https://api.zapier.com/v1/zaps/{zap_id}/tasks
```

### Obter informações do perfil

```bash
GET https://api.zapier.com/v1/profiles/me
```

## Webhooks (Triggers)

### Catch Hook (receber dados)

Crie um trigger "Webhooks by Zapier" para receber dados:

```bash
POST https://hooks.zapier.com/hooks/catch/{webhook_id}/

{
  "event": "user.created",
  "user_id": "123",
  "email": "user@example.com"
}
```

### Enviar dados para o Zapier

Mais comum: disparar um Zap a partir do seu app:

```bash
POST https://hooks.zapier.com/hooks/catch/{account_id}/{hook_id}/

{
  "name": "John Doe",
  "email": "john@example.com",
  "plan": "pro"
}
```

## Automações de Marketing Comuns

### Com SDK (recomendado para agentes)

```typescript
// Lead capture to CRM
const hubspot = await zapier.apps.hubspot();
await hubspot.createContact({ email, firstName, lastName });

// New customer notification
const slack = await zapier.apps.slack();
await slack.sendChannelMessage({ channel: "#revenue", message: `New customer: ${email}` });

// Add to email sequence
const customerio = await zapier.apps.customerio();
await customerio.createOrUpdatePerson({ email, plan: "pro" });
```

### Com Zaps (no-code)

- Tipoform → Zapier → HubSpot (lead capture)
- Stripe → Zapier → Slack (alertas de novos clientes)
- Envio de formulário → Zapier → Customer.io (sequências de email)
- Nova avaliação → Zapier → Slack (social proof)
- Nova indicação → Zapier → Spreadsheet + Slack (rastreamento de indicações)

## Estrutura de Payload de Webhook

Ao enviar para o Zapier, estruture os dados como JSON plano:

```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "plan_name": "Pro",
  "plan_price": 99,
  "signup_date": "2024-01-15"
}
```

## Conceitos Principais

- **Zap** - Workflow automatizado (no-code)
- **SDK** - Acesso programático a mais de 8.000 integrações de apps
- **Trigger** - Event that starts a Zap
- **Action** - Task performed by Zap or SDK
- **Task** - Single action execution
- **Connection** - Link autenticado para um app (compartilhado entre Zaps e SDK)

## Quando Usar

- **SDK**: Quando um agente de IA precisa interagir diretamente com qualquer app — enviar mensagens, criar registros, sincronizar dados
- **Zaps**: Quando você precisa de automação always-on sem código
- **Webhooks**: Ao disparar workflows a partir do seu próprio app
- **API**: Ao gerenciar Zaps programaticamente

## Limites de Taxa

- API: 100 requests per minute
- SDK: Rate limits per connected app
- Task limits by plan tier

## Skills Relevantes

- email-sequence
- analytics-tracking
- referral-program
- revops
