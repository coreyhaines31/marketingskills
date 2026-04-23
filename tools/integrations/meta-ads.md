# Meta Ads (Facebook/Instagram)

Plataforma de anúncios para Facebook, Instagram, Messenger e Audience Network.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Marketing API for campaigns, audiences, reporting |
| MCP | - | Not available |
| CLI | - | Not available |
| SDK | ✓ | Official SDKs for Python, PHP, Node.js |

## Autenticação

- **Type**: OAuth 2.0 Access Token
- **Header**: Access token como query parameter
- **Setup**: Crie app no Meta Business Suite e gere um System User token

## Operações comuns do agente

### Obter contas de anúncio

```bash
GET https://graph.facebook.com/v18.0/me/adaccounts?access_token={access_token}&fields=id,name,account_status
```

### Obter campanhas

```bash
GET https://graph.facebook.com/v18.0/act_{ad_account_id}/campaigns?access_token={access_token}&fields=id,name,status,objective,daily_budget
```

### Obter insights da campanha

```bash
GET https://graph.facebook.com/v18.0/{campaign_id}/insights?access_token={access_token}&fields=impressions,clicks,spend,actions,cost_per_action_type&date_preset=last_30d
```

### Obter conjuntos de anúncios

```bash
GET https://graph.facebook.com/v18.0/act_{ad_account_id}/adsets?access_token={access_token}&fields=id,name,status,targeting,daily_budget,bid_amount
```

### Obter anúncios

```bash
GET https://graph.facebook.com/v18.0/{ad_set_id}/ads?access_token={access_token}&fields=id,name,status,creative
```

### Criar campanha

```bash
POST https://graph.facebook.com/v18.0/act_{ad_account_id}/campaigns

access_token={access_token}
&name=Campaign Name
&objective=CONVERSIONS
&status=PAUSED
&special_ad_categories=[]
```

### Atualizar status da campanha

```bash
POST https://graph.facebook.com/v18.0/{campaign_id}

access_token={access_token}
&status=ACTIVE
```

### Obter custom audiences

```bash
GET https://graph.facebook.com/v18.0/act_{ad_account_id}/customaudiences?access_token={access_token}&fields=id,name,approximate_count
```

### Criar lookalike audience

```bash
POST https://graph.facebook.com/v18.0/act_{ad_account_id}/customaudiences

access_token={access_token}
&name=Lookalike - Top Customers
&subtype=LOOKALIKE
&origin_audience_id={source_audience_id}
&lookalike_spec={"type":"similarity","country":"US"}
```

## Métricas principais

| Metric | Description |
|--------|-------------|
| `impressions` | Impressões de anúncio |
| `clicks` | Todos os cliques |
| `spend` | Valor gasto |
| `reach` | Pessoas únicas alcançadas |
| `frequency` | Média de impressões por pessoa |
| `cpm` | Custo por 1000 impressões |
| `cpc` | Custo por clique |
| `actions` | Array de conversões |
| `cost_per_action_type` | CPA por ação |

## Objetivos de campanha

- `AWARENESS` - Reconhecimento de marca
- `TRAFFIC` - Tráfego para o website
- `ENGAGEMENT` - Engajamento em posts
- `LEADS` - Geração de leads
- `APP_PROMOTION` - Instalações de app
- `SALES` - Conversões/vendas de catálogo

## Opções de segmentação

```json
{
  "geo_locations": {
    "countries": ["US"],
    "cities": [{"key": "2420379"}]
  },
  "age_min": 25,
  "age_max": 45,
  "genders": [1, 2],
  "interests": [{"id": "6003139266461", "name": "Marketing"}],
  "behaviors": [{"id": "6002714895372"}]
}
```

## Quando usar

- Criar/gerenciar anúncios no Facebook e Instagram
- Segmentação de audiência e lookalikes
- Análise de performance de campanha
- Configuração de retargeting

## Limites de taxa

- 200 calls/hour per ad account
- 60 calls/hour for marketing API
- Use batch requests para eficiência

## Skills relevantes

- paid-ads
- analytics-tracking
- page-cro
