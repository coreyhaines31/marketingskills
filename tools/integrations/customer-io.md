# Customer.io

Plataforma de mensagens baseada em comportamento para email, push, SMS e in-app.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | Track API, App API, Journeys API |
| MCP | - | Não disponível |
| CLI | - | Não disponível |
| SDK | ✓ | JavaScript, iOS, Android, Ruby, Python |

## Autenticação

- **Track API**: Site ID + API Key (Basic auth)
- **App API**: Bearer token
- **Cabeçalho**: `Authorization: Basic {base64(site_id:api_key)}`

## Operações Comuns do Agente

### Identificar customer

```bash
PUT https://track.customer.io/api/v1/customers/{customer_id}

Authorization: Basic {base64(site_id:api_key)}

{
  "email": "user@example.com",
  "created_at": 1705312800,
  "first_name": "John",
  "plan": "pro"
}
```

### Rastrear event

```bash
POST https://track.customer.io/api/v1/customers/{customer_id}/events

Authorization: Basic {base64(site_id:api_key)}

{
  "name": "purchase",
  "data": {
    "product": "Pro Plan",
    "amount": 99
  }
}
```

### Rastrear anonymous event

```bash
POST https://track.customer.io/api/v1/events

Authorization: Basic {base64(site_id:api_key)}

{
  "name": "page_viewed",
  "data": {
    "page": "/pricing"
  },
  "anonymous_id": "anon_123"
}
```

### Excluir customer

```bash
DELETE https://track.customer.io/api/v1/customers/{customer_id}

Authorization: Basic {base64(site_id:api_key)}
```

### Obter customer (App API)

```bash
GET https://api.customer.io/v1/customers/{customer_id}/attributes

Authorization: Bearer {app_api_key}
```

### Listar campaigns

```bash
GET https://api.customer.io/v1/campaigns

Authorization: Bearer {app_api_key}
```

### Obter campaign metrics

```bash
GET https://api.customer.io/v1/campaigns/{campaign_id}/metrics

Authorization: Bearer {app_api_key}
```

### Disparar broadcast

```bash
POST https://api.customer.io/v1/campaigns/{campaign_id}/triggers

Authorization: Bearer {app_api_key}

{
  "emails": ["user@example.com"],
  "data": {
    "coupon_code": "SAVE20"
  }
}
```

### Enviar transactional email

```bash
POST https://api.customer.io/v1/send/email

Authorization: Bearer {app_api_key}

{
  "transactional_message_id": "1",
  "to": "user@example.com",
  "identifiers": {
    "id": "user_123"
  },
  "message_data": {
    "order_id": "ORD-456"
  }
}
```

## SDK JavaScript

```javascript
// Initialize
_cio.identify({
  id: 'user_123',
  email: 'user@example.com',
  created_at: 1705312800,
  plan: 'pro'
});

// Track event
_cio.track('purchase', {
  product: 'Pro Plan',
  amount: 99
});

// Track page view
_cio.page();
```

## Conceitos Principais

- **People** - Clientes e leads
- **Segments** - Grupos dinâmicos baseados em atributos/comportamento
- **Campaigns** - Automated message sequences
- **Broadcasts** - One-time sends
- **Transactional** - Triggered messages

## Tipos de Atributo

- Padrão: `email`, `created_at`, `unsubscribed`
- Custom: qualquer chave que você definir
- Computed: Agregações de eventos

## Quando Usar

- Automação de email baseada em comportamento
- Multi-channel messaging (email, push, SMS)
- Onboarding sequences
- Re-engagement campaigns
- Transactional messages

## Limites de Taxa

- Track API: 100 requisições/segundo
- App API: 10 requisições/segundo

## Skills Relevantes

- email-sequence
- onboarding-cro
- analytics-tracking
