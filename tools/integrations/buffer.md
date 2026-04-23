# Buffer

Plataforma de agendamento, publicação e analytics de mídias sociais para gerenciar múltiplos perfis sociais.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | REST API v1 for profiles, updates, scheduling |
| MCP | - | Não disponível |
| CLI | ✓ | [buffer.js](../clis/buffer.js) |
| SDK | - | Sem SDK oficial; API legada ainda suportada |

## Autenticação

- **Tipo**: OAuth 2.0 Bearer Token
- **Cabeçalho**: `Authorization: Bearer {access_token}`
- **Obter chave**: Register app at https://buffer.com/developers/apps then complete OAuth flow
- **Observação**: Buffer não está mais aceitando novos registros de developer app; apps existentes continuam funcionando. A nova API pública está em desenvolvimento em https://buffer.com/developer-api

## Operações Comuns do Agente

### Obter user info

```bash
GET https://api.bufferapp.com/1/user.json

Authorization: Bearer {token}
```

### Listar connected profiles

```bash
GET https://api.bufferapp.com/1/profiles.json

Authorization: Bearer {token}
```

### Obter profile posting schedules

```bash
GET https://api.bufferapp.com/1/profiles/{profile_id}/schedules.json
```

### Criar a scheduled post

```bash
POST https://api.bufferapp.com/1/updates/create.json
Content-Type: application/x-www-form-urlencoded

profile_ids[]={profile_id}&text=Your+post+content&scheduled_at=2026-03-01T10:00:00Z
```

### Obter updates pendentes de um perfil

```bash
GET https://api.bufferapp.com/1/profiles/{profile_id}/updates/pending.json?count=25
```

### Obter updates enviados de um perfil

```bash
GET https://api.bufferapp.com/1/profiles/{profile_id}/updates/sent.json?count=25
```

### Publicar um update pendente imediatamente

```bash
POST https://api.bufferapp.com/1/updates/{update_id}/share.json
```

### Excluir um update

```bash
POST https://api.bufferapp.com/1/updates/{update_id}/destroy.json
```

### Reorder queue

```bash
POST https://api.bufferapp.com/1/profiles/{profile_id}/updates/reorder.json
Content-Type: application/x-www-form-urlencoded

order[]={update_id_1}&order[]={update_id_2}&order[]={update_id_3}
```

## Padrão da API

A Buffer API v1 usa extensões `.json` em todos os endpoints. Requisições POST usam content type `application/x-www-form-urlencoded`. Parâmetros de array usam notação com colchetes (ex.: `profile_ids[]`).

As respostas incluem um boolean `success` para operações de mutação.

## Métricas Principais

### Métricas de Perfil
- `followers` - Contagem de seguidores do perfil conectado
- `service` - Nome da plataforma (twitter, facebook, instagram, linkedin, etc.)

### Métricas de Update (updates enviados)
- `statistics.reach` - Alcance do post
- `statistics.clicks` - Link clicks
- `statistics.retweets` - Retweets/shares
- `statistics.favorites` - Likes/favorites
- `statistics.mentions` - Mentions

## Parâmetros

### Parâmetros de Criação de Update
- `profile_ids[]` - Obrigatório. Array de IDs de perfil para publicar
- `text` - Obrigatório. Conteúdo do post
- `scheduled_at` - Timestamp ISO 8601 para agendamento
- `now` - Defina como `true` para publicar imediatamente
- `top` - Defina como `true` para adicionar no topo da fila
- `shorten` - Defina como `true` para encurtar links automaticamente
- `media[photo]` - URL do anexo de foto
- `media[thumbnail]` - URL da thumbnail
- `media[link]` - URL para anexo de link

## Quando Usar

- Agendamento de posts em mídias sociais em múltiplas plataformas
- Managing social media content queues
- Análise de desempenho de posts entre canais
- Automating social media publishing workflows
- Coordinating team social media activity

## Limites de Taxa

- 60 requisições autenticadas por usuário por minuto
- Exceder retorna HTTP 429
- Limites maiores disponíveis entrando em contato com hello@buffer.com

## Skills Relevantes

- social-media-calendar
- content-repurposing
- social-proof
- launch-sequence
