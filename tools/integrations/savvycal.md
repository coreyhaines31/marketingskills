# SavvyCal

API de plataforma de agendamento para gerenciar scheduling links, eventos, slots de disponibilidade e webhooks.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API v1 - scheduling links, events, webhooks |
| MCP | - | Not available |
| CLI | ✓ | [savvycal.js](../clis/savvycal.js) |
| SDK | - | No official SDK |

## Autenticação

- **Type**: Bearer Token (Personal Access Token or OAuth 2.0)
- **Header**: `Authorization: Bearer {token}`
- **Get key**: Developer Settings in SavvyCal dashboard (create a Personal Access Token)

## Operações comuns do agente

### Obter usuário atual

```bash
GET https://api.savvycal.com/v1/me
```

### Listar scheduling links

```bash
GET https://api.savvycal.com/v1/scheduling-links
```

### Obter um scheduling link

```bash
GET https://api.savvycal.com/v1/scheduling-links/{id}
```

### Criar um scheduling link

```bash
POST https://api.savvycal.com/v1/scheduling-links

{
  "name": "30 Minute Meeting",
  "slug": "30min",
  "duration_minutes": 30
}
```

### Atualizar um scheduling link

```bash
PATCH https://api.savvycal.com/v1/scheduling-links/{id}

{
  "name": "Updated Meeting Name"
}
```

### Excluir um scheduling link

```bash
DELETE https://api.savvycal.com/v1/scheduling-links/{id}
```

### Duplicar um scheduling link

```bash
POST https://api.savvycal.com/v1/scheduling-links/{id}/duplicate
```

### Alternar estado do link (active/disabled)

```bash
POST https://api.savvycal.com/v1/scheduling-links/{id}/toggle
```

### Obter slots de horário disponíveis

```bash
GET https://api.savvycal.com/v1/scheduling-links/{id}/slots
```

### Listar eventos

```bash
GET https://api.savvycal.com/v1/events
```

### Obter um evento

```bash
GET https://api.savvycal.com/v1/events/{id}
```

### Criar um evento

```bash
POST https://api.savvycal.com/v1/events

{
  "scheduling_link_id": "{link_id}",
  "start_at": "2024-01-20T10:00:00Z",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Cancelar um evento

```bash
POST https://api.savvycal.com/v1/events/{id}/cancel
```

### Listar webhooks

```bash
GET https://api.savvycal.com/v1/webhooks
```

### Criar um webhook

```bash
POST https://api.savvycal.com/v1/webhooks

{
  "url": "https://example.com/webhook",
  "events": ["event.created", "event.canceled"]
}
```

## Métricas principais

### Dados de scheduling link
- `id` - Identificador único do link
- `name` - Nome de exibição
- `slug` - Slug da URL
- `duration_minutes` - Duração da reunião
- `state` - Active ou disabled
- `url` - URL completa de agendamento

### Dados de evento
- `id` - Identificador único do evento
- `name` - Nome do invitee
- `email` - Email do invitee
- `start_at` / `end_at` - Horário do evento
- `status` - Status do evento
- `scheduling_link` - Scheduling link associado

## Parâmetros

### Listar eventos
- `before` / `after` - Cursors de paginação
- `limit` - Resultados por página (default 20, max 100)

### Listar scheduling links
- `before` / `after` - Cursors de paginação
- `limit` - Resultados por página

## Quando usar

- Gerenciar scheduling links programaticamente
- Buscar eventos agendados para sync de CRM ou analytics
- Verificar slots disponíveis para booking UIs custom
- Automatizar criação de scheduling links para campanhas
- Monitorar atividade de agendamento via webhooks

## Limites de taxa

- Não documentado oficialmente
- Implemente lógica de retry com exponential backoff
- Monitore respostas HTTP 429

## Skills relevantes

- lead-generation
- sales-automation
- appointment-scheduling
- customer-onboarding
