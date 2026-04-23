# Livestorm

Plataforma de engajamento em vídeo para webinars, eventos virtuais e reuniões online com analytics e integrações embutidos.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Events, Sessions, People, Recordings, Webhooks |
| MCP | - | Não disponível |
| CLI | ✓ | [livestorm.js](../clis/livestorm.js) |
| SDK | - | REST API com formato JSON:API |

## Autenticação

- **Tipo**: API Token
- **Header**: `Authorization: {API_TOKEN}` (no prefix)
- **Content-Type**: `application/vnd.api+json` (JSON:API)
- **Scopes**: Identity, Events, Admin, Webhooks
- **Obter token**: Account Settings > Integrations > Public API
- **Docs**: https://developers.livestorm.co/

## Operações comuns de agent

### Ping (testar autenticação)

```bash
GET https://api.livestorm.co/v1/ping

Headers:
  Authorization: {API_TOKEN}
  Accept: application/vnd.api+json
```

### Listar events

```bash
GET https://api.livestorm.co/v1/events?page[number]=1&page[size]=25

Headers:
  Authorization: {API_TOKEN}
  Accept: application/vnd.api+json
```

### Criar um event

```bash
POST https://api.livestorm.co/v1/events

Headers:
  Authorization: {API_TOKEN}
  Content-Type: application/vnd.api+json

{
  "data": {
    "type": "events",
    "attributes": {
      "title": "Product Demo Webinar",
      "slug": "product-demo-webinar",
      "estimated_duration": 60
    }
  }
}
```

### Buscar detalhes do event

```bash
GET https://api.livestorm.co/v1/events/{event_id}

Headers:
  Authorization: {API_TOKEN}
  Accept: application/vnd.api+json
```

### Atualizar um event

```bash
PATCH https://api.livestorm.co/v1/events/{event_id}

Headers:
  Authorization: {API_TOKEN}
  Content-Type: application/vnd.api+json

{
  "data": {
    "type": "events",
    "id": "{event_id}",
    "attributes": {
      "title": "Updated Webinar Title"
    }
  }
}
```

### Listar sessions

```bash
GET https://api.livestorm.co/v1/sessions?page[number]=1&page[size]=25

Headers:
  Authorization: {API_TOKEN}
  Accept: application/vnd.api+json
```

### Criar uma session para um event

```bash
POST https://api.livestorm.co/v1/events/{event_id}/sessions

Headers:
  Authorization: {API_TOKEN}
  Content-Type: application/vnd.api+json

{
  "data": {
    "type": "sessions",
    "attributes": {
      "estimated_started_at": "2025-06-15T14:00:00.000Z",
      "timezone": "America/New_York"
    }
  }
}
```

### Registrar alguém em uma session

```bash
POST https://api.livestorm.co/v1/sessions/{session_id}/people

Headers:
  Authorization: {API_TOKEN}
  Content-Type: application/vnd.api+json

{
  "data": {
    "type": "people",
    "attributes": {
      "fields": {
        "email": "attendee@example.com",
        "first_name": "Jane",
        "last_name": "Doe"
      }
    }
  }
}
```

### Listar participantes da session

```bash
GET https://api.livestorm.co/v1/sessions/{session_id}/people?page[number]=1&page[size]=25

Headers:
  Authorization: {API_TOKEN}
  Accept: application/vnd.api+json
```

### Remover um inscrito da session

```bash
DELETE https://api.livestorm.co/v1/sessions/{session_id}/people?filter[email]=attendee@example.com

Headers:
  Authorization: {API_TOKEN}
```

### Listar mensagens de chat da session

```bash
GET https://api.livestorm.co/v1/sessions/{session_id}/chat-messages

Headers:
  Authorization: {API_TOKEN}
  Accept: application/vnd.api+json
```

### Listar perguntas da session

```bash
GET https://api.livestorm.co/v1/sessions/{session_id}/questions

Headers:
  Authorization: {API_TOKEN}
  Accept: application/vnd.api+json
```

### Buscar recordings da session

```bash
GET https://api.livestorm.co/v1/sessions/{session_id}/recordings

Headers:
  Authorization: {API_TOKEN}
  Accept: application/vnd.api+json
```

### Listar todas as people

```bash
GET https://api.livestorm.co/v1/people?page[number]=1&page[size]=25

Headers:
  Authorization: {API_TOKEN}
  Accept: application/vnd.api+json
```

### Criar um webhook

```bash
POST https://api.livestorm.co/v1/webhooks

Headers:
  Authorization: {API_TOKEN}
  Content-Type: application/vnd.api+json

{
  "data": {
    "type": "webhooks",
    "attributes": {
      "target_url": "https://example.com/webhook",
      "event_name": "attendance"
    }
  }
}
```

## Padrão da API

O Livestorm segue a especificação JSON:API:
- Todas as respostas usam a estrutura `data`, `attributes`, `relationships`
- Paginação: parâmetros de query `page[number]` e `page[size]`
- Filtros: parâmetros de query `filter[field]=value`
- Events contêm múltiplas Sessions; Sessions contêm People
- Timestamps ISO 8601 em toda a API

## Métricas principais

### Métricas de event
- `title` - Título do event
- `slug` - Identificador amigável para URL
- `estimated_duration` - Duração em minutos
- `registration_page_enabled` - Status da página de inscrição
- `everyone_can_speak` - Se todos os participantes podem falar

### Métricas de session
- `status` - Status da session (upcoming, live, past)
- `estimated_started_at` - Horário de início programado
- `started_at` - Horário real de início
- `ended_at` - Horário real de término
- `timezone` - Fuso horário da session
- `attendees_count` - Número de participantes
- `registrants_count` - Número de inscritos

### Métricas de people
- `email` - Email de contato
- `first_name` / `last_name` - Nome do contato
- `registrant_detail` - Metadados de inscrição
- `attendance_rate` - Percentual de presença
- `attended_at` - Timestamp de entrada
- `left_at` - Timestamp de saída

## Parâmetros

### Paginação
- `page[number]` - Número da página (padrão: 1)
- `page[size]` - Itens por página (padrão: 25)

### Atributos de event
- `title` - Título do event (obrigatório para criação)
- `slug` - URL slug
- `description` - Descrição do event
- `estimated_duration` - Duração em minutos

### Atributos de session
- `estimated_started_at` - Horário de início ISO 8601
- `timezone` - String de timezone IANA

### Campos de inscrição
- `email` - Email do inscrito (obrigatório)
- `first_name` - Nome
- `last_name` - Sobrenome

### Eventos de webhook
- `attendance` - Disparado na presença da session
- `registration` - Disparado em nova inscrição
- `unregistration` - Disparado no cancelamento da inscrição

## Quando usar

- Realizar product demos e webinars de marketing
- Automatizar inscrição em webinars e gestão de participantes
- Acompanhar engajamento e taxas de presença em webinars
- Buscar gravações de session para reaproveitamento de conteúdo
- Construir páginas de inscrição customizadas com registro via API
- Sincronizar dados de webinars com CRM e automação de marketing
- Monitorar Q&A e chat da session para follow-up

## Limites de taxa

- **10.000 chamadas de API por período de 30 dias** (nível da organização)
- Limites de taxa compartilhados entre todos os API tokens da organização
- Planeje adequadamente para operações de alto volume
- Use webhooks em vez de polling para economizar cota

## Habilidades relevantes

- webinar-marketing
- event-marketing
- lead-generation
- content-strategy
- lifecycle-marketing
- customer-engagement
