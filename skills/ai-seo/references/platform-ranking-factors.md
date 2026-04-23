# Como Cada Plataforma de IA Escolhe Suas Fontes

Cada plataforma de busca por IA tem seu próprio índice de busca, lógica de ranking e preferências de conteúdo. Este guia aborda o que importa para ser citado em cada uma delas.

Fontes citadas ao longo do texto: estudo Princeton GEO (KDD 2024), estudo de autoridade de domínio da SE Ranking, análise de adequação conteúdo-resposta da ZipTie.

---

## Os Fundamentos

Toda plataforma de IA compartilha três requisitos básicos:

1. **Seu conteúdo precisa estar no índice deles** — Cada plataforma usa um backend de busca diferente (Google, Bing, Brave ou o próprio). Se você não está indexado, não pode ser citado.
2. **Seu conteúdo precisa ser rastreável** — Os bots de IA precisam de acesso via robots.txt. Bloqueie o bot, perca a citação.
3. **Seu conteúdo precisa ser extraível** — Sistemas de IA puxam trechos, não páginas. Estrutura clara e parágrafos autossuficientes vencem.

Além desses fundamentos, cada plataforma valoriza sinais diferentes. Veja o que importa e onde.

---

## Google AI Overviews

O Google AI Overviews extrai dados do próprio índice do Google e se baseia fortemente em sinais E-E-A-T (Experiência, Expertise, Autoridade, Confiabilidade). Eles aparecem em aproximadamente 45% das buscas do Google.

**O que torna o Google AI Overviews diferente:** Eles já têm seus sinais de SEO tradicional — backlinks, autoridade de página, relevância temática. A camada adicional de IA acrescenta uma preferência por conteúdo com fontes citadas e dados estruturados. Pesquisas mostram que incluir citações autoritativas no seu conteúdo se correlaciona com um aumento de 132% na visibilidade, e escrever com um tom autoritativo (não de vendas) adiciona outros 89%.

**É importante destacar que os AI Overviews não simplesmente reciclam o Top 10 tradicional.** Apenas cerca de 15% das fontes dos AI Overviews se sobrepõem com os resultados orgânicos convencionais. Páginas que não chegariam à primeira página na busca tradicional ainda podem ser citadas se tiverem dados estruturados sólidos e respostas claras e extraíveis.

**No que focar:**
- Schema markup é a alavanca mais poderosa — schemas de Article, FAQPage, HowTo e Product fornecem aos AI Overviews contexto estruturado para trabalhar (aumento de 30-40% na visibilidade)
- Construir autoridade temática por meio de clusters de conteúdo com forte linkagem interna
- Incluir citações nomeadas e com fonte no seu conteúdo (não apenas afirmações)
- Biografias de autores com credenciais reais importam — E-E-A-T tem peso significativo
- Entrar no Google Knowledge Graph quando possível (uma entrada precisa na Wikipedia ajuda)
- Focar em padrões de consulta "como fazer" e "o que é" — estes ativam AI Overviews com mais frequência

---

## ChatGPT

A busca na web do ChatGPT usa um índice baseado no Bing. Ele combina isso com seu conhecimento de treinamento para gerar respostas e, em seguida, cita as fontes web nas quais se baseou.

**O que torna o ChatGPT diferente:** A autoridade de domínio importa mais aqui do que em outras plataformas de IA. Uma análise da SE Ranking de 129.000 domínios descobriu que sinais de autoridade e credibilidade representam cerca de 40% do que determina a citação, com a qualidade do conteúdo em torno de 35% e a confiança na plataforma em 25%. Sites com contagens muito altas de domínios de referência (350K+) têm em média 8,4 citações por resposta, enquanto sites com pontuações de confiança ligeiramente menores (91-96 vs. 97-100) caem de 8,4 para 6 citações.

**A atualidade é um diferencial importante.** Conteúdo atualizado nos últimos 30 dias é citado cerca de 3,2x mais do que conteúdo mais antigo. O ChatGPT claramente favorece informações recentes.

**O sinal mais importante é a adequação conteúdo-resposta** — uma análise da ZipTie de 400.000 páginas descobriu que o quanto o estilo e a estrutura do seu conteúdo correspondem ao próprio formato de resposta do ChatGPT representa cerca de 55% da probabilidade de citação. Isso é muito mais importante do que a autoridade de domínio (12%) ou a estrutura on-page (14%) isoladamente. Escreva da forma como o ChatGPT responderia à pergunta e você tem mais chance de ser a fonte que ele cita.

**Onde o ChatGPT busca além do seu site:** A Wikipedia representa 7,8% de todas as citações do ChatGPT, o Reddit 1,8% e o Forbes 1,1%. Sites oficiais de marcas são citados com frequência, mas menções de terceiros têm peso significativo.

**No que focar:**
- Investir em backlinks e autoridade de domínio — é o sinal base mais forte
- Atualizar conteúdo competitivo pelo menos mensalmente
- Estruturar seu conteúdo da forma como o ChatGPT estrutura suas respostas (conversacional, direto, bem organizado)
- Incluir estatísticas verificáveis com fontes nomeadas
- Hierarquia de títulos clara (H1 > H2 > H3) com títulos descritivos

---

## Perplexity

O Perplexity sempre cita suas fontes com links clicáveis, tornando-se a plataforma de busca por IA mais transparente. Ele combina seu próprio índice com o do Google e executa os resultados por múltiplas etapas de reranking — recuperação inicial de relevância, depois pontuação de fatores de ranking tradicionais, depois avaliação de qualidade baseada em ML que pode descartar conjuntos inteiros de resultados se não atenderem aos limites de qualidade.

**O que torna o Perplexity diferente:** É o mecanismo de busca por IA mais "orientado à pesquisa", e seu comportamento de citação reflete isso. O Perplexity mantém listas selecionadas de domínios autoritativos (Amazon, GitHub, grandes sites acadêmicos) que recebem aumentos de ranking inerentes. Ele usa um algoritmo de decaimento de tempo que avalia conteúdo novo rapidamente, dando aos novos publicadores uma real chance de citação.

**O Perplexity tem preferências únicas de conteúdo:**
- **FAQ Schema (JSON-LD)** — Páginas com dados estruturados de FAQ são citadas notavelmente com mais frequência
- **Documentos PDF** — PDFs acessíveis publicamente (whitepapers, relatórios de pesquisa) são priorizados. Se você tem conteúdo autoritativo em PDF bloqueado por um formulário, considere disponibilizar uma versão pública
- **Velocidade de publicação** — Com que frequência você publica importa mais do que o direcionamento de palavras-chave
- **Parágrafos autossuficientes** — O Perplexity prefere parágrafos atômicos e semanticamente completos que pode extrair de forma limpa

**No que focar:**
- Permitir o PerplexityBot no robots.txt
- Implementar schema FAQPage em qualquer página com conteúdo de perguntas e respostas
- Hospedar recursos em PDF publicamente (whitepapers, guias, relatórios)
- Adicionar schema Article com timestamps de publicação e modificação
- Escrever em parágrafos claros e autossuficientes que funcionem como respostas independentes
- Construir autoridade temática profunda no seu nicho específico

---

## Microsoft Copilot

O Copilot está integrado em todo o ecossistema Microsoft — Edge, Windows, Microsoft 365 e Bing Search. Ele depende inteiramente do índice do Bing, portanto, se o Bing não indexou seu conteúdo, o Copilot não pode citá-lo.

**O que torna o Copilot diferente:** A conexão com o ecossistema Microsoft cria oportunidades únicas de otimização. Menções e conteúdo no LinkedIn e GitHub fornecem aumentos de ranking que outras plataformas não oferecem. O Copilot também dá mais peso à velocidade da página — tempos de carregamento abaixo de 2 segundos são um limiar claro.

**No que focar:**
- Enviar seu site para o Bing Webmaster Tools (muitos sites enviam apenas para o Google Search Console)
- Usar o protocolo IndexNow para indexação mais rápida de conteúdo novo e atualizado
- Otimizar a velocidade da página para menos de 2 segundos
- Escrever definições claras de entidades — quando seu conteúdo define um termo ou conceito, torne a definição explícita e extraível
- Construir presença no LinkedIn (publicar artigos, manter página da empresa) e no GitHub, se relevante
- Garantir que o Bingbot tenha acesso completo de rastreamento

---

## Claude

O Claude usa o Brave Search como backend de busca quando a busca na web está habilitada — não o Google, não o Bing. Este é um índice completamente diferente, o que significa que a sua visibilidade no Brave Search determina diretamente se o Claude pode encontrar e citá-lo.

**O que torna o Claude diferente:** O Claude é extremamente seletivo sobre o que cita. Embora processe quantidades enormes de conteúdo, sua taxa de citação é muito baixa — ele procura o conteúdo mais preciso factualmente e bem referenciado sobre um determinado tema. Conteúdo rico em dados com números específicos e atribuição clara tem desempenho significativamente melhor do que conteúdo de uso geral.

**No que focar:**
- Verificar se seu conteúdo aparece nos resultados do Brave Search (pesquise sua marca e termos-chave em search.brave.com)
- Permitir os user agents ClaudeBot e anthropic-ai no robots.txt
- Maximizar a densidade factual — números específicos, fontes nomeadas, estatísticas com data
- Usar estrutura clara e extraível com títulos descritivos
- Citar fontes autoritativas dentro do seu conteúdo
- Buscar ser a fonte mais factualmente precisa sobre o seu tema — o Claude recompensa a precisão

---

## Permitindo Bots de IA no robots.txt

Se o seu robots.txt bloquear um bot de IA, essa plataforma não poderá citar seu conteúdo. Aqui estão os user agents para permitir:

```
User-agent: GPTBot           # OpenAI — powers ChatGPT search
User-agent: ChatGPT-User     # ChatGPT browsing mode
User-agent: PerplexityBot    # Perplexity AI search
User-agent: ClaudeBot        # Anthropic Claude
User-agent: anthropic-ai     # Anthropic Claude (alternate)
User-agent: Google-Extended   # Google Gemini and AI Overviews
User-agent: Bingbot          # Microsoft Copilot (via Bing)
Allow: /
```

**Treinamento vs. busca:** Alguns bots de IA são usados tanto para treinamento de modelos quanto para citação em busca. Se você deseja ser citado, mas não quer que seu conteúdo seja usado para treinamento, suas opções são limitadas — o GPTBot lida com ambos para a OpenAI. No entanto, você pode bloquear o **CCBot** (Common Crawl) com segurança sem afetar nenhuma citação de busca por IA, pois ele é usado apenas para coleta de datasets de treinamento.

---

## Por Onde Começar

Se você está otimizando para busca por IA pela primeira vez, foque seu esforço onde seu público realmente está:

**Comece com o Google AI Overviews** — Eles alcançam mais usuários (45%+ das buscas do Google) e você provavelmente já tem a base de SEO do Google em vigor. Adicione schema markup, inclua fontes citadas no seu conteúdo e fortaleça os sinais E-E-A-T.

**Em seguida, aborde o ChatGPT** — É a ferramenta de busca por IA independente mais usada para públicos de tecnologia e negócios. Foque na atualidade (atualizar conteúdo mensalmente), autoridade de domínio e adequar a estrutura do seu conteúdo à forma como o ChatGPT formata suas respostas.

**Depois, expanda para o Perplexity** — Especialmente valioso se seu público inclui pesquisadores, early adopters ou profissionais de tecnologia. Adicione schema FAQ, publique recursos em PDF e escreva em parágrafos claros e autossuficientes.

**Copilot e Claude são prioridade menor** a menos que seu público seja mais corporativo/Microsoft (Copilot) ou desenvolvedor/analista (Claude). Mas os fundamentos — conteúdo estruturado, fontes citadas, schema markup — ajudam em todas as plataformas.

**Ações que ajudam em todas as plataformas:**
1. Permitir todos os bots de IA no robots.txt
2. Implementar schema markup (FAQPage, Article, Organization no mínimo)
3. Incluir estatísticas com fontes nomeadas no seu conteúdo
4. Atualizar conteúdo regularmente — mensalmente para tópicos competitivos
5. Usar estrutura clara de títulos (H1 > H2 > H3)
6. Manter o tempo de carregamento da página abaixo de 2 segundos
7. Adicionar biografias de autores com credenciais
