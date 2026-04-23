# Close

CRM de vendas para SMBs com chamadas, email e gerenciamento de pipeline integrados, projetado para equipes de vendas de alta velocidade.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | Leads, Contacts, Opportunities, Activities, Tasks |
| MCP | - | Não disponível |
| CLI | ✓ | [close.js](../clis/close.js) |
| SDK | - | Apenas REST API |

## Autenticação

- **Tipo**: Basic Auth
- **Cabeçalho**: `Authorization: Basic {base64(api_key + ':')}`
- **Obter chave**: Settings > API Keys at https://app.close.com

## Operações Comuns do Agente

### Listar Leads

```bash
GET https://api.close.com/api/v1/lead/

Authorization: Basic {base64(api_key + ':')}
```

### Buscar Leads

```bash
GET https://api.close.com/api/v1/lead/?query=company_name

Authorization: Basic {base64(api_key + ':')}
```

### Criar Lead

```bash
POST https://api.close.com/api/v1/lead/

{
  "name": "Acme Corp",
  "url": "https://acme.com",
  "description": "Enterprise prospect"
}
```

### Obter Contact

```bash
GET https://api.close.com/api/v1/contact/{contact_id}/

Authorization: Basic {base64(api_key + ':')}
```

### Criar Contact

```bash
POST https://api.close.com/api/v1/contact/

{
  "lead_id": "lead_xxx",
  "name": "Jane Smith",
  "emails": [{ "email": "jane@acme.com", "type": "office" }],
  "phones": [{ "phone": "+15551234567", "type": "office" }]
}
```

### Criar Opportunity

```bash
POST https://api.close.com/api/v1/opportunity/

{
  "lead_id": "lead_xxx",
  "value": 50000,
  "status_type": "active"
}
```

### Listar Activities

```bash
GET https://api.close.com/api/v1/activity/?lead_id=lead_xxx

Authorization: Basic {base64(api_key + ':')}
```

### Criar Task

```bash
POST https://api.close.com/api/v1/task/

{
  "lead_id": "lead_xxx",
  "text": "Follow up on demo request",
  "_type": "lead",
  "date": "2026-03-10"
}
```

## Métricas Principais

### Dados de Lead
- `id` - Lead ID
- `display_name` - Lead name
- `url` - Website URL
- `description` - Lead description
- `status_id` - Pipeline status
- `contacts` - Associated contacts
- `opportunities` - Associated opportunities
- `tasks` - Associated tasks

### Dados de Contato
- `id` - Contact ID
- `lead_id` - Parent lead
- `name` - Full name
- `title` - Job title
- `emails` - Email addresses array
- `phones` - Phone numbers array

### Dados de Oportunidade
- `id` - Opportunity ID
- `lead_id` - Parent lead
- `value` - Value in cents
- `status_type` - active, won, or lost
- `confidence` - Win probability (0-100)
- `date_won` - Close date

### Dados de Tarefa
- `id` - Task ID
- `lead_id` - Parent lead
- `text` - Task description
- `assigned_to` - Assigned user ID
- `date` - Due date
- `is_complete` - Completion status

## Parâmetros

### Leads
- `query` - String de query de busca
- `_skip` - Número de resultados para pular (paginação)
- `_limit` - Máximo de resultados para retornar (padrão: 100)
- `_fields` - Campos separados por vírgula para retornar

### Contatos
- `lead_id` - Filtrar por lead pai
- `_skip` - Pagination offset
- `_limit` - Max results

### Oportunidades
- `lead_id` - Filtrar por lead pai
- `status` - Filtrar por tipo de status (active, won, lost)
- `_skip` - Pagination offset
- `_limit` - Max results

### Atividades
- `lead_id` - Filtrar por lead
- `_type__type` - Filtrar por tipo (Email, Call, Note, SMS, Meeting)
- `date_created__gt` - Após a data
- `date_created__lt` - Antes da data

### Tarefas
- `assigned_to` - Filtrar por ID de usuário
- `is_complete` - Filtrar por conclusão (true/false)
- `lead_id` - Filtrar por lead
- `_type` - Task type (lead)

## Quando Usar

- Gerenciamento de pipelines de vendas SMB com outreach de alto contato
- Rastreamento de atividades de vendas (calls, emails, meetings) por lead
- Criação e gerenciamento de tarefas para follow-ups de vendas
- Rastreamento de oportunidades e previsão de receita
- Criação de workflows automatizados de outreach
- Sales team performance reporting

## Limites de Taxa

- Limites de taxa baseados no plano da organização
- Padrão: ~100 requisições/minuto
- As respostas incluem os headers `ratelimit-limit` e `ratelimit-remaining`
- Respostas 429 incluem o header `Retry-After`

## Skills Relevantes

- revops
- sales-enablement
- cold-email
