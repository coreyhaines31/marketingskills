# Gong

Plataforma de revenue intelligence que grava, transcreve e analisa conversas de vendas (ligações, reuniões em vídeo, emails) para gerar insights de deals, oportunidades de coaching e inteligência competitiva.

## Capacidades

| Integração | Disponível | Observações |
|-------------|-----------|-------|
| API | ✓ | REST API, Basic Auth ou OAuth2 |
| MCP | - | Não disponível |
| CLI | - | Não disponível |
| SDK | - | Apenas REST API; client Python da comunidade via dltHub |

## Autenticação

- **Tipo**: Basic Auth (Access Key + Secret) ou OAuth2 para apps publicados
- **Obter chave**: Somente admin — Settings > API em https://app.gong.io
- **Base URL**: Específica do tenant — obtenha nas configurações da sua Gong API (normalmente `https://{tenant}.api.gong.io/v2/`)
- **Docs**: https://help.gong.io/docs/what-the-gong-api-provides

## Endpoints da API

A maioria dos endpoints da Gong API usa **POST** com JSON no corpo da requisição para filtros. Consulte a [documentação oficial da API](https://gong.app.gong.io/settings/api/documentation) para verificar a disponibilidade atual dos endpoints.

### Calls

```bash
# List calls (with date/user filters)
POST /v2/calls/extensive

# Get call transcripts (batch, by call IDs)
POST /v2/calls/transcript
```

### Usuários e estatísticas

```bash
# List users
GET /v2/users

# Get activity stats (talk ratio, questions asked, longest monologue)
POST /v2/stats/activity/day-by-day
```

### Engagement Flows

```bash
# List flows
GET /v2/flows

# Get flow analytics
GET /v2/flows/{id}/analytics
```

## Principais pontos de dados

### Por call
- Transcrição completa com identificação de falantes e timestamps
- Relação fala/escuta por participante
- Tópicos discutidos (detectados automaticamente)
- Perguntas feitas (quantidade e conteúdo)
- Duração do monólogo mais longo
- Próximos passos mencionados
- Menções a concorrentes
- Discussões de preço sinalizadas

### Por deal
- Todas as calls e emails associados
- Progressão de estágio do deal
- Sinais de risco (sem resposta, menção a concorrente, champion saiu)
- Score de engajamento

### Por rep
- Tendências de talk ratio
- Frequência de perguntas
- Cobertura de tópicos vs. playbook
- Correlação entre taxa de ganho e comportamentos

## Operações comuns de agent

### Extrair Competitive Intelligence de Calls

1. Consultar calls com menção a nomes de concorrentes
2. Extrair: objeções levantadas, features comparadas, discussões de preço
3. Sintetizar em atualizações de battlecards competitivos
4. Acompanhar frequência de menções a concorrentes ao longo do tempo

### Minerar Calls para Customer Research

1. Coletar transcrições de deals ganhos/perdidos recentemente
2. Extrair: pain points, trigger events, critérios de decisão e linguagem usada
3. Alimentar trabalho de construção de personas e messaging
4. Identificar objeções recorrentes para sales enablement

### Revenue Attribution

1. Coletar dados de call junto com dados de deals no CRM
2. Mapear quais conteúdos/páginas foram discutidos em deals ganhos
3. Identificar quais talking points se correlacionam com closed-won
4. Criar relatórios de atribuição de conteúdo para receita

### Rep Coaching Insights

1. Comparar padrões de call dos top performers vs. média da equipe
2. Identificar: talk ratio, frequência de perguntas, lacunas de cobertura de tópicos
3. Destacar momentos específicos de calls para revisão de coaching
4. Acompanhar melhorias ao longo do tempo

## Limites de taxa

- 3 chamadas de API por segundo
- 10.000 chamadas de API por dia
- Paginação obrigatória para grandes conjuntos de resultados

## Quando usar

- Minerar transcrições de calls de vendas para customer research e dados de VOC
- Extrair inteligência competitiva de conversas com prospects
- Construir modelos de atribuição de receita (conteúdo → influência no deal)
- Analisar padrões de ganho/perda em transcrições de deals
- Fazer coaching de sales reps com base em conversation analytics
- Identificar objeções comuns e sinais de compra

## Limitações

- Acesso à API exige credenciais de admin
- Qualidade da transcrição depende da qualidade do áudio da call
- Limites de taxa (10k/dia) podem limitar análises em grande escala
- O preço é de nível enterprise (não listado publicamente, geralmente $100+/usuário/mês)
- Exige adoção da equipe — grava calls via integrações, mas também permite upload de calls de sistemas de telefonia não integrados

## Habilidades relevantes

- customer-research
- sales-enablement
- competitor-alternatives
- revops
- cold-email

## Fontes

- [Gong API overview](https://help.gong.io/docs/what-the-gong-api-provides)
- [Gong API documentation](https://gong.app.gong.io/settings/api/documentation)
- [Call upload support](https://help.gong.io/docs/uploading-calls-from-a-non-integrated-telephony-system)
