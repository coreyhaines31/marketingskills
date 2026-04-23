# Postmark

Serviço de entrega de email transacional com envio rápido, templates, gestão de bounces e analytics detalhado.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for email sending, templates, bounces, stats |
| MCP | - | Not available |
| CLI | ✓ | [postmark.js](../clis/postmark.js) |
| SDK | ✓ | Node.js, Ruby, Python, PHP, Java, .NET, Go |

## Autenticação

- **Type**: Server Token (ou Account Token para ops em nível de conta)
- **Header**: `X-Postmark-Server-Token: {server_token}` (server-level)
- **Header**: `X-Postmark-Account-Token: {account_token}` (account-level)
- **Get key**: API Tokens tab at https://account.postmarkapp.com/servers
- **Note**: Server tokens são por servidor; account tokens se aplicam a todos os servidores

## Operações comuns do agente

### Enviar email único

```bash
POST https://api.postmarkapp.com/email

{
  "From": "sender@example.com",
  "To": "recipient@example.com",
  "Subject": "Welcome!",
  "HtmlBody": "<html><body><p>Hello!</p></body></html>",
  "TextBody": "Hello!",
  "MessageStream": "outbound",
  "TrackOpens": true,
  "TrackLinks": "HtmlAndText"
}
```

### Enviar com template

```bash
POST https://api.postmarkapp.com/email/withTemplate

{
  "From": "sender@example.com",
  "To": "recipient@example.com",
  "TemplateId": 12345,
  "TemplateModel": {
    "name": "Jane",
    "action_url": "https://example.com/verify"
  },
  "MessageStream": "outbound"
}
```

### Enviar emails em batch

```bash
POST https://api.postmarkapp.com/email/batch

[
  {
    "From": "sender@example.com",
    "To": "user1@example.com",
    "Subject": "Notification",
    "TextBody": "Hello user 1"
  },
  {
    "From": "sender@example.com",
    "To": "user2@example.com",
    "Subject": "Notification",
    "TextBody": "Hello user 2"
  }
]
```

### Listar templates

```bash
GET https://api.postmarkapp.com/templates?Count=100&Offset=0
```

### Obter template

```bash
GET https://api.postmarkapp.com/templates/{templateIdOrAlias}
```

### Criar template

```bash
POST https://api.postmarkapp.com/templates

{
  "Name": "Welcome Email",
  "Alias": "welcome",
  "Subject": "Welcome {{name}}!",
  "HtmlBody": "<html><body><p>Hello {{name}}</p></body></html>",
  "TextBody": "Hello {{name}}"
}
```

### Obter stats de entrega

```bash
GET https://api.postmarkapp.com/deliverystats
```

### Listar bounces

```bash
GET https://api.postmarkapp.com/bounces?count=50&offset=0&type=HardBounce
```

### Ativar bounce (reativar recipient)

```bash
PUT https://api.postmarkapp.com/bounces/{bounceId}/activate
```

### Buscar mensagens outbound

```bash
GET https://api.postmarkapp.com/messages/outbound?count=50&offset=0&recipient=user@example.com
```

### Obter visão geral de stats outbound

```bash
GET https://api.postmarkapp.com/stats/outbound?fromdate=2025-01-01&todate=2025-01-31
```

### Obter stats de abertura

```bash
GET https://api.postmarkapp.com/stats/outbound/opens?fromdate=2025-01-01&todate=2025-01-31
```

### Obter stats de clique

```bash
GET https://api.postmarkapp.com/stats/outbound/clicks?fromdate=2025-01-01&todate=2025-01-31
```

### Obter informações do servidor

```bash
GET https://api.postmarkapp.com/server
```

### Listar suppressions

```bash
GET https://api.postmarkapp.com/message-streams/outbound/suppressions/dump
```

### Criar suppression

```bash
POST https://api.postmarkapp.com/message-streams/outbound/suppressions

{
  "Suppressions": [
    { "EmailAddress": "user@example.com" }
  ]
}
```

## Padrão de API

A Postmark usa endpoints REST simples com nomes de campos em PascalCase nos request/response bodies. A autenticação é via headers custom em vez de Authorization. A paginação usa os parâmetros `Count` e `Offset`. O envio de email é síncrono, com confirmação imediata de entrega.

## Métricas principais

### Métricas de entrega
- `Sent` - Total de emails enviados
- `Bounced` - Quantidade de bounce por tipo (hard, soft, transient)
- `SpamComplaints` - Quantidade de reclamações de spam
- `Opens` - Quantidade de aberturas e aberturas únicas
- `Clicks` - Quantidade de cliques e cliques únicos

### Tipos de bounce
- `HardBounce` - Falha permanente de entrega
- `SoftBounce` - Falha temporária de entrega
- `Transient` - Problema temporário (retry)
- `SpamNotification` - Marcado como spam

### Campos de mensagem
- `MessageID` - Identificador único da mensagem
- `SubmittedAt` - Timestamp de envio
- `Status` - Status de entrega
- `Recipients` - Lista de recipients

## Parâmetros

### Parâmetros de email
- `From` - Endereço do remetente (deve estar verificado)
- `To` - Recipient (separado por vírgulas para múltiplos)
- `Subject` - Assunto do email
- `HtmlBody` / `TextBody` - Conteúdo do email
- `MessageStream` - outbound (transacional) ou broadcast
- `TrackOpens` - Habilita rastreamento de abertura (boolean)
- `TrackLinks` - None, HtmlAndText, HtmlOnly, TextOnly
- `Tag` - Tag custom para categorização

### Parâmetros de stats
- `fromdate` - Data inicial (YYYY-MM-DD)
- `todate` - Data final (YYYY-MM-DD)
- `tag` - Filtro por tag

## Quando usar

- Emails transacionais (password resets, confirmações de pedido, notifications)
- Envio de email por template com variáveis dinâmicas
- Monitorar deliverability de email e taxas de bounce
- Rastrear engajamento de email (aberturas, cliques)
- Gerenciar email suppressions e bounces
- Entrega de email altamente confiável e com performance rápida

## Limites de taxa

- 500 messages per batch request
- 10 MB max per single message (including attachments)
- 50 MB max per batch request
- Limites de taxa da API variam por plano

## Skills relevantes

- email-sequence
- transactional-email
- email-deliverability
- onboarding-email
