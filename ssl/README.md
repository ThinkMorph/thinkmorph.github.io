# ThinkMorph-SSL project page

Static page: plain HTML/CSS/JS, no build step and no dependencies. Open `index.html` directly or serve the folder
(`python3 -m http.server`).

Every figure on the page is a figure from the paper; the page draws no charts of its own.

## Before publishing

- **Links**: the dataset and model buttons point to Hugging Face. Paper, arXiv, and Code still have an empty
  `href=""` in `index.html`; a button with an empty `href` shows as "soon".
- **BibTeX**: update the entry in `index.html` once the arXiv ID exists.
- **Numbers**: the results table and the three level averages come from the `RESULTS` block at the top of
  `static/js/main.js`, copied from Tables 3 and 4 of the paper (`section/5_experiments_v2.tex`). The two
  inference-time tables and the image-use table are written in `index.html` from Tables 1, 2 and the image-use
  table of the same file. If the paper changes, edit those places.

## Figures

`static/img/fig/` holds the paper's figures:

| Page file | Paper figure |
| --- | --- |
| `stage1.webp` | `figures/stage1.pdf` (overview; used only as the link-preview image) |
| `spatial_smile.webp` | `figures/spatial_smile.pdf` (Instruct-180K pipelines) |
| `composition.webp` | `figures/smile-composition.pdf` (corpus composition) |
| `case_study_mmsi.webp` | `figures/case_study_mmsi.pdf` |
| `case_failure_mmsi.webp` | `figures/case_failure_mmsi.pdf` |
| `cost_scatter.webp` | `figures/cost_scatter.pdf` |
| `ablation_row.webp` | `figures/fig_ablation_row.pdf` |
| `instruction_free.webp` | `figures/fig_instruction_free.pdf` |

To render the PDF figures again (needs PyMuPDF and Pillow):

```bash
python3 _tools/render_paper_figs.py <paper>/figures static/img/fig
```

The overview and pipelines images, the strip at the top and the example traces
(`static/img/pretext/`, `static/img/instruct/`, `static/js/examples.js`) were made from the paper's figures and
appendix cards with `webpage/_tools/build_assets.py` in the paper repository.
