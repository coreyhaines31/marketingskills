# Stripe

Processamento de pagamentos, assinaturas e cobrança para negócios na internet.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Comprehensive REST API |
| MCP | ✓ | Disponível via servidor MCP do Stripe |
| CLI | ✓ | `stripe` CLI para testes e webhooks |
| SDK | ✓ | SDKs oficiais para a maioria das linguagens |

## Autenticação

- **Tipo**: API Key
- **Header**: `Authorization: Bearer sk_live_xxx` or `sk_test_xxx`
- **Keys**: Secret key (server), Publishable key (client)

## Operações Comuns do Agente

### Listar clientes

```bash
GET https://api.stripe.com/v1/customers?limit=10
```

### Get customer by email

```bash
GET https://api.stripe.com/v1/customers?email=user@example.com
```

### Get subscription

```bash
GET https://api.stripe.com/v1/subscriptions/{subscription_id}
```

### List subscriptions for customer

```bash
GET https://api.stripe.com/v1/subscriptions?customer={customer_id}
```

### Create checkout session

```bash
POST https://api.stripe.com/v1/checkout/sessions

customer={customer_id}
&line_items[0][price]={price_id}
&line_items[0][quantity]=1
&mode=subscription
&success_url=https://example.com/success
&cancel_url=https://example.com/cancel
```

### Create customer portal session

```bash
POST https://api.stripe.com/v1/billing_portal/sessions

customer={customer_id}
&return_url=https://example.com/account
```

### List recent invoices

```bash
GET https://api.stripe.com/v1/invoices?customer={customer_id}&limit=10
```

### Get payment intent

```bash
GET https://api.stripe.com/v1/payment_intents/{payment_intent_id}
```

## Eventos de Webhook

Principais eventos para tratar:

| Evento | Quando | Ação |
|-------|------|--------|
| `checkout.session.completed` | Checkout concluído com sucesso | Provisionar acesso |
| `customer.subscription.created` | Nova assinatura | Atualizar registro do usuário |
| `customer.subscription.updated` | Mudança de plano | Atualizar permissões |
| `customer.subscription.deleted` | Cancelamento | Revogar acesso |
| `invoice.payment_failed` | Payment failed | Notify user, retry |
| `invoice.paid` | Invoice paid | Confirm payment |

### Verify webhook signature

```javascript
const event = stripe.webhooks.constructEvent(
  payload,
  sig,
  webhookSecret
);
```

## Comandos CLI

```bash
# Listen to webhooks locally
stripe listen --forward-to localhost:3000/webhooks

# Trigger test events
stripe trigger checkout.session.completed

# List recent events
stripe events list --limit 10

# Get resource
stripe customers retrieve cus_xxx
```

## Objetos Principais

- **Customer** - Perfil de cobrança do usuário
- **Subscription** - Recurring billing
- **Price** - Pricing configuration
- **Product** - What you sell
- **Invoice** - Billing document
- **PaymentIntent** - One-time payment
- **Checkout Session** - Hosted payment page

## Quando Usar

- Processing payments
- Gerenciar assinaturas
- Creating checkout flows
- Handling billing portal
- Consultar dados de clientes
- Revenue analytics

## Limites de Taxa

- 100 read requests per second
- 100 write requests per second
- Limites mais altos disponíveis sob solicitação

## Skills Relevantes

- pricing-strategy
- referral-program (Stripe-integrated affiliate tools)
- analytics-tracking (revenue tracking)
