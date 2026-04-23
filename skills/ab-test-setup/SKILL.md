---
name: ab-test-setup
description: When the user wants to plan, design, or implement an A/B test or experiment, or build a growth experimentation program. Also use when the user mentions "A/B test," "split test," "experiment," "test this change," "variant copy," "multivariate test," "hypothesis," "should I test this," "which version is better," "test two versions," "statistical significance," "how long should I run this test," "growth experiments," "experiment velocity," "experiment backlog," "ICE score," "experimentation program," or "experiment playbook." Use this whenever someone is comparing two approaches and wants to measure which performs better, or when they want to build a systematic experimentation practice. For tracking implementation, see analytics-tracking. For page-level conversion optimization, see page-cro.
metadata:
  version: 1.2.0
---

# Configuração de Teste A/B

Você é um especialista em experimentação e testes A/B. Seu objetivo é ajudar a projetar testes que produzam resultados estatisticamente válidos e acionáveis.

## Avaliação Inicial

**Verifique o contexto de marketing do produto primeiro:**
Se `.agents/product-marketing-context.md` existir (ou `.claude/product-marketing-context.md` em configurações mais antigas), leia-o antes de fazer perguntas. Use esse contexto e pergunte apenas sobre informações não cobertas ou específicas desta tarefa.

Antes de projetar um teste, entenda:

1. **Contexto do Teste** - O que você está tentando melhorar? Qual mudança está considerando?
2. **Estado Atual** - Taxa de conversão de linha de base? Volume de tráfego atual?
3. **Restrições** - Complexidade técnica? Prazo? Ferramentas disponíveis?

---

## Princípios Fundamentais

### 1. Comece com uma Hipótese
- Não apenas "vamos ver o que acontece"
- Previsão específica do resultado
- Baseada em raciocínio ou dados

### 2. Teste Uma Coisa
- Uma única variável por teste
- Caso contrário, você não saberá o que funcionou

### 3. Rigor Estatístico
- Determine o tamanho de amostra com antecedência
- Não faça peeking nem interrompa cedo
- Comprometa-se com a metodologia

### 4. Meça o que Importa
- Métrica principal vinculada ao valor do negócio
- Métricas secundárias para contexto
- Métricas de guarda-chuva para prevenir danos

---

## Framework de Hipótese

### Estrutura

```
Because [observation/data],
we believe [change]
will cause [expected outcome]
for [audience].
We'll know this is true when [metrics].
```

### Exemplo

**Fraca**: "Mudar a cor do botão pode aumentar os cliques."

**Forte**: "Como os usuários relatam dificuldade em encontrar o CTA (por heatmaps e feedback), acreditamos que tornar o botão maior e usar cor contrastante aumentará os cliques no CTA em 15%+ para novos visitantes. Mediremos a taxa de cliques da visualização da página até o início do cadastro."

---

## Tipos de Teste

| Tipo | Descrição | Tráfego Necessário |
|------|-----------|-------------------|
| A/B | Duas versões, mudança única | Moderado |
| A/B/n | Múltiplas variantes | Alto |
| MVT | Múltiplas mudanças em combinações | Muito alto |
| Split URL | URLs diferentes para cada variante | Moderado |

---

## Tamanho de Amostra

### Referência Rápida

| Linha de Base | Lift de 10% | Lift de 20% | Lift de 50% |
|---------------|-------------|-------------|-------------|
| 1% | 150k/variante | 39k/variante | 6k/variante |
| 3% | 47k/variante | 12k/variante | 2k/variante |
| 5% | 27k/variante | 7k/variante | 1,2k/variante |
| 10% | 12k/variante | 3k/variante | 550/variante |

**Calculadoras:**
- [Evan Miller's](https://www.evanmiller.org/ab-testing/sample-size.html)
- [Optimizely's](https://www.optimizely.com/sample-size-calculator/)

**Para tabelas detalhadas de tamanho de amostra e cálculos de duração**: Veja [references/sample-size-guide.md](references/sample-size-guide.md)

---

## Seleção de Métricas

### Métrica Principal
- Única métrica mais importante
- Diretamente vinculada à hipótese
- O que você usará para encerrar o teste

### Métricas Secundárias
- Apoiam a interpretação da métrica principal
- Explicam por que/como a mudança funcionou

### Métricas de Guarda-chuva
- Coisas que não devem piorar
- Interrompa o teste se forem significativamente negativas

### Exemplo: Teste de Página de Preços
- **Principal**: Taxa de seleção de plano
- **Secundárias**: Tempo na página, distribuição de planos
- **Guarda-chuva**: Tickets de suporte, taxa de reembolso

---

## Projetando Variantes

### O que Variar

| Categoria | Exemplos |
|-----------|----------|
| Títulos/Texto | Ângulo da mensagem, proposta de valor, especificidade, tom |
| Design Visual | Layout, cor, imagens, hierarquia |
| CTA | Texto do botão, tamanho, posicionamento, quantidade |
| Conteúdo | Informações incluídas, ordem, quantidade, prova social |

### Boas Práticas
- Mudança única e significativa
- Ousada o suficiente para fazer diferença
- Fiel à hipótese

---

## Distribuição de Tráfego

| Abordagem | Divisão | Quando Usar |
|-----------|---------|-------------|
| Padrão | 50/50 | Padrão para A/B |
| Conservadora | 90/10, 80/20 | Limitar risco de variante ruim |
| Gradual | Começa pequeno, aumenta | Mitigação de risco técnico |

**Considerações:**
- Consistência: usuários veem a mesma variante ao retornar
- Exposição equilibrada ao longo do dia/semana

---

## Implementação

### Lado do Cliente (Client-Side)
- JavaScript modifica a página após o carregamento
- Rápido de implementar, pode causar flicker
- Ferramentas: PostHog, Optimizely, VWO

### Lado do Servidor (Server-Side)
- Variante determinada antes da renderização
- Sem flicker, requer trabalho de desenvolvimento
- Ferramentas: PostHog, LaunchDarkly, Split

---

## Executando o Teste

### Checklist Pré-Lançamento
- [ ] Hipótese documentada
- [ ] Métrica principal definida
- [ ] Tamanho de amostra calculado
- [ ] Variantes implementadas corretamente
- [ ] Rastreamento verificado
- [ ] QA concluído em todas as variantes

### Durante o Teste

**FAÇA:**
- Monitore problemas técnicos
- Verifique a qualidade dos segmentos
- Documente fatores externos

**Evite:**
- Verificar resultados antes do prazo e interromper cedo
- Fazer alterações nas variantes
- Adicionar tráfego de novas fontes

### O Problema do Peeking
Verificar os resultados antes de atingir o tamanho de amostra e interromper cedo leva a falsos positivos e decisões erradas. Comprometa-se com o tamanho de amostra e confie no processo.

---

## Analisando Resultados

### Significância Estatística
- 95% de confiança = p-valor < 0,05
- Significa menos de 5% de chance de o resultado ser aleatório
- Não é uma garantia — apenas um limiar

### Checklist de Análise

1. **Atingiu o tamanho de amostra?** Se não, o resultado é preliminar
2. **É estatisticamente significativo?** Verifique os intervalos de confiança
3. **O tamanho do efeito é relevante?** Compare com o MDE e projete o impacto
4. **Métricas secundárias são consistentes?** Apoiam a principal?
5. **Preocupações com guarda-chuva?** Algo piorou?
6. **Diferenças por segmento?** Mobile vs. desktop? Novos vs. recorrentes?

### Interpretando Resultados

| Resultado | Conclusão |
|-----------|-----------|
| Vencedor significativo | Implementar a variante |
| Perdedor significativo | Manter o controle, aprender o motivo |
| Sem diferença significativa | Precisa de mais tráfego ou teste mais ousado |
| Sinais mistos | Aprofunde a análise, talvez por segmento |

---

## Documentação

Documente cada teste com:
- Hipótese
- Variantes (com capturas de tela)
- Resultados (amostra, métricas, significância)
- Decisão e aprendizados

**Para templates**: Veja [references/test-templates.md](references/test-templates.md)

---

## Programa de Experimentação para Crescimento

Testes individuais têm valor. Um programa de experimentação contínua é um ativo com ganhos compostos. Esta seção cobre como executar experimentos como um motor de crescimento contínuo, não apenas testes pontuais.

### O Loop de Experimentação

```
1. Generate hypotheses (from data, research, competitors, customer feedback)
2. Prioritize with ICE scoring
3. Design and run the test
4. Analyze results with statistical rigor
5. Promote winners to a playbook
6. Generate new hypotheses from learnings
→ Repeat
```

### Geração de Hipóteses

Alimente seu backlog de experimentos com múltiplas fontes:

| Fonte | O que Observar |
|-------|----------------|
| Analytics | Pontos de abandono, páginas de baixa conversão, segmentos com desempenho abaixo |
| Pesquisa com clientes | Dores, confusões, expectativas não atendidas |
| Análise de concorrentes | Funcionalidades, mensagens ou padrões de UX que eles usam e você não |
| Tickets de suporte | Perguntas ou reclamações recorrentes sobre fluxos de conversão |
| Heatmaps/gravações | Onde os usuários hesitam, clicam com raiva ou abandonam |
| Experimentos passados | Testes "perdedores significativos" frequentemente revelam novos ângulos a explorar |

### Priorização ICE

Pontue cada hipótese de 1 a 10 em três dimensões:

| Dimensão | Pergunta |
|----------|----------|
| **Impacto** | Se funcionar, quanto vai mover a métrica principal? |
| **Confiança** | Quão certos estamos de que vai funcionar? (Baseado em dados, não em intuição.) |
| **Facilidade** | Quão rápido e barato conseguimos lançar e medir isso? |

**Pontuação ICE** = (Impacto + Confiança + Facilidade) / 3

Execute primeiro os experimentos com maior pontuação. Reavalie mensalmente conforme o contexto muda.

### Velocidade de Experimentação

Acompanhe sua taxa de experimentação como indicador antecedente de crescimento:

| Métrica | Meta |
|---------|------|
| Experimentos lançados por mês | 4–8 para a maioria dos times |
| Taxa de sucesso | 20–30% é comum para programas maduros (taxas consistentemente maiores podem indicar hipóteses conservadoras) |
| Duração média do teste | 2–4 semanas |
| Profundidade do backlog | 20+ hipóteses enfileiradas |
| Lift acumulado | Ganhos compostos de todos os vencedores |

### O Playbook de Experimentos

Quando um teste vence, não apenas implemente — documente o padrão:

```
## [Experiment Name]
**Date**: [date]
**Hypothesis**: [the hypothesis]
**Sample size**: [n per variant]
**Result**: [winner/loser/inconclusive] — [primary metric] changed by [X%] (95% CI: [range], p=[value])
**Guardrails**: [any guardrail metrics and their outcomes]
**Segment deltas**: [notable differences by device, segment, or cohort]
**Why it worked/failed**: [analysis]
**Pattern**: [the reusable insight — e.g., "social proof near pricing CTAs increases plan selection"]
**Apply to**: [other pages/flows where this pattern might work]
**Status**: [implemented / parked / needs follow-up test]
```

Com o tempo, seu playbook se torna uma biblioteca de padrões de crescimento comprovados, específicos para o seu produto e público.

### Cadência de Experimentação

**Semanal (30 min)**: Revise os experimentos em andamento para problemas técnicos e métricas de guarda-chuva. Não encerre vencedores antes do prazo — mas interrompa testes onde as métricas de guarda-chuva estejam significativamente negativas.

**Quinzenal**: Conclua os experimentos finalizados. Analise os resultados, atualize o playbook e lance o próximo experimento do backlog.

**Mensal (1 hora)**: Revise velocidade de experimentação, taxa de sucesso e lift acumulado. Reabastece o backlog de hipóteses. Repriorize com o ICE.

**Trimestral**: Faça uma auditoria do playbook. Quais padrões foram amplamente aplicados? Quais padrões vencedores ainda não foram escalados? Quais áreas do funil estão sendo pouco testadas?

---

## Erros Comuns

### Design do Teste
- Testar uma mudança pequena demais (indetectável)
- Testar muitas coisas ao mesmo tempo (não consegue isolar)
- Sem hipótese clara

### Execução
- Interromper cedo
- Fazer alterações no meio do teste
- Não verificar a implementação

### Análise
- Ignorar os intervalos de confiança
- Selecionar segmentos a dedo
- Superinterpretar resultados inconclusivos

---

## Perguntas Específicas da Tarefa

1. Qual é sua taxa de conversão atual?
2. Quanto tráfego essa página recebe?
3. Qual mudança você está considerando e por quê?
4. Qual é a menor melhoria que vale a pena detectar?
5. Quais ferramentas você tem para testes?
6. Você já testou essa área antes?

---

## Skills Relacionadas

- **page-cro**: Para gerar ideias de testes com base em princípios de CRO
- **analytics-tracking**: Para configurar a medição dos testes
- **copywriting**: Para criar texto das variantes
