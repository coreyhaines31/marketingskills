# Guia de Tamanho de Amostra

Referência para calcular tamanhos de amostra e duração de testes.

## Conteúdo
- Fundamentos do Tamanho de Amostra (entradas necessárias, o que significam)
- Tabelas de Referência Rápida de Tamanho de Amostra
- Calculadora de Duração (fórmula, exemplos, regras de duração mínima, diretrizes de duração máxima)
- Calculadoras Online
- Ajuste para Múltiplas Variantes
- Erros Comuns de Tamanho de Amostra
- Quando os Requisitos de Tamanho de Amostra São Muito Altos
- Teste Sequencial
- Framework de Decisão Rápida

## Fundamentos do Tamanho de Amostra

### Entradas Necessárias

1. **Taxa de conversão de linha de base**: Sua taxa atual
2. **Efeito mínimo detectável (MDE)**: Menor mudança que vale a pena detectar
3. **Nível de significância estatística**: Geralmente 95% (α = 0,05)
4. **Poder estatístico**: Geralmente 80% (β = 0,20)

### O que Significam

**Taxa de conversão de linha de base**: Se sua página converte a 5%, essa é sua linha de base.

**MDE (Efeito Mínimo Detectável)**: A menor melhoria que você quer ser capaz de detectar. Defina com base em:
- Impacto no negócio (um lift de 5% é relevante?)
- Custo de implementação (vale o esforço?)
- Expectativas realistas (o que testes passados mostraram?)

**Significância estatística (95%)**: Significa que há menos de 5% de chance de que a diferença observada seja fruto do acaso.

**Poder estatístico (80%)**: Significa que, se houver um efeito real do tamanho do MDE, você tem 80% de chance de detectá-lo.

---

## Tabelas de Referência Rápida de Tamanho de Amostra

### Taxa de Conversão: 1%

| Lift a Detectar | Amostra por Variante | Amostra Total |
|-----------------|---------------------|---------------|
| 5% (1% → 1,05%) | 1.500.000 | 3.000.000 |
| 10% (1% → 1,1%) | 380.000 | 760.000 |
| 20% (1% → 1,2%) | 97.000 | 194.000 |
| 50% (1% → 1,5%) | 16.000 | 32.000 |
| 100% (1% → 2%) | 4.200 | 8.400 |

### Taxa de Conversão: 3%

| Lift a Detectar | Amostra por Variante | Amostra Total |
|-----------------|---------------------|---------------|
| 5% (3% → 3,15%) | 480.000 | 960.000 |
| 10% (3% → 3,3%) | 120.000 | 240.000 |
| 20% (3% → 3,6%) | 31.000 | 62.000 |
| 50% (3% → 4,5%) | 5.200 | 10.400 |
| 100% (3% → 6%) | 1.400 | 2.800 |

### Taxa de Conversão: 5%

| Lift a Detectar | Amostra por Variante | Amostra Total |
|-----------------|---------------------|---------------|
| 5% (5% → 5,25%) | 280.000 | 560.000 |
| 10% (5% → 5,5%) | 72.000 | 144.000 |
| 20% (5% → 6%) | 18.000 | 36.000 |
| 50% (5% → 7,5%) | 3.100 | 6.200 |
| 100% (5% → 10%) | 810 | 1.620 |

### Taxa de Conversão: 10%

| Lift a Detectar | Amostra por Variante | Amostra Total |
|-----------------|---------------------|---------------|
| 5% (10% → 10,5%) | 130.000 | 260.000 |
| 10% (10% → 11%) | 34.000 | 68.000 |
| 20% (10% → 12%) | 8.700 | 17.400 |
| 50% (10% → 15%) | 1.500 | 3.000 |
| 100% (10% → 20%) | 400 | 800 |

### Taxa de Conversão: 20%

| Lift a Detectar | Amostra por Variante | Amostra Total |
|-----------------|---------------------|---------------|
| 5% (20% → 21%) | 60.000 | 120.000 |
| 10% (20% → 22%) | 16.000 | 32.000 |
| 20% (20% → 24%) | 4.000 | 8.000 |
| 50% (20% → 30%) | 700 | 1.400 |
| 100% (20% → 40%) | 200 | 400 |

---

## Calculadora de Duração

### Fórmula

```
Duration (days) = (Sample per variant × Number of variants) / (Daily traffic × % exposed)
```

### Exemplos

**Cenário 1: Página de alto tráfego**
- Necessário: 10.000 por variante (2 variantes = 20.000 no total)
- Tráfego diário: 5.000 visitantes
- 100% expostos ao teste
- Duração: 20.000 / 5.000 = **4 dias**

**Cenário 2: Página de tráfego médio**
- Necessário: 30.000 por variante (60.000 no total)
- Tráfego diário: 2.000 visitantes
- 100% expostos
- Duração: 60.000 / 2.000 = **30 dias**

**Cenário 3: Baixo tráfego com exposição parcial**
- Necessário: 15.000 por variante (30.000 no total)
- Tráfego diário: 500 visitantes
- 50% expostos ao teste
- Efetivo diário: 250
- Duração: 30.000 / 250 = **120 dias** (muito longo!)

### Regras de Duração Mínima

Mesmo com tamanho de amostra suficiente, execute testes por no mínimo:
- **1 semana completa**: Para capturar variação por dia da semana
- **2 ciclos de negócio**: Se for B2B (padrões de dia útil vs. fim de semana)
- **Incluindo dias de pagamento**: Se for e-commerce (início/fim do mês)

### Diretrizes de Duração Máxima

Evite executar testes por mais de 4–8 semanas:
- Efeitos de novidade se dissipam
- Fatores externos interferem
- Custo de oportunidade de outros testes

---

## Calculadoras Online

### Ferramentas Recomendadas

**Calculadora do Evan Miller**
https://www.evanmiller.org/ab-testing/sample-size.html
- Interface simples
- Salve nos favoritos

**Calculadora da Optimizely**
https://www.optimizely.com/sample-size-calculator/
- Linguagem orientada ao negócio
- Estimativas de duração

**Calculadora do AB Test Guide**
https://www.abtestguide.com/calc/
- Inclui opção Bayesian
- Múltiplos tipos de teste

**Calculadora de Duração da VWO**
https://vwo.com/tools/ab-test-duration-calculator/
- Foco em duração
- Ideal para planejamento

---

## Ajuste para Múltiplas Variantes

Com mais de 2 variantes (testes A/B/n), você precisa de mais amostra:

| Variantes | Multiplicador |
|-----------|--------------|
| 2 (A/B) | 1x |
| 3 (A/B/C) | ~1,5x |
| 4 (A/B/C/D) | ~2x |
| 5+ | Considere reduzir as variantes |

**Por quê?** Mais comparações aumentam a chance de falsos positivos. Você está comparando:
- A vs B
- A vs C
- B vs C (às vezes)

Aplique a correção de Bonferroni ou use ferramentas que lidam com isso automaticamente.

---

## Erros Comuns de Tamanho de Amostra

### 1. Testes sub-potencializados
**Problema**: Amostra insuficiente para detectar efeitos realistas
**Solução**: Seja realista quanto ao MDE, obtenha mais tráfego ou não teste

### 2. Testes super-potencializados
**Problema**: Esperando pelo tamanho de amostra quando já há significância
**Solução**: Isso é aceitável — você se comprometeu com o tamanho de amostra, honre isso

### 3. Taxa de linha de base errada
**Problema**: Usar taxa de conversão errada para o cálculo
**Solução**: Use a métrica e a página específicas, não médias de todo o site

### 4. Ignorar segmentos
**Problema**: Calcular para o tráfego total e depois analisar segmentos
**Solução**: Se você planeja análise por segmento, calcule a amostra para o menor segmento

### 5. Testar muitas coisas
**Problema**: Dividir o tráfego em muitas partes
**Solução**: Priorize rigorosamente, execute menos testes simultâneos

---

## Quando os Requisitos de Tamanho de Amostra São Muito Altos

Opções quando você não consegue tráfego suficiente:

1. **Aumente o MDE**: Aceite detectar apenas efeitos maiores (lift de 20%+)
2. **Reduza a confiança**: Use 90% em vez de 95% (arriscado, documente isso)
3. **Reduza as variantes**: Teste apenas a variante mais promissora
4. **Combine tráfego**: Teste em múltiplas páginas semelhantes
5. **Teste mais acima no funil**: Teste mais cedo, onde o tráfego é maior
6. **Não teste**: Tome a decisão com base em dados qualitativos
7. **Teste mais longo**: Aceite uma duração maior (semanas/meses)

---

## Teste Sequencial

Se você precisar verificar os resultados antes de atingir o tamanho de amostra:

### O que é?
Método estatístico que ajusta para múltiplas verificações dos dados.

### Quando usar
- Mudanças de alto risco
- Necessidade de interromper variantes ruins antecipadamente
- Decisões sensíveis ao tempo

### Ferramentas que suportam
- Optimizely (Stats Accelerator)
- VWO (SmartStats)
- PostHog (abordagem Bayesian)

### Troca
- Mais flexibilidade para encerrar antes
- Requisito de tamanho de amostra levemente maior
- Análise mais complexa

---

## Framework de Decisão Rápida

### Posso executar este teste?

```
Daily traffic to page: _____
Baseline conversion rate: _____
MDE I care about: _____

Sample needed per variant: _____ (from tables above)
Days to run: Sample / Daily traffic = _____

If days > 60: Consider alternatives
If days > 30: Acceptable for high-impact tests
If days < 14: Likely feasible
If days < 7: Easy to run, consider running longer anyway
```
