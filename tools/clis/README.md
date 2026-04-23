# Marketing CLIs

Ferramentas CLI em arquivo único e sem dependências para plataformas de marketing que não oferecem a sua própria.

Cada CLI é um script Node.js autônomo (Node 18+) sem necessidade de `npm install` — basta `chmod +x` e usar.

## Instalação

### Opção 1: Executar diretamente

```bash
node tools/clis/ahrefs.js backlinks list --target example.com
```

### Opção 2: Symlink para acesso global

```bash
# Crie um symlink para qualquer CLI que queira disponível globalmente
ln -sf "$(pwd)/tools/clis/ahrefs.js" ~/.local/bin/ahrefs
ln -sf "$(pwd)/tools/clis/resend.js" ~/.local/bin/resend

# Depois use diretamente
ahrefs backlinks list --target example.com
resend send --from you@example.com --to them@example.com --subject "Hello" --html "<p>Hi</p>"
```

### Opção 3: Adicionar o diretório inteiro ao PATH

```bash
export PATH="$PATH:/path/to/marketingskills/tools/clis"
```

## Autenticação

Cada CLI lê credenciais a partir de variáveis de ambiente:

| CLI | Environment Variable |
|-----|---------------------|
| `activecampaign` | `ACTIVECAMPAIGN_API_KEY`, `ACTIVECAMPAIGN_API_URL` |
| `adobe-analytics` | `ADOBE_ACCESS_TOKEN`, `ADOBE_CLIENT_ID`, `ADOBE_COMPANY_ID` |
| `ahrefs` | `AHREFS_API_KEY` |
| `amplitude` | `AMPLITUDE_API_KEY`, `AMPLITUDE_SECRET_KEY` |
| `apollo` | `APOLLO_API_KEY` |
| `beehiiv` | `BEEHIIV_API_KEY` |
| `brevo` | `BREVO_API_KEY` |
| `buffer` | `BUFFER_API_KEY` |
| `calendly` | `CALENDLY_API_KEY` |
| `clearbit` | `CLEARBIT_API_KEY` |
| `customer-io` | `CUSTOMERIO_APP_KEY` (App API), `CUSTOMERIO_SITE_ID` + `CUSTOMERIO_API_KEY` (Track API) |
| `dataforseo` | `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD` |
| `demio` | `DEMIO_API_KEY`, `DEMIO_API_SECRET` |
| `dub` | `DUB_API_KEY` |
| `g2` | `G2_API_TOKEN` |
| `ga4` | `GA4_ACCESS_TOKEN` |
| `google-ads` | `GOOGLE_ADS_TOKEN`, `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CUSTOMER_ID` |
| `google-search-console` | `GSC_ACCESS_TOKEN` |
| `hotjar` | `HOTJAR_CLIENT_ID`, `HOTJAR_CLIENT_SECRET` |
| `intercom` | `INTERCOM_API_KEY` |
| `keywords-everywhere` | `KEYWORDS_EVERYWHERE_API_KEY` |
| `kit` | `KIT_API_KEY`, `KIT_API_SECRET` |
| `klaviyo` | `KLAVIYO_API_KEY` |
| `linkedin-ads` | `LINKEDIN_ACCESS_TOKEN` |
| `livestorm` | `LIVESTORM_API_TOKEN` |
| `mailchimp` | `MAILCHIMP_API_KEY` |
| `mention-me` | `MENTIONME_API_KEY` |
| `meta-ads` | `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID` |
| `mixpanel` | `MIXPANEL_TOKEN` (ingestion), `MIXPANEL_API_KEY` + `MIXPANEL_SECRET` (query) |
| `onesignal` | `ONESIGNAL_REST_API_KEY`, `ONESIGNAL_APP_ID` |
| `optimizely` | `OPTIMIZELY_API_KEY` |
| `paddle` | `PADDLE_API_KEY`, `PADDLE_SANDBOX` (optional) |
| `partnerstack` | `PARTNERSTACK_PUBLIC_KEY`, `PARTNERSTACK_SECRET_KEY` |
| `plausible` | `PLAUSIBLE_API_KEY`, `PLAUSIBLE_BASE_URL` (optional, for self-hosted) |
| `postmark` | `POSTMARK_API_KEY` |
| `resend` | `RESEND_API_KEY` |
| `rewardful` | `REWARDFUL_API_KEY` |
| `savvycal` | `SAVVYCAL_API_KEY` |
| `segment` | `SEGMENT_WRITE_KEY` (tracking), `SEGMENT_ACCESS_TOKEN` (profile) |
| `semrush` | `SEMRUSH_API_KEY` |
| `sendgrid` | `SENDGRID_API_KEY` |
| `tiktok-ads` | `TIKTOK_ACCESS_TOKEN`, `TIKTOK_ADVERTISER_ID` |
| `tolt` | `TOLT_API_KEY` |
| `trustpilot` | `TRUSTPILOT_API_KEY`, `TRUSTPILOT_API_SECRET`, `TRUSTPILOT_BUSINESS_UNIT_ID` |
| `typeform` | `TYPEFORM_API_KEY` |
| `hunter` | `HUNTER_API_KEY` |
| `instantly` | `INSTANTLY_API_KEY` |
| `lemlist` | `LEMLIST_API_KEY` |
| `snov` | `SNOV_CLIENT_ID`, `SNOV_CLIENT_SECRET` |
| `wistia` | `WISTIA_API_KEY` |
| `zapier` | `ZAPIER_API_KEY` |

## Segurança

**Nunca insira chaves de API ou tokens diretamente nos scripts.** Todos os CLIs leem credenciais exclusivamente a partir de variáveis de ambiente.

- Armazene as chaves no perfil do seu shell (`~/.zshrc`, `~/.bashrc`) ou em um arquivo `.env`
- O arquivo `.env` está no gitignore — mas verifique antes de fazer commit
- Use `--dry-run` em qualquer comando para visualizar a requisição sem enviá-la (credenciais são mascaradas como `***`)
- Se você fizer um fork deste repositório, audite seus commits para garantir que nenhum segredo está incluído

## Padrão de Comandos

Todos os CLIs seguem a mesma estrutura:

```
{tool} <resource> <action> [options]
```

Exemplos:

```bash
ahrefs backlinks list --target example.com --limit 50
semrush keywords overview --phrase "marketing automation" --database us
mailchimp campaigns list --limit 20
resend send --from you@example.com --to them@example.com --subject "Hello" --html "<p>Hi</p>"
dub links create --url https://example.com/landing --key summer-sale
```

## Saída

Todos os CLIs produzem JSON no stdout para fácil encadeamento:

```bash
# Encadear com jq
ahrefs backlinks list --target example.com | jq '.backlinks[].url_from'

# Salvar em arquivo
semrush keywords overview --phrase "saas marketing" --database us > keywords.json

# Usar em scripts
DOMAINS=$(rewardful affiliates list | jq -r '.data[].email')
```

## CLIs Disponíveis

| CLI | Categoria | Ferramenta |
|-----|----------|------|
| `activecampaign.js` | Email/CRM | [ActiveCampaign](https://activecampaign.com) |
| `adobe-analytics.js` | Analytics | [Adobe Analytics](https://business.adobe.com/products/analytics) |
| `ahrefs.js` | SEO | [Ahrefs](https://ahrefs.com) |
| `amplitude.js` | Analytics | [Amplitude](https://amplitude.com) |
| `apollo.js` | Enriquecimento de Dados | [Apollo.io](https://apollo.io) |
| `beehiiv.js` | Newsletter | [Beehiiv](https://beehiiv.com) |
| `brevo.js` | Email/SMS | [Brevo](https://brevo.com) |
| `buffer.js` | Social | [Buffer](https://buffer.com) |
| `calendly.js` | Agendamento | [Calendly](https://calendly.com) |
| `clearbit.js` | Enriquecimento de Dados | [Clearbit](https://clearbit.com) |
| `customer-io.js` | Email | [Customer.io](https://customer.io) |
| `dataforseo.js` | SEO | [DataForSEO](https://dataforseo.com) |
| `demio.js` | Webinar | [Demio](https://demio.com) |
| `dub.js` | Links | [Dub.co](https://dub.co) |
| `g2.js` | Avaliações | [G2](https://g2.com) |
| `ga4.js` | Analytics | [Google Analytics 4](https://analytics.google.com) |
| `google-ads.js` | Anúncios | [Google Ads](https://ads.google.com) |
| `google-search-console.js` | SEO | [Google Search Console](https://search.google.com/search-console) |
| `hotjar.js` | CRO | [Hotjar](https://hotjar.com) |
| `hunter.js` | Prospecção por Email | [Hunter.io](https://hunter.io) |
| `instantly.js` | Prospecção por Email | [Instantly.ai](https://instantly.ai) |
| `intercom.js` | Mensagens | [Intercom](https://intercom.com) |
| `keywords-everywhere.js` | SEO | [Keywords Everywhere](https://keywordseverywhere.com) |
| `kit.js` | Email | [Kit](https://kit.com) |
| `klaviyo.js` | Email/SMS | [Klaviyo](https://klaviyo.com) |
| `lemlist.js` | Prospecção por Email | [Lemlist](https://lemlist.com) |
| `linkedin-ads.js` | Anúncios | [LinkedIn Ads](https://business.linkedin.com/marketing-solutions/ads) |
| `livestorm.js` | Webinar | [Livestorm](https://livestorm.co) |
| `mailchimp.js` | Email | [Mailchimp](https://mailchimp.com) |
| `mention-me.js` | Indicação | [Mention Me](https://www.mention-me.com) |
| `meta-ads.js` | Anúncios | [Meta Ads](https://www.facebook.com/business/ads) |
| `mixpanel.js` | Analytics | [Mixpanel](https://mixpanel.com) |
| `onesignal.js` | Push | [OneSignal](https://onesignal.com) |
| `optimizely.js` | Testes A/B | [Optimizely](https://optimizely.com) |
| `paddle.js` | Pagamentos | [Paddle](https://paddle.com) |
| `partnerstack.js` | Afiliados | [PartnerStack](https://partnerstack.com) |
| `plausible.js` | Analytics | [Plausible](https://plausible.io) |
| `postmark.js` | Email | [Postmark](https://postmarkapp.com) |
| `resend.js` | Email | [Resend](https://resend.com) |
| `rewardful.js` | Indicação | [Rewardful](https://www.getrewardful.com) |
| `savvycal.js` | Agendamento | [SavvyCal](https://savvycal.com) |
| `segment.js` | Analytics | [Segment](https://segment.com) |
| `semrush.js` | SEO | [SEMrush](https://semrush.com) |
| `sendgrid.js` | Email | [SendGrid](https://sendgrid.com) |
| `snov.js` | Prospecção por Email | [Snov.io](https://snov.io) |
| `tiktok-ads.js` | Anúncios | [TikTok Ads](https://ads.tiktok.com) |
| `tolt.js` | Indicação | [Tolt](https://tolt.io) |
| `trustpilot.js` | Avaliações | [Trustpilot](https://trustpilot.com) |
| `typeform.js` | Formulários | [Typeform](https://typeform.com) |
| `wistia.js` | Vídeo | [Wistia](https://wistia.com) |
| `zapier.js` | Automação | [Zapier](https://zapier.com) |
