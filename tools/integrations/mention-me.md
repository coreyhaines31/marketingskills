# Mention Me

Plataforma enterprise de referral marketing para advocacy de clientes.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for referrals, customers, rewards |
| MCP | - | Not available |
| CLI | - | Not available |
| SDK | - | JavaScript widget para embed |

## Autenticação

- **Type**: API Key
- **Header**: `Authorization: Bearer {api_key}`
- **Environment**: Chaves separadas para sandbox e produção

## Operações comuns do agente

### Criar oferta de referral

```bash
POST https://api.mention-me.com/api/v2/referrer-offer

{
  "email": "customer@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "order_number": "ORD-123",
  "order_total": 99.99,
  "order_currency": "USD"
}
```

### Obter link de referral para cliente

```bash
GET https://api.mention-me.com/api/v2/referrer/{customer_id}/share-links
```

### Registrar referee (cliente indicado)

```bash
POST https://api.mention-me.com/api/v2/referee

{
  "email": "referred@example.com",
  "firstname": "Jane",
  "referrer_code": "JOHN123",
  "order_number": "ORD-456",
  "order_total": 149.99
}
```

### Obter status do referral

```bash
GET https://api.mention-me.com/api/v2/referral/{referral_id}
```

### Listar referrals do cliente

```bash
GET https://api.mention-me.com/api/v2/referrer/{customer_id}/referrals
```

### Obter saldo de reward

```bash
GET https://api.mention-me.com/api/v2/referrer/{customer_id}/rewards
```

### Resgatar reward

```bash
POST https://api.mention-me.com/api/v2/referrer/{customer_id}/rewards/redeem

{
  "reward_id": "RWD-123",
  "order_number": "ORD-789"
}
```

## JavaScript Widget

### Embed do widget de referral

```html
<div id="mmWrapper"></div>
<script>
  window.MentionMe = window.MentionMe || [];
  MentionMe.push({
    type: 'offer',
    customer: {
      email: 'customer@example.com',
      firstname: 'John',
      order_number: 'ORD-123'
    }
  });
</script>
<script src="https://tag.mention-me.com/client/{partner_code}.js" async></script>
```

### Widget de name share

```javascript
MentionMe.push({
  type: 'nameShare',
  customer: {
    email: 'customer@example.com'
  }
});
```

## Eventos de webhook

| Event | When |
|-------|------|
| `referral.created` | Novo referral rastreado |
| `referral.converted` | Referral concluiu compra |
| `reward.earned` | Reward desbloqueada |
| `reward.redeemed` | Reward usada |

## Principais recursos

- **A/B testing** - Framework de experimentos nativo
- **Fraud prevention** - Detecção automática de fraude
- **Multi-channel** - Compartilhamento via link, email e social
- **Name sharing** - Indicação por nome, não por código
- **Segmentation** - Ofertas diferentes por segmento
- **Analytics** - Relatórios de programa de referral

## Objetos principais

- **Referrer** - Cliente que indica
- **Referee** - Cliente que foi indicado
- **Referral** - Conexão entre referrer e referee
- **Offer** - Configuração do programa de referral
- **Reward** - Incentivo ganho

## Quando usar

- Programas enterprise de referral
- Campanhas de referral em múltiplos mercados
- A/B testing de ofertas de referral
- Rastreamento de referral resistente a fraude
- Programas de compartilhamento por nome

## Limites de taxa

- 1000 requests per minute
- Entre em contato para limites maiores

## Skills relevantes

- referral-program
- pricing-strategy
- analytics-tracking
