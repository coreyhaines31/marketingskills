# PostHog

Product analytics open-source com session replay e feature flags.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Capture API, Query API, Feature Flags API |
| MCP | - | Not available |
| CLI | ✓ | `posthog` CLI for local development |
| SDK | ✓ | JavaScript, Python, Ruby, Go, etc. |

## Autenticação

- **Type**: API Key (Personal or Project)
- **Header**: `Authorization: Bearer {api_key}`
- **For capture**: Project API Key no payload

## Operações comuns do agente

### Capturar evento

```bash
POST https://app.posthog.com/capture/

{
  "api_key": "{project_api_key}",
  "event": "signup_completed",
  "distinct_id": "user_123",
  "properties": {
    "plan": "pro",
    "$current_url": "https://example.com/signup"
  }
}
```

### Eventos em batch

```bash
POST https://app.posthog.com/batch/

{
  "api_key": "{project_api_key}",
  "batch": [
    {"event": "pageview", "distinct_id": "user_1"},
    {"event": "signup", "distinct_id": "user_2"}
  ]
}
```

### Obter pessoa por distinct_id

```bash
GET https://app.posthog.com/api/projects/{project_id}/persons/?distinct_id=user_123

Authorization: Bearer {api_key}
```

### Consultar eventos (HogQL)

```bash
POST https://app.posthog.com/api/projects/{project_id}/query/

{
  "query": {
    "kind": "HogQLQuery",
    "query": "SELECT event, count() FROM events WHERE timestamp > now() - interval 7 day GROUP BY event ORDER BY count() DESC LIMIT 10"
  }
}
```

### Obter valor de feature flag

```bash
POST https://app.posthog.com/decide?v=3

{
  "api_key": "{project_api_key}",
  "distinct_id": "user_123"
}
```

### Obter insights

```bash
GET https://app.posthog.com/api/projects/{project_id}/insights/

Authorization: Bearer {api_key}
```

### Obter gravações de sessão

```bash
GET https://app.posthog.com/api/projects/{project_id}/session_recordings/

Authorization: Bearer {api_key}
```

## JavaScript SDK

```javascript
// Initialize
posthog.init('PROJECT_API_KEY', {
  api_host: 'https://app.posthog.com'
});

// Identify user
posthog.identify('user_123', {
  email: 'user@example.com',
  plan: 'pro'
});

// Track event
posthog.capture('signup_completed', {
  method: 'email'
});

// Check feature flag
if (posthog.isFeatureEnabled('new-pricing')) {
  // Show new pricing
}
```

## Principais recursos

- **Event tracking** - Product analytics
- **Session replay** - Visualizar sessões de usuários
- **Feature flags** - Controlar rollout de funcionalidades
- **A/B testing** - Experimentos nativos
- **HogQL** - Linguagem de query similar a SQL
- **Self-hostable** - Rodar na sua infraestrutura

## Quando usar

- Product analytics com foco em privacidade
- Session replay para insights de UX
- Gerenciamento de feature flags
- Necessidade de analytics self-hosted
- Requisitos de open-source

## Limites de taxa

- Cloud: 10,000 events/second
- Self-hosted: Unlimited

## Skills relevantes

- analytics-tracking
- ab-test-setup
- onboarding-cro
