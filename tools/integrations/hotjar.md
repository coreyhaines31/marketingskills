# Hotjar

Plataforma de analytics comportamental com heatmaps, gravações de sessão e pesquisas para entender a experiência do usuário.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | Surveys, Responses, Sites, Heatmaps, Recordings |
| MCP | - | Não disponível |
| CLI | ✓ | [hotjar.js](../clis/hotjar.js) |
| SDK | ✓ | Snippet de tracking JavaScript, Identify API, Events API |

## Autenticação

- **Tipo**: OAuth 2.0 Client Credentials
- **Token endpoint**: `POST https://api.hotjar.io/v1/oauth/token`
- **Header**: `Authorization: Bearer {access_token}`
- **Get credentials**: Hotjar Dashboard > Integrations > API
- **Token expiry**: 3600 segundos (1 hora)

### Requisição de token

```bash
POST https://api.hotjar.io/v1/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={client_id}&client_secret={client_secret}
```

### Resposta do token

```json
{
  "access_token": "<token>",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## Operações comuns de agent

### Listar Sites

```bash
GET https://api.hotjar.io/v1/sites

Authorization: Bearer {access_token}
```

### Listar Surveys

```bash
GET https://api.hotjar.io/v1/sites/{site_id}/surveys

Authorization: Bearer {access_token}
```

### Buscar respostas de Survey

```bash
GET https://api.hotjar.io/v1/sites/{site_id}/surveys/{survey_id}/responses?limit=100

Authorization: Bearer {access_token}
```

Suporta paginação baseada em cursor com os parâmetros `cursor` e `limit`.

### Listar Heatmaps

```bash
GET https://api.hotjar.io/v1/sites/{site_id}/heatmaps

Authorization: Bearer {access_token}
```

### Listar Recordings

```bash
GET https://api.hotjar.io/v1/sites/{site_id}/recordings

Authorization: Bearer {access_token}
```

### Listar Forms

```bash
GET https://api.hotjar.io/v1/sites/{site_id}/forms

Authorization: Bearer {access_token}
```

## Métricas principais

### Dados de resposta de Survey
- `response_id` - Identificador único da resposta
- `answers` - Array de pares pergunta/resposta
- `created_at` - Timestamp da resposta
- `device_type` - Desktop, mobile, tablet

### Dados de Heatmap
- `url` - URL da página
- `click_count` - Total de cliques rastreados
- `visitors` - Visitantes únicos
- `created_at` - Data de criação do heatmap

### Dados de Recording
- `recording_id` - ID único da gravação
- `duration` - Duração da sessão
- `pages_visited` - Páginas na sessão
- `device` - Informações do dispositivo

## Parâmetros

### Respostas de Survey
- `limit` - Resultados por página (padrão: 100)
- `cursor` - Cursor de paginação da resposta anterior
- `sort` - Ordenação (padrão: created_at desc)

### Recordings
- `limit` - Resultados por página
- `cursor` - Cursor de paginação
- `date_from` - Filtro de data inicial
- `date_to` - Filtro de data final

## Quando usar

- Analisar padrões de comportamento de usuários em landing pages
- Coletar feedback qualitativo com surveys no site
- Identificar problemas de UX por meio de gravações de sessão
- Entender profundidade de rolagem e engajamento com heatmaps
- Validar hipóteses de CRO com dados de comportamento do usuário
- Analisar abandono de formulários

## Limites de taxa

- 3000 requisições/minuto (50 por segundo)
- Limite de taxa por endereço IP de origem
- Paginação por cursor para grandes conjuntos de resultados

## Habilidades relevantes

- page-cro
- ab-test-setup
- analytics-tracking
- ux-audit
- landing-page
