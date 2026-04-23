# Contentful

CMS headless empresarial com suporte a múltiplos locais, arquitetura de duas APIs e conteúdo componível.

## Capacidades

| Integração | Disponível | Notas |
|-------------|------------|-------|
| API | ✓ | Content Delivery API (leitura), Content Management API (escrita) |
| MCP | - | Sem servidor MCP oficial |
| CLI | ✓ | `contentful-cli` para spaces, content types, migrations |
| SDK | ✓ | `contentful` (delivery), `contentful-management` (management) |

## Autenticação

- **Delivery API (CDA)**: `Authorization: Bearer {delivery_token}`
  - Base URL: `https://cdn.contentful.com`
  - Somente leitura, CDN-cached
- **Preview API (CPA)**: `Authorization: Bearer {preview_token}`
  - Base URL: `https://preview.contentful.com`
  - Somente leitura, retorna conteúdo em rascunho
- **Management API (CMA)**: `Authorization: Bearer {management_token}`
  - Base URL: `https://api.contentful.com`
  - Leitura/escrita, não armazenado em cache
- **Tokens**: Crie em Settings → API keys (delivery) or Settings → CMA tokens (management)

## Operações Comuns do Agente

### Obter entries (Delivery API)

```bash
GET https://cdn.contentful.com/spaces/{space_id}/environments/{environment}/entries?content_type=blogPost&limit=10

Authorization: Bearer {delivery_token}
```

### Obter single entry

```bash
GET https://cdn.contentful.com/spaces/{space_id}/environments/{environment}/entries/{entry_id}

Authorization: Bearer {delivery_token}
```

### Buscar e filtrar

```bash
# By field value
GET https://cdn.contentful.com/spaces/{space_id}/environments/{environment}/entries?content_type=blogPost&fields.slug=my-post

# Full-text search
GET https://cdn.contentful.com/spaces/{space_id}/environments/{environment}/entries?query=marketing+strategy

# By date range
GET https://cdn.contentful.com/spaces/{space_id}/environments/{environment}/entries?content_type=blogPost&fields.publishDate[gte]=2024-01-01
```

### Criar entry (Management API)

O CMA usa PUT com `entry_id` gerado pelo cliente. Para gerar automaticamente, use POST sem ID no path.

```bash
PUT https://api.contentful.com/spaces/{space_id}/environments/{environment}/entries/{entry_id}
Content-Type: application/vnd.contentful.management.v1+json
X-Contentful-Content-Type: blogPost
Authorization: Bearer {management_token}

{
  "fields": {
    "title": {"en-US": "New Post"},
    "slug": {"en-US": "new-post"},
    "body": {"en-US": "Post content here"}
  }
}
```

### Atualizar entry

```bash
PUT https://api.contentful.com/spaces/{space_id}/environments/{environment}/entries/{entry_id}
Content-Type: application/vnd.contentful.management.v1+json
X-Contentful-Version: {current_version}
Authorization: Bearer {management_token}

{
  "fields": {
    "title": {"en-US": "Updated Title"}
  }
}
```

### Publicar entry

```bash
PUT https://api.contentful.com/spaces/{space_id}/environments/{environment}/entries/{entry_id}/published
X-Contentful-Version: {current_version}
Authorization: Bearer {management_token}
```

### Despublicar entry

```bash
DELETE https://api.contentful.com/spaces/{space_id}/environments/{environment}/entries/{entry_id}/published
X-Contentful-Version: {current_version}
Authorization: Bearer {management_token}
```

## Comandos CLI

```bash
# Login
contentful login

# List spaces
contentful space list

# Export space content
contentful space export --space-id {space_id}

# Import content
contentful space import --space-id {space_id} --content-file export.json

# Create migration
contentful space migration --space-id {space_id} migration.js

# List content types
contentful content-type list --space-id {space_id}
```

## Objetos Principais

- **Space** — Contêiner de nível superior para conteúdo (um por projeto)
- **Environment** — Isolated content branch (`master`, `staging`, etc.)
- **Content Type** — Definição de schema com campos e validações
- **Entry** — Content item of a specific content type
- **Asset** — Media file (image, video, document)
- **Locale** — Language/region variant (e.g., `en-US`, `de-DE`)

## Quando Usar

- Multi-locale marketing content (global sites)
- Operações de conteúdo Enterprise com workflows de aprovação
- Composable content architecture
- Equipes que precisam de suporte de fornecedor estabelecido e SLAs
- Reutilização de conteúdo em múltiplos canais

## Limites de Taxa

Limites de taxa dependem do plano. Verifique o header de resposta `X-Contentful-RateLimit-Second-Limit` para seus limites reais.

- Delivery API (CDA): Varia por plano (typically high throughput)
- Preview API (CPA): menor que CDA (varia por plano)
- Management API (CMA): ~10 requisições por segundo (padrão)
- Veja [Contentful technical limits](https://www.contentful.com/developers/docs/technical-limits/) para os valores atuais

## Skills Relevantes

- content-strategy (CMS selection, content modeling)
- programmatic-seo (CMS as data source for generated pages)
- site-architecture (multi-locale URL structure)
