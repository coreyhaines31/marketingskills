# Mixpanel

Plataforma de product analytics para rastrear comportamento e retenção de usuários.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Ingestion API, Query API, Data Export |
| MCP | - | Not available |
| CLI | - | Not available |
| SDK | ✓ | JavaScript, iOS, Android, Python, etc. |

## Autenticação

- **Ingestion**: Project token (público)
- **Query API**: Service Account (username:secret as Basic auth)
- **Export**: API Secret

## Operações comuns do agente

### Rastrear evento (Ingestion API)

```bash
POST https://api.mixpanel.com/track

{
  "event": "signup_completed",
  "properties": {
    "token": "{project_token}",
    "distinct_id": "user_123",
    "plan": "pro",
    "time": 1705312800
  }
}
```

### Definir perfil de usuário

```bash
POST https://api.mixpanel.com/engage

{
  "$token": "{project_token}",
  "$distinct_id": "user_123",
  "$set": {
    "$email": "user@example.com",
    "$name": "John Doe",
    "plan": "pro"
  }
}
```

### Consultar eventos (Query API)

```bash
POST https://mixpanel.com/api/2.0/insights

{
  "project_id": {project_id},
  "bookmark_id": null,
  "params": {
    "events": [{"event": "signup_completed"}],
    "time_range": {
      "from_date": "2024-01-01",
      "to_date": "2024-01-31"
    }
  }
}
```

### Obter dados de funnel

```bash
GET https://mixpanel.com/api/2.0/funnels?funnel_id={funnel_id}&from_date=2024-01-01&to_date=2024-01-31
```

### Exportar eventos brutos

```bash
GET https://data.mixpanel.com/api/2.0/export?from_date=2024-01-01&to_date=2024-01-01
```

### Obter dados de retenção

```bash
GET https://mixpanel.com/api/2.0/retention?from_date=2024-01-01&to_date=2024-01-31&retention_type=birth&born_event=signup_completed
```

## JavaScript SDK

```javascript
// Initialize
mixpanel.init('YOUR_TOKEN');

// Identify user
mixpanel.identify('user_123');

// Set user properties
mixpanel.people.set({
  '$email': 'user@example.com',
  'plan': 'pro'
});

// Track event
mixpanel.track('Feature Used', {
  'feature_name': 'export'
});
```

## Conceitos principais

- **Events** - Ações do usuário (signup, purchase etc.)
- **Properties** - Atributos dos eventos
- **User Profiles** - Dados persistentes do usuário
- **Cohorts** - Segmentos de usuário salvos
- **Funnels** - Sequências de conversão
- **Retention** - Padrões de retorno dos usuários

## Quando usar

- Rastrear eventos de uso do produto
- Analisar funnels de conversão
- Medir adoção de funcionalidades
- Análise de retenção
- Segmentação de usuários

## Limites de taxa

- Ingestion: Sem limite rígido (batch recomendado)
- Query API: Varia por plano

## Skills relevantes

- analytics-tracking
- ab-test-setup
- onboarding-cro
