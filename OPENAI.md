# Uso con ChatGPT y OpenAI Codex

Este fork está preparado para usar las habilidades de marketing en superficies distintas de OpenAI sin depender de Claude Code.

## Diferencia entre ChatGPT y Codex

| Producto | Para qué sirve | Cómo usa las habilidades |
|---|---|---|
| ChatGPT | Trabajo conversacional, análisis, creación de contenido y flujos de negocio | Instala Skills desde la interfaz o usa archivos en un Proyecto/GPT personalizado |
| Codex | Trabajo sobre repositorios, archivos, terminal y código | Descubre Skills instaladas en rutas compatibles y sigue `AGENTS.md` |

Los dos productos pueden usar el estándar `SKILL.md`, pero la instalación y el acceso a herramientas son diferentes.

## 1. ChatGPT con Personal Skills

Cuando tu cuenta o workspace tenga habilitada la función:

1. Abre **Plugins** en la barra lateral.
2. Entra a **Skills**.
3. Selecciona **Create**.
4. Selecciona **Upload from your computer**.
5. Sube el ZIP de una habilidad.
6. Revisa el resultado del análisis de seguridad.
7. Instala la habilidad.

Después, ChatGPT puede activarla automáticamente o puedes seleccionarla explícitamente mediante `@`.

### Crear paquetes subibles

Desde la raíz del repositorio:

```bash
python tools/package_chatgpt_skills.py --skill emails
python tools/package_chatgpt_skills.py --skill revops analytics cro
python tools/package_chatgpt_skills.py --all
```

La salida se guarda en:

```text
dist/chatgpt/
```

Cada ZIP contiene una sola habilidad y coloca `SKILL.md` en la raíz del paquete.

## 2. ChatGPT sin Personal Skills

Cuando no aparezca **Plugins → Skills**, usa un **Proyecto** o un **GPT personalizado**.

### Archivos recomendados

Carga solamente las habilidades necesarias:

```text
skills/product-marketing/SKILL.md
skills/revops/SKILL.md
skills/emails/SKILL.md
skills/analytics/SKILL.md
skills/cro/SKILL.md
skills/copywriting/SKILL.md
skills/copy-editing/SKILL.md
skills/customer-research/SKILL.md
skills/social/SKILL.md
skills/ads/SKILL.md
chatgpt/INSTRUCTIONS.md
```

Añade también tu documento de contexto:

```text
product-marketing.md
```

### Configuración del Proyecto o GPT

Usa `chatgpt/INSTRUCTIONS.md` como instrucciones principales. Ese archivo hace que ChatGPT:

- Identifique la habilidad adecuada.
- Revise el contexto del producto.
- Combine habilidades cuando la tarea lo requiera.
- Distinga estrategia de ejecución.
- Verifique información actual cuando sea necesario.
- Entregue resultados listos para usar.

### Evita cargar todo sin necesidad

Subir decenas de habilidades a un solo GPT puede reducir la precisión de selección y consumir contexto innecesariamente. Crea conjuntos por uso:

- **CRM y automatización:** `product-marketing`, `revops`, `emails`, `analytics`
- **Contenido:** `product-marketing`, `copywriting`, `copy-editing`, `social`
- **Conversión:** `product-marketing`, `cro`, `signup`, `onboarding`, `ab-testing`
- **Paid media:** `product-marketing`, `ads`, `ad-creative`, `analytics`
- **Investigación:** `customer-research`, `competitor-profiling`, `competitors`

## 3. OpenAI Codex

### Instalación por proyecto

Ejecuta dentro de la carpeta del proyecto:

```bash
npx skills add THEGACCI/marketingskills -a codex
```

### Instalación global

```bash
npx skills add THEGACCI/marketingskills -a codex -g
```

### Habilidades específicas

```bash
npx skills add THEGACCI/marketingskills -a codex \
  --skill product-marketing revops emails analytics cro
```

### Uso en Codex

Puedes solicitar:

```text
Usa las skills product-marketing, revops y analytics para diseñar un modelo de scoring de leads y el plan de medición.
```

Codex también debe leer el `AGENTS.md` del repositorio antes de modificar archivos.

## 4. `AGENTS.md`, `SKILL.md` e instrucciones de ChatGPT

- `AGENTS.md`: reglas para trabajar dentro del repositorio. Codex lo utiliza como contexto operativo.
- `skills/<nombre>/SKILL.md`: flujo reutilizable de una especialidad.
- `chatgpt/INSTRUCTIONS.md`: enrutador para Proyectos y GPTs personalizados.
- `.agents/product-marketing.md`: contexto reutilizable de marca y producto en proyectos locales.
- `product-marketing.md`: equivalente recomendado como archivo de conocimiento en ChatGPT.

## 5. Contexto mínimo de producto

El documento de contexto debe incluir:

1. Marca y empresa.
2. Productos y servicios.
3. Mercado y ubicación.
4. Segmentos y perfiles.
5. Problemas, motivaciones y objeciones.
6. Propuesta de valor.
7. Diferenciadores.
8. Voz y tono.
9. Canales.
10. Restricciones.
11. Métricas objetivo.
12. Herramientas disponibles.

## 6. Compatibilidad y seguridad

- Mantén las instrucciones compartidas libres de sintaxis exclusiva de un proveedor.
- No incluyas claves API, contraseñas, tokens ni datos personales en las habilidades.
- Revisa scripts y archivos antes de subirlos a ChatGPT.
- Una habilidad no concede acceso automático a Gmail, HubSpot, Google Drive u otras herramientas.
- El acceso real depende de las apps, conectores y permisos disponibles en la cuenta.
- No afirmes que una acción fue ejecutada si solo se produjo una recomendación o un borrador.

## 7. Actualizaciones

Para actualizar tu fork desde el proyecto original:

```bash
git remote add upstream https://github.com/coreyhaines31/marketingskills.git
git fetch upstream
git merge upstream/main
```

Después de actualizar, vuelve a generar los paquetes de ChatGPT.
