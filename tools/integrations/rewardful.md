# Rewardful

Rastreamento de afiliados e referral para negócios SaaS baseados em Stripe.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for affiliates, referrals, commissions |
| MCP | - | Not available |
| CLI | - | Not available |
| SDK | - | API-only, JavaScript snippet for tracking |

## Autenticação

- **Type**: API Key
- **Header**: `Authorization: Bearer {api_secret}`
- **Get key**: Settings > API in Rewardful dashboard

## Operações comuns do agente

### Listar affiliates

```bash
GET https://api.getrewardful.com/v1/affiliates
```

### Obter affiliate por ID

```bash
GET https://api.getrewardful.com/v1/affiliates/{affiliate_id}
```

### Buscar affiliate por email

```bash
GET https://api.getrewardful.com/v1/affiliates?email=affiliate@example.com
```

### Obter referral por Stripe customer

```bash
GET https://api.getrewardful.com/v1/referrals?stripe_customer_id={customer_id}
```

### Listar referrals do affiliate

```bash
GET https://api.getrewardful.com/v1/referrals?affiliate_id={affiliate_id}
```

### Obter detalhes da commission

```bash
GET https://api.getrewardful.com/v1/commissions/{commission_id}
```

### Listar commissions

```bash
GET https://api.getrewardful.com/v1/commissions?affiliate_id={affiliate_id}
```

### Criar link de affiliate

```bash
POST https://api.getrewardful.com/v1/affiliates/{affiliate_id}/links

{
  "token": "custom-link-token",
  "url": "https://example.com/pricing"
}
```

### Atualizar affiliate

```bash
PUT https://api.getrewardful.com/v1/affiliates/{affiliate_id}

{
  "first_name": "John",
  "last_name": "Doe",
  "paypal_email": "john@example.com"
}
```

## Tracking em JavaScript

### Instalar snippet

```html
<script>
(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');
</script>
<script async src='https://r.wdfl.co/rw.js' data-rewardful='YOUR_API_KEY'></script>
```

### Rastrear conversão manualmente

```javascript
rewardful('convert', { email: 'customer@example.com' });
```

## Eventos de webhook

| Event | When |
|-------|------|
| `affiliate.created` | Novo affiliate se cadastra |
| `affiliate.approved` | Affiliate aprovado |
| `referral.created` | Novo referral rastreado |
| `referral.converted` | Referral vira customer |
| `commission.created` | Commission gerada |
| `commission.paid` | Commission paga |

## Objetos principais

- **Affiliate** - Partner que promove seu produto
- **Referral** - Visita/lead rastreado vindo de affiliate
- **Commission** - Pagamento ganho pelo affiliate
- **Campaign** - Programa com termos específicos
- **Link** - URL de tracking do affiliate

## Integração com Stripe

A Rewardful automaticamente:
1. Rastreia o cookie de referral quando o usuário visita via link de affiliate
2. Associa o Stripe customer ao referral no checkout
3. Cria commissions quando subscriptions são pagas
4. Gerencia commissions recorrentes para subscriptions

## Quando usar

- Configurar programas de affiliate/referral para SaaS
- Rastrear atribuição de referral em pagamentos do Stripe
- Gerenciar relacionamento com affiliates
- Processar pagamentos de affiliates
- Analisar performance do programa de referral

## Limites de taxa

- 120 requests per minute
- Entre em contato com o suporte para limites maiores

## Skills relevantes

- referral-program
- pricing-strategy
