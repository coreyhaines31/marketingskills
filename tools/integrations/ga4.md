# Google Analytics 4 (GA4)

Plataforma de analytics web para rastrear o comportamento de usuários, conversões e desempenho de marketing.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Data API para relatórios, Admin API para configuração |
| MCP | ✓ | Disponível via Google Analytics MCP server |
| CLI | - | Use gcloud para algumas operações |
| SDK | ✓ | gtag.js, Google Analytics SDK para mobile |

## Autenticação

- **Tipo**: OAuth 2.0 ou Service Account
- **Scopes**: `https://www.googleapis.com/auth/analytics.readonly` (read), `https://www.googleapis.com/auth/analytics.edit` (write)
- **Setup**: Crie credenciais no Google Cloud Console

## Operações comuns de agent

### Executar um relatório (Data API)

```bash
POST https://analyticsdata.googleapis.com/v1beta/properties/{property_id}:runReport

{
  "dateRanges": [{"startDate": "30daysAgo", "endDate": "today"}],
  "dimensions": [{"name": "sessionSource"}],
  "metrics": [{"name": "sessions"}, {"name": "conversions"}]
}
```

### Buscar dados em tempo real

```bash
POST https://analyticsdata.googleapis.com/v1beta/properties/{property_id}:runRealtimeReport

{
  "dimensions": [{"name": "country"}],
  "metrics": [{"name": "activeUsers"}]
}
```

### Listar eventos de conversão

```bash
GET https://analyticsadmin.googleapis.com/v1beta/properties/{property_id}/conversionEvents
```

### Criar um evento de conversão

```bash
POST https://analyticsadmin.googleapis.com/v1beta/properties/{property_id}/conversionEvents

{
  "eventName": "purchase"
}
```

## Tracking no client-side

### Enviar evento customizado (gtag.js)

```javascript
gtag('event', 'signup_completed', {
  'method': 'email',
  'plan': 'free'
});
```

### Enviar evento via Measurement Protocol

```bash
POST https://www.google-analytics.com/mp/collect?measurement_id={measurement_id}&api_secret={api_secret}

{
  "client_id": "client_123",
  "events": [{
    "name": "purchase",
    "params": {
      "value": 99.99,
      "currency": "USD"
    }
  }]
}
```

## Principais dimensões e métricas

### Dimensões comuns
- `sessionSource` - Origem do tráfego
- `sessionMedium` - Meio do tráfego
- `sessionCampaignName` - Nome da campanha
- `landingPage` - Página de entrada
- `deviceCategory` - Tipo de dispositivo
- `country` - País do usuário

### Métricas comuns
- `sessions` - Total de sessões
- `activeUsers` - Usuários ativos
- `newUsers` - Novos usuários
- `conversions` - Eventos de conversão
- `engagementRate` - Taxa de sessões engajadas
- `averageSessionDuration` - Duração da sessão

## Quando usar

- Rastrear tráfego do site e comportamento de usuários
- Medir performance de campanhas de marketing
- Configurar tracking de conversão
- Analisar jornadas de usuários e funis
- Fazer modelagem de atribuição

## Limites de taxa

- Data API: 10 requisições por segundo por propriedade
- Admin API: varia por endpoint
- Measurement Protocol: 1M hits/dia na camada gratuita

## Habilidades relevantes

- analytics-tracking
- ab-test-setup
- seo-audit
- page-cro
