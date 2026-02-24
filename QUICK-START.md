# Quick Start Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub (1 min)

```bash
git add .
git commit -m "Subdomain routing setup"
git push origin main
```

### Step 2: Deploy to Vercel (2 min)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Click "Deploy"

### Step 3: Add Domains (2 min)

In Vercel dashboard:
1. Go to Settings → Domains
2. Add: `www.propsanchal.com`
3. Add: `propsanchal.com`
4. Add: `tools.propsanchal.com`

### Step 4: Update DNS

Copy DNS records from Vercel and add to your domain provider:

```
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
CNAME   tools   cname.vercel-dns.com
```

### Step 5: Wait & Verify (5-10 min)

Wait for DNS propagation, then visit:
- ✅ www.propsanchal.com → IRCTC Checker
- ✅ tools.propsanchal.com → Multi-Tool Editor

## 🎉 Done!

Your site is now live with subdomain routing!

---

For detailed instructions, see `DEPLOYMENT-GUIDE.md`
