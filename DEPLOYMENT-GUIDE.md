# Deployment Guide - Subdomain Routing on Vercel

This guide explains how to deploy the project with subdomain routing where:
- `www.propsanchal.com` → IRCTC Booking Checker
- `tools.propsanchal.com` → Multi-Tool Editor

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier works)
- Domain name (propsanchal.com)
- Access to domain DNS settings

## 🚀 Step-by-Step Deployment

### Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit with subdomain routing"

# Add remote repository
git remote add origin https://github.com/yourusername/your-repo.git

# Push to GitHub
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Click "Deploy" (Vercel will auto-detect settings)

### Step 3: Configure Custom Domains

#### Add Main Domain (www.propsanchal.com)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add domain: `www.propsanchal.com`
4. Add domain: `propsanchal.com` (redirect to www)
5. Vercel will provide DNS records

#### Add Subdomain (tools.propsanchal.com)

1. Still in "Domains" section
2. Add domain: `tools.propsanchal.com`
3. Vercel will provide DNS records

### Step 4: Update DNS Records

Go to your domain provider (GoDaddy, Namecheap, Cloudflare, etc.) and add these records:

#### For Main Domain

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### For Subdomain

```
Type: CNAME
Name: tools
Value: cname.vercel-dns.com
TTL: 3600
```

**Important:** Use the exact DNS values provided by Vercel in your dashboard!

### Step 5: Verify Configuration

1. Wait 5-10 minutes for DNS propagation
2. Visit `www.propsanchal.com` → Should show IRCTC checker
3. Visit `tools.propsanchal.com` → Should show Multi-Tool Editor
4. Check SSL certificate is active (🔒 in browser)

## 🔍 Vercel.json Explanation

```json
{
  "rewrites": [
    {
      "source": "/",
      "has": [{ "type": "host", "value": "www.propsanchal.com" }],
      "destination": "/irctc/index.html"
    },
    {
      "source": "/",
      "has": [{ "type": "host", "value": "propsanchal.com" }],
      "destination": "/irctc/index.html"
    },
    {
      "source": "/",
      "has": [{ "type": "host", "value": "tools.propsanchal.com" }],
      "destination": "/tools/index.html"
    }
  ]
}
```

### How It Works:

1. **Host-based routing**: Vercel checks the incoming hostname
2. **Conditional rewrites**: Routes to different folders based on domain
3. **Static file serving**: Each folder serves its own assets
4. **No redirects**: Users stay on their original URL

## 🧪 Testing Locally

You can't test subdomain routing locally, but you can test each page:

```bash
# Test IRCTC page
open irctc/index.html

# Test Tools page
open tools/index.html
```

Or use a local server:

```bash
# Python
python -m http.server 8000

# Then visit:
# http://localhost:8000/irctc/
# http://localhost:8000/tools/
```

## 🐛 Troubleshooting

### Issue: "Domain not found" or 404 error

**Solution:**
- Check DNS records are correct
- Wait for DNS propagation (up to 48 hours, usually 5-10 minutes)
- Verify domain is added in Vercel dashboard
- Check vercel.json syntax is correct

### Issue: Wrong page showing on domain

**Solution:**
- Check vercel.json host values match exactly
- Redeploy from Vercel dashboard
- Clear browser cache
- Check Vercel deployment logs

### Issue: CSS/JS not loading

**Solution:**
- Verify file paths in HTML are relative (not absolute)
- Check files are in correct folders
- Inspect browser console for 404 errors
- Ensure vercel.json doesn't block static assets

### Issue: SSL certificate error

**Solution:**
- Wait for Vercel to provision SSL (automatic, takes a few minutes)
- Ensure domain is verified in Vercel
- Check DNS records are correct

## 📊 Monitoring

### Vercel Analytics

1. Go to your project in Vercel
2. Click "Analytics" tab
3. View traffic, performance, and errors

### Check Deployment Status

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Check deployments
vercel ls

# View logs
vercel logs
```

## 🔄 Updating the Site

### Automatic Deployment

Every push to GitHub main branch triggers automatic deployment:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Manual Deployment

```bash
# Using Vercel CLI
vercel --prod
```

## 🌐 Custom Domain Providers

### GoDaddy

1. Go to DNS Management
2. Add A record: `@` → Vercel IP
3. Add CNAME: `www` → `cname.vercel-dns.com`
4. Add CNAME: `tools` → `cname.vercel-dns.com`

### Namecheap

1. Go to Advanced DNS
2. Add A Record: `@` → Vercel IP
3. Add CNAME: `www` → `cname.vercel-dns.com`
4. Add CNAME: `tools` → `cname.vercel-dns.com`

### Cloudflare

1. Go to DNS settings
2. Add A record: `@` → Vercel IP (Proxy status: DNS only)
3. Add CNAME: `www` → `cname.vercel-dns.com` (Proxy status: DNS only)
4. Add CNAME: `tools` → `cname.vercel-dns.com` (Proxy status: DNS only)

**Important:** Disable Cloudflare proxy initially to verify setup

## ✅ Post-Deployment Checklist

- [ ] Both domains resolve correctly
- [ ] SSL certificates are active
- [ ] All pages load without errors
- [ ] CSS and JavaScript work properly
- [ ] Images and assets load correctly
- [ ] Mobile responsive design works
- [ ] Cross-browser compatibility verified
- [ ] Analytics tracking works (if enabled)
- [ ] SEO meta tags are correct
- [ ] Performance is optimized

## 📈 SEO Optimization

### Submit to Google

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add both properties:
   - `www.propsanchal.com`
   - `tools.propsanchal.com`
3. Submit sitemaps (if created)
4. Request indexing for main pages

### Create Sitemap (Optional)

Create `sitemap.xml` in root:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.propsanchal.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tools.propsanchal.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## 🎉 Success!

Your site is now live with subdomain routing:
- ✅ www.propsanchal.com → IRCTC Checker
- ✅ tools.propsanchal.com → Multi-Tool Editor

## 📞 Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- Check project issues on GitHub
