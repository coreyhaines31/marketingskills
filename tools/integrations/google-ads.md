# Google Ads

Plataforma de publicidade pay-per-click para campanhas de search, display e vídeo.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Google Ads API para gestão de campanhas |
| MCP | ✓ | Disponível via Google Ads MCP server |
| CLI | - | Use gcloud ou scripts de API |
| SDK | ✓ | Bibliotecas client para múltiplas linguagens |

## Autenticação

- **Tipo**: OAuth 2.0
- **Scopes**: `https://www.googleapis.com/auth/adwords`
- **Setup**: Crie credenciais no Google Cloud Console e vincule à conta do Google Ads
- **Headers**: `developer-token`, `login-customer-id` (para MCC)

## Operações comuns de agent

### Buscar informações da conta

```bash
POST https://googleads.googleapis.com/v14/customers/{customer_id}/googleAds:searchStream

{
  "query": "SELECT customer.id, customer.descriptive_name FROM customer"
}
```

### Listar campanhas

```bash
POST https://googleads.googleapis.com/v14/customers/{customer_id}/googleAds:searchStream

{
  "query": "SELECT campaign.id, campaign.name, campaign.status, campaign_budget.amount_micros FROM campaign ORDER BY campaign.id"
}
```

### Buscar performance da campanha

```bash
POST https://googleads.googleapis.com/v14/customers/{customer_id}/googleAds:searchStream

{
  "query": "SELECT campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM campaign WHERE segments.date DURING LAST_30_DAYS"
}
```

### Buscar performance do ad group

```bash
POST https://googleads.googleapis.com/v14/customers/{customer_id}/googleAds:searchStream

{
  "query": "SELECT ad_group.name, metrics.impressions, metrics.clicks, metrics.conversions FROM ad_group WHERE segments.date DURING LAST_7_DAYS"
}
```

### Buscar performance de keyword

```bash
POST https://googleads.googleapis.com/v14/customers/{customer_id}/googleAds:searchStream

{
  "query": "SELECT ad_group_criterion.keyword.text, metrics.impressions, metrics.clicks, metrics.average_cpc FROM keyword_view WHERE segments.date DURING LAST_30_DAYS ORDER BY metrics.clicks DESC LIMIT 50"
}
```

### Pausar campanha

```bash
POST https://googleads.googleapis.com/v14/customers/{customer_id}/campaigns:mutate

{
  "operations": [{
    "update": {
      "resourceName": "customers/{customer_id}/campaigns/{campaign_id}",
      "status": "PAUSED"
    },
    "updateMask": "status"
  }]
}
```

### Atualizar orçamento

```bash
POST https://googleads.googleapis.com/v14/customers/{customer_id}/campaignBudgets:mutate

{
  "operations": [{
    "update": {
      "resourceName": "customers/{customer_id}/campaignBudgets/{budget_id}",
      "amountMicros": "50000000"
    },
    "updateMask": "amountMicros"
  }]
}
```

## Métricas principais

| Métrica | Descrição |
|---------|-----------|
| `metrics.impressions` | Impressões de anúncios |
| `metrics.clicks` | Cliques |
| `metrics.cost_micros` | Custo em micros (dividir por 1M) |
| `metrics.conversions` | Conversões |
| `metrics.conversions_value` | Valor de conversão |
| `metrics.average_cpc` | Custo médio por clique |
| `metrics.ctr` | Taxa de cliques |
| `metrics.conversion_rate` | Taxa de conversão |

## Tipos de campanha

- `SEARCH` - Anúncios de texto na rede de pesquisa
- `DISPLAY` - Rede de display
- `SHOPPING` - Anúncios de produtos
- `VIDEO` - Anúncios em vídeo no YouTube
- `PERFORMANCE_MAX` - Otimização com AI entre canais
- `DEMAND_GEN` - Discovery/Demand Gen

## GAQL (Google Ads Query Language)

```sql
SELECT
  campaign.name,
  metrics.clicks,
  metrics.conversions
FROM campaign
WHERE
  campaign.status = 'ENABLED'
  AND segments.date DURING LAST_30_DAYS
ORDER BY metrics.conversions DESC
LIMIT 10
```

## Quando usar

- Gerenciar campanhas de anúncios de pesquisa
- Analisar performance de campanhas
- Ajustar orçamentos e lances
- Fazer pesquisa e gestão de keywords
- Analisar tracking de conversão

## Limites de taxa

- 15.000 operações por dia (básico)
- Limites maiores conforme nível do developer token

## Habilidades relevantes

- paid-ads
- analytics-tracking
- page-cro
