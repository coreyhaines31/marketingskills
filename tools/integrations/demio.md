# Demio

Plataforma de webinar para hospedar webinars ao vivo, automatizados e on-demand com registro e rastreamento de participantes integrados.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | Events, Registration, Participants, Sessions |
| MCP | - | Não disponível |
| CLI | ✓ | [demio.js](../clis/demio.js) |
| SDK | ✓ | PHP (official), Ruby (community) |

## Autenticação

- **Tipo**: API Key + API Secret
- **Headers**: `Api-Key: {key}` e `Api-Secret: {secret}`
- **Obter credenciais**: Account Settings > API (acesso de Owner obrigatório)
- **Docs**: https://publicdemioapi.docs.apiary.io/

## Operações Comuns do Agente

### Ping (verificação de saúde)

```bash
GET https://my.demio.com/api/v1/ping

Headers:
  Api-Key: {API_KEY}
  Api-Secret: {API_SECRET}
```

### Listar todos os eventos

```bash
GET https://my.demio.com/api/v1/events

Headers:
  Api-Key: {API_KEY}
  Api-Secret: {API_SECRET}
```

### Listar eventos por tipo

```bash
GET https://my.demio.com/api/v1/events?type=upcoming

Headers:
  Api-Key: {API_KEY}
  Api-Secret: {API_SECRET}
```

### Obter um evento específico

```bash
GET https://my.demio.com/api/v1/event/{event_id}

Headers:
  Api-Key: {API_KEY}
  Api-Secret: {API_SECRET}
```

### Obter detalhes da data do evento

```bash
GET https://my.demio.com/api/v1/event/{event_id}/date/{date_id}

Headers:
  Api-Key: {API_KEY}
  Api-Secret: {API_SECRET}
```

### Registrar participante para evento

```bash
POST https://my.demio.com/api/v1/event/register

Headers:
  Api-Key: {API_KEY}
  Api-Secret: {API_SECRET}
  Content-Type: application/json

{
  "id": 12345,
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

### Registrar participante para data específica

```bash
POST https://my.demio.com/api/v1/event/register

Headers:
  Api-Key: {API_KEY}
  Api-Secret: {API_SECRET}
  Content-Type: application/json

{
  "id": 12345,
  "date_id": 67890,
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

### Obter participantes para data do evento

```bash
GET https://my.demio.com/api/v1/date/{date_id}/participants

Headers:
  Api-Key: {API_KEY}
  Api-Secret: {API_SECRET}
```

## Padrão da API

Demio uses a straightforward REST API:
- Todas as requisições exigem ambos headers `Api-Key` e `Api-Secret`
- As respostas são objetos JSON
- O registro retorna uma URL `join_link` para o participante
- Eventos têm múltiplas "dates" (sessions), cada uma com `date_id` único

## Métricas Principais

### Métricas de Evento
- `id` - Event ID
- `name` - Event name
- `date_id` - Session/date identifier
- `status` - Event status (upcoming, past, active)
- `type` - Event type (live, automated, on-demand)
- `registration_url` - Public registration page URL

### Métricas de Participante
- `name` - Participant name
- `email` - Participant email
- `status` - Attendance status (registered, attended, missed)
- `attended_minutes` - Duration of attendance
- `join_link` - URL de entrada única para o participante

## Parâmetros

### Filtros de Lista de Eventos
- `type` - Filtrar por tipo de evento: `upcoming`, `past`, `all`

### Campos de Registro
- `id` - ID do evento (obrigatório)
- `name` - Nome do inscrito (obrigatório)
- `email` - Email do inscrito (obrigatório)
- `date_id` - Specific session date ID (optional)
- `ref_url` - URL de indicação para rastreamento (opcional)

### Campos Customizados
- Campos customizados são suportados via UID (não display name)
- Verifique as configurações do evento para UIDs de campos customizados disponíveis

## Quando Usar

- Automação de registro em webinar a partir de landing pages ou formulários
- Sincronização de dados de participantes de webinar com CRM
- Criação de fluxos customizados de registro para webinars
- Rastreamento de presença e engajamento em webinars
- Disparo de sequências de follow-up com base no status de presença
- Managing multiple webinar sessions programmatically

## Limites de Taxa

- **180 requisições por minuto** (3 por segundo)
- **Free Trial**: 100 chamadas de API por dia
- **Paid Plans**: 5.000 chamadas de API por dia (reset às 00:00 UTC)
- Entre em contato com a Demio para solicitar limites diários maiores
- Exceder os limites retorna uma resposta de erro

## Skills Relevantes

- webinar-marketing
- lead-generation
- event-marketing
- content-strategy
- lifecycle-marketing
