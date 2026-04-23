# Outreach

Plataforma de sales engagement para gerenciar prospects, sequências e campanhas outbound em escala.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Prospects, Sequences, Mailings, Accounts, Tasks |
| MCP | ✓ | [Claude connector](https://claude.com/connectors/outreach) |
| CLI | ✓ | [outreach.js](../clis/outreach.js) |
| SDK | - | REST API only (JSON:API format) |

## Autenticação

- **Type**: OAuth2 Bearer Token
- **Header**: `Authorization: Bearer {access_token}`
- **Content-Type**: `application/vnd.api+json`
- **Get token**: Settings > API at https://app.outreach.io or via OAuth2 flow

## Operações comuns do agente

### Listar prospects

```bash
curl -s https://api.outreach.io/api/v2/prospects \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json"
```

### Obter um prospect

```bash
curl -s https://api.outreach.io/api/v2/prospects/42 \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json"
```

### Criar um prospect

```bash
curl -s -X POST https://api.outreach.io/api/v2/prospects \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  -d '{
    "data": {
      "type": "prospect",
      "attributes": {
        "emails": ["jane@example.com"],
        "firstName": "Jane",
        "lastName": "Doe"
      }
    }
  }'
```

### Listar sequências

```bash
curl -s https://api.outreach.io/api/v2/sequences \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json"
```

### Adicionar prospect à sequência

```bash
curl -s -X POST https://api.outreach.io/api/v2/sequenceStates \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  -d '{
    "data": {
      "type": "sequenceState",
      "relationships": {
        "prospect": { "data": { "type": "prospect", "id": 42 } },
        "sequence": { "data": { "type": "sequence", "id": 7 } }
      }
    }
  }'
```

### Listar mailings de uma sequência

```bash
curl -s "https://api.outreach.io/api/v2/mailings?filter[sequence][id]=7" \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json"
```

### Listar accounts

```bash
curl -s https://api.outreach.io/api/v2/accounts \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json"
```

### Listar tasks

```bash
curl -s "https://api.outreach.io/api/v2/tasks?filter[status]=incomplete" \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json"
```

## Métricas principais

### Dados de prospect
- `firstName`, `lastName` - Nome
- `emails` - Endereços de email
- `title` - Cargo
- `company` - Nome da empresa
- `tags` - Tags do prospect
- `engagedAt` - Timestamp do último engajamento

### Dados de sequência
- `name` - Nome da sequência
- `enabled` - Se a sequência está ativa
- `sequenceType` - Tipo (ex.: interval, date-based)
- `stepCount` - Número de etapas
- `openCount`, `clickCount`, `replyCount` - Métricas de engajamento

### Dados de mailing
- `mailingType` - Tipo de mailing
- `state` - Estado de entrega
- `openCount`, `clickCount` - Engajamento
- `deliveredAt`, `openedAt`, `clickedAt` - Timestamps

## Parâmetros

### Prospects
- `page[number]` - Número da página (default: 1)
- `page[size]` - Resultados por página (default: 25, max: 1000)
- `filter[emails]` - Filtro por email
- `filter[firstName]` - Filtro por first name
- `filter[lastName]` - Filtro por last name
- `sort` - Campo de ordenação (ex.: `createdAt`, `-updatedAt`)

### Sequences
- `filter[name]` - Filtro por nome da sequência
- `filter[enabled]` - Filtro por status ativo

### Mailings
- `filter[sequence][id]` - Filtro por ID da sequência
- `filter[prospect][id]` - Filtro por ID do prospect

### Tasks
- `filter[status]` - Filtro por status (ex.: `incomplete`, `complete`)
- `filter[taskType]` - Filtro por tipo (ex.: `call`, `email`, `action_item`)

## Quando usar

- Gerenciar sequências e cadências de vendas outbound
- Adicionar prospects a sequências de email automatizadas
- Rastrear engajamento de prospects em múltiplos touchpoints
- Gerenciar tasks de vendas e follow-ups
- Coordenar campanhas de outreach multicanal
- Monitorar performance das sequências e taxas de resposta

## Limites de taxa

- 10,000 requests per hour per user
- Burst limit: 100 requests per 10 seconds
- Rate limit headers returned: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Respostas 429 quando os limites são excedidos

## Skills relevantes

- cold-email
- revops
- sales-enablement
- email-sequence
