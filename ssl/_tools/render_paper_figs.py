"""Render the paper's own figure PDFs to WebP for the project page (no new figures are drawn)."""
import sys, pathlib
import pymupdf as fitz  # PyMuPDF
from PIL import Image
src, dst = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
FIGS = {  # paper figure -> (page asset, width in px, about 2x the displayed width)
    "case_study_mmsi.pdf": ("case_study_mmsi.webp", 2240),
    "case_failure_mmsi.pdf": ("case_failure_mmsi.webp", 1400),
    "cost_scatter.pdf": ("cost_scatter.webp", 1400),
    "fig_ablation_row.pdf": ("ablation_row.webp", 2240),
    "fig_instruction_free.pdf": ("instruction_free.webp", 1100),
    "smile-composition.pdf": ("composition.webp", 2000),
}
for f, (name, width) in FIGS.items():
    doc = fitz.open(src / f)
    assert doc.page_count == 1, f
    page = doc[0]
    zoom = width / page.rect.width
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    im.save(dst / name, "WEBP", quality=90, method=6)
    print(f"{f} -> {name} {im.size[0]}x{im.size[1]} {(dst / name).stat().st_size // 1024} KB")
