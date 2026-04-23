# Template de Relatório de ASO Audit

Use esta estrutura para todos os relatórios de ASO audit.

---

## Cabeçalho

```
# ASO Audit: {App Name}
**Store:** {Apple App Store / Google Play}
**URL:** {listing URL}
**Audit date:** {date}
**Brand tier:** {Dominant / Established / Challenger} — {one-line justification}
**Overall Score:** {score}/100 (Grade: {A/B/C/D/F})
```

---

## Tabela de Pontuação

```
| Dimension | Score | Grade | Key Issue |
|-----------|-------|-------|-----------|
| Title & Subtitle | X/10 | {grade} | {one-line summary} |
| Description | X/10 | {grade} | {one-line summary} |
| Visual Assets | X/10 | {grade} | {one-line summary} |
| Ratings & Reviews | X/10 | {grade} | {one-line summary} |
| Metadata & Freshness | X/10 | {grade} | {one-line summary} |
| Conversion Signals | X/10 | {grade} | {one-line summary} |
| **OVERALL** | **{weighted}/100** | **{grade}** | |
```

Escala de notas por dimensão: 9-10 = A, 7-8 = B, 5-6 = C, 3-4 = D, 1-2 = F

---

## Top 3 Vitórias Rápidas

Mudanças de maior impacto que levam menos de 1 hora:

```
### 1. {Verbo de ação} — {mudança específica}
**Impact:** {High/Medium} | **Effort:** {<15 min / <30 min / <1 hour}
**Current:** {o que é agora}
**Recommended:** {substituição exata, com contagem de caracteres}
**Why:** {uma frase explicando o impacto}

### 2. ...
### 3. ...
```

---

## Análise Detalhada

### Análise de Título e Subtítulo

```
**Current title:** "{title}" ({X}/30 chars used)
**Current subtitle/short desc:** "{subtitle}" ({X}/30 ou /80 chars used)

**Problemas encontrados:**
- {problema 1}
- {problema 2}

**Recommended title:** "{new title}" ({X}/30 chars) — {justificativa}
**Recommended subtitle:** "{new subtitle}" ({X}/30 ou /80 chars) — {justificativa}
```

### Análise de Descrição

```
**Primeiras 3 linhas (acima da dobra):**
> {texto citado}

**Problemas encontrados:**
- {problema 1}
- {problema 2}

**Keyword density (Google Play only):** {X}% — alvo: 2-3%
**Principais palavras-chave encontradas:** {keyword1} (Xn), {keyword2} (Xn), ...
**Palavras-chave de alto valor ausentes:** {keyword1}, {keyword2}, ...

**Primeiras 3 linhas recomendadas:**
> {texto reescrito}
```

### Análise de Ativos Visuais

```
**Screenshots:** {count} ({store} mostra os primeiros {3/todos} na busca)
**Preview video:** {Sim/Não}
**Avaliação do ícone:** {descrição}
**Feature graphic (Google Play):** {Sim/Não}

**Auditoria de screenshots:**
1. {descrição do screenshot 1} — {aprovado/problema}
2. {descrição do screenshot 2} — {aprovado/problema}
...

**Recomendações:**
- {mudança visual específica 1}
- {mudança visual específica 2}
```

### Análise de Avaliações e Reviews

```
**Avaliação média:** {X.X} estrelas ({count} avaliações)
**Sentimento dos reviews recentes:** {Positivo/Misto/Negativo}
**Reclamações comuns:** {tema1}, {tema2}
**Respostas do desenvolvedor:** {Sim, ativo / Esporádico / Nenhum}

**Recomendações:**
- {ação específica 1}
- {ação específica 2}
```

### Metadados e Atualidade

```
**Última atualização:** {data} ({X dias/meses atrás})
**Localizações:** {count} idiomas
**Categoria:** {categoria atual}
**Eventos no app/LiveOps:** {Sim/Não}

**Recomendações:**
- {ação específica 1}
- {ação específica 2}
```

### Sinais de Conversão

```
**Modelo de preço:** {Gratuito / Freemium / Pago}
**Quantidade de IAPs:** {count}
**Downloads (Google Play):** {faixa}
**Prova social visível:** {prêmios, imprensa, selos — ou "nenhum"}

**Recomendações:**
- {ação específica 1}
- {ação específica 2}
```

---

## Sugestões de Palavras-Chave

```
| Palavra-chave | Justificativa | Onde Colocar | Prioridade |
|---------------|---------------|--------------|------------|
| {keyword} | {por que esta palavra-chave} | {title/subtitle/description/keyword field} | {High/Med/Low} |
| ... | ... | ... | ... |
```

Nota: Sem ferramentas de ASO pagas, o volume exato de busca não está disponível. Estas
sugestões são baseadas na análise de categoria, metadados dos concorrentes e
relevância semântica. Valide com AppTweak, Sensor Tower ou MobileAction para dados de volume.

---

## Comparação com Concorrentes (se aplicável)

```
| Métrica | {Seu App} | {Concorrente 1} | {Concorrente 2} |
|---------|-----------|-----------------|-----------------|
| Palavras-chave no título | ... | ... | ... |
| Avaliação | ... | ... | ... |
| Screenshots | ... | ... | ... |
| Vídeo | ... | ... | ... |
| Palavras-chave na descrição | ... | ... | ... |
| Última atualização | ... | ... | ... |
| Pontuação geral de ASO | ... | ... | ... |
```

---

## Plano de Ação Priorizado

Ordenado por impacto (alto para baixo), agrupado por esforço:

```
### Faça Esta Semana (Vitórias Rápidas)
1. {ação} — {impacto esperado}
2. {ação} — {impacto esperado}

### Faça Este Mês (Esforço Médio)
3. {ação} — {impacto esperado}
4. {ação} — {impacto esperado}

### Planeje para o Próximo Trimestre (Alto Esforço)
5. {ação} — {impacto esperado}
6. {ação} — {impacto esperado}
```

---

## Limitações

Sempre inclua esta seção:

> **O que esta auditoria não consegue medir sem ferramentas de ASO pagas:**
>
> - Volume exato de busca por palavra-chave e pontuações de dificuldade
> - Posições históricas de ranking de palavras-chave
> - Estimativas de downloads e receita
> - Conteúdo do campo de palavras-chave da Apple (oculto da visualização pública)
> - Dados de taxa de conversão de instalação (disponíveis apenas para o proprietário do app no console)
> - Resultados de testes A/B de experimentos anteriores
>
> Para esses pontos de dados, considere usar AppTweak ($69/mês), Sensor Tower ou
> MobileAction ($69/mês).
