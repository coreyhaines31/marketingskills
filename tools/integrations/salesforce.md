# Salesforce

Plataforma enterprise de CRM para vendas, atendimento e marketing.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API, SOAP API, Bulk API |
| MCP | - | Not available |
| CLI | ✓ | Salesforce CLI (`sf`) |
| SDK | ✓ | JSforce, simple-salesforce, etc. |

## Autenticação

- **Type**: OAuth 2.0 (Web Server Flow or JWT Bearer)
- **Header**: `Authorization: Bearer {access_token}`
- **Instance URL**: Use o instance_url da resposta de autenticação

## Operações comuns do agente

### Consultar registros (SOQL)

```bash
GET https://{instance}.salesforce.com/services/data/v59.0/query?q=SELECT+Id,Name,Email+FROM+Contact+LIMIT+10

Authorization: Bearer {access_token}
```

### Obter registro por ID

```bash
GET https://{instance}.salesforce.com/services/data/v59.0/sobjects/Contact/{record_id}

Authorization: Bearer {access_token}
```

### Criar registro

```bash
POST https://{instance}.salesforce.com/services/data/v59.0/sobjects/Contact

{
  "FirstName": "John",
  "LastName": "Doe",
  "Email": "john@example.com",
  "AccountId": "{account_id}"
}
```

### Atualizar registro

```bash
PATCH https://{instance}.salesforce.com/services/data/v59.0/sobjects/Contact/{record_id}

{
  "Title": "Senior Developer"
}
```

### Buscar registros (SOSL)

```bash
GET https://{instance}.salesforce.com/services/data/v59.0/search?q=FIND+{searchTerm}+IN+ALL+FIELDS+RETURNING+Contact(Id,Name,Email)

Authorization: Bearer {access_token}
```

### Obter oportunidades

```bash
GET https://{instance}.salesforce.com/services/data/v59.0/query?q=SELECT+Id,Name,Amount,StageName,CloseDate+FROM+Opportunity+WHERE+IsClosed=false

Authorization: Bearer {access_token}
```

### Descrever objeto

```bash
GET https://{instance}.salesforce.com/services/data/v59.0/sobjects/Contact/describe

Authorization: Bearer {access_token}
```

## Comandos de CLI

```bash
# Authenticate
sf org login web

# Query records
sf data query --query "SELECT Id, Name FROM Account LIMIT 10"

# Create record
sf data create record --sobject Account --values "Name='New Account'"

# Deploy metadata
sf project deploy start

# Run Apex
sf apex run --file script.apex
```

## Exemplos de SOQL

```sql
-- Get contacts with accounts
SELECT Id, Name, Email, Account.Name
FROM Contact
WHERE Account.Industry = 'Technology'

-- Get opportunities by stage
SELECT StageName, COUNT(Id)
FROM Opportunity
GROUP BY StageName

-- Get recent leads
SELECT Id, Name, Company, Status
FROM Lead
WHERE CreatedDate = LAST_N_DAYS:30
ORDER BY CreatedDate DESC
```

## Objetos principais

- **Lead** - Cliente potencial
- **Contact** - Pessoa da account
- **Account** - Empresa/organização
- **Opportunity** - Deal de vendas
- **Case** - Ticket de suporte
- **Campaign** - Campanha de marketing

## Quando usar

- Operações enterprise de CRM
- Processos de venda complexos
- Relacionamentos entre múltiplos objetos
- Gerenciamento de objetos custom
- Rastreamento de campanhas de marketing

## Limites de taxa

- 15,000 API calls per 24 hours (Enterprise)
- Limites maiores disponíveis

## Skills relevantes

- email-sequence
- analytics-tracking
- paid-ads
