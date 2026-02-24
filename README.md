# Multi-Tool Web Editor & IRCTC Booking Checker

A comprehensive web application featuring multiple utility tools and a dedicated IRCTC booking window checker, optimized for subdomain routing on Vercel.

## 🌐 Live Deployment

- **Main Domain** (www.propsanchal.com) → IRCTC Booking Checker
- **Tools Subdomain** (tools.propsanchal.com) → Multi-Tool Editor

## 📁 Project Structure

```
.
├── irctc/                      # IRCTC Booking Checker (Main Domain)
│   ├── index.html             # IRCTC main page
│   ├── script.js              # IRCTC functionality
│   └── styles.css             # IRCTC styles
│
├── tools/                      # Multi-Tool Editor (Subdomain)
│   ├── index.html             # Tools main page
│   ├── script.js              # All tools functionality
│   └── style.css              # Tools styles
│
├── vercel.json                # Vercel routing configuration
├── README.md                  # This file
└── IRCTC-README.md           # IRCTC specific documentation
```

## 🚀 Features

### IRCTC Booking Window Checker (www.propsanchal.com)
- ✅ Real-time booking status checker
- ⏰ Countdown timer for booking availability
- 🎫 Direct link to IRCTC website when booking opens
- 📅 Smart date calculations with IST timezone
- 🔄 Reset functionality
- 📱 Fully responsive design
- 🔍 SEO optimized with meta tags and FAQ section

### Multi-Tool Editor (tools.propsanchal.com)
1. **JSON Formatter** - Format, validate, and export JSON with collapsible tree view
2. **JSON Compare** - Side-by-side comparison with match score and detailed differences
3. **Text Compare** - Line-by-line text comparison with similarity percentage
4. **Image Editor** - Rotate, flip, crop, filters, and download
5. **Base64 Converter** - Encode/decode text and files with preview
6. **Hash Generator** - SHA-256/512 with fixed parameters and text/file input
7. **Text Summary** - Character, word, sentence counts with letter frequency analysis
8. **File Analyzer** - File type detection and format conversion
9. **IRCTC Checker** - Also available within the tools suite

## 🔧 Vercel Configuration

The `vercel.json` file handles subdomain routing:

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
- Requests to `www.propsanchal.com` or `propsanchal.com` → Serve IRCTC checker
- Requests to `tools.propsanchal.com` → Serve Multi-Tool Editor
- All static assets are served from their respective folders

## 🚀 Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Reorganized for subdomain routing"
   git push origin main
   ```

2. **Configure Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect `vercel.json`
   - No additional configuration needed

3. **Set Up Custom Domains**
   - In Vercel dashboard, go to your project settings
   - Add domains:
     - `www.propsanchal.com`
     - `propsanchal.com`
     - `tools.propsanchal.com`
   - Update DNS records as instructed by Vercel

4. **Deploy**
   - Vercel will automatically deploy on every push
   - Or manually trigger deployment from Vercel dashboard

## 🌐 DNS Configuration

Add these DNS records in your domain provider:

```
Type    Name    Value
A       @       76.76.21.21 (Vercel IP)
CNAME   www     cname.vercel-dns.com
CNAME   tools   cname.vercel-dns.com
```

*Note: Use the actual IPs/CNAMEs provided by Vercel*

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔍 SEO Features

### IRCTC Page
- Optimized meta tags with keywords
- Open Graph tags for social sharing
- Structured FAQ section
- Semantic HTML
- Mobile-responsive design

### Tools Page
- Individual tool descriptions
- Fast loading with performance optimizations
- Clean URL structure

## 🛠️ Local Development

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. Open in browser
   - IRCTC: Open `irctc/index.html`
   - Tools: Open `tools/index.html`

3. Or use a local server
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

## 📊 Performance Optimizations

- GPU-accelerated CSS animations
- Efficient memory management
- Lazy loading for large data
- Optimized scrolling
- Minimal repaints and reflows

## 🔐 Security

- No backend required
- All processing happens client-side
- No data is stored or transmitted
- Safe to use with sensitive information

## 📄 License

Free to use for personal and commercial purposes.

## ⚠️ Disclaimer

The IRCTC Booking Window Checker is an unofficial tool. For official bookings, please visit [www.irctc.co.in](https://www.irctc.co.in)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📞 Support

For questions or issues, please open an issue in the repository.

---

**Built with ❤️ for better productivity**
