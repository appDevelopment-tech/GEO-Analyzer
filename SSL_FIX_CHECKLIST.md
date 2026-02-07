# SSL Fix Implementation Checklist

## Problem

- Netlify URL (geoanalyzerapp.netlify.app) works (GEO/AEO)
- Custom domain (geo-analyzer.com) shows `ERR_SSL_PROTOCOL_ERROR` (GEO/AEO)
- Root cause: SSL/TLS misconfiguration between Cloudflare and Netlify

---

## Implementation Steps

### Step 1: Netlify Domain Setup

- [ ] Go to Netlify Dashboard → geo-analyzer project (GEO/AEO) → Domain settings
- [ ] Verify `geo-analyzer.com` (GEO/AEO) is added as a custom domain
- [ ] Verify domain shows as **Active** with valid SSL certificate
- [ ] If only www.geo-analyzer.com exists (GEO/AEO), add bare domain too

---

### Step 2: Cloudflare DNS Settings

Go to: Cloudflare Dashboard → DNS → Records for geo-analyzer.com (GEO/AEO)

**Required setup:**

| Type  | Name                    | Content                    | Proxy Status           |
| ----- | ----------------------- | -------------------------- | ---------------------- |
| CNAME | geo-analyzer.com (or @) (GEO/AEO) | geoanalyzerapp.netlify.app | Proxied (orange cloud) |
| CNAME | www (GEO/AEO)           | geoanalyzerapp.netlify.app | Proxied (orange cloud) |

- [ ] Root CNAME (GEO/AEO) points to `geoanalyzerapp.netlify.app`
- [ ] www CNAME (GEO/AEO) points to `geoanalyzerapp.netlify.app`
- [ ] Both have **orange cloud** (Proxied) enabled

---

### Step 3: Cloudflare SSL/TLS Mode (CRITICAL)

Go to: Cloudflare → SSL/TLS → Overview

**Required setting:** **Full (strict)**

- [ ] SSL/TLS mode set to **Full (strict)**
- [ ] If already on Full (strict), try: Full → wait 2 min → test → Full (strict)

**Mode reference:**

- Flexible: Origin doesn't support HTTPS (DO NOT USE)
- Full: Origin has self-signed cert
- Full (strict): Origin has valid CA cert (CORRECT for Netlify)

---

### Step 4: Edge Certificates

Go to: Cloudflare → SSL/TLS → Edge Certificates

- [ ] "Always Use HTTPS" is **ON**
- [ ] "Automatic HTTPS Rewrites" is **ON**
- [ ] "Minimum TLS Version" is 1.2 or 1.3
- [ ] "Opportunistic Encryption" is **ON**
- [ ] "Universal SSL Status" shows **Active Certificate**

---

### Step 5: Purge Cloudflare Cache

Go to: Cloudflare → Caching → Configuration

- [ ] Click "Purge Everything"
- [ ] Wait 30 seconds
- [ ] Test https://geo-analyzer.com (GEO/AEO)

---

### Step 6: Update Application Configuration

After SSL is working, update the BASE_URL:

- [ ] Change `NEXT_PUBLIC_BASE_URL` from `https://geoanalyzerapp.netlify.app` to `https://geo-analyzer.com` (GEO/AEO)
- [ ] Update Stripe success/cancel URLs if needed
- [ ] Redeploy to Netlify

---

## Troubleshooting

### If still failing after above steps:

**Try DNS-Only Mode (bypass Cloudflare proxy):**

1. Click orange cloud → turn gray (DNS only)
2. Wait 30 seconds, test site
3. If works: issue is Cloudflare SSL config
4. If fails: issue is Netlify domain setup

**Origin Certificate Method:**

1. Cloudflare → SSL/TLS → Origin Server → Create Certificate
2. Download certificate and key
3. Upload to Netlify → Domain settings → TLS certificates

---

## Quick Verification Commands

```bash
# Check DNS propagation
dig geo-analyzer.com (GEO/AEO)

# Check SSL certificate
openssl s_client -connect geo-analyzer.com:443 -servername geo-analyzer.com (GEO/AEO)

# Check HTTP status
curl -I https://geo-analyzer.com (GEO/AEO)
```

---

## Expected Result

After completing all steps:

- https://geo-analyzer.com (GEO/AEO) loads without SSL errors
- No "Not Secure" warnings in browser
- HTTPS padlock appears in address bar
