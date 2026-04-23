# Segment

Customer data platform para coletar, rotear e ativar dados de usuários.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Tracking API, Profile API, Config API |
| MCP | - | Not available |
| CLI | - | Not available |
| SDK | ✓ | analytics.js, iOS, Android, server libraries |

## Autenticação

- **Tracking**: Write Key (por source)
- **API**: Access Token (OAuth 2.0)
- **Header**: `Authorization: Bearer {access_token}`

## Operações comuns do agente

### Rastrear evento

```bash
POST https://api.segment.io/v1/track

Authorization: Basic {base64(write_key:)}

{
  "userId": "user_123",
  "event": "signup_completed",
  "properties": {
    "plan": "pro",
    "method": "email"
  }
}
```

### Identificar usuário

```bash
POST https://api.segment.io/v1/identify

Authorization: Basic {base64(write_key:)}

{
  "userId": "user_123",
  "traits": {
    "email": "user@example.com",
    "name": "John Doe",
    "plan": "pro"
  }
}
```

### Rastrear page view

```bash
POST https://api.segment.io/v1/page

Authorization: Basic {base64(write_key:)}

{
  "userId": "user_123",
  "name": "Pricing",
  "properties": {
    "title": "Pricing - Example",
    "url": "https://example.com/pricing"
  }
}
```

### Eventos em batch

```bash
POST https://api.segment.io/v1/batch

Authorization: Basic {base64(write_key:)}

{
  "batch": [
    {"type": "identify", "userId": "user_1", "traits": {"plan": "free"}},
    {"type": "track", "userId": "user_1", "event": "signup"}
  ]
}
```

### Obter perfil de usuário (Profile API)

```bash
GET https://profiles.segment.com/v1/spaces/{space_id}/collections/users/profiles/user_id:{user_id}/traits

Authorization: Basic {base64(access_token:)}
```

### Obter eventos do usuário

```bash
GET https://profiles.segment.com/v1/spaces/{space_id}/collections/users/profiles/user_id:{user_id}/events

Authorization: Basic {base64(access_token:)}
```

## JavaScript SDK

```javascript
// Initialize
analytics.load('WRITE_KEY');

// Identify user
analytics.identify('user_123', {
  email: 'user@example.com',
  plan: 'pro'
});

// Track event
analytics.track('Feature Used', {
  feature_name: 'export'
});

// Page view
analytics.page('Pricing');
```

## Conceitos principais

- **Sources** - De onde os dados vêm (website, app, server)
- **Destinations** - Para onde os dados vão (analytics, CRM, ads)
- **Tracking Plan** - Schema para eventos e properties
- **Protocols** - Governança e validação de dados
- **Personas** - Perfis de usuário unificados
- **Audiences** - Segmentos computados de usuários

## Destinations comuns

- Analytics: GA4, Mixpanel, Amplitude
- CRM: HubSpot, Salesforce
- Email: Customer.io, Mailchimp
- Ads: Google Ads, Meta
- Data Warehouse: BigQuery, Snowflake

## Quando usar

- Centralizar event tracking
- Rotear dados para múltiplas ferramentas
- Manter tracking consistente
- Criar perfis de usuário unificados
- Sincronizar audiences entre plataformas

## Limites de taxa

- 500 requests/second per source
- Batch up to 500KB or 32KB per event

## Skills relevantes

- analytics-tracking
- email-sequence
- paid-ads
