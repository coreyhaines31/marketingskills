# Tolt

Gerenciamento de programa de afiliados para SaaS, com integração Stripe e Paddle.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | API REST para afiliados, indicações e pagamentos |
| MCP | - | Não disponível |
| CLI | - | Não disponível |
| SDK | - | Snippet JavaScript para rastreamento |

## Autenticação

- **Tipo**: API Key
- **Header**: `Authorization: Bearer {api_key}`
- **Obter chave**: Settings > API no dashboard do Tolt

## Operações Comuns do Agente

### Listar afiliados

```bash
GET https://api.tolt.io/v1/affiliates
```

### Obter afiliado

```bash
GET https://api.tolt.io/v1/affiliates/{affiliate_id}
```

### Criar afiliado

```bash
POST https://api.tolt.io/v1/affiliates

{
  "email": "affiliate@example.com",
  "name": "John Doe"
}
```

### Listar indicações

```bash
GET https://api.tolt.io/v1/referrals?affiliate_id={affiliate_id}
```

### Obter indicação por cliente

```bash
GET https://api.tolt.io/v1/referrals?customer_id={stripe_customer_id}
```

### Listar comissões

```bash
GET https://api.tolt.io/v1/commissions?affiliate_id={affiliate_id}
```

### Obter histórico de pagamentos

```bash
GET https://api.tolt.io/v1/payouts?affiliate_id={affiliate_id}
```

### Atualizar afiliado

```bash
PATCH https://api.tolt.io/v1/affiliates/{affiliate_id}

{
  "commission_rate": 30,
  "payout_method": "paypal",
  "paypal_email": "affiliate@paypal.com"
}
```

## Rastreamento em JavaScript

### Instalar snippet

```html
<script src="https://cdn.tolt.io/tolt.js" data-tolt="YOUR_PUBLIC_KEY"></script>
```

### Rastrear cadastro

```javascript
window.tolt.signup(stripeCustomerId);
```

### Identificar cliente existente

```javascript
window.tolt.identify(stripeCustomerId);
```

## Eventos de Webhook

| Evento | Quando |
|-------|------|
| `affiliate.created` | Novo afiliado registrado |
| `affiliate.approved` | Affiliate approved |
| `referral.created` | Nova indicação rastreada |
| `referral.converted` | Indicação convertida em cliente |
| `commission.created` | Commission earned |
| `payout.completed` | Payout sent |

## Key Features

- **Stripe native** - Rastreamento automático de comissão
- **Paddle support** - Funciona com cobrança via Paddle
- **Affiliate dashboard** - White-labeled portal
- **Automação de pagamentos** - Pagamentos via PayPal e Wise
- **Custom commission tiers** - Different rates per affiliate

## Objetos Principais

- **Affiliate** - Partner in your program
- **Referral** - Tracked conversion
- **Commission** - Earned affiliate payment
- **Payout** - Processed payment to affiliate
- **Program** - Campaign configuration

## Quando Usar

- Setting up SaaS affiliate programs
- Gerenciar relacionamento com afiliados
- Rastrear indicações baseadas em Stripe ou Paddle
- Processing affiliate payouts
- Construir dashboards de afiliados

## Limites de Taxa

- 100 requests per minute
- Higher limits on enterprise plans

## Skills Relevantes

- referral-program
- pricing-strategy
