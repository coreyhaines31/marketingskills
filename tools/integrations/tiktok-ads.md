# TikTok Ads

Plataforma de anúncios para a audiência de vídeos curtos do TikTok.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Marketing API para campanhas, audiências e relatórios |
| MCP | - | Não disponível |
| CLI | - | Não disponível |
| SDK | ✓ | SDK Python disponível |

## Autenticação

- **Tipo**: Access Token
- **Header**: `Access-Token: {access_token}`
- **Setup**: Criar app no TikTok for Business e obter access token

## Operações Comuns do Agente

### Get advertiser info

```bash
GET https://business-api.tiktok.com/open_api/v1.3/advertiser/info/?advertiser_ids=["{advertiser_id}"]

Access-Token: {access_token}
```

### Get campaigns

```bash
GET https://business-api.tiktok.com/open_api/v1.3/campaign/get/?advertiser_id={advertiser_id}&page=1&page_size=20

Access-Token: {access_token}
```

### Get campaign report

```bash
POST https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/

Access-Token: {access_token}

{
  "advertiser_id": "{advertiser_id}",
  "report_type": "BASIC",
  "dimensions": ["campaign_id"],
  "metrics": ["spend", "impressions", "clicks", "conversion"],
  "data_level": "AUCTION_CAMPAIGN",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

### Create campaign

```bash
POST https://business-api.tiktok.com/open_api/v1.3/campaign/create/

Access-Token: {access_token}

{
  "advertiser_id": "{advertiser_id}",
  "campaign_name": "Campaign Name",
  "objective_type": "CONVERSIONS",
  "budget_mode": "BUDGET_MODE_DAY",
  "budget": 100
}
```

### Update campaign status

```bash
POST https://business-api.tiktok.com/open_api/v1.3/campaign/status/update/

Access-Token: {access_token}

{
  "advertiser_id": "{advertiser_id}",
  "campaign_ids": ["{campaign_id}"],
  "opt_status": "ENABLE"
}
```

### Get ad groups

```bash
GET https://business-api.tiktok.com/open_api/v1.3/adgroup/get/?advertiser_id={advertiser_id}&campaign_ids=["{campaign_id}"]

Access-Token: {access_token}
```

### Get audiences

```bash
GET https://business-api.tiktok.com/open_api/v1.3/dmp/custom_audience/list/?advertiser_id={advertiser_id}

Access-Token: {access_token}
```

## Métricas Principais

| Métrica | Descrição |
|--------|-------------|
| `spend` | Amount spent |
| `impressions` | Ad impressions |
| `clicks` | Clicks |
| `ctr` | Click-through rate |
| `cpc` | Cost per click |
| `cpm` | Cost per 1000 impressions |
| `conversion` | Conversions |
| `cost_per_conversion` | CPA |
| `video_play_actions` | Visualizações de vídeo |
| `video_watched_6s` | 6s views |

## Objetivos de Campanha

- `REACH` - Brand awareness
- `TRAFFIC` - Tráfego de site
- `VIDEO_VIEWS` - Visualizações de vídeo
- `LEAD_GENERATION` - Lead forms
- `CONVERSIONS` - Conversões de site
- `APP_PROMOTION` - App installs

## Opções de Segmentação

### Demographics
- Age ranges
- Gender
- Languages
- Locations

### Interests & Behavior
- Interest categories
- Interações com vídeo
- Creator interactions
- Hashtag interactions

### Custom Audiences
- Upload de arquivos de clientes
- Visitantes de site (pixel)
- App activity
- Engagement audiences

## Quando Usar

- Reaching younger demographics (18-34)
- Publicidade com foco em vídeo
- Viral/creative campaigns
- App promotion

## Limites de Taxa

- 10 requests/second
- 100,000 requests/day

## Skills Relevantes

- paid-ads
- analytics-tracking
