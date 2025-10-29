# 🚀 ThinkMorph Website Deployment Guide

This guide will help you deploy the ThinkMorph website to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- The website files ready in `/Users/geniusgu/Code/Webpages/thinkmorph.github.io`

## Option 1: Deploy to User/Organization Pages (Recommended)

This will make your site available at `https://thinkmorph.github.io`

### Steps:

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Repository name: `thinkmorph.github.io`
   - Make it public
   - Don't initialize with README (we already have files)

2. **Initialize and push from your local directory**
   ```bash
   cd /Users/geniusgu/Code/Webpages/thinkmorph.github.io
   
   # Initialize git repository
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit: ThinkMorph project website"
   
   # Add remote (replace USERNAME with your GitHub username)
   git remote add origin https://github.com/ThinkMorph/thinkmorph.github.io.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Source", select "Deploy from a branch"
   - Branch: `main`, Folder: `/ (root)`
   - Click "Save"

4. **Wait for deployment** (usually 1-2 minutes)
   - Your site will be live at `https://thinkmorph.github.io`

## Option 2: Deploy to Project Pages

This will make your site available at `https://YOUR_USERNAME.github.io/ThinkMorph/`

### Steps:

1. **Create repository with any name** (e.g., `ThinkMorph`)

2. **Follow same git commands as above**, but use:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ThinkMorph.git
   ```

3. **Enable GitHub Pages** with same settings

4. **Your site will be at**: `https://YOUR_USERNAME.github.io/ThinkMorph/`

## Quick Deploy Script

Save this as `deploy.sh` in the website directory:

```bash
#!/bin/bash

# ThinkMorph Website Deployment Script

echo "🚀 Deploying ThinkMorph website..."

# Add changes
git add .

# Commit with timestamp
git commit -m "Update website: $(date '+%Y-%m-%d %H:%M:%S')"

# Push to GitHub
git push origin main

echo "✅ Deployment complete!"
echo "🌐 Your site will be updated at: https://thinkmorph.github.io"
echo "⏳ Changes may take 1-2 minutes to appear"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Use it for future updates:
```bash
./deploy.sh
```

## Updating the Website

After making changes to any files:

```bash
cd /Users/geniusgu/Code/Webpages/thinkmorph.github.io
git add .
git commit -m "Description of your changes"
git push origin main
```

## Troubleshooting

### PDF Files Not Displaying?

Some browsers have issues with PDF files. Solutions:
1. Convert PDFs to PNG using the provided `convert_pdf_to_png.py` script
2. Update image references in `index.html` to use `.png` instead of `.pdf`

### Images Not Loading?

- Check file paths in `index.html`
- Ensure all files are in `static/images/` directory
- Clear browser cache and refresh

### Site Not Updating?

- Wait 2-3 minutes after pushing (GitHub Pages takes time to build)
- Check GitHub Actions tab for build status
- Try force-refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

## Custom Domain (Optional)

To use a custom domain like `thinkmorph.ai`:

1. Buy domain from a registrar (Namecheap, GoDaddy, etc.)
2. Add a file named `CNAME` in root with your domain:
   ```
   thinkmorph.ai
   ```
3. Configure DNS with your registrar:
   - Type: `A`
   - Host: `@`
   - Value: `185.199.108.153` (GitHub Pages IP)
   - Add 3 more A records with IPs: `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. For www subdomain:
   - Type: `CNAME`
   - Host: `www`
   - Value: `thinkmorph.github.io`

## Analytics (Optional)

To add Google Analytics:

1. Create a Google Analytics account
2. Get your tracking ID (G-XXXXXXXXXX)
3. Update the GA code in `index.html` (currently commented out)

## Support

For issues or questions:
- Check GitHub Pages documentation: https://docs.github.com/en/pages
- Open an issue on the repository
- Contact the development team

---

**Last Updated**: October 2024

