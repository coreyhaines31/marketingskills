# LinkedIn Ads

Plataforma de publicidade B2B com segmentação profissional.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Marketing API para campaigns, audiences e analytics |
| MCP | - | Não disponível |
| CLI | - | Não disponível |
| SDK | - | somente API (bibliotecas da comunidade disponíveis) |

## Autenticação

- **Tipo**: OAuth 2.0
- **Header**: `Authorization: Bearer {access_token}`
- **Scopes**: `r_ads`, `r_ads_reporting`, `rw_ads`

## Operações comuns de agent

### Buscar contas de anúncio

```bash
GET https://api.linkedin.com/v2/adAccountsV2?q=search

Authorization: Bearer {access_token}
```

### Buscar campanhas

```bash
GET https://api.linkedin.com/v2/adCampaignsV2?q=search&search.account.values[0]=urn:li:sponsoredAccount:{account_id}

Authorization: Bearer {access_token}
```

### Buscar analytics de campanha

```bash
GET https://api.linkedin.com/v2/adAnalyticsV2?q=analytics&pivot=CAMPAIGN&dateRange.start.year=2024&dateRange.start.month=1&dateRange.start.day=1&dateRange.end.year=2024&dateRange.end.month=1&dateRange.end.day=31&campaigns=urn:li:sponsoredCampaign:{campaign_id}&fields=impressions,clicks,costInLocalCurrency,conversions

Authorization: Bearer {access_token}
```

### Criar campanha

```bash
POST https://api.linkedin.com/v2/adCampaignsV2

Authorization: Bearer {access_token}

{
  "account": "urn:li:sponsoredAccount:{account_id}",
  "name": "Campaign Name",
  "type": "SPONSORED_UPDATES",
  "costType": "CPC",
  "unitCost": {
    "amount": "5.00",
    "currencyCode": "USD"
  },
  "dailyBudget": {
    "amount": "100.00",
    "currencyCode": "USD"
  },
  "status": "PAUSED"
}
```

### Atualizar status da campanha

```bash
POST https://api.linkedin.com/v2/adCampaignsV2/{campaign_id}

Authorization: Bearer {access_token}

{
  "patch": {
    "$set": {
      "status": "ACTIVE"
    }
  }
}
```

### Buscar creatives

```bash
GET https://api.linkedin.com/v2/adCreativesV2?q=search&search.campaign.values[0]=urn:li:sponsoredCampaign:{campaign_id}

Authorization: Bearer {access_token}
```

### Buscar contagem de audiência

```bash
POST https://api.linkedin.com/v2/audienceCountsV2

{
  "audienceCriteria": {
    "include": {
      "and": [{
        "or": {
          "urn:li:adTargetingFacet:titles": ["urn:li:title:123"]
        }
      }]
    }
  }
}
```

## Métricas principais

| Métrica | Descrição |
|---------|-----------|
| `impressions` | Impressões de anúncios |
| `clicks` | Total de cliques |
| `costInLocalCurrency` | Gasto |
| `conversions` | Total de conversões |
| `leadGenerationMailContactInfoShares` | Envios de formulário de lead |

## Tipos de campanha

- `SPONSORED_UPDATES` - Conteúdo patrocinado
- `TEXT_AD` - Anúncios de texto
- `SPONSORED_INMAILS` - Anúncios de mensagem
- `DYNAMIC` - Anúncios dinâmicos

## Opções de segmentação

### Baseadas em cargo
- Cargos
- Funções de trabalho
- Níveis de senioridade
- Anos de experiência

### Baseadas em empresa
- Nomes de empresas
- Setores
- Tamanho da empresa
- Seguidores da empresa

### Profissional
- Habilidades
- Groups
- Schools
- Degrees

## Quando usar

- Publicidade B2B
- Segmentação por cargo
- Account-based marketing
- Campanhas de geração de leads

## Limites de taxa

- 100 requisições/dia (básico)
- 10.000 requisições/dia (Marketing Developer Platform)

## Habilidades relevantes

- paid-ads
- analytics-tracking
