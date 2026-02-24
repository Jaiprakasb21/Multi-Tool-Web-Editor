# Local Testing Guide

## ⚠️ CSS Not Loading Issue

If you're seeing only HTML without CSS styling, it's because browsers block CSS loading when opening HTML files directly from the file system (`file://` protocol).

## ✅ Solution: Use a Local Server

You need to run a local web server to test the pages properly.

### Option 1: Using the Provided Scripts (Easiest)

#### Windows (Batch File)
Double-click `start-local-server.bat` and choose option 1 or 2.

#### Windows (PowerShell)
Right-click `start-local-server.ps1` → Run with PowerShell

### Option 2: Manual Commands

#### Using Python (Recommended)
```bash
# Open terminal in project root
python -m http.server 8000
```

Then visit:
- IRCTC: http://localhost:8000/irctc/
- Tools: http://localhost:8000/tools/
- Test Page: http://localhost:8000/test-local.html

#### Using Node.js
```bash
# Install serve globally (one time)
npm install -g serve

# Run server
serve -p 8000
```

Then visit the same URLs as above.

#### Using PHP
```bash
php -S localhost:8000
```

### Option 3: Use VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click on `test-local.html`
3. Select "Open with Live Server"

## 🧪 Testing Checklist

Once server is running, verify:

### IRCTC Page (http://localhost:8000/irctc/)
- [ ] Purple gradient background visible
- [ ] Header with dark background
- [ ] Date input field styled
- [ ] Reset button (🔄) visible
- [ ] Check button styled in blue
- [ ] All text properly formatted

### Tools Page (http://localhost:8000/tools/)
- [ ] Purple gradient background visible
- [ ] Tab buttons at top
- [ ] All sections accessible
- [ ] Proper styling on all tools

## 🔍 Troubleshooting

### Issue: Still no CSS after starting server

**Check:**
1. Are you visiting `http://localhost:8000/irctc/` (with trailing slash)?
2. Open browser console (F12) - any errors?
3. Check Network tab - is `styles.css` loading?

**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private mode
- Try different browser

### Issue: Server won't start

**Python not found:**
```bash
# Install Python from python.org
# Or use Node.js instead
```

**Port already in use:**
```bash
# Use different port
python -m http.server 8001
```

### Issue: CSS loads but looks broken

**Check:**
1. File encoding is UTF-8
2. No syntax errors in CSS
3. Browser console for errors

## 📁 File Structure Verification

Your structure should look like this:

```
project-root/
├── irctc/
│   ├── index.html      ← Opens this
│   ├── script.js       ← Referenced as "script.js"
│   └── styles.css      ← Referenced as "styles.css"
│
├── tools/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── test-local.html     ← Start here for easy navigation
```

## ✅ Quick Test

1. Start server:
   ```bash
   python -m http.server 8000
   ```

2. Open browser:
   ```
   http://localhost:8000/test-local.html
   ```

3. Click "IRCTC Booking Checker" link

4. You should see:
   - Purple gradient background
   - Styled header
   - Formatted input fields
   - Proper buttons

## 🚀 For Production (Vercel)

Once deployed to Vercel, CSS will load automatically because:
- Vercel serves files over HTTP/HTTPS
- No file:// protocol restrictions
- Proper MIME types set
- CDN delivery

## 📞 Still Having Issues?

1. Check browser console (F12) for errors
2. Verify file paths in HTML match actual files
3. Ensure all files are in correct folders
4. Try different browser
5. Clear all caches

## 💡 Pro Tip

Always use `test-local.html` as your starting point for local testing. It provides easy navigation to both pages and includes troubleshooting tips.
