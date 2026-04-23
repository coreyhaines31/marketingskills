# OneSignal

Plataforma de push notification, email, SMS e in-app messaging para customer engagement em escala.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Notifications, Users, Segments, Templates, Apps |
| MCP | - | Not available |
| CLI | ✓ | [onesignal.js](../clis/onesignal.js) |
| SDK | ✓ | JavaScript, Node.js, Python, Java, PHP, Ruby, Go, .NET |

## Autenticação

- **Type**: REST API Key (Basic Auth)
- **Header**: `Authorization: Basic {REST_API_KEY}`
- **App ID**: Obrigatório como `app_id` nos request bodies
- **Get credentials**: Dashboard > Settings > Keys & IDs
- **Security**: HTTPS obrigatório, TLS 1.2+ na porta 443

## Operações comuns do agente

### Enviar push notification para segmento

```bash
POST https://api.onesignal.com/api/v1/notifications

Headers:
  Authorization: Basic {REST_API_KEY}
  Content-Type: application/json

{
  "app_id": "YOUR_APP_ID",
  "included_segments": ["Subscribed Users"],
  "headings": { "en": "New Feature!" },
  "contents": { "en": "Check out our latest update." },
  "url": "https://example.com/feature"
}
```

### Enviar notification para usuários específicos

```bash
POST https://api.onesignal.com/api/v1/notifications

Headers:
  Authorization: Basic {REST_API_KEY}
  Content-Type: application/json

{
  "app_id": "YOUR_APP_ID",
  "include_aliases": { "external_id": ["user-123", "user-456"] },
  "target_channel": "push",
  "contents": { "en": "You have a new message." }
}
```

### Agendar uma notification

```bash
POST https://api.onesignal.com/api/v1/notifications

Headers:
  Authorization: Basic {REST_API_KEY}
  Content-Type: application/json

{
  "app_id": "YOUR_APP_ID",
  "included_segments": ["Subscribed Users"],
  "contents": { "en": "Scheduled notification" },
  "send_after": "2025-12-01 12:00:00 GMT-0500"
}
```

### Listar notifications

```bash
GET https://api.onesignal.com/api/v1/notifications?app_id={APP_ID}&limit=50&offset=0

Headers:
  Authorization: Basic {REST_API_KEY}
```

### Visualizar uma notification

```bash
GET https://api.onesignal.com/api/v1/notifications/{notification_id}?app_id={APP_ID}

Headers:
  Authorization: Basic {REST_API_KEY}
```

### Cancelar uma notification agendada

```bash
DELETE https://api.onesignal.com/api/v1/notifications/{notification_id}?app_id={APP_ID}

Headers:
  Authorization: Basic {REST_API_KEY}
```

### Listar segmentos

```bash
GET https://api.onesignal.com/api/v1/apps/{APP_ID}/segments

Headers:
  Authorization: Basic {REST_API_KEY}
```

### Criar um segmento

```bash
POST https://api.onesignal.com/api/v1/apps/{APP_ID}/segments

Headers:
  Authorization: Basic {REST_API_KEY}
  Content-Type: application/json

{
  "name": "Active Users",
  "filters": [
    { "field": "session_count", "relation": ">", "value": "5" }
  ]
}
```

### Obter usuário por external ID

```bash
GET https://api.onesignal.com/api/v1/apps/{APP_ID}/users/by/external_id/{external_id}

Headers:
  Authorization: Basic {REST_API_KEY}
```

### Criar um usuário

```bash
POST https://api.onesignal.com/api/v1/apps/{APP_ID}/users

Headers:
  Authorization: Basic {REST_API_KEY}
  Content-Type: application/json

{
  "identity": { "external_id": "user-789" },
  "subscriptions": [
    { "type": "Email", "token": "user@example.com" }
  ],
  "tags": { "plan": "pro", "signup_source": "organic" }
}
```

### Listar templates

```bash
GET https://api.onesignal.com/api/v1/templates?app_id={APP_ID}

Headers:
  Authorization: Basic {REST_API_KEY}
```

## Métricas principais

### Métricas de notification
- `successful` - Número de entregas bem-sucedidas
- `failed` - Número de entregas com falha
- `converted` - Usuários que clicaram/convertaram
- `remaining` - Notifications ainda em fila
- `errored` - Quantidade de erros
- `opened` - Quantidade de aberturas de notification

### Métricas de usuário
- `session_count` - Total de sessões do usuário
- `last_active` - Timestamp da última atividade
- `tags` - Metadados custom key-value
- `subscriptions` - Canais de subscription ativos

## Parâmetros

### Parâmetros de notification
- `app_id` - Application ID (obrigatório)
- `included_segments` - Array de segmentos-alvo
- `excluded_segments` - Array de segmentos excluídos
- `include_aliases` - Segmenta usuários específicos por alias
- `target_channel` - Canal: `push`, `email`, `sms`
- `contents` - Conteúdo da mensagem por language code
- `headings` - Título da notification por language code
- `url` - URL aberta no clique
- `data` - Payload custom key-value
- `send_after` - Horário de envio agendado (UTC string)
- `ttl` - Time to live em segundos

### Campos de filtro de segmento
- `session_count` - Número de sessões
- `first_session` - Data da primeira sessão
- `last_session` - Data da última sessão
- `tag` - Valor de tag custom
- `language` - Idioma do usuário
- `app_version` - Versão do app
- `country` - Código de país do usuário

## Quando usar

- Enviar push notifications para atualizações de produto
- Notifications acionadas com base no comportamento do usuário
- Mensageria multicanal (push + email + SMS)
- Campanhas de re-engagement para usuários inativos
- Segmentação de usuários para mensagens direcionadas
- A/B testing de conteúdo de notification
- Agendamento de campanhas promocionais

## Limites de taxa

- **Free Plan**: 150 notification requests/second per app
- **Paid Plan**: 6,000 notification requests/second per app
- **User/Subscription ops**: 1,000 requests/second por app
- **Burst limit**: Não mais que 10x do total de subscribers em 15 minutos
- **429 response**: Inclui header `RetryAfter` com os segundos de espera

## Skills relevantes

- push-notifications
- customer-engagement
- retention-campaign
- re-engagement
- lifecycle-marketing
