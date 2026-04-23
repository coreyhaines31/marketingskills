# Calendly

API da plataforma de agendamento e reservas para gerenciar tipos de evento, eventos agendados, convidados e disponibilidade.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | REST API v2 - event types, scheduled events, invitees, availability |
| MCP | - | Não disponível |
| CLI | ✓ | [calendly.js](../clis/calendly.js) |
| SDK | ✓ | Sem SDK oficial; bibliotecas da comunidade disponíveis |

## Autenticação

- **Tipo**: Bearer Token (Personal Access Token or OAuth 2.0)
- **Cabeçalho**: `Authorization: Bearer {token}`
- **Obter chave**: https://calendly.com/integrations/api_webhooks (Personal Access Token)

## Operações Comuns do Agente

### Obter current user

```bash
GET https://api.calendly.com/users/me
```

### Listar event types

```bash
GET https://api.calendly.com/event_types?user={user_uri}
```

### Listar scheduled events

```bash
GET https://api.calendly.com/scheduled_events?user={user_uri}&min_start_time=2024-01-01T00:00:00Z&max_start_time=2024-12-31T23:59:59Z&status=active
```

### Obter a scheduled event

```bash
GET https://api.calendly.com/scheduled_events/{event_uuid}
```

### Listar convidados de um evento

```bash
GET https://api.calendly.com/scheduled_events/{event_uuid}/invitees
```

### Cancelar a scheduled event

```bash
POST https://api.calendly.com/scheduled_events/{event_uuid}/cancellation

{
  "reason": "Cancellation reason"
}
```

### Obter horários disponíveis

```bash
GET https://api.calendly.com/event_type_available_times?event_type={event_type_uri}&start_time=2024-01-20T00:00:00Z&end_time=2024-01-27T00:00:00Z
```

### Obter user busy times

```bash
GET https://api.calendly.com/user_busy_times?user={user_uri}&start_time=2024-01-20T00:00:00Z&end_time=2024-01-27T00:00:00Z
```

### Listar organization members

```bash
GET https://api.calendly.com/organization_memberships?organization={organization_uri}
```

### Criar webhook subscription

```bash
POST https://api.calendly.com/webhook_subscriptions

{
  "url": "https://example.com/webhook",
  "events": ["invitee.created", "invitee.canceled"],
  "organization": "{organization_uri}",
  "scope": "organization"
}
```

### Listar webhook subscriptions

```bash
GET https://api.calendly.com/webhook_subscriptions?organization={organization_uri}&scope=organization
```

### Excluir webhook subscription

```bash
DELETE https://api.calendly.com/webhook_subscriptions/{webhook_uuid}
```

## Métricas Principais

### Dados de Evento Agendado
- `uri` - Unique event URI
- `name` - Event type name
- `status` - Event status (active, canceled)
- `start_time` / `end_time` - Event timing
- `event_type` - URI do tipo de evento
- `location` - Meeting location details
- `invitees_counter` - Count of invitees (active, limit, total)

### Dados de Convidado
- `name` - Invitee full name
- `email` - Invitee email
- `status` - active or canceled
- `questions_and_answers` - Respostas de perguntas customizadas
- `tracking` - Parâmetros UTM
- `created_at` / `updated_at` - Timestamps

## Parâmetros

### Listar Eventos Agendados
- `user` - URI do usuário (obrigatório)
- `min_start_time` / `max_start_time` - Filtro de intervalo de datas (ISO 8601)
- `status` - Filtrar por status (active, canceled)
- `count` - Número de resultados (padrão 20, máx. 100)
- `page_token` - Pagination token
- `sort` - Sort order (start_time:asc or start_time:desc)

### Listar Tipos de Evento
- `user` - User URI
- `organization` - Organization URI
- `active` - Filtrar active/inactive
- `count` - Resultados por página
- `sort` - Sort order

## Quando Usar

- Recuperação de dados de reuniões agendadas para sync com CRM
- Monitoramento da atividade de reservas e taxas de conversão
- Automating follow-up workflows after meetings
- Verificação de disponibilidade antes de sugerir horários de reunião
- Rastreamento de cancelamentos de reunião e no-shows
- Criação de interfaces de reserva customizadas

## Limites de Taxa

- Não oficialmente documentado; implemente lógica de retry com exponential backoff
- Use taxas de requisição conservadoras (evite rajadas)
- Monitore respostas HTTP 429

## Skills Relevantes

- lead-generation
- sales-automation
- customer-onboarding
- appointment-scheduling
