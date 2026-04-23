# Strapi

CMS headless open-source com opção self-hosted, APIs REST e GraphQL e painel admin personalizável. Voltado ao Strapi 5.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | REST (default), GraphQL (plugin) |
| MCP | - | Sem servidor MCP oficial |
| CLI | ✓ | `strapi` CLI para setup de projeto, tipos de conteúdo e plugins |
| SDK | ✓ | `@strapi/sdk-js`, `@strapi/blocks-react-renderer` |

## Autenticação

- **Tipo**: API Token ou JWT de Users & Permissions
- **Header**: `Authorization: Bearer {api_token}`
- **Tokens**: Crie em Settings → API Tokens (acesso total, somente leitura ou customizado)
- **JWT**: `POST /api/auth/local` with identifier + password retorna JWT

## Operações Comuns do Agente

### List documents

```bash
GET http://localhost:1337/api/articles?populate=*

Authorization: Bearer {api_token}
```

### Get single document

```bash
GET http://localhost:1337/api/articles/{documentId}?populate=*

Authorization: Bearer {api_token}
```

### Filter and sort

```bash
# Filter by field
GET http://localhost:1337/api/articles?filters[slug][$eq]=my-post

# Multiple filters
GET http://localhost:1337/api/articles?filters[category][name][$eq]=Marketing&filters[publishedAt][$notNull]=true

# Sort
GET http://localhost:1337/api/articles?sort=publishedAt:desc

# Pagination
GET http://localhost:1337/api/articles?pagination[page]=1&pagination[pageSize]=10
```

### Create document

```bash
POST http://localhost:1337/api/articles
Content-Type: application/json
Authorization: Bearer {api_token}

{
  "data": {
    "title": "New Article",
    "slug": "new-article",
    "body": "Article content here",
    "category": "{category_documentId}"
  }
}
```

### Update document

```bash
PUT http://localhost:1337/api/articles/{documentId}
Content-Type: application/json
Authorization: Bearer {api_token}

{
  "data": {
    "title": "Updated Title"
  }
}
```

### Delete document

```bash
DELETE http://localhost:1337/api/articles/{documentId}

Authorization: Bearer {api_token}
```

### Get draft content

```bash
# Strapi 5 uses status parameter (replaces v4 publicationState)
GET http://localhost:1337/api/articles?status=draft

Authorization: Bearer {api_token}
```

Publicação e despublicação são gerenciadas pelo painel admin do Strapi ou pela Document Service API (server-side). A API REST pública não expõe endpoints dedicados de publicar/despublicar.

### Populate relations and components

```bash
# Populate all relations
GET http://localhost:1337/api/articles?populate=*

# Populate specific relations
GET http://localhost:1337/api/articles?populate[0]=author&populate[1]=category

# Deep populate
GET http://localhost:1337/api/articles?populate[author][populate]=avatar
```

## Comandos CLI

```bash
# Create new Strapi project
npx create-strapi@latest my-project

# Start development server
strapi develop

# Build admin panel
strapi build

# Generate content type
strapi generate content-type

# Generate controller
strapi generate controller

# Add GraphQL plugin
npm install @strapi/plugin-graphql
```

## Objetos Principais

- **Content Tipo** — Definição de schema (collection type ou single type)
- **Document** — Item de conteúdo identificado por `documentId` (padrão do Strapi 5)
- **Component** — Reusable field group (e.g., SEO fields, CTA block)
- **Dynamic Zone** — Área flexível de conteúdo que aceita múltiplos tipos de componente
- **Media** — Arquivos gerenciados pela Media Library
- **Locale** — Locale i18n para tradução de conteúdo (baseado em plugin)

## Quando Usar

- CMS self-hosted com total propriedade dos dados
- Projetos com foco em orçamento (sem cobrança por assento)
- Custom admin panel or plugin requirements
- Times com capacidade de DevOps
- Projetos que precisam de acesso REST e GraphQL

## Limites de Taxa

- Self-hosted: Sem limites de taxa embutidos (configure via middleware ou reverse proxy)
- Strapi Cloud: Varies by plan
- Recomendado: adicionar middleware de rate limiting para APIs em produção

## Skills Relevantes

- content-strategy (CMS selection, content modeling)
- programmatic-seo (CMS as data source for generated pages)
- site-architecture (URL structure from CMS slugs)
