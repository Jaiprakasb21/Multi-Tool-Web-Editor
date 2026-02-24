# Quick Google Indexing Reference

## 📁 Files Created

```
project-root/
├── public/
│   ├── robots.txt          ✅ Created
│   └── sitemap.xml         ✅ Created
├── irctc/
│   └── index.html          ✅ Updated (verification meta tag added)
└── vercel.json             ✅ Updated (routes added)
```

## 🔗 URLs to Check After Deployment

| File | URL | Expected |
|------|-----|----------|
| robots.txt | https://www.propsanchal.com/robots.txt | Plain text file |
| sitemap.xml | https://www.propsanchal.com/sitemap.xml | XML file |
| Homepage | https://www.propsanchal.com/ | Full site with CSS |

## 🚀 Quick Deploy

```bash
git add .
git commit -m "Add Google indexing: robots.txt, sitemap.xml, GSC verification"
git push origin main
```

## 📝 Google Search Console Setup (5 Minutes)

### Step 1: Add Property
1. Go to: https://search.google.com/search-console
2. Add property: `https://www.propsanchal.com`

### Step 2: Verify Ownership
1. Choose "HTML tag" method
2. Copy verification code (e.g., `abc123xyz`)
3. Update `irctc/index.html`:
   ```html
   <meta name="google-site-verification" content="abc123xyz" />
   ```
4. Deploy:
   ```bash
   git add irctc/index.html
   git commit -m "Add GSC verification code"
   git push
   ```
5. Click "Verify" in Search Console

### Step 3: Submit Sitemap
1. In Search Console → Sitemaps
2. Enter: `sitemap.xml`
3. Click "Submit"

### Step 4: Request Indexing
1. URL Inspection → Enter: `https://www.propsanchal.com/`
2. Click "Request Indexing"

## ✅ Verification Checklist

- [ ] Files deployed to Vercel
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Search Console property added
- [ ] Ownership verified
- [ ] Sitemap submitted
- [ ] Indexing requested

## 📊 Timeline

- **Day 1:** Setup complete
- **Day 2-3:** Google crawls site
- **Day 4-7:** Pages indexed
- **Week 2+:** Rankings improve

## 🔍 Quick Tests

### Test robots.txt
```bash
curl https://www.propsanchal.com/robots.txt
```

### Test sitemap.xml
```bash
curl https://www.propsanchal.com/sitemap.xml
```

### Check if indexed
```
site:www.propsanchal.com
```
(Search in Google after 2-7 days)

## 📞 Need Help?

See detailed guide: `GOOGLE-INDEXING-SETUP.md`

---

**Status: ✅ READY TO DEPLOY**
