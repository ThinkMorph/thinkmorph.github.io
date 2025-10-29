# ThinkMorph Project Website

This is the official website for **ThinkMorph: Emergent Properties in Multimodal Interleaved Chain-of-Thought Reasoning**.

## 🌐 Live Site

Visit: [https://thinkmorph.github.io](https://thinkmorph.github.io)

## 📋 Features

- **Beautiful & Modern Design**: Clean, gradient-based UI with smooth animations
- **Interactive Case Gallery**: Click on any case to view detailed reasoning traces
- **Three Emergent Properties**: Highlighted with distinct gradient cards
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Key Results Dashboard**: Visual grid showing major performance improvements

## 🚀 Local Development

To view the website locally:

1. Clone or navigate to this repository
2. Open `index.html` in your web browser
3. Or use a local server:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## 📁 Directory Structure

```
thinkmorph.github.io/
├── index.html           # Main HTML file
├── README.md           # This file
└── static/
    ├── css/            # Stylesheets (Bulma framework)
    ├── js/             # JavaScript files
    └── images/         # All images (logo, figures, cases)
```

## 🎨 Customization

### Adding New Cases

To add new case examples:

1. Place your PDF/PNG files in `static/images/`
2. Update the case arrays in the `<script>` section at the bottom of `index.html`:
   ```javascript
   const mainCases = ['case1.pdf', 'case2.pdf', ...];
   const unseenCases = ['unseen-case-1.pdf', ...];
   const modeSwitchCases = ['mode-switch-case-1.pdf', ...];
   ```

### Updating Links

Update the paper, arXiv, and other links in the hero section once they're available:
```html
<a href="YOUR_PAPER_LINK" ...>Paper</a>
<a href="YOUR_ARXIV_LINK" ...>arXiv</a>
```

## 🔄 Deployment to GitHub Pages

1. Create a GitHub repository named `thinkmorph.github.io`
2. Push all files to the `main` branch
3. Go to repository Settings → Pages
4. Set source to "Deploy from a branch" → `main` → `/root`
5. Your site will be live at `https://thinkmorph.github.io`

Alternatively, if deploying to a project page:
- Repository name: `ThinkMorph` or any name
- URL will be: `https://YOUR_USERNAME.github.io/ThinkMorph/`

## 📝 TODO

- [ ] Update paper link once published
- [ ] Update arXiv link once available
- [ ] Convert remaining PDF images to PNG for better web compatibility
- [ ] Add Google Analytics tracking (optional)
- [ ] Add social media preview images (Open Graph tags)

## 🙏 Credits

- Website template adapted from [EMMA Benchmark](https://emma-benchmark.github.io/)
- Built with [Bulma CSS framework](https://bulma.io/)
- Icons from [Font Awesome](https://fontawesome.com/)

## 📧 Contact

For questions or suggestions, please open an issue on GitHub or contact the authors.

---

**Note**: Make sure all image paths are correct and all PDF files are accessible. Some browsers may have issues displaying PDF images directly; consider converting them to PNG for better compatibility.

