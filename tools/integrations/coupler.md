# Coupler.io

Plataforma de integração de dados que conecta fontes de dados de marketing, vendas, analytics e e-commerce a destinos como planilhas, ferramentas de BI e data warehouses com agendamento automatizado.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | Importers, Runs, Sources, Destinations |
| MCP | ✓ | [Claude connector](https://claude.com/connectors/coupler-io) |
| CLI | ✓ | [coupler.js](../clis/coupler.js) |
| SDK | - | Apenas REST API |

## Autenticação

- **Tipo**: API Key
- **Cabeçalho**: `Authorization: Bearer {api_key}`
- **Obter chave**: Settings > API at https://app.coupler.io

## Operações Comuns do Agente

### Listar Importers

```bash
GET https://api.coupler.io/v1/importers
```

### Obter Importer Details

```bash
GET https://api.coupler.io/v1/importers/{id}
```

### Disparar an Importer Run

```bash
POST https://api.coupler.io/v1/importers/{id}/run
```

### Criar an Importer

```bash
POST https://api.coupler.io/v1/importers

{
  "source_type": "google_analytics",
  "destination_type": "google_sheets",
  "name": "GA4 to Sheets Daily"
}
```

### Excluir an Importer

```bash
DELETE https://api.coupler.io/v1/importers/{id}
```

### Listar Runs de um Importer

```bash
GET https://api.coupler.io/v1/importers/{id}/runs
```

### Obter Run Details

```bash
GET https://api.coupler.io/v1/runs/{id}
```

### Listar Fontes Disponíveis

```bash
GET https://api.coupler.io/v1/sources
```

### Listar Destinos Disponíveis

```bash
GET https://api.coupler.io/v1/destinations
```

## Métricas Principais

### Dados de Importer
- `id` - Importer ID
- `name` - Importer name
- `source_type` - Source connector type
- `destination_type` - Destination connector type
- `schedule` - Automation schedule
- `status` - Current status
- `last_run_at` - Last run timestamp

### Dados de Run
- `id` - Run ID
- `importer_id` - Parent importer
- `status` - Run status (pending, running, completed, failed)
- `started_at` - Start timestamp
- `finished_at` - Finish timestamp
- `rows_imported` - Number of rows processed
- `error` - Error message if failed

## Parâmetros

### Importer Creation
- `source_type` - Source connector (e.g., google_analytics, google_ads, facebook_ads, hubspot, shopify, stripe, airtable)
- `destination_type` - Destination connector (e.g., google_sheets, bigquery, snowflake, postgresql)
- `name` - Importer name
- `schedule` - Automation schedule (e.g., hourly, daily, weekly)

### Fontes Suportadas
- **Analytics**: Google Analytics, Adobe Analytics
- **Ads**: Google Ads, Facebook Ads, LinkedIn Ads, TikTok Ads
- **CRM**: HubSpot, Salesforce, Pipedrive
- **E-commerce**: Shopify, Stripe, WooCommerce
- **Other**: Airtable, Google Sheets, BigQuery, MySQL, PostgreSQL

### Destinos Suportados
- **Spreadsheets**: Google Sheets, Excel Online
- **BI Tools**: Looker Studio, Power BI, Tableau
- **Data Warehouses**: BigQuery, Snowflake, Redshift
- **Databases**: PostgreSQL, MySQL

## Quando Usar

- Automação de pipelines de dados de marketing a partir de plataformas de ads e analytics
- Consolidação de dados de campanhas multicanal em um único destino
- Agendamento de sincronizações recorrentes de dados do CRM para planilhas ou ferramentas de BI
- Criação de dashboards de marketing com dados atualizados de múltiplas fontes
- Exportação de dados de e-commerce para relatórios e análise
- Conexão de fontes de dados sem escrever código ETL customizado

## Limites de Taxa

- Os limites de taxa variam por plano
- Padrão: Acesso à API disponível nos planos Professional e superiores
- Importer run frequency depends on plan tier

## Skills Relevantes

- analytics-tracking
- paid-ads
- revops
