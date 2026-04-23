# Klaviyo

Plataforma de marketing por email e SMS para e-commerce com profiles, flows, campaigns, segments e event tracking.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | REST API com especificação JSON:API, versionada por revision |
| MCP | - | Não disponível |
| CLI | ✓ | [klaviyo.js](../clis/klaviyo.js) |
| SDK | ✓ | Python, Node.js, Ruby, PHP, Java, C# |

## Autenticação

- **Tipo**: Private API Key
- **Header**: `Authorization: Klaviyo-API-Key {private_api_key}`
- **Revision Header**: `revision: 2024-10-15` (obrigatório em todas as requisições)
- **Obter chave**: Account Settings > API Keys em https://www.klaviyo.com/settings/account/api-keys
- **Note**: Chaves privadas têm prefixo `pk_`; chaves públicas (site ID de 6 caracteres) são apenas para client-side

## Operações comuns de agent

### Listar profiles

```bash
GET https://a.klaviyo.com/api/profiles/?page[size]=20

# Filter by email
GET https://a.klaviyo.com/api/profiles/?filter=equals(email,"user@example.com")
```

### Criar profile

```bash
POST https://a.klaviyo.com/api/profiles/

{
  "data": {
    "type": "profile",
    "attributes": {
      "email": "user@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "phone_number": "+15551234567"
    }
  }
}
```

### Atualizar profile

```bash
PATCH https://a.klaviyo.com/api/profiles/{profileId}/

{
  "data": {
    "type": "profile",
    "id": "{profileId}",
    "attributes": {
      "first_name": "Updated Name"
    }
  }
}
```

### Listar todas as lists

```bash
GET https://a.klaviyo.com/api/lists/
```

### Criar lista

```bash
POST https://a.klaviyo.com/api/lists/

{
  "data": {
    "type": "list",
    "attributes": {
      "name": "Newsletter Subscribers"
    }
  }
}
```

### Adicionar perfis à lista

```bash
POST https://a.klaviyo.com/api/lists/{listId}/relationships/profiles/

{
  "data": [
    { "type": "profile", "id": "{profileId1}" },
    { "type": "profile", "id": "{profileId2}" }
  ]
}
```

### Rastrear evento

```bash
POST https://a.klaviyo.com/api/events/

{
  "data": {
    "type": "event",
    "attributes": {
      "metric": {
        "data": {
          "type": "metric",
          "attributes": { "name": "Placed Order" }
        }
      },
      "profile": {
        "data": {
          "type": "profile",
          "attributes": { "email": "user@example.com" }
        }
      },
      "properties": {
        "value": 99.99,
        "items": ["Product A"]
      },
      "time": "2025-01-15T10:00:00Z"
    }
  }
}
```

### Listar campaigns

```bash
GET https://a.klaviyo.com/api/campaigns/?filter=equals(messages.channel,"email")
```

### Listar flows

```bash
GET https://a.klaviyo.com/api/flows/
```

### Atualizar status do flow

```bash
PATCH https://a.klaviyo.com/api/flows/{flowId}/

{
  "data": {
    "type": "flow",
    "id": "{flowId}",
    "attributes": {
      "status": "live"
    }
  }
}
```

### Listar métricas

```bash
GET https://a.klaviyo.com/api/metrics/
```

### Listar segments

```bash
GET https://a.klaviyo.com/api/segments/
```

## Padrão da API

A Klaviyo usa a especificação JSON:API. Todos os corpos de request/response usam o formato `{ "data": { "type": "...", "attributes": {...} } }`. Relationships são gerenciados via sub-endpoints `/relationships/`. O header `revision` é obrigatório em todas as requisições e determina a versão de comportamento da API.

## Métricas principais

### Campos de profile
- `email` - Endereço de email
- `phone_number` - Telefone para SMS
- `first_name`, `last_name` - Campos de nome
- `properties` - Objeto de propriedades customizadas
- `subscriptions` - Status de inscrição de Email/SMS

### Campos de evento
- `metric` - Nome da métrica/evento
- `properties` - Propriedades customizadas do evento
- `time` - Timestamp do evento
- `value` - Valor monetário (para revenue tracking)

### Métricas de Campaign/Flow
- `send_count` - Número de envios
- `open_rate` - Percentual de abertura
- `click_rate` - Percentual de clique
- `revenue` - Receita atribuída

## Parâmetros

### Parâmetros de query comuns
- `page[size]` - Resultados por página (padrão 20, máx 100)
- `page[cursor]` - Cursor para paginação
- `filter` - Expressões de filtro (ex.: `equals(email,"user@example.com")`)
- `sort` - Campo de ordenação (prefixo `-` para descendente)
- `include` - Incluir recursos relacionados
- `fields[resource]` - Conjuntos de campos esparsos

## Quando usar

- Automação de email/SMS marketing para e-commerce
- Sincronizar profiles de clientes de sistemas externos
- Rastrear eventos de compra e comportamento de clientes
- Gerenciar flows de email e drip campaigns
- Segmentar audiências para campanhas direcionadas
- Gerar relatórios de performance de campaign e flow

## Limites de taxa

- Steady-state: 75 requisições/segundo para a maioria dos endpoints
- Burst: até 700 requisições em 1 minuto
- Limite de taxa headers: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`
- Limites menores em alguns endpoints de escrita (profiles, events)

## Habilidades relevantes

- email-sequence
- ecommerce-email
- lifecycle-marketing
- customer-segmentation
