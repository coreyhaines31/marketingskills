# Amplitude

Plataforma de product analytics para comportamento do usuário, retenção e experimentação.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | HTTP API para eventos, User Profile API, Export API |
| MCP | - | Não disponível |
| CLI | - | Não disponível |
| SDK | ✓ | JavaScript, iOS, Android, Python, etc. |

## Autenticação

- **HTTP API**: API Key (pública para eventos)
- **Export/Dashboard API**: API Key + Secret Key

## Operações Comuns do Agente

### Rastrear event

```bash
POST https://api2.amplitude.com/2/httpapi

{
  "api_key": "{api_key}",
  "events": [{
    "user_id": "user_123",
    "event_type": "signup_completed",
    "event_properties": {
      "plan": "pro"
    },
    "user_properties": {
      "email": "user@example.com"
    }
  }]
}
```

### Batch events

```bash
POST https://api2.amplitude.com/batch

{
  "api_key": "{api_key}",
  "events": [
    {"user_id": "user_1", "event_type": "pageview"},
    {"user_id": "user_2", "event_type": "signup"}
  ]
}
```

### Obter user activity

```bash
GET https://amplitude.com/api/2/useractivity?user={user_id}

Authorization: Basic {base64(api_key:secret_key)}
```

### Export events

```bash
GET https://amplitude.com/api/2/export?start=20240101T00&end=20240131T23

Authorization: Basic {base64(api_key:secret_key)}
```

### Obter dados de retenção

```bash
GET https://amplitude.com/api/2/retention?e={"event_type":"signup_completed"}&start=20240101&end=20240131

Authorization: Basic {base64(api_key:secret_key)}
```

### Consultar com SQL (Snowflake)

Para clientes Amplitude com acesso SQL:
```sql
SELECT event_type, COUNT(*) as count
FROM events
WHERE event_time > '2024-01-01'
GROUP BY event_type
```

## SDK JavaScript

```javascript
// Initialize
amplitude.init('API_KEY');

// Identify user
amplitude.setUserId('user_123');

// Set user properties
const identify = new amplitude.Identify();
identify.set('plan', 'pro');
amplitude.identify(identify);

// Track event
amplitude.track('Feature Used', {
  feature_name: 'export'
});
```

## Conceitos Principais

- **Events** - Ações de usuário com propriedades
- **User Properties** - Persistent user attributes
- **Cohorts** - Behavioral segments
- **Funnels** - Multi-step conversion analysis
- **Retention** - Padrões de retorno de usuário
- **Journeys** - User path analysis

## Quando Usar

- Rastreamento de product analytics
- Analyzing user funnels
- Análise de cohort e retenção
- Experimentação e teste A/B
- User journey mapping

## Limites de Taxa

- HTTP API: 1000 events/second
- Export API: 360 requisições/hora

## Skills Relevantes

- analytics-tracking
- ab-test-setup
- onboarding-cro
