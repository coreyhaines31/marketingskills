# EDM Layout Templates

Complete HTML templates for common EDM types. Copy, adapt, and send.

---

## Template 1: Minimal Newsletter

Clean, text-forward newsletter template. Best for weekly digests and content roundups.

```html
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Newsletter</title>
  <style type="text/css">
    body { margin: 0; padding: 0; background-color: #f4f4f4; }
    table { border-collapse: collapse; }
    img { border: 0; display: block; }
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .hero-text { font-size: 26px !important; }
      .body-padding { padding: 20px !important; }
    }
  </style>
</head>
<body>

<!-- Preheader -->
<span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  {{preheader_text}} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
</span>

<!-- Wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4">
<tr><td align="center" style="padding: 20px 0;">

  <!-- Container -->
  <table class="container" width="600" cellpadding="0" cellspacing="0" border="0"
         style="max-width:600px; width:100%; background-color:#ffffff;">

    <!-- Header -->
    <tr>
      <td style="padding: 24px 32px; border-bottom: 1px solid #e8e8e8;">
        <img src="{{logo_url}}" alt="{{company_name}}" height="32" style="height:32px;">
      </td>
    </tr>

    <!-- Hero Section -->
    <tr>
      <td class="body-padding" style="padding: 40px 32px 24px;">
        <h1 class="hero-text"
            style="margin:0 0 16px; font-family:Arial,Helvetica,sans-serif;
                   font-size:32px; font-weight:bold; line-height:1.2; color:#1a1a1a;">
          {{headline}}
        </h1>
        <p style="margin:0; font-family:Arial,Helvetica,sans-serif;
                  font-size:18px; line-height:1.6; color:#555555;">
          {{sub_headline}}
        </p>
      </td>
    </tr>

    <!-- Body Copy -->
    <tr>
      <td class="body-padding" style="padding: 0 32px 32px;">
        <p style="margin:0 0 16px; font-family:Arial,Helvetica,sans-serif;
                  font-size:16px; line-height:1.7; color:#333333;">
          {{body_paragraph_1}}
        </p>
        <p style="margin:0 0 24px; font-family:Arial,Helvetica,sans-serif;
                  font-size:16px; line-height:1.7; color:#333333;">
          {{body_paragraph_2}}
        </p>

        <!-- CTA Button -->
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          href="{{cta_url}}"
          style="height:50px;v-text-anchor:middle;width:180px;"
          arcsize="8%" stroke="f" fillcolor="#0066FF">
          <w:anchorlock/>
          <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">
            {{cta_text}}
          </center>
        </v:roundrect>
        <![endif]-->
        <!--[if !mso]><!-->
        <a href="{{cta_url}}"
           style="background-color:#0066FF;border-radius:4px;color:#ffffff;
                  display:inline-block;font-family:Arial,Helvetica,sans-serif;
                  font-size:16px;font-weight:bold;line-height:50px;
                  text-align:center;text-decoration:none;width:180px;
                  -webkit-text-size-adjust:none;">
          {{cta_text}}
        </a>
        <!--<![endif]-->
      </td>
    </tr>

    <!-- Divider -->
    <tr>
      <td style="padding: 0 32px;">
        <hr style="border:none;border-top:1px solid #e8e8e8;margin:0;">
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:24px 32px;text-align:center;
                 font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;">
        <p style="margin:0 0 8px;">© 2026 {{company_name}}. All rights reserved.</p>
        <p style="margin:0 0 8px;">{{company_address}}</p>
        <p style="margin:0;">
          <a href="{{unsubscribe_url}}" style="color:#999999;text-decoration:underline;">Unsubscribe</a>
          &nbsp;·&nbsp;
          <a href="{{preferences_url}}" style="color:#999999;text-decoration:underline;">Update preferences</a>
        </p>
      </td>
    </tr>

  </table>
  <!-- /Container -->

</td></tr>
</table>
<!-- /Wrapper -->

</body>
</html>
```

---

## Template 2: Hero-Led Promotional

Bold hero image or color block, strong CTA above the fold. Best for launches, offers, and campaigns.

```html
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Promotional Email</title>
  <style type="text/css">
    body { margin: 0; padding: 0; background-color: #f4f4f4; }
    table { border-collapse: collapse; }
    img { border: 0; display: block; max-width: 100%; }
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .hero-headline { font-size: 28px !important; }
      .col-2 { display: block !important; width: 100% !important; }
      .col-2-inner { padding: 0 !important; }
      .hide-mobile { display: none !important; }
    }
  </style>
</head>
<body>

<!-- Preheader -->
<span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  {{preheader_text}} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
</span>

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4">
<tr><td align="center" style="padding: 20px 0;">

  <table class="container" width="600" cellpadding="0" cellspacing="0" border="0"
         style="max-width:600px;width:100%;background-color:#ffffff;">

    <!-- Header -->
    <tr>
      <td bgcolor="{{brand_color}}" style="padding:20px 32px;">
        <img src="{{logo_url_white}}" alt="{{company_name}}" height="28" style="height:28px;">
      </td>
    </tr>

    <!-- Hero Image -->
    <tr>
      <td>
        <a href="{{cta_url}}">
          <img src="{{hero_image_url}}" alt="{{hero_image_alt}}"
               width="600" style="width:100%;display:block;">
        </a>
      </td>
    </tr>

    <!-- Hero Copy -->
    <tr>
      <td bgcolor="{{brand_color}}" style="padding:32px 32px 40px;text-align:center;">
        <h1 class="hero-headline"
            style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;
                   font-size:36px;font-weight:bold;line-height:1.2;color:#ffffff;">
          {{hero_headline}}
        </h1>
        <p style="margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;
                  font-size:18px;line-height:1.5;color:rgba(255,255,255,0.85);">
          {{hero_sub_headline}}
        </p>

        <!-- Hero CTA -->
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          href="{{cta_url}}"
          style="height:54px;v-text-anchor:middle;width:220px;"
          arcsize="6%" stroke="f" fillcolor="#ffffff">
          <w:anchorlock/>
          <center style="color:{{brand_color}};font-family:Arial,sans-serif;font-size:17px;font-weight:bold;">
            {{cta_text}}
          </center>
        </v:roundrect>
        <![endif]-->
        <!--[if !mso]><!-->
        <a href="{{cta_url}}"
           style="background-color:#ffffff;border-radius:4px;color:{{brand_color}};
                  display:inline-block;font-family:Arial,Helvetica,sans-serif;
                  font-size:17px;font-weight:bold;line-height:54px;
                  text-align:center;text-decoration:none;width:220px;
                  -webkit-text-size-adjust:none;">
          {{cta_text}}
        </a>
        <!--<![endif]-->
      </td>
    </tr>

    <!-- 2-Column Feature Section -->
    <tr>
      <td style="padding:40px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <!-- Feature 1 -->
            <td class="col-2" width="48%" valign="top" style="width:48%;">
              <div class="col-2-inner" style="padding-right:16px;">
                <img src="{{feature1_icon}}" alt="" width="48" height="48"
                     style="width:48px;height:48px;margin-bottom:12px;">
                <h3 style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;
                            font-size:18px;font-weight:bold;color:#1a1a1a;">
                  {{feature1_headline}}
                </h3>
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;
                           font-size:15px;line-height:1.6;color:#555555;">
                  {{feature1_copy}}
                </p>
              </div>
            </td>

            <!-- Spacer -->
            <td class="hide-mobile" width="4%" style="width:4%;"></td>

            <!-- Feature 2 -->
            <td class="col-2" width="48%" valign="top" style="width:48%;">
              <div class="col-2-inner" style="padding-left:16px;">
                <img src="{{feature2_icon}}" alt="" width="48" height="48"
                     style="width:48px;height:48px;margin-bottom:12px;">
                <h3 style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;
                            font-size:18px;font-weight:bold;color:#1a1a1a;">
                  {{feature2_headline}}
                </h3>
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;
                           font-size:15px;line-height:1.6;color:#555555;">
                  {{feature2_copy}}
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Testimonial Block -->
    <tr>
      <td bgcolor="#f8f9fa" style="padding:32px;text-align:center;">
        <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:18px;
                  line-height:1.6;color:#333333;font-style:italic;">
          "{{testimonial_quote}}"
        </p>
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;
                  font-size:14px;color:#777777;font-weight:bold;">
          — {{testimonial_name}}, {{testimonial_title}}
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:24px 32px;text-align:center;
                 font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;">
        <p style="margin:0 0 8px;">© 2026 {{company_name}}. All rights reserved.</p>
        <p style="margin:0 0 8px;">{{company_address}}</p>
        <p style="margin:0;">
          <a href="{{unsubscribe_url}}" style="color:#999999;text-decoration:underline;">Unsubscribe</a>
          &nbsp;·&nbsp;
          <a href="{{preferences_url}}" style="color:#999999;text-decoration:underline;">Update preferences</a>
          &nbsp;·&nbsp;
          <a href="{{view_in_browser_url}}" style="color:#999999;text-decoration:underline;">View in browser</a>
        </p>
      </td>
    </tr>

  </table>

</td></tr>
</table>

</body>
</html>
```

---

## Template 3: 3-Column Product Showcase

Grid layout for product features, pricing tiers, or content categories.

```html
<!-- 3-Column Section (use inside full template wrapper) -->
<tr>
  <td style="padding: 40px 24px;">
    <h2 style="margin:0 0 24px;text-align:center;font-family:Arial,Helvetica,sans-serif;
               font-size:24px;font-weight:bold;color:#1a1a1a;">
      {{section_headline}}
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <!-- Column 1 -->
        <td width="31%" valign="top" style="width:31%;padding:0 8px 0 0;">
          <img src="{{item1_image}}" alt="{{item1_alt}}" width="172"
               style="width:100%;border-radius:4px;margin-bottom:12px;">
          <h3 style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;
                      font-size:16px;font-weight:bold;color:#1a1a1a;">
            {{item1_title}}
          </h3>
          <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;
                     font-size:14px;line-height:1.5;color:#555555;">
            {{item1_description}}
          </p>
          <a href="{{item1_url}}"
             style="color:#0066FF;font-family:Arial,Helvetica,sans-serif;
                    font-size:14px;font-weight:bold;text-decoration:none;">
            {{item1_cta}} →
          </a>
        </td>

        <!-- Spacer -->
        <td width="3%" style="width:3%;"></td>

        <!-- Column 2 -->
        <td width="31%" valign="top" style="width:31%;padding:0 4px;">
          <img src="{{item2_image}}" alt="{{item2_alt}}" width="172"
               style="width:100%;border-radius:4px;margin-bottom:12px;">
          <h3 style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;
                      font-size:16px;font-weight:bold;color:#1a1a1a;">
            {{item2_title}}
          </h3>
          <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;
                     font-size:14px;line-height:1.5;color:#555555;">
            {{item2_description}}
          </p>
          <a href="{{item2_url}}"
             style="color:#0066FF;font-family:Arial,Helvetica,sans-serif;
                    font-size:14px;font-weight:bold;text-decoration:none;">
            {{item2_cta}} →
          </a>
        </td>

        <!-- Spacer -->
        <td width="3%" style="width:3%;"></td>

        <!-- Column 3 -->
        <td width="31%" valign="top" style="width:31%;padding:0 0 0 8px;">
          <img src="{{item3_image}}" alt="{{item3_alt}}" width="172"
               style="width:100%;border-radius:4px;margin-bottom:12px;">
          <h3 style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;
                      font-size:16px;font-weight:bold;color:#1a1a1a;">
            {{item3_title}}
          </h3>
          <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;
                     font-size:14px;line-height:1.5;color:#555555;">
            {{item3_description}}
          </p>
          <a href="{{item3_url}}"
             style="color:#0066FF;font-family:Arial,Helvetica,sans-serif;
                    font-size:14px;font-weight:bold;text-decoration:none;">
            {{item3_cta}} →
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

---

## Reusable Section Blocks

### Image + Text (Left Image)
```html
<tr>
  <td style="padding: 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="40%" valign="top" style="width:40%;padding-right:24px;">
          <img src="{{image_url}}" alt="{{image_alt}}" width="200"
               style="width:100%;border-radius:6px;">
        </td>
        <td width="60%" valign="middle" style="width:60%;">
          <h3 style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;
                      font-size:20px;font-weight:bold;color:#1a1a1a;">
            {{section_headline}}
          </h3>
          <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;
                     font-size:15px;line-height:1.6;color:#555555;">
            {{section_copy}}
          </p>
          <a href="{{link_url}}"
             style="color:#0066FF;font-family:Arial,Helvetica,sans-serif;
                    font-size:15px;font-weight:bold;text-decoration:none;">
            {{link_text}} →
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

### Stat / Highlight Bar
```html
<tr>
  <td bgcolor="{{brand_color_light}}" style="padding:32px;text-align:center;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="33%" style="text-align:center;border-right:1px solid rgba(0,0,0,0.1);">
          <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;
                     font-size:36px;font-weight:bold;color:{{brand_color}};">
            {{stat1_number}}
          </p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;
                     font-size:13px;color:#666666;">
            {{stat1_label}}
          </p>
        </td>
        <td width="33%" style="text-align:center;border-right:1px solid rgba(0,0,0,0.1);">
          <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;
                     font-size:36px;font-weight:bold;color:{{brand_color}};">
            {{stat2_number}}
          </p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;
                     font-size:13px;color:#666666;">
            {{stat2_label}}
          </p>
        </td>
        <td width="33%" style="text-align:center;">
          <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;
                     font-size:36px;font-weight:bold;color:{{brand_color}};">
            {{stat3_number}}
          </p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;
                     font-size:13px;color:#666666;">
            {{stat3_label}}
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

### Divider with Label
```html
<tr>
  <td style="padding:8px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="border-top:1px solid #e8e8e8;"></td>
        <td style="padding:0 16px;white-space:nowrap;
                   font-family:Arial,Helvetica,sans-serif;font-size:12px;
                   font-weight:bold;text-transform:uppercase;color:#999999;
                   letter-spacing:1px;">
          {{section_label}}
        </td>
        <td style="border-top:1px solid #e8e8e8;"></td>
      </tr>
    </table>
  </td>
</tr>
```

---

## Token Reference

Standard personalization tokens across major ESPs:

| Purpose | Mailchimp | Klaviyo | Customer.io | HubSpot |
|---------|-----------|---------|-------------|---------|
| First name | `*\|FNAME\|*` | `{{ first_name }}` | `{{customer.first_name}}` | `{{contact.firstname}}` |
| Email | `*\|EMAIL\|*` | `{{ email }}` | `{{customer.email}}` | `{{contact.email}}` |
| Unsubscribe | `*\|UNSUB\|*` | `{{ unsubscribe_url }}` | `{{unsubscribe_url}}` | `{{{unsubscribeLink}}}` |
| Current date | `*\|DATE:d F Y\|*` | `{{ "now" | date: "%B %d, %Y" }}` | `{% now "%B %d, %Y" %}` | N/A |
