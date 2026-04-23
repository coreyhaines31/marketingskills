# Trustpilot

Plataforma de gestão de avaliações de negócios para coletar, gerenciar e exibir avaliações de clientes.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Business Units, Reviews, Invitations, Tags |
| MCP | - | Não disponível |
| CLI | ✓ | [trustpilot.js](../clis/trustpilot.js) |
| SDK | ✓ | Node.js (official), community wrappers |

## Autenticação

- **Tipo**: API Key (public endpoints) + OAuth 2.0 (private endpoints)
- **Public Header**: `apikey: {YOUR_API_KEY}`
- **Private Header**: `Authorization: Bearer {access_token}`
- **OAuth Grant**: Client Credentials (`Basic base64(API_KEY:API_SECRET)`)
- **Token Lifetime**: Access tokens expiram após 100 horas, refresh tokens após 30 dias
- **Obter credenciais**: https://businessapp.b2b.trustpilot.com/ > Integrations > API

## Operações Comuns do Agente

### Buscar uma business unit

```bash
GET https://api.trustpilot.com/v1/business-units/search?query=example.com&limit=10

Headers:
  apikey: {API_KEY}
```

### Obter detalhes da business unit

```bash
GET https://api.trustpilot.com/v1/business-units/{businessUnitId}

Headers:
  apikey: {API_KEY}
```

### Obter informações do perfil da empresa

```bash
GET https://api.trustpilot.com/v1/business-units/{businessUnitId}/profileinfo

Headers:
  apikey: {API_KEY}
```

### Listar avaliações públicas

```bash
GET https://api.trustpilot.com/v1/business-units/{businessUnitId}/reviews?perPage=20&orderBy=createdat.desc

Headers:
  apikey: {API_KEY}
```

### Listar avaliações privadas (com dados de clientes)

```bash
GET https://api.trustpilot.com/v1/private/business-units/{businessUnitId}/reviews?perPage=20

Headers:
  Authorization: Bearer {access_token}
```

### Responder a uma avaliação

```bash
POST https://api.trustpilot.com/v1/private/reviews/{reviewId}/reply

Headers:
  Authorization: Bearer {access_token}

{
  "message": "Thank you for your feedback!"
}
```

### Send email invitation

```bash
POST https://api.trustpilot.com/v1/private/business-units/{businessUnitId}/email-invitations

Headers:
  Authorization: Bearer {access_token}

{
  "consumerEmail": "customer@example.com",
  "consumerName": "Jane Doe",
  "referenceNumber": "order-123",
  "redirectUri": "https://example.com/thanks"
}
```

### Gerar link de convite para avaliação

```bash
POST https://api.trustpilot.com/v1/private/business-units/{businessUnitId}/invitation-links

Headers:
  Authorization: Bearer {access_token}

{
  "email": "customer@example.com",
  "name": "Jane Doe",
  "referenceId": "order-123",
  "redirectUri": "https://example.com/thanks"
}
```

### Listar templates de convite

```bash
GET https://api.trustpilot.com/v1/private/business-units/{businessUnitId}/templates

Headers:
  Authorization: Bearer {access_token}
```

### Adicionar tags a uma avaliação

```bash
PUT https://api.trustpilot.com/v1/private/reviews/{reviewId}/tags

Headers:
  Authorization: Bearer {access_token}

{
  "tags": [{ "group": "sentiment", "value": "positive" }]
}
```

## Métricas Principais

### Métricas da Unidade de Negócio
- `numberOfReviews` - Total de avaliações
- `trustScore` - Overall trust score (1-5)
- `stars` - Star rating displayed
- `status` - Claim status (claimed, unclaimed)

### Métricas de Avaliações
- `stars` - Avaliação em estrelas individual (1-5)
- `language` - Código de idioma da avaliação
- `createdAt` - Timestamp de criação da avaliação
- `isVerified` - Se a avaliação é verificada
- `status` - Status da avaliação (ativa, reportada, sinalizada)

## Parâmetros

### Filtros de Avaliações
- `stars` - Filtrar por avaliação em estrelas (1-5)
- `language` - Filtrar por código de idioma (ex.: `en`)
- `orderBy` - Sort order (`createdat.desc`, `createdat.asc`, `stars.desc`, `stars.asc`)
- `perPage` - Results per page (max 100)

### Parâmetros de Convite
- `consumerEmail` - Recipient email (required)
- `consumerName` - Recipient name (required)
- `referenceNumber` - Order or transaction reference
- `templateId` - Email template ID
- `redirectUri` - URL para redirecionar após envio da avaliação
- `senderEmail` - Custom sender email
- `replyTo` - Custom reply-to address

## Quando Usar

- Coletar e gerenciar avaliações de clientes em escala
- Automatizar fluxos de convite para avaliação pós-compra
- Monitorar reputação da marca e sentimento das avaliações
- Responder ao feedback de clientes de forma programática
- Exibir TrustScore e avaliações em páginas de marketing
- Taguear e categorizar avaliações para análise

## Limites de Taxa

- Recomendado: no máximo 833 chamadas a cada 5 minutos (10K/hora)
- Limitado ao exceder 1 requisição por segundo
- Rate limit headers returned in responses
- Usar webhooks em vez de polling quando possível

## Skills Relevantes

- reputation-management
- customer-feedback
- review-generation
- social-proof
- post-purchase-flow
