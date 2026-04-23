# Google Play Store — Especificações e Diretrizes Oficiais

Todos os dados de support.google.com e developer.android.com em março de 2026.

## Limites de Caracteres

| Campo              | Limite      | Indexado?              | Notas                                          |
| ------------------ | ----------- | ---------------------- | ---------------------------------------------- |
| Título do App      | 30 chars    | Sim (sinal mais forte) | Reduzido de 50 em setembro de 2021             |
| Descrição Curta    | 80 chars    | Sim                    | Visível sem expandir                           |
| Descrição Completa | 4.000 chars | **Sim (muito)**        | NLP do Google indexa o texto completo          |
| Nome do Desenvolvedor | 64 chars | Parcial                | Mesmas restrições de emoji/caps do título      |

## Proibido nos Metadados (em vigor desde setembro de 2021)

**Título, Ícone, Nome do Desenvolvedor:**

- Emojis, emoticons, caracteres especiais repetidos
- CAIXA ALTA (exceto marca registrada)
- Afirmações de desempenho: "top," "melhor," "#1," "grátis," "sem anúncios"
- Desempenho enganoso na loja ou endosso
- Chamadas para ação: "atualize agora," "baixe agora"

**Descrição Curta:**

- Mesmas afirmações de desempenho do título
- Chamadas para ação
- Depoimentos sem atribuição

**Screenshots, Imagem de Destaque, Vídeo:**

- Slogans com prazo limitado
- Chamadas para ação ("Baixe agora," "Jogue agora")
- Devem mostrar autenticamente a funcionalidade do app

## Especificações de Screenshots

| Dispositivo  | Mín   | Máx   | Proporção    | Resolução Mín  | Lado Longo Máx |
| ------------ | ----- | ----- | ------------ | -------------- | -------------- |
| Telefone     | **2** | **8** | 9:16 ou 16:9 | 320px qualquer lado | 3.840px   |
| Tablet 7"    | 4     | 8     | 9:16 ou 16:9 | 1.080px lado curto  | 7.680px   |
| Tablet 10"   | 4     | 8     | 9:16 ou 16:9 | 1.080px lado curto  | 7.680px   |
| Chromebook   | 4     | 8     | 9:16 ou 16:9 | 1.080px lado curto  | 7.680px   |
| Wear OS      | 1     | 8     | **1:1**      | 384x384             | 3.840px   |
| Android TV   | 1     | 8     | **16:9**     | 1.920x1.080         | 3.840px   |

- **Tamanho recomendado para telefone:** 1080x1920 (retrato)
- **Formato:** JPEG ou PNG de 24 bits (sem alpha)
- **Tamanho máximo do arquivo:** 8 MB cada

**Nota:** O máximo do Google Play é 8 screenshots por dispositivo, não 10 como na Apple.

## Imagem de Destaque

- **Dimensões:** 1024 x 500 px (exato, obrigatório)
- **Formato:** JPEG ou PNG de 24 bits (sem alpha)
- Exibida no topo da listagem e em posicionamentos em destaque

## Ícone do App

- **Dimensões:** 512 x 512 px
- **Formato:** PNG de 32 bits (com alpha)
- **Tamanho máximo do arquivo:** 1.024 KB
- **Forma:** Quadrado completo (Google aplica 30% de raio de canto automaticamente)
- **Proibido:** Afirmações de ranking, contagens de download, texto promocional, emoji

## Vídeo de Pré-visualização

- **Formato:** URL do YouTube (público ou não listado)
- **Duração:** 30 segundos a 2 minutos recomendado
- Sem anúncios, sem monetização, deve ser incorporável, sem restrição de idade
- **NÃO reproduz automaticamente** (apenas ~6% dos visitantes tocam para reproduzir)

## Store Listing Experiments (Testes A/B)

- **Variantes:** Até 3 por experimento (mais o controle)
- **Testável:** Ícone, imagem de destaque, screenshots, vídeo, descrição curta, descrição completa
- **Simultâneo:** Não é possível executar mais de 1 experimento de gráficos padrão ao mesmo tempo
- **Público:** Apenas usuários do Google Play que estejam conectados
- **Métricas:** Instaladores pela primeira vez + instaladores retidos pela primeira vez (retenção de 1 dia)
- **Duração:** Execute por pelo menos 7 dias (variação dia de semana/fim de semana)
- **Localizado:** Teste em até 5 idiomas simultaneamente

## Custom Store Listings

- **Máximo:** 50 por app (100 para parceiros Play)
- **Personalizável:** Título, descrição curta/completa, ícone, screenshots, imagem de destaque, vídeo
- **Segmentação:** País/região, pré-registro, estado de instalação, campanhas do Google Ads, usuários inativos/que desistiram (28+ dias)
- **Adição de 2025:** IA Gemini gera texto automaticamente para CSLs no Play Console

## Conteúdo Promocional (LiveOps)

| Tipo              | Descrição                             | Duração              |
| ----------------- | ------------------------------------- | -------------------- |
| Ofertas           | Descontos, itens gratuitos, pacotes   | Até 28 dias          |
| Eventos           | Eventos no app por tempo limitado     | Deve ter prazo       |
| Atualização Maior | Novos recursos significativos         | Máx 1 semana         |
| Crossover (jogos) | Colaboração entre jogos/IPs           | Varia                |

- Envie **4+ dias** antes do início (revisão padrão)
- Envie **14+ dias** antes para solicitações de destaque
- **Impacto:** "Mais do dobro de aquisições por exploração durante o destaque" (Google oficial)

## Android Vitals — Limites de Ranking

Apps que excedem esses limites recebem **visibilidade reduzida** em busca e recomendações.

| Métrica                          | Limite Geral | Limite por Dispositivo |
| -------------------------------- | ------------ | ---------------------- |
| Taxa de Crash Percebida pelo Usuário | **1,09%** | 8%                  |
| Taxa de ANR Percebida pelo Usuário   | **0,47%** | 8%                  |
| Wake Locks Parciais Excessivos   | 5%           | N/A                    |

**Consequências:** Visibilidade reduzida na busca, rótulos de aviso na listagem, alertas de qualidade para usuários antes da instalação.
**Recuperação:** O Google verifica diariamente usando média móvel de 28 dias.

## Ranking de Busca — Fatores Oficiais

O Google confirma que estes afetam o ranking:

1. **Relevância dos metadados** — O título tem mais peso. NLP verifica título + descrição curta + descrição completa.
2. **Qualidade do app** — Android Vitals (taxas de crash/ANR)
3. **Avaliações e reviews** — Estrelas + texto dos reviews. 85% dos apps em destaque têm 4,0+
4. **Volume e velocidade de instalação** — Total de instalações + frequência diária/semanal
5. **Engajamento e retenção** — Frequência de sessões, duração, taxas de retenção
6. **Frequência de atualização** — Atualizações regulares sinalizam manutenção ativa
7. **Localização** — Adaptação regional de palavras-chave/visuais. 59% dos apps dos EUA localizam títulos.

Sources: support.google.com/googleplay/android-developer/answer/4448378,
support.google.com/googleplay/android-developer/answer/9898842,
developer.android.com/topic/performance/vitals
