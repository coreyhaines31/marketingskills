# SEMrush

Plataforma de SEO e análise competitiva para keyword research e auditorias de site.

## Capacidades

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Analytics API, Projects API |
| MCP | - | Not available |
| CLI | - | Not available |
| SDK | - | API-only |

## Autenticação

- **Type**: API Key
- **Parameter**: `key={api_key}` in query string
- **Get key**: My Profile > API in SEMrush dashboard

## Operações comuns do agente

### Visão geral do domínio

```bash
GET https://api.semrush.com/?type=domain_ranks&key={api_key}&export_columns=Db,Dn,Rk,Or,Ot,Oc,Ad,At,Ac&domain=example.com
```

### Keywords orgânicas

```bash
GET https://api.semrush.com/?type=domain_organic&key={api_key}&export_columns=Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr&domain=example.com&database=us&display_limit=100
```

### Visão geral da keyword

```bash
GET https://api.semrush.com/?type=phrase_all&key={api_key}&export_columns=Ph,Nq,Cp,Co,Nr&phrase=keyword&database=us
```

### Keywords relacionadas

```bash
GET https://api.semrush.com/?type=phrase_related&key={api_key}&export_columns=Ph,Nq,Cp,Co,Nr,Td&phrase=keyword&database=us&display_limit=50
```

### Dificuldade da keyword

```bash
GET https://api.semrush.com/?type=phrase_kdi&key={api_key}&export_columns=Ph,Kd&phrase=keyword&database=us
```

### Visão geral de backlinks

```bash
GET https://api.semrush.com/?type=backlinks_overview&key={api_key}&target=example.com&target_type=root_domain
```

### Lista de backlinks

```bash
GET https://api.semrush.com/?type=backlinks&key={api_key}&target=example.com&target_type=root_domain&export_columns=source_url,source_title,target_url,anchor&display_limit=100
```

### Concorrentes

```bash
GET https://api.semrush.com/?type=domain_organic_organic&key={api_key}&export_columns=Dn,Cr,Np,Or,Ot,Oc,Ad&domain=example.com&database=us&display_limit=20
```

## Formato de resposta

As respostas são CSV por padrão. Adicione `&export_escape=1` para escaping adequado.

## Colunas de export

### Relatório de domínio
- `Db` - Database
- `Dn` - Domínio
- `Rk` - Rank
- `Or` - Keywords orgânicas
- `Ot` - Tráfego orgânico
- `Oc` - Custo orgânico

### Relatório de keyword
- `Ph` - Phrase/keyword
- `Nq` - Volume de busca
- `Cp` - CPC
- `Co` - Concorrência
- `Kd` - Dificuldade da keyword
- `Nr` - Número de resultados

### Backlinks
- `source_url` - Página de origem do link
- `target_url` - Página de destino
- `anchor` - Texto âncora
- `source_title` - Título da página

## Databases

Use código de país: `us`, `uk`, `de`, `fr`, `ca`, `au` etc.

## Quando usar

- Keyword research
- Análise competitiva
- Análise de backlinks
- Auditorias de site
- Rank tracking
- Análise de lacunas de conteúdo

## Limites de taxa

- Varia por plano (10-30K unidades/dia)
- Cada chamada de API consome unidades

## Skills relevantes

- seo-audit
- programmatic-seo
- content-strategy
- competitor-alternatives
