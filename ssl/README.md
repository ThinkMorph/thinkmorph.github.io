# ThinkMorph-SSL project page

Static page: plain HTML/CSS/JS, no build step and no dependencies. Open `index.html` directly or serve the folder
(`python3 -m http.server`). To publish, copy this folder to the root of a GitHub Pages repository.

## Before publishing

- **Links**: the dataset and model buttons point to Hugging Face. Paper, arXiv, and Code still have an empty
  `href=""` in `index.html`; a button with an empty `href` shows as "soon".
- **BibTeX**: update the entry in `index.html` once the arXiv ID exists.
- **Numbers**: every result shown on the page lives in one block at the top of `static/js/main.js`, copied from
  `section/5_experiments_v2.tex` and `section/A_appendix.tex`. If the paper changes, edit that block.
  The two MindCube curves marked "≈" (Stage 2 only, mixed) are read from the plotted data of the ablation figure,
  since the paper has no table for them.

## Regenerating images and example traces

`static/img/` and `static/js/examples.js` are generated from the paper's figures and appendix cards:

```bash
python3 webpage/_tools/build_assets.py   # needs Pillow and poppler (pdftotext, pdfimages, pdftoppm)
```

Which examples appear is set at the top of that script (`PRETEXT`, `INSTRUCT`, `INSTRUCT_EXAMPLES`).
