# Paddle

Plataforma de billing e pagamentos para SaaS com tax compliance embutido, atuando como merchant of record para vendas globais.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for products, prices, subscriptions, transactions |
| MCP | - | Not available |
| CLI | ✓ | [paddle.js](../clis/paddle.js) |
| SDK | ✓ | Node.js, Python, PHP, Go |

## Autenticação

- **Type**: Bearer Token
- **Header**: `Authorization: Bearer {api_key}`
- **Get key**: Paddle dashboard > Developer Tools > Authentication
- **Production URL**: `https://api.paddle.com`
- **Sandbox URL**: `https://sandbox-api.paddle.com`
- **Note**: A versão é especificada via header, não no path. Defina a env var `PADDLE_SANDBOX=true` para sandbox.

## Operações comuns do agente

### Listar produtos

```bash
GET https://api.paddle.com/products
```

### Criar um produto

```bash
POST https://api.paddle.com/products

{
  "name": "Pro Plan",
  "tax_category": "standard",
  "description": "Professional tier subscription"
}
```

### Criar um preço para um produto

```bash
POST https://api.paddle.com/prices

{
  "product_id": "pro_01abc...",
  "description": "Monthly Pro",
  "unit_price": {
    "amount": "2999",
    "currency_code": "USD"
  },
  "billing_cycle": {
    "interval": "month",
    "frequency": 1
  }
}
```

### Listar customers

```bash
GET https://api.paddle.com/customers
```

### Criar um customer

```bash
POST https://api.paddle.com/customers

{
  "email": "customer@example.com",
  "name": "Jane Smith"
}
```

### Listar subscriptions

```bash
GET https://api.paddle.com/subscriptions?status=active
```

### Obter detalhes de subscription

```bash
GET https://api.paddle.com/subscriptions/{subscription_id}
```

### Cancelar uma subscription

```bash
POST https://api.paddle.com/subscriptions/{subscription_id}/cancel

{
  "effective_from": "next_billing_period"
}
```

### Pausar uma subscription

```bash
POST https://api.paddle.com/subscriptions/{subscription_id}/pause
```

### Listar transactions

```bash
GET https://api.paddle.com/transactions
```

### Criar um discount

```bash
POST https://api.paddle.com/discounts

{
  "amount": "20",
  "type": "percentage",
  "description": "20% off first month",
  "code": "WELCOME20"
}
```

### Criar um ajuste de refund

```bash
POST https://api.paddle.com/adjustments

{
  "transaction_id": "txn_01abc...",
  "action": "refund",
  "reason": "Customer requested refund",
  "items": [{"item_id": "txnitm_01abc...", "type": "full"}]
}
```

### Listar eventos

```bash
GET https://api.paddle.com/events
```

### Listar tipos de evento

```bash
GET https://api.paddle.com/event-types
```

## Métricas principais

### Métricas de transaction
- `totals.total` - Valor total cobrado
- `totals.tax` - Valor de tax
- `totals.subtotal` - Valor antes de tax
- `totals.discount` - Discount aplicado
- `currency_code` - Moeda da transaction

### Métricas de subscription
- `status` - active, canceled, paused, past_due, trialing
- `current_billing_period` - Início/fim do período atual
- `next_billed_at` - Próxima data de cobrança
- `scheduled_change` - Mudanças pendentes (cancelamento, mudança de plano)

### Métricas de Product/Price
- `unit_price.amount` - Preço na menor denominação
- `billing_cycle` - Intervalo e frequência
- `trial_period` - Duração do trial, se definido

## Parâmetros

### Filtros de listagem
- `status` - Filtro por status (ex.: active, archived)
- `after` - Cursor para paginação
- `per_page` - Resultados por página (default: 50)
- `order_by` - Campo e direção de ordenação

### Opções de cancelamento de subscription
- `effective_from` - `immediately` or `next_billing_period`

### Billing cycle de preço
- `interval` - `day`, `week`, `month`, `year`
- `frequency` - Número de intervalos entre cobranças

### Categorias de tax
- `standard` - Taxa padrão de tax
- `digital-goods` - Taxa de tax para bens digitais
- `saas` - Taxa de tax específica para SaaS

## Quando usar

- Gerenciar billing de subscriptions SaaS com tax compliance
- Criar produtos e tiers de preço
- Processar refunds e ajustes
- Gerenciar lifecycle de subscriptions (create, pause, cancel, resume)
- Gerenciar tax global como merchant of record
- Gerenciar discounts e cupons para promoções

## Limites de taxa

- 100 requests per minute
- Aplica-se a todos os endpoints
- HTTP 429 retornado quando excedido

## Skills relevantes

- pricing-page
- saas-metrics
- churn-reduction
- launch-sequence
- monetization-strategy
