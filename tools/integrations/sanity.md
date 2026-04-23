# Sanity

Headless CMS com colaboração em tempo real, linguagem de query GROQ e schema-as-code.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | GROQ queries, Mutations API, Assets API |
| MCP | - | No official MCP server |
| CLI | ✓ | `sanity` CLI for studio, datasets, deployment |
| SDK | ✓ | `@sanity/client`, `next-sanity`, `@sanity/image-url` |

## Autenticação

- **Type**: API Token (Bearer)
- **Header**: `Authorization: Bearer skXXXXXX`
- **Tokens**: Create in Sanity Manage → API → Tokens
- **Permissions**: Read-only ou Read+Write por token

## Operações comuns do agente

### Consultar documentos (GROQ)

Na prática, faça URL-encode do valor do parâmetro `query`.

```bash
GET https://{projectId}.api.sanity.io/v2024-01-01/data/query/{dataset}?query=*[_type == "post"]{title, slug, publishedAt}
```

### Consultar com parâmetros

```bash
GET https://{projectId}.api.sanity.io/v2024-01-01/data/query/{dataset}?query=*[_type == "post" && slug.current == $slug][0]&$slug="my-post"
```

### Obter documento por ID

```bash
GET https://{projectId}.api.sanity.io/v2024-01-01/data/doc/{dataset}/{documentId}
```

### Criar documento (Mutations API)

```bash
POST https://{projectId}.api.sanity.io/v2024-01-01/data/mutate/{dataset}

{
  "mutations": [
    {
      "create": {
        "_type": "post",
        "title": "New Post",
        "slug": {"_type": "slug", "current": "new-post"},
        "body": [{"_type": "block", "children": [{"_type": "span", "text": "Hello"}]}]
      }
    }
  ]
}
```

Use `createOrReplace` se quiser fazer upsert (requer campo `_id`).

### Excluir documento

```bash
POST https://{projectId}.api.sanity.io/v2024-01-01/data/mutate/{dataset}

{
  "mutations": [
    {"delete": {"id": "document-id"}}
  ]
}
```

### Aplicar patch em documento

```bash
POST https://{projectId}.api.sanity.io/v2024-01-01/data/mutate/{dataset}

{
  "mutations": [
    {
      "patch": {
        "id": "document-id",
        "set": {"title": "Updated Title"}
      }
    }
  ]
}
```

## Comandos de CLI

```bash
# Create a new Sanity project
sanity init

# Start the studio locally
sanity dev

# Deploy studio to Sanity hosting
sanity deploy

# Export dataset
sanity dataset export production ./backup.tar.gz

# Import dataset
sanity dataset import ./data.ndjson production

# List datasets
sanity dataset list

# Run a GROQ query
sanity documents query '*[_type == "post"][0..9]{title, slug}'
```

## Objetos principais

- **Document** — Item de conteúdo de nível superior com `_id`, `_type`, `_rev`
- **Asset** — Imagens e arquivos armazenados no Sanity CDN
- **Reference** — Link entre documentos (`{_type: "reference", _ref: "doc-id"}`)
- **Portable Text** — Rich text como array estruturado de blocos
- **Dataset** — Banco de conteúdo isolado (ex.: `production`, `staging`)
- **Slug** — Identificador amigável para URL (`{_type: "slug", current: "my-slug"}`)

## Quando usar

- Conteúdo estruturado para sites de marketing e blogs
- Entrega de conteúdo multicanal (web, mobile, email)
- Fluxos de edição colaborativa em tempo real
- Sites com muito conteúdo e modelos complexos
- Frontends baseados em Next.js ou React

## Limites de taxa

Os limites de taxa variam por plano. Padrões documentados:

- CDN API (queries): Alto throughput, distribuído globalmente (sem hard cap por segundo publicado)
- API (sem CDN): Rate-limited por projeto (varia por plano)
- Mutations: Rate-limited por projeto (varia por plano)
- Veja [Sanity technical limits](https://www.sanity.io/docs/technical-limits) para os valores atuais

## Skills relevantes

- content-strategy (CMS selection, content modeling)
- programmatic-seo (CMS as data source for generated pages)
- site-architecture (URL structure from CMS slugs)
