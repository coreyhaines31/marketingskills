# WordPress

Sistema de gestão de conteúdo para blogs e sites.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | REST API (WP REST API) |
| MCP | - | Não disponível |
| CLI | ✓ | WP-CLI para gerenciamento server-side |
| SDK | ✓ | Various client libraries |

## Autenticação

- **Tipo**: Application Password, JWT, or OAuth
- **Header**: `Authorization: Basic {base64(username:app_password)}`
- **Setup**: Users > Your Profile > Application Passwords

## Operações Comuns do Agente

### Listar posts

```bash
GET https://example.com/wp-json/wp/v2/posts?per_page=10

Authorization: Basic {base64(username:app_password)}
```

### Obter post

```bash
GET https://example.com/wp-json/wp/v2/posts/{post_id}

Authorization: Basic {base64(username:app_password)}
```

### Criar post

```bash
POST https://example.com/wp-json/wp/v2/posts

Authorization: Basic {base64(username:app_password)}

{
  "title": "Post Title",
  "content": "<p>Post content here</p>",
  "status": "draft",
  "categories": [1],
  "tags": [5, 6]
}
```

### Atualizar post

```bash
PUT https://example.com/wp-json/wp/v2/posts/{post_id}

Authorization: Basic {base64(username:app_password)}

{
  "title": "Updated Title",
  "status": "publish"
}
```

### Listar páginas

```bash
GET https://example.com/wp-json/wp/v2/pages?per_page=20

Authorization: Basic {base64(username:app_password)}
```

### Listar categorias

```bash
GET https://example.com/wp-json/wp/v2/categories
```

### Criar categoria

```bash
POST https://example.com/wp-json/wp/v2/categories

{
  "name": "Category Name",
  "slug": "category-name"
}
```

### Enviar mídia

```bash
POST https://example.com/wp-json/wp/v2/media

Authorization: Basic {base64(username:app_password)}
Content-Disposition: attachment; filename="image.jpg"
Content-Type: image/jpeg

[binary image data]
```

### Listar usuários

```bash
GET https://example.com/wp-json/wp/v2/users

Authorization: Basic {base64(username:app_password)}
```

## Comandos WP-CLI

```bash
# List posts
wp post list --post_type=post --post_status=publish

# Create post
wp post create --post_title="Title" --post_content="Content" --post_status=publish

# Update post
wp post update 123 --post_title="New Title"

# Export database
wp db export backup.sql

# Search/replace in database
wp search-replace 'old-domain.com' 'new-domain.com'

# Install plugin
wp plugin install yoast-seo --activate

# Update plugins
wp plugin update --all
```

## Status de Postagem

- `publish` - Ao vivo no site
- `draft` - Não publicado
- `pending` - Aguardando revisão
- `private` - Private post
- `future` - Scheduled
- `trash` - In trash

## Endpoints Comuns

| Endpoint | Recurso |
|----------|----------|
| `/wp/v2/posts` | Blog posts |
| `/wp/v2/pages` | Pages |
| `/wp/v2/media` | Images/files |
| `/wp/v2/categories` | Categories |
| `/wp/v2/tags` | Tags |
| `/wp/v2/users` | Users |
| `/wp/v2/comments` | Comments |

## Quando Usar

- Gestão de conteúdo de blog
- Page updates
- Media management
- Configuração do site
- Plugin/theme management

## Limites de Taxa

- Sem limites padrão
- Server/host dependent

## Skills Relevantes

- content-strategy
- seo-audit
- programmatic-seo
