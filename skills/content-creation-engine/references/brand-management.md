# Brand Management Reference

Detailed setup and workflows for managing brand profiles in the content creation engine.

---

## Full Supabase Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Brands
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  primary_color TEXT,
  secondary_colors JSONB DEFAULT '[]',
  typography JSONB DEFAULT '{}',
  tone_of_voice TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Brand Guidelines (file uploads)
CREATE TABLE brand_guidelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'image', 'text')),
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Brand Narratives (versioned)
CREATE TABLE brand_narratives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id),
  title TEXT,
  copy TEXT,
  layout_html TEXT,
  image_prompts JSONB DEFAULT '[]',
  template_id UUID REFERENCES templates(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'exported', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Project Exports
CREATE TABLE project_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  format TEXT NOT NULL,
  file_url TEXT NOT NULL,
  exported_at TIMESTAMPTZ DEFAULT now()
);

-- Templates
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id),
  name TEXT NOT NULL,
  layout_html TEXT,
  custom_hints TEXT,
  output_format TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_narratives ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users see only their own data)
CREATE POLICY "Users own brands" ON brands
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own guidelines via brand" ON brand_guidelines
  FOR ALL USING (
    brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
  );

CREATE POLICY "Users own narratives via brand" ON brand_narratives
  FOR ALL USING (
    brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid())
  );

CREATE POLICY "Users own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own exports via project" ON project_exports
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users own templates" ON templates
  FOR ALL USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brands_updated_at BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Supabase Storage Setup

```
Bucket: brand-assets (public: false)

Folder structure:
{user_id}/
  brands/
    {brand_id}/
      guidelines/       ← uploaded PDFs, images, text files
      exports/          ← generated PDFs, PNGs, ZIPs
```

```sql
-- Storage bucket policy (Supabase dashboard or SQL)
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-assets', 'brand-assets', false);

CREATE POLICY "Users manage own brand assets"
ON storage.objects FOR ALL
USING (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## Brand Profile Data Examples

### Typography JSON Structure
```json
{
  "fontFamily": "Inter, system-ui, sans-serif",
  "headingSize": "32px",
  "subheadingSize": "24px",
  "bodySize": "16px",
  "lineHeight": "1.6",
  "fontWeight": {
    "heading": "700",
    "body": "400"
  }
}
```

### Secondary Colors JSON Structure
```json
["#FF5733", "#C70039", "#F5F5F5", "#2C3E50"]
```

### Tone of Voice Examples

| Brand Type | Tone Example |
|------------|-------------|
| SaaS Startup | "Direct, jargon-free, founder-led. We talk like humans, not marketers." |
| Executive Coach | "Confident, no-fluff, actionable. Challenges conventional wisdom." |
| E-commerce | "Warm, enthusiastic, benefit-led. Makes customers feel understood." |
| Agency | "Strategic, authoritative, results-focused. Data-backed opinions." |

---

## Brand Narrative Template

```
[BRAND NAME] exists to [mission/purpose].

We serve [target audience] who [pain point or aspiration].

Unlike [alternative/competitor], we [key differentiator].

Our approach: [2-3 core beliefs or methodologies].

We've helped [social proof statement if applicable].

Core messages:
1. [Key message 1]
2. [Key message 2]
3. [Key message 3]
```

---

## React Brand Form Component

```typescript
// components/BrandForm.tsx
interface BrandFormData {
  name: string;
  description: string;
  primaryColor: string;
  secondaryColors: string[];
  typography: Typography;
  toneOfVoice: string;
}

export function BrandForm({ brand, onSave }: Props) {
  const [form, setForm] = useState<BrandFormData>(brand ?? defaultForm);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Brand name"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        required
      />

      {/* Color pickers */}
      <label>Primary Color</label>
      <input
        type="color"
        value={form.primaryColor}
        onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
      />

      {/* Secondary colors: input + tag list */}
      <SecondaryColorPicker
        colors={form.secondaryColors}
        onChange={colors => setForm(f => ({ ...f, secondaryColors: colors }))}
      />

      {/* Typography */}
      <input
        type="text"
        placeholder="Font family (e.g. Inter, Georgia)"
        value={form.typography.fontFamily}
        onChange={e => setForm(f => ({
          ...f,
          typography: { ...f.typography, fontFamily: e.target.value }
        }))}
      />

      {/* Tone of voice */}
      <textarea
        placeholder="Describe your brand's voice and tone..."
        value={form.toneOfVoice}
        onChange={e => setForm(f => ({ ...f, toneOfVoice: e.target.value }))}
        rows={4}
      />

      <button type="submit">Save Brand</button>
    </form>
  );
}
```

---

## Guidelines Upload Flow

```typescript
// Upload brand guideline file to Supabase storage
async function uploadGuideline(
  file: File,
  userId: string,
  brandId: string
): Promise<string> {
  const path = `${userId}/brands/${brandId}/guidelines/${Date.now()}_${file.name}`;

  const { error } = await supabase.storage
    .from('brand-assets')
    .upload(path, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('brand-assets')
    .getPublicUrl(path);

  // Save reference in brand_guidelines table
  await supabase.from('brand_guidelines').insert({
    brand_id: brandId,
    file_name: file.name,
    file_url: publicUrl,
    file_type: file.type.includes('pdf') ? 'pdf' :
               file.type.includes('image') ? 'image' : 'text',
  });

  return publicUrl;
}
```

---

## Brand Narrative Versioning

```typescript
// Save a new version (never overwrite — always insert)
async function saveBrandNarrative(brandId: string, content: string) {
  const { data: latest } = await supabase
    .from('brand_narratives')
    .select('version')
    .eq('brand_id', brandId)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  const nextVersion = (latest?.version ?? 0) + 1;

  await supabase.from('brand_narratives').insert({
    brand_id: brandId,
    content,
    version: nextVersion,
  });
}

// Fetch latest version
async function getLatestNarrative(brandId: string) {
  const { data } = await supabase
    .from('brand_narratives')
    .select('content, version, created_at')
    .eq('brand_id', brandId)
    .order('version', { ascending: false })
    .limit(1)
    .single();
  return data;
}
```

---

## Multi-Brand Patterns

For users managing multiple brands (e.g., agency or founder with multiple projects):

- Always show brand selector at top of every page (sticky)
- Color-code brands in the selector dropdown
- Show brand's primary color as accent in the UI while that brand is active
- "Last used brand" persists in localStorage for fast return
- Brand-specific default export formats configurable in brand settings
