# Adobe Analytics

Plataforma de analytics empresarial para mensuração e atribuição cross-channel.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | Reporting API 2.0, Data Insertion API |
| MCP | - | Não disponível |
| CLI | - | Não disponível |
| SDK | ✓ | AppMeasurement.js, Mobile SDKs, Launch |

## Autenticação

- **Tipo**: OAuth 2.0 (Service Account JWT)
- **Configuração**: Crie a integração no Adobe Developer Console
- **Cabeçalho**: `Authorization: Bearer {access_token}`

## Operações Comuns do Agente

### Obter report suite info

```bash
GET https://analytics.adobe.io/api/{company_id}/reportsuites

Authorization: Bearer {access_token}
x-api-key: {client_id}
```

### Obter dimensions

```bash
GET https://analytics.adobe.io/api/{company_id}/dimensions?rsid={report_suite_id}

Authorization: Bearer {access_token}
x-api-key: {client_id}
```

### Obter metrics

```bash
GET https://analytics.adobe.io/api/{company_id}/metrics?rsid={report_suite_id}

Authorization: Bearer {access_token}
x-api-key: {client_id}
```

### Executar report

```bash
POST https://analytics.adobe.io/api/{company_id}/reports

{
  "rsid": "{report_suite_id}",
  "globalFilters": [{
    "type": "dateRange",
    "dateRange": "2024-01-01T00:00:00/2024-01-31T23:59:59"
  }],
  "metricContainer": {
    "metrics": [
      {"id": "metrics/visits"},
      {"id": "metrics/pageviews"},
      {"id": "metrics/orders"}
    ]
  },
  "dimension": "variables/evar1"
}
```

### Obter segments

```bash
GET https://analytics.adobe.io/api/{company_id}/segments?rsid={report_suite_id}

Authorization: Bearer {access_token}
x-api-key: {client_id}
```

### Data Insertion (lado do servidor)

```bash
POST https://{tracking_server}/b/ss/{report_suite_id}/0

<?xml version="1.0" encoding="UTF-8"?>
<request>
  <visitorID>user_123</visitorID>
  <events>event1</events>
  <eVar1>campaign_name</eVar1>
  <prop1>page_type</prop1>
</request>
```

## AppMeasurement.js

```javascript
// Initialize
var s = s_gi('report_suite_id');
s.trackingServer = 'metrics.example.com';

// Set variables
s.pageName = 'Home Page';
s.channel = 'Marketing';
s.eVar1 = 'campaign_name';
s.events = 'event1';

// Track page view
s.t();

// Track link
s.tl(this, 'o', 'Button Click');
```

## Conceitos Principais

- **Report Suite** - Contêiner de dados
- **eVars** - Conversion variables (persistent)
- **props** - Traffic variables (hit-level)
- **Events** - Success metrics
- **Segments** - Filtros de usuário/visita
- **Calculated Metrics** - Derived metrics

## Common Dimensions

- `variables/page` - Page name
- `variables/evar1` - Custom conversion variable
- `variables/prop1` - Custom traffic variable
- `variables/marketingchannel` - Marketing channel
- `variables/referringdomain` - Referring domain

## Common Metrics

- `metrics/visits` - Visits
- `metrics/pageviews` - Page views
- `metrics/uniquevisitors` - Unique visitors
- `metrics/orders` - Orders
- `metrics/revenue` - Revenue

## Quando Usar

- Enterprise-scale analytics
- Cross-channel attribution
- Integração com Adobe Experience Cloud
- Advanced segmentation
- Exportações para data warehouse

## Limites de Taxa

- 12 requisições/segundo por empresa
- 120 requisições/minuto

## Skills Relevantes

- analytics-tracking
- ab-test-setup
- paid-ads
