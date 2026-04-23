# Mailchimp

Plataforma de email marketing para campanhas, automação e gestão de público.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Marketing API para campaigns, audiences e automação |
| MCP | ✓ | Disponível via Mailchimp MCP server |
| CLI | - | Não disponível |
| SDK | ✓ | SDKs oficiais para múltiplas linguagens |

## Autenticação

- **Tipo**: API Key ou OAuth 2.0
- **Header**: `Authorization: Bearer {api_key}` ou `Authorization: apikey {api_key}`
- **Base URL**: `https://{dc}.api.mailchimp.com/3.0/` (dc = datacenter da API key)

## Operações comuns de agent

### Listar audiences (lists)

```bash
GET https://{dc}.api.mailchimp.com/3.0/lists
```

### Buscar membros da audiência

```bash
GET https://{dc}.api.mailchimp.com/3.0/lists/{list_id}/members?count=100
```

### Adicionar subscriber

```bash
POST https://{dc}.api.mailchimp.com/3.0/lists/{list_id}/members

{
  "email_address": "user@example.com",
  "status": "subscribed",
  "merge_fields": {
    "FNAME": "John",
    "LNAME": "Doe"
  }
}
```

### Atualizar subscriber

```bash
PATCH https://{dc}.api.mailchimp.com/3.0/lists/{list_id}/members/{subscriber_hash}

{
  "merge_fields": {
    "FNAME": "Jane"
  },
  "tags": ["customer", "premium"]
}
```

### Buscar campaigns

```bash
GET https://{dc}.api.mailchimp.com/3.0/campaigns?count=20
```

### Buscar relatório de campanha

```bash
GET https://{dc}.api.mailchimp.com/3.0/reports/{campaign_id}
```

### Criar campanha

```bash
POST https://{dc}.api.mailchimp.com/3.0/campaigns

{
  "type": "regular",
  "recipients": {
    "list_id": "{list_id}"
  },
  "settings": {
    "subject_line": "Your Subject",
    "from_name": "Your Name",
    "reply_to": "reply@example.com"
  }
}
```

### Enviar campanha

```bash
POST https://{dc}.api.mailchimp.com/3.0/campaigns/{campaign_id}/actions/send
```

### Listar automations

```bash
GET https://{dc}.api.mailchimp.com/3.0/automations
```

## Métricas principais

### Campos de relatório de campanha
- `emails_sent` - Total enviado
- `opens` - Total de aberturas
- `unique_opens` - Aberturas únicas
- `open_rate` - Taxa de abertura
- `clicks` - Total de cliques
- `click_rate` - Taxa de cliques
- `unsubscribes` - Total de cancelamentos de inscrição
- `bounces` - Total de bounces

### Hash do subscriber

Calcule o hash do subscriber para atualizações:
```javascript
const hash = md5(email.toLowerCase());
```

## Status de subscriber

- `subscribed` - Subscriber ativo
- `unsubscribed` - Descadastrado
- `cleaned` - Hard bounce
- `pending` - Aguardando confirmação
- `transactional` - Apenas transacional

## Quando usar

- Gerenciar listas de email e assinantes
- Criar e enviar campanhas de email
- Configurar automação de email
- Analisar performance de campanhas
- Segmentar audiências
- Fazer A/B testing de emails

## Limites de taxa

- 10 conexões simultâneas
- 10 requisições por segundo
- Endpoints em lote para operações em massa

## Habilidades relevantes

- email-sequence
- analytics-tracking
- referral-program
