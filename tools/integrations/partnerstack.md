# PartnerStack

Plataforma de gestão de programas de parceiros e afiliados para empresas SaaS, com rastreamento de deals, rewards e parcerias em múltiplos níveis.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Vendor API v2 for partnerships, deals, customers, transactions |
| MCP | - | Not available |
| CLI | ✓ | [partnerstack.js](../clis/partnerstack.js) |
| SDK | - | No official SDK; REST API with Basic Auth |

## Autenticação

- **Type**: Basic Auth (Vendor API)
- **Header**: `Authorization: Basic {base64(public_key:secret_key)}`
- **Get credentials**: Vendor dashboard > Settings > Integrations > PartnerStack API Keys
- **Note**: Chaves de API de Test e Production são separadas. Transactions de teste só podem ser adicionadas a customers criados com chaves de Test.

## Operações comuns do agente

### Listar partnerships

```bash
GET https://api.partnerstack.com/api/v2/partnerships?limit=25

Authorization: Basic {base64(public_key:secret_key)}
```

### Criar uma partnership

```bash
POST https://api.partnerstack.com/api/v2/partnerships

{
  "email": "partner@example.com",
  "group_key": "affiliates",
  "first_name": "Jane",
  "last_name": "Smith"
}
```

### Listar customers

```bash
GET https://api.partnerstack.com/api/v2/customers?limit=25
```

### Criar um customer (atribuir ao partner)

```bash
POST https://api.partnerstack.com/api/v2/customers

{
  "email": "customer@example.com",
  "partner_key": "prtnr_abc123",
  "name": "John Doe"
}
```

### Registrar uma transaction

```bash
POST https://api.partnerstack.com/api/v2/transactions

{
  "customer_key": "cust_abc123",
  "amount": 9900,
  "currency": "USD",
  "product_key": "pro_plan"
}
```

### Listar deals

```bash
GET https://api.partnerstack.com/api/v2/deals?limit=25
```

### Criar um deal

```bash
POST https://api.partnerstack.com/api/v2/deals

{
  "partner_key": "prtnr_abc123",
  "name": "Enterprise Opportunity",
  "amount": 50000,
  "stage": "qualified"
}
```

### Registrar uma action (rewards baseadas em evento)

```bash
POST https://api.partnerstack.com/api/v2/actions

{
  "customer_key": "cust_abc123",
  "key": "signup_completed",
  "value": 1
}
```

### Criar uma reward

```bash
POST https://api.partnerstack.com/api/v2/rewards

{
  "partner_key": "prtnr_abc123",
  "amount": 5000,
  "description": "Bonus for Q1 performance"
}
```

### Listar leads

```bash
GET https://api.partnerstack.com/api/v2/leads?limit=25
```

### Criar um lead

```bash
POST https://api.partnerstack.com/api/v2/leads

{
  "partner_key": "prtnr_abc123",
  "email": "lead@company.com",
  "name": "Potential Customer",
  "company": "Acme Corp"
}
```

### Listar grupos de parceiros

```bash
GET https://api.partnerstack.com/api/v2/groups
```

### Gerenciar webhooks

```bash
POST https://api.partnerstack.com/api/v2/webhooks

{
  "target": "https://example.com/webhooks/partnerstack",
  "events": ["deal.created", "transaction.created", "customer.created"]
}
```

## Padrão de API

A PartnerStack usa paginação baseada em cursor. As respostas de listagem incluem `has_more` e chaves de item para os parâmetros `starting_after` / `ending_before`.

Todas as respostas seguem o formato:
```json
{
  "data": { ... },
  "message": "...",
  "status": "2xx"
}
```

## Métricas principais

### Métricas de partnership
- `partner_key` - Identificador único do partner
- `group` - Tier/grupo do partner
- `status` - active, pending, archived
- `created_at` - Data de início da partnership

### Métricas de transaction
- `amount` - Valor da transaction em centavos
- `currency` - Código de moeda
- `product_key` - Produto associado
- `customer_key` - Customer associado

### Métricas de deal
- `amount` - Valor do deal
- `stage` - Etapa do pipeline do deal
- `status` - open, won, lost

### Métricas de reward
- `amount` - Valor da reward em centavos
- `status` - pending, approved, paid

## Parâmetros

### Parâmetros de paginação
- `limit` - Itens por página (1-250, default: 10)
- `starting_after` - Cursor para a próxima página (item key)
- `ending_before` - Cursor para a página anterior (item key)
- `order_by` - Campo de ordenação, prefixe com `-` para descendente

### Filtros comuns
- `include_archived` - Inclui registros arquivados
- `has_sub_id` - Filtra pela presença de sub ID

## Quando usar

- Gerenciar programas de afiliados e referral para SaaS
- Rastrear receita e atribuição geradas por parceiros
- Automatizar onboarding de parceiros e rewards
- Registro de deals e acompanhamento de pipeline
- Programas de partnership em múltiplos tiers (affiliates, resellers, agencies)
- Triggers de rewards baseadas em eventos (signups, upgrades etc.)

## Limites de taxa

- Não documentado explicitamente
- Use taxas de requisição razoáveis; implemente exponential backoff em respostas 429

## Skills relevantes

- referral-program
- affiliate-marketing
- partner-enablement
- saas-metrics
- launch-sequence
