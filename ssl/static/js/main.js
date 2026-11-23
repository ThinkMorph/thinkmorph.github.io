/* ThinkMorph-SSL project page. No dependencies. */
(() => {
  "use strict";

  /* ────────────────────────────── numbers from the paper ──────────────────────────────
     Every number below is copied from the paper (section/5_experiments_v2.tex and
     section/A_appendix.tex). Update here if the paper changes.                         */

  const L1_COLS = ["V*", "HR-4K", "HR-8K", "MME-RW-L", "RealWorldQA"];
  const L2_COLS = ["BLINK", "CV-2D", "CV-3D", "SAT"];
  const L3_COLS = ["MMSI", "MindCube", "OmniSpatial", "SpatialViz"];

  // Table 3 (Level 1) and Table 4 (Levels 2 & 3). Rows: [name, group, L1 x5, L1avg, L2 x4, L3 x4, L2avg, L3avg]
  const RESULTS = [
    ["GPT-5", "Closed-source", [69.63, 67.50, 65.50, 56.80, 73.86], 66.66, [67.70, 77.68, 87.58, 81.33], [42.50, 42.33, 57.34, 53.47], 78.57, 48.91],
    ["Claude Sonnet 4.6", "Closed-source", [66.49, 72.50, 64.50, 46.95, 71.50], 64.39, [63.28, 69.25, 82.33, 44.67], [32.70, 43.18, 50.29, 44.58], 64.88, 42.69],
    ["Gemini 2.5 Flash", "Closed-source", [76.96, 82.75, 78.50, 51.02, 75.16], 72.88, [67.23, 74.21, 80.75, 65.33], [35.90, 42.20, 53.62, 29.66], 71.88, 40.35],
    ["Qwen2.5-VL-7B", "Open-source", [71.20, 61.38, 58.75, 43.10, 61.96], 59.28, [54.87, 69.97, 64.00, 45.33], [28.80, 30.95, 41.88, 30.76], 58.54, 33.10],
    ["Qwen2.5-VL-32B", "Open-source", [75.92, 66.62, 64.38, 45.28, 63.01], 63.04, [59.55, 74.28, 83.33, 43.33], [27.60, 33.10, 47.75, 35.25], 65.12, 35.93],
    ["Janus-Pro", "Unified", [38.22, 44.88, 39.63, 23.19, 41.83], 37.55, [38.51, 68.74, 66.75, 22.00], [27.80, 37.50, 28.70, 18.64], 49.00, 28.16],
    ["Chameleon", "Unified", [28.27, 26.25, 24.88, 24.13, 36.21], 27.95, [16.52, 27.36, 47.50, 18.67], [5.10, 28.85, 22.90, 21.53], 27.51, 19.60],
    ["SenseNova-U1-8B", "Unified", [61.26, 56.38, 52.25, 39.52, 69.67], 55.82, [68.60, 81.45, 90.33, 72.00], [38.70, 64.13, 45.66, 31.27], 78.10, 44.94],
    ["LongCat-Next-A3B", "Unified", [76.44, 65.38, 62.00, 40.78, 71.76], 63.27, [56.34, 73.17, 80.75, 27.33], [28.80, 39.90, 40.18, 28.56], 59.40, 34.36],
    ["Show-o2-7B", "Unified", [42.93, 49.75, 43.25, 41.01, 64.05], 48.20, [43.35, 67.95, 74.08, 26.00], [29.00, 40.00, 40.51, 30.68], 52.84, 35.05],
    ["BAGEL no-think", "BAGEL inference variants", [52.88, 46.88, 39.50, 41.88, 70.59], 50.35, [63.91, 70.92, 43.17, 46.67], [31.60, 34.71, 45.79, 33.56], 56.17, 36.42],
    ["BAGEL think-4k", "BAGEL inference variants", [58.64, 59.38, 48.88, 25.64, 64.44], 51.40, [53.39, 72.81, 85.17, 47.33], [27.40, 29.66, 31.57, 12.97], 64.67, 25.40],
    ["BAGEL think-16k", "BAGEL inference variants", [61.26, 63.00, 50.50, 25.64, 68.89], 53.86, [52.97, 74.30, 83.00, 46.67], [29.00, 29.66, 35.09, 13.56], 64.23, 26.83],
    ["ThinkMorph-SSL (ours)", "ours", [68.06, 67.00, 55.38, 45.28, 70.46], 61.24, [58.02, 74.79, 86.75, 56.00], [34.40, 60.38, 45.27, 33.22], 68.89, 43.32],
  ];
  const row = (name) => RESULTS.find((r) => r[0] === name);
  const OURS = row("ThinkMorph-SSL (ours)");
  const T4K = row("BAGEL think-4k");
  const NOTHINK = row("BAGEL no-think");

  const LEVELS = {
    L1: { name: "Basic visual perception", ours: OURS[3], base: T4K[3] },
    L2: { name: "Static spatial understanding", ours: OURS[6], base: T4K[6] },
    L3: { name: "Mental world modeling", ours: OURS[7], base: T4K[7] },
  };

  const BASE_L3 = [ // Table 1
    { label: "Answer directly (no-think)", v: 36.42 },
    { label: "Text reasoning, 4K (think-4k)", v: 25.40 },
    { label: "Text reasoning, 16K (think-16k)", v: 26.83 },
  ];
  const BASE_FORCE = [ // Table 2
    { label: "Text reasoning (16k)", v: 47.40 },
    { label: "Forced interleaved (16k)", v: 41.20 },
    { label: "Forced interleaved + ground-truth image", v: 42.00 },
  ];

  const FIXED_BUDGET = [ // Table 5: Stage 2 only -> Stage 1 -> Stage 2
    { label: "V*", sub: "L1", a: 52.88, b: 59.16 },
    { label: "SAT", sub: "L2", a: 52.67, b: 60.00 },
    { label: "SpatialViz", sub: "L3", a: 26.86, b: 32.71 },
  ];

  // MindCube ablation (Figure 4 + Tables staging-internvlu, app-instruction-free).
  // "approx": values read off the plotted data of the paper figure (the other series in that
  // figure reproduce their table values exactly with the same read-off).
  const ABL = {
    order: {
      note: "Stage-1 traces are built from the same images as the spatial instruction data, so the staged run sees no extra images. Against Stage 2 alone, the staged run leads from the second epoch and finishes 4.9 points ahead. At the same instruction-tuning budget, the mixed run, which samples both corpora in proportion to their size, stays near 57%.",
      series: [
        { name: "Stage 1 → Stage 2 (ours)", color: "var(--rose)", values: [59.0, 63.9, 66.8, 66.6] },
        { name: "Stage 2 only", color: "var(--gray-mark)", values: [62.6, 63.3, 59.3, 61.7], approx: true },
        { name: "Stage 1 + Stage 2 mixed", color: "var(--blue)", values: [53.2, 56.9, 57.3, 57.1], approx: true },
      ],
    },
    instr: {
      note: "Only the Stage-1 traces change: the instructed variant adds an explicit instruction to restore the image. Instruction-free leads at every checkpoint, by 2.7 points on average (64.08 vs. 61.42), suggesting that Stage 1 can build the skill without task instructions.",
      series: [
        { name: "Instruction-free Stage 1 (ours)", color: "var(--rose)", values: [59.0, 63.9, 66.8, 66.6] },
        { name: "Instructed Stage 1", color: "var(--amber)", dash: true, values: [58.75, 63.17, 58.65, 65.10] },
      ],
    },
    internvl: {
      note: "Same comparison with InternVL-U-4B, changing only the backbone. The gain stays below 0.5 points for the first three epochs and reaches 4.72 points in the fourth: the benefit emerges as instruction tuning progresses.",
      series: [
        { name: "Stage 1 → Stage 2", color: "var(--rose)", values: [54.62, 55.77, 56.63, 62.12] },
        { name: "Stage 2 only", color: "var(--gray-mark)", values: [54.62, 55.29, 56.25, 57.40] },
      ],
    },
  };

  const IMAGE_USE = [ // Table app-image-use
    { label: "Spatial (training split)", sub: "15 problems", a: 32.2, b: 69.4 },
    { label: "MMSI (test)", sub: "42 problems", a: 18.5, b: 31.3 },
  ];
  const DEFECT = [ // Table app-fidelity (error rates)
    { label: "Spatial (training split)", sub: "501 traces", a: 15.4, b: 40.7 },
    { label: "MMSI (test)", sub: "1,052 traces", a: 47.4, b: 67.8 },
  ];
  const COST = [ // Table app-cost, V* (191 questions)
    { name: "BAGEL no-think", x: 1.3, y: 52.88, kind: "base", dx: 10, dy: 16 },
    { name: "BAGEL think-4k", x: 44.3, y: 58.64, kind: "base", dx: 10, dy: 15 },
    { name: "BAGEL think-16k", x: 112.4, y: 61.26, kind: "base", dx: -10, dy: 17, anchor: "end" },
    { name: "ThinkMorph-SSL", x: 62.3, y: 68.06, kind: "ours", dx: 10, dy: 17 },
    { name: "ThinkMorph-SSL + TeaCache", x: 21.3, y: 69.10, kind: "ours-hollow", dx: 10, dy: -8 },
  ];
  const TRACE_LEN = [ // Figure 4 (right), mean characters
    { label: "V*", a: 5102, b: 1104 },
    { label: "BLINK", a: 3926, b: 1593 },
    { label: "SAT", a: 3578, b: 1091 },
    { label: "MMSI", a: 1007, b: 1268 },
  ];
  const INSTRUCT_LEVELS = [ // Instruct-180K dataset card on Hugging Face (180,490 traces)
    { label: "L1 · Basic visual perception", short: "L1", v: 62100, color: "#ea8eab" },
    { label: "L2 · Static spatial understanding", short: "L2", v: 15144, color: "#cf3f6c" },
    { label: "L3 · Mental world modeling", short: "L3", v: 103246, color: "#8f0f37" },
  ];

  /* ────────────────────────────── helpers ────────────────────────────── */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";
  const fmt2 = (v) => v.toFixed(2);
  const fmtD = (v) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(2);
  const fmtInt = (v) => v.toLocaleString("en-US");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const star = (s) => esc(s).replace("V*", "V<sup>⋆</sup>");

  function h(tag, attrs = {}, html) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === false || v == null) continue;
      if (k === "class") el.className = v; else el.setAttribute(k, v);
    }
    if (html != null) el.innerHTML = html;
    return el;
  }
  function s(tag, attrs = {}, parent) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) if (v != null) el.setAttribute(k, v);
    if (parent) parent.appendChild(el);
    return el;
  }
  function text(parent, x, y, str, cls, extra = {}) {
    const t = s("text", { x, y, class: cls, ...extra }, parent);
    t.textContent = str;
    return t;
  }
  const linear = (d0, d1, r0, r1) => (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
  function ticks(d0, d1, step) { const out = []; for (let v = Math.ceil(d0 / step) * step; v <= d1 + 1e-9; v += step) out.push(+v.toFixed(6)); return out; }
  // horizontal bar with 4px rounded data end, square at the baseline
  function hbar(x0, y, w, hgt, r = 4) {
    r = Math.min(r, w / 2, hgt / 2);
    if (w <= 0) return "";
    return `M${x0},${y}H${x0 + w - r}Q${x0 + w},${y} ${x0 + w},${y + r}V${y + hgt - r}Q${x0 + w},${y + hgt} ${x0 + w - r},${y + hgt}H${x0}Z`;
  }
  function legend(el, items) {
    if (!el) return;
    el.innerHTML = items.map((it) =>
      `<span class="sw"><i class="${it.shape || ""}${it.dash ? " dash" : ""}" style="${it.shape === "ring" || it.shape?.startsWith("line") ? `border-color:${it.color}` : `background:${it.color}`}"></i>${esc(it.name)}</span>`).join("");
  }
  function dataTable(chartEl, head, rows) {
    const card = chartEl.closest(".chart-card") || chartEl.parentElement;
    let d = card.querySelector(":scope > .data-table");
    if (!d) { d = h("details", { class: "data-table" }); card.appendChild(d); }
    d.innerHTML = `<summary>View as table</summary><table><thead><tr>${head.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  }

  /* tooltip */
  const tip = $("#tooltip");
  function showTip(html, x, y) {
    tip.innerHTML = html;
    tip.hidden = false;
    const w = tip.offsetWidth || 200;
    const cx = Math.max(w / 2 + 8, Math.min(window.innerWidth - w / 2 - 8, x));
    tip.style.left = cx + "px";
    tip.style.top = Math.max(tip.offsetHeight + 20, y) + "px";
  }
  const hideTip = () => { tip.hidden = true; };
  function bindTip(node, htmlFn) {
    node.setAttribute("tabindex", "0");
    node.addEventListener("pointermove", (e) => showTip(htmlFn(), e.clientX, e.clientY));
    node.addEventListener("pointerleave", hideTip);
    node.addEventListener("focus", () => { const r = node.getBoundingClientRect(); showTip(htmlFn(), r.left + r.width / 2, r.top); });
    node.addEventListener("blur", hideTip);
  }
  const ttRow = (color, name, val, ring) => `<div class="tt-row"><span><i style="${ring ? `border:2px solid ${color};background:transparent` : `background:${color}`}"></i>${name}</span><span>${val}</span></div>`;

  /* responsive redraw */
  const charts = [];
  function chart(el, draw) {
    if (!el) return;
    const run = () => { const w = el.clientWidth; if (w > 0 && w !== el._w) { el._w = w; el.innerHTML = ""; draw(el, w); } };
    el._redraw = () => { el._w = 0; run(); };
    charts.push(run);
    run();
  }
  let rT;
  window.addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => charts.forEach((f) => f()), 120); });

  /* ────────────────────────────── chart types ────────────────────────────── */

  // single-series horizontal bars (baselines → gray)
  function barChart(el, rows, { domain = [0, 50], step = 10, color = "var(--gray-mark)", unit = "%" } = {}) {
    chart(el, (el, W) => {
      const stacked = W < 520;   // narrow: label above its bar
      const labW = stacked ? 0 : Math.min(210, W * 0.42), padR = 52, rowH = stacked ? 44 : 34, barH = 14, top = 4, axisH = 24;
      const H = top + rows.length * rowH + axisH;
      const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": rows.map((r) => `${r.label}: ${r.v}${unit}`).join("; ") }, el);
      const x = linear(domain[0], domain[1], stacked ? 1 : labW, W - padR);
      const g = s("g", { class: "grid" }, svg);
      ticks(domain[0], domain[1], step).forEach((t) => {
        s("line", { x1: x(t), x2: x(t), y1: top, y2: top + rows.length * rowH }, g);
        text(svg, x(t), H - 6, t, "tick ax", { "text-anchor": t === domain[0] && stacked ? "start" : "middle" });
      });
      rows.forEach((r, i) => {
        const y = top + i * rowH, gy = s("g", { class: "row" }, svg);
        const by = stacked ? y + 20 : y + (rowH - barH) / 2;
        s("rect", { class: "hit", x: 0, y, width: W, height: rowH, rx: 6 }, gy);
        if (stacked) text(gy, x(domain[0]) + 2, y + 14, r.label, "lbl");
        else text(gy, labW - 12, y + rowH / 2 + 4, r.label, "lbl", { "text-anchor": "end" });
        s("path", { d: hbar(x(domain[0]), by, x(r.v) - x(domain[0]), barH), fill: color }, gy);
        text(gy, x(r.v) + 7, by + barH - 3, fmt2(r.v), "val");
        bindTip(gy, () => `<div class="tt-head">${esc(r.label)}</div>${ttRow(color, "Accuracy", fmt2(r.v) + unit)}`);
      });
      s("line", { class: "baseline", x1: x(domain[0]), x2: x(domain[0]), y1: top, y2: top + rows.length * rowH }, svg);
    });
    dataTable(el, ["Setting", "Accuracy (%)"], rows.map((r) => [r.label, fmt2(r.v)]));
  }

  // dumbbell: a (gray) → b (accent), grouped rows, optional third marker c
  function dumbbell(el, groups, opts) {
    const { domain, step = 10, aName, bName, bColor = "var(--rose)", aColor = "var(--gray-mark)", cName, delta = true, unit = "", fmt = fmt2, rowH = 28, labMax = 150 } = opts;
    const fD = (v) => (v >= 0 ? "+" : "−") + fmt(Math.abs(v));
    chart(el, (el, W) => {
      const showC = opts.showC && opts.showC();
      const labW = Math.min(labMax, W * 0.36), padR = delta ? 70 : 20, grpH = 26, top = 2, axisH = 26;
      const nRows = groups.reduce((n, g) => n + g.rows.length, 0);
      const nGrp = groups.filter((g) => g.name).length;
      const H = top + nRows * rowH + nGrp * grpH + axisH;
      const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `${aName} versus ${bName}` }, el);
      const x = linear(domain[0], domain[1], labW, W - padR);
      const gGrid = s("g", { class: "grid" }, svg);
      ticks(domain[0], domain[1], step).forEach((t) => {
        s("line", { x1: x(t), x2: x(t), y1: top, y2: H - axisH }, gGrid);
        text(svg, x(t), H - 8, t, "tick ax", { "text-anchor": "middle" });
      });
      if (delta) text(svg, W - 4, H - 8, "Δ", "tick ax", { "text-anchor": "end" });
      let y = top;
      groups.forEach((g) => {
        if (g.name) { text(svg, 0, y + grpH - 9, g.name, "grp"); y += grpH; }
        g.rows.forEach((r) => {
          const gy = s("g", { class: "row" }, svg), cy = y + rowH / 2;
          s("rect", { class: "hit", x: 0, y, width: W, height: rowH, rx: 6 }, gy);
          const lab = text(gy, labW - 14, cy + (r.sub && opts.showSub ? -1 : 4), "", r.strong || opts.showSub ? "lbl" : "lbl-muted", { "text-anchor": "end" });
          lab.innerHTML = star(r.label).replace("<sup>", '<tspan baseline-shift="super" font-size="70%">').replace("</sup>", "</tspan>");
          if (r.strong) lab.style.fontWeight = 600;
          const xa = x(r.a), xb = x(r.b);
          s("line", { x1: xa, x2: xb, y1: cy, y2: cy, stroke: bColor, "stroke-opacity": 0.35, "stroke-width": 2 }, gy);
          if (showC && r.c != null) s("circle", { cx: x(r.c), cy, r: 4.5, fill: "var(--surface)", stroke: "var(--ink-3)", "stroke-width": 1.6 }, gy);
          s("circle", { cx: xa, cy, r: 5, fill: aColor, stroke: "var(--surface)", "stroke-width": 2 }, gy);
          s("circle", { cx: xb, cy, r: r.strong ? 6 : 5, fill: bColor, stroke: "var(--surface)", "stroke-width": 2 }, gy);
          if (delta) text(gy, W - 4, cy + 4, fD(r.b - r.a), r.strong ? "val-strong" : "val", { "text-anchor": "end" });
          if (r.sub && opts.showSub) text(gy, labW - 14, cy + 17, r.sub, "tick", { "text-anchor": "end" });
          bindTip(gy, () => `<div class="tt-head">${star(r.label)}${r.sub ? ` <span style="color:#a9a7a0;font-weight:400">· ${esc(r.sub)}</span>` : ""}</div>` +
            (showC && r.c != null ? ttRow("var(--ink-3)", esc(cName), fmt(r.c) + unit, true) : "") +
            ttRow(aColor, esc(aName), fmt(r.a) + unit) + ttRow(bColor, esc(bName), fmt(r.b) + unit) +
            (delta ? `<div class="tt-foot">Δ ${fD(r.b - r.a)}</div>` : ""));
          y += rowH;
        });
      });
    });
    const head = ["", ...(cName ? [cName] : []), aName, bName, ...(delta ? ["Δ"] : [])];
    dataTable(el, head, groups.flatMap((g) => g.rows.map((r) => [(g.name ? g.name + " · " : "") + r.label, ...(cName ? [r.c != null ? fmt(r.c) : ""] : []), fmt(r.a), fmt(r.b), ...(delta ? [fD(r.b - r.a)] : [])])));
  }

  // two-series horizontal bars per row
  function pairBars(el, rows, { domain, step, aName, bName, aColor = "var(--gray-mark)", bColor = "var(--rose)", fmt = fmtInt, tickFmt = (t) => t } = {}) {
    chart(el, (el, W) => {
      const labW = Math.min(90, W * 0.2), padR = 56, rowH = 46, barH = 12, gap = 2, top = 2, axisH = 24;
      const H = top + rows.length * rowH + axisH;
      const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `${aName} versus ${bName}` }, el);
      const x = linear(domain[0], domain[1], labW, W - padR);
      const g = s("g", { class: "grid" }, svg);
      ticks(domain[0], domain[1], step).forEach((t) => {
        s("line", { x1: x(t), x2: x(t), y1: top, y2: top + rows.length * rowH }, g);
        text(svg, x(t), H - 6, tickFmt(t), "tick ax", { "text-anchor": "middle" });
      });
      rows.forEach((r, i) => {
        const y = top + i * rowH, gy = s("g", { class: "row" }, svg);
        const y0 = y + (rowH - 2 * barH - gap) / 2;
        s("rect", { class: "hit", x: 0, y, width: W, height: rowH, rx: 6 }, gy);
        const lab = text(gy, labW - 12, y + rowH / 2 + 4, "", "lbl", { "text-anchor": "end" });
        lab.innerHTML = star(r.label).replace("<sup>", '<tspan baseline-shift="super" font-size="70%">').replace("</sup>", "</tspan>");
        s("path", { d: hbar(x(domain[0]), y0, x(r.a) - x(domain[0]), barH), fill: aColor }, gy);
        s("path", { d: hbar(x(domain[0]), y0 + barH + gap, x(r.b) - x(domain[0]), barH), fill: bColor }, gy);
        text(gy, x(r.a) + 6, y0 + barH - 2, fmt(r.a), "val");
        text(gy, x(r.b) + 6, y0 + 2 * barH + gap - 2, fmt(r.b), "val-strong");
        bindTip(gy, () => `<div class="tt-head">${star(r.label)}</div>${ttRow(aColor, esc(aName), fmt(r.a))}${ttRow(bColor, esc(bName), fmt(r.b))}`);
      });
      s("line", { class: "baseline", x1: x(domain[0]), x2: x(domain[0]), y1: top, y2: top + rows.length * rowH }, svg);
    });
    dataTable(el, ["", aName, bName], rows.map((r) => [r.label, fmt(r.a), fmt(r.b)]));
  }

  // multi-line with crosshair tooltip and end labels
  function lineChart(el, cfg) {
    chart(el, (el, W) => {
      const { series, xs, domain, step } = cfg();
      const padL = 34, padR = Math.min(150, W * 0.34), top = 10, H = 250, axisH = 30;
      const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": series.map((se) => `${se.name}: ${se.values.join(", ")}`).join("; ") }, el);
      const x = linear(xs[0], xs[xs.length - 1], padL + 12, W - padR);
      const y = linear(domain[0], domain[1], H - axisH, top);
      const g = s("g", { class: "grid" }, svg);
      ticks(domain[0], domain[1], step).forEach((t) => {
        s("line", { x1: padL, x2: W - padR + 8, y1: y(t), y2: y(t) }, g);
        text(svg, padL - 8, y(t) + 4, t, "tick ax", { "text-anchor": "end" });
      });
      xs.forEach((v) => text(svg, x(v), H - 10, v, "tick ax", { "text-anchor": "middle" }));
      // lines
      series.forEach((se) => {
        s("path", { d: se.values.map((v, i) => `${i ? "L" : "M"}${x(xs[i])},${y(v)}`).join(""), fill: "none", stroke: se.color, "stroke-width": 2, "stroke-dasharray": se.dash ? "5 4" : null, "stroke-linejoin": "round" }, svg);
      });
      series.forEach((se) => se.values.forEach((v, i) => s("circle", { cx: x(xs[i]), cy: y(v), r: 4.5, fill: se.dash ? "var(--surface)" : se.color, stroke: se.dash ? se.color : "var(--surface)", "stroke-width": 2 }, svg)));
      // end labels, nudged apart
      const ends = series.map((se) => ({ se, y: y(se.values[se.values.length - 1]) })).sort((a, b) => a.y - b.y);
      for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 15) ends[i].y = ends[i - 1].y + 15;
      ends.forEach((e) => {
        const v = e.se.values[e.se.values.length - 1];
        const t = text(svg, x(xs[xs.length - 1]) + 12, e.y + 4, "", "val");
        t.innerHTML = `<tspan class="val-strong">${e.se.approx ? "≈" : ""}${v.toFixed(1)}</tspan><tspan class="lbl-muted" dx="6">${esc(e.se.short || e.se.name)}</tspan>`;
      });
      // crosshair
      const cross = s("line", { y1: top, y2: H - axisH, stroke: "var(--ink-3)", "stroke-width": 1, opacity: 0 }, svg);
      const hit = s("rect", { x: padL, y: top, width: W - padR - padL + 10, height: H - axisH - top, fill: "transparent", tabindex: 0 }, svg);
      let idx = xs.length - 1;
      const html = (i) => `<div class="tt-head">Stage-2 epoch ${xs[i]}</div>` + series.map((se) => ttRow(se.color, esc(se.name), (se.approx ? "≈" : "") + String(se.values[i]), se.dash)).join("");
      const at = (i, cx, cy) => { idx = i; cross.setAttribute("x1", x(xs[i])); cross.setAttribute("x2", x(xs[i])); cross.setAttribute("opacity", 1); showTip(html(i), cx, cy); };
      hit.addEventListener("pointermove", (e) => {
        const r = svg.getBoundingClientRect(), px = (e.clientX - r.left) * (W / r.width);
        let best = 0; xs.forEach((v, i) => { if (Math.abs(x(v) - px) < Math.abs(x(xs[best]) - px)) best = i; });
        at(best, e.clientX, e.clientY);
      });
      hit.addEventListener("pointerleave", () => { cross.setAttribute("opacity", 0); hideTip(); });
      hit.addEventListener("focus", () => { const r = svg.getBoundingClientRect(); at(idx, r.left + (x(xs[idx]) / W) * r.width, r.top + 20); });
      hit.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault(); idx = Math.max(0, Math.min(xs.length - 1, idx + (e.key === "ArrowRight" ? 1 : -1)));
          const r = svg.getBoundingClientRect(); at(idx, r.left + (x(xs[idx]) / W) * r.width, r.top + 20);
        }
      });
      hit.addEventListener("blur", () => { cross.setAttribute("opacity", 0); hideTip(); });
    });
  }

  // scatter: latency vs accuracy
  function scatter(el, pts, { xDomain, yDomain, xStep, yStep }) {
    chart(el, (el, W) => {
      const padL = 36, padR = 18, top = 12, H = 270, axisH = 38;
      const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": pts.map((p) => `${p.name}: ${p.y}% at ${p.x} s`).join("; ") }, el);
      const x = linear(xDomain[0], xDomain[1], padL + 6, W - padR);
      const y = linear(yDomain[0], yDomain[1], H - axisH, top);
      const g = s("g", { class: "grid" }, svg);
      ticks(yDomain[0], yDomain[1], yStep).forEach((t) => { s("line", { x1: padL, x2: W - padR, y1: y(t), y2: y(t) }, g); text(svg, padL - 8, y(t) + 4, t, "tick ax", { "text-anchor": "end" }); });
      ticks(xDomain[0], xDomain[1], xStep).forEach((t) => { s("line", { x1: x(t), x2: x(t), y1: top, y2: H - axisH }, g); text(svg, x(t), H - axisH + 16, t + " s", "tick ax", { "text-anchor": "middle" }); });
      text(svg, W - padR, H - 4, "latency per question →", "tick ax", { "text-anchor": "end" });
      pts.forEach((p) => {
        const gp = s("g", { class: "row" }, svg), cx = x(p.x), cy = y(p.y);
        const col = p.kind === "base" ? "var(--gray-mark)" : "var(--rose)";
        s("circle", { class: "hit", cx, cy, r: 16 }, gp);
        s("circle", { cx, cy, r: p.kind === "ours" ? 7 : 6, fill: p.kind === "ours-hollow" ? "var(--surface)" : col, stroke: p.kind === "ours-hollow" ? col : "var(--surface)", "stroke-width": p.kind === "ours-hollow" ? 2.2 : 2 }, gp);
        const anchor = p.anchor || (cx > W * 0.7 ? "end" : "start");
        const dx = anchor === "end" ? -Math.abs(p.dx) : Math.abs(p.dx);
        text(gp, cx + dx, cy + p.dy, p.name, p.kind === "base" ? "lbl-muted" : "lbl", { "text-anchor": anchor });
        bindTip(gp, () => `<div class="tt-head">${esc(p.name)}</div>${ttRow(col, "V⋆ accuracy", fmt2(p.y) + "%", p.kind === "ours-hollow")}${ttRow(col, "Latency", p.x + " s", p.kind === "ours-hollow")}`);
      });
    });
    dataTable(el, ["Method", "V* accuracy (%)", "Latency (s)"], pts.map((p) => [p.name, fmt2(p.y), p.x]));
  }

  // single stacked bar (part-to-whole), 2px surface gaps
  function stackBar(el, parts) {
    const total = parts.reduce((a, p) => a + p.v, 0);
    chart(el, (el, W) => {
      const H = 34, barH = 22;
      const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": parts.map((p) => `${p.label}: ${fmtInt(p.v)}`).join("; ") }, el);
      let x0 = 0;
      parts.forEach((p, i) => {
        const w = (p.v / total) * W - (i < parts.length - 1 ? 2 : 0);
        const gp = s("g", { class: "row" }, svg);
        const r = 4, first = i === 0, last = i === parts.length - 1;
        s("rect", { class: "hit", x: x0, y: 0, width: w, height: H }, gp);
        s("rect", { x: x0, y: 4, width: w, height: barH, rx: first || last ? r : 0, fill: p.color }, gp);
        if (!first && last) s("rect", { x: x0, y: 4, width: Math.min(r, w), height: barH, fill: p.color }, gp);
        if (first && !last) s("rect", { x: x0 + w - Math.min(r, w), y: 4, width: Math.min(r, w), height: barH, fill: p.color }, gp);
        const pct = ((p.v / total) * 100).toFixed(1);
        if (w > 64) text(gp, x0 + 9, 4 + barH / 2 + 4, `${p.short} ${pct}%`, "val", { fill: i === 0 ? "var(--ink)" : "#fff", style: `fill:${i === 0 ? "var(--ink)" : "#fff"}` });
        bindTip(gp, () => `<div class="tt-head">${esc(p.label)}</div>${ttRow(p.color, "Traces", fmtInt(p.v))}${ttRow(p.color, "Share", pct + "%")}`);
        x0 += w + 2;
      });
    });
    dataTable(el, ["Level", "Traces", "Share"], parts.map((p) => [p.label, fmtInt(p.v), ((p.v / total) * 100).toFixed(1) + "%"]));
  }

  /* ────────────────────────────── page parts ────────────────────────────── */

  // links: empty href → "soon"
  $$("a[data-link]").forEach((a) => {
    if (!a.getAttribute("href")) {
      a.classList.add("is-soon"); a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); a.title = "Coming soon";
    } else { a.target = "_blank"; a.rel = "noopener"; }
  });

  // top bar state + active section
  const topbar = $(".topbar");
  const onScroll = () => topbar.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const tocLinks = $$(".toc a");
  const secObs = new IntersectionObserver((ents) => {
    ents.forEach((e) => { if (e.isIntersecting) tocLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id)); });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["idea", "method", "data", "results", "analysis", "cite"].forEach((id) => { const el = document.getElementById(id); if (el) secObs.observe(el); });

  const EX = window.TM_EXAMPLES || { pretext: [], instruct: [] };

  /* hero strip: seven corrupt → restore tiles */
  (function strip() {
    const picks = { jigsaw: 1, colorization: 2, super_resolution: 4, masked_inpainting: 2, orthogonal_transform: 3, denoising: 4, deformation_recovery: 3 };
    const ol = $("#strip"); if (!ol) return;
    const tiles = EX.pretext.map((t, i) => {
      const ex = t.examples.find((e) => e.id === picks[t.key]) || t.examples[0];
      const li = h("li", { class: "tile", tabindex: "0", "aria-label": `${t.name}: corrupted input and restored target` },
        `<div class="tile-frame"><span class="tile-state"></span><img class="before" src="${ex.input}" alt="" loading="eager"><img class="after" src="${ex.output}" alt="" loading="eager"><span class="scan"></span></div>
         <div class="tile-label"><span class="n">0${i + 1}</span>${esc(t.name)}</div>`);
      li.addEventListener("click", () => { document.getElementById("method")?.scrollIntoView(); selectPretext(i); });
      li.addEventListener("keydown", (e) => { if (e.key === "Enter") li.click(); });
      li.addEventListener("pointerenter", () => li.classList.add("is-restored"));
      li.addEventListener("focus", () => li.classList.add("is-restored"));
      ol.appendChild(li);
      return li;
    });
    const btn = $("#strip-toggle");
    if (reduceMotion) { btn.hidden = true; return; }
    let playing = true, visible = true, timer = null, step = 0;
    const N = tiles.length;
    // sequence: restore 0..N-1 one by one, hold, corrupt all, hold, repeat
    function tick() {
      if (!playing || !visible) { timer = setTimeout(tick, 400); return; }
      if (step < N) { tiles[step].classList.add("is-restored"); step++; timer = setTimeout(tick, 520); }
      else if (step === N) { step++; timer = setTimeout(tick, 2600); }
      else { tiles.forEach((t, i) => setTimeout(() => t.classList.remove("is-restored"), i * 70)); step = 0; timer = setTimeout(tick, 1900); }
    }
    timer = setTimeout(tick, 700);
    btn.addEventListener("click", () => {
      playing = !playing; btn.textContent = playing ? "Pause" : "Play"; btn.setAttribute("aria-pressed", String(!playing));
    });
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(ol);
  })();

  /* key numbers */
  $$(".keynum").forEach((el) => {
    const L = LEVELS[el.dataset.level]; const d = L.ours - L.base;
    el.innerHTML = `<span class="lv">${el.dataset.level}</span><div class="bar"><span class="from"></span></div><div class="val">${fmt2(L.ours)}<small>${fmtD(d)}</small></div>`;
    const bar = $(".bar", el);
    const W = 200, H = 26, x = linear(20, 75, 4, W - 4);
    const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "none", "aria-label": `${L.name}: ${fmt2(L.base)} to ${fmt2(L.ours)}` });
    s("line", { x1: 4, x2: W - 4, y1: H / 2, y2: H / 2, stroke: "var(--grid)", "stroke-width": 1 }, svg);
    s("line", { x1: x(L.base), x2: x(L.ours), y1: H / 2, y2: H / 2, stroke: "var(--rose)", "stroke-opacity": .4, "stroke-width": 2 }, svg);
    bar.appendChild(svg);
    // dots as HTML so they stay round under preserveAspectRatio="none"
    const dot = (v, col, size) => { const i = h("i"); i.style.cssText = `position:absolute;top:50%;left:${(x(v) / W) * 100}%;width:${size}px;height:${size}px;margin:-${size / 2}px 0 0 -${size / 2}px;border-radius:50%;background:${col};box-shadow:0 0 0 2px var(--surface)`; bar.appendChild(i); };
    dot(L.base, "var(--gray-mark)", 9); dot(L.ours, "var(--rose)", 11);
    $(".from", el).textContent = "";
    el.title = `${L.name}: BAGEL think-4k ${fmt2(L.base)} → ThinkMorph-SSL ${fmt2(L.ours)}`;
    const lab = h("div", { class: "from" }, `think-4k ${fmt2(L.base)}`); lab.style.cssText = "position:absolute;left:0;top:100%;margin-top:2px;white-space:nowrap";
    bar.appendChild(lab);
  });

  /* base-model charts */
  barChart($("#ch-base-l3"), BASE_L3, { domain: [0, 40], step: 10 });
  barChart($("#ch-base-force"), BASE_FORCE, { domain: [0, 50], step: 10 });

  /* Stage 1 explorer */
  let selectPretext = () => {};
  (function pretextExplorer() {
    const tabs = $("#ex-pretext-tabs"), pager = $("#ex-pretext-pager"), src = $("#ex-pretext-source"), body = $("#ex-pretext-body");
    if (!tabs || !EX.pretext.length) return;
    let ti = 0, ei = 0;
    EX.pretext.forEach((t, i) => {
      const b = h("button", { role: "tab", "aria-selected": i === 0 ? "true" : "false" }, esc(t.name));
      b.addEventListener("click", () => { ti = i; ei = 0; render(); });
      tabs.appendChild(b);
    });
    function render() {
      $$("button", tabs).forEach((b, i) => b.setAttribute("aria-selected", i === ti ? "true" : "false"));
      const t = EX.pretext[ti], ex = t.examples[ei];
      pager.innerHTML = "";
      t.examples.forEach((e, i) => {
        const b = h("button", { type: "button", "aria-pressed": i === ei ? "true" : "false", "aria-label": `Example ${i + 1}` }, String(i + 1));
        b.addEventListener("click", () => { ei = i; render(); });
        pager.appendChild(b);
      });
      src.textContent = `${t.name} · example ${ex.id} · image source: ${ex.source}`;
      body.innerHTML = `
        <div class="step"><div class="step-head"><span class="step-tok in">I<sub>c</sub></span><span class="step-name">corrupted input</span></div>
          <img src="${ex.input}" alt="${esc(t.name)} example ${ex.id}: corrupted input" width="${ex.w}" height="${ex.h}">
          <p class="noprompt">text prompt: none</p></div>
        <div class="step"><span class="step-arrow" aria-hidden="true">→</span><div class="step-head"><span class="step-tok">T<sub>0</sub></span><span class="step-name">describe</span></div>
          <p class="thought">${esc(ex.t0)}</p></div>
        <div class="step"><span class="step-arrow" aria-hidden="true">→</span><div class="step-head"><span class="step-tok gen">I<sub>0</sub></span><span class="step-name">restore</span></div>
          <span class="gen-tag">&lt;gen_image&gt; · target: the original</span>
          <img src="${ex.output}" alt="${esc(t.name)} example ${ex.id}: restored target image" width="${ex.w}" height="${ex.h}"></div>
        <div class="step"><span class="step-arrow" aria-hidden="true">→</span><div class="step-head"><span class="step-tok">T<sub>1</sub></span><span class="step-name">describe result</span></div>
          <p class="thought">${esc(ex.t1)}</p></div>`;
    }
    selectPretext = (i) => { ti = i; ei = 0; render(); };
    render();
  })();

  /* Stage 2 explorer */
  (function instructExplorer() {
    const tabs = $("#ex-instruct-tabs"), pager = $("#ex-instruct-pager"), src = $("#ex-instruct-source"), body = $("#ex-instruct-body");
    if (!tabs || !EX.instruct.length) return;
    let ti = EX.instruct.findIndex((t) => t.key === "mindcube_bev"); if (ti < 0) ti = 0;
    let ei = 0, lastLevel = null;
    EX.instruct.forEach((t, i) => {
      if (t.level !== lastLevel) { tabs.appendChild(h("span", { class: "tab-group-label", "aria-hidden": "true" }, t.level)); lastLevel = t.level; }
      const b = h("button", { role: "tab", "aria-selected": "false", "data-i": i, "aria-label": `${t.name}, level ${t.level.slice(1)}` }, esc(t.name));
      b.addEventListener("click", () => { ti = i; ei = 0; render(); });
      tabs.appendChild(b);
    });
    const sub = (k) => `<sub>${k}</sub>`;
    function render() {
      $$("button", tabs).forEach((b) => b.setAttribute("aria-selected", +b.dataset.i === ti ? "true" : "false"));
      const t = EX.instruct[ti], ex = t.examples[ei];
      pager.innerHTML = "";
      t.examples.forEach((e, i) => {
        const b = h("button", { type: "button", "aria-pressed": i === ei ? "true" : "false", "aria-label": `Example ${i + 1}` }, String(i + 1));
        b.addEventListener("click", () => { ei = i; render(); });
        pager.appendChild(b);
      });
      src.textContent = `${t.level} · ${t.name} · source: ${ex.source}`;
      const n = ex.inputs.length;
      const ins = ex.inputs.map((im) => `<figure><img src="${im.src}" alt="Input: ${esc(im.label)}" width="${im.w}" height="${im.h}" loading="lazy">${n > 1 ? `<figcaption class="cap">${esc(im.label)}</figcaption>` : ""}</figure>`).join("");
      let steps = "";
      ex.thoughts.forEach((th, k) => {
        steps += `<div class="istep"><div class="rail"><span>T${sub(k)}</span></div><div><p class="lab">${esc(th.label)}</p><p class="thought">${esc(th.text)}</p></div></div>`;
        const g = ex.gens[k];
        if (g) steps += `<div class="istep is-gen"><div class="rail"><span>I${sub(k)}</span></div><div><p class="lab">&lt;gen_image&gt; · ${esc(g.label)}</p><figure><img src="${g.src}" alt="Intermediate image: ${esc(g.label)}" width="${g.w}" height="${g.h}" loading="lazy"></figure></div></div>`;
      });
      ex.gens.slice(ex.thoughts.length).forEach((g, j) => {
        const k = ex.thoughts.length + j;
        steps += `<div class="istep is-gen"><div class="rail"><span>I${sub(k)}</span></div><div><p class="lab">&lt;gen_image&gt; · ${esc(g.label)}</p><figure><img src="${g.src}" alt="Intermediate image: ${esc(g.label)}" loading="lazy"></figure></div></div>`;
      });
      steps += `<div class="istep is-ans"><div class="rail"><span>A</span></div><div><p class="lab">answer</p><span class="ans">${esc(ex.answer)}</span></div></div>`;
      body.innerHTML = `<div class="iq"><div class="iq-text"><p class="k">Question</p><p>${esc(ex.question)}</p></div><div class="iq-imgs n${Math.min(n, 5)}">${ins}</div></div><div class="isteps">${steps}</div>`;
    }
    render();
  })();

  /* data: level breakdown */
  legend($("#lg-levels"), INSTRUCT_LEVELS.map((p) => ({ name: `${p.label} · ${fmtInt(p.v)}`, color: p.color })));
  stackBar($("#ch-levels"), INSTRUCT_LEVELS);

  /* results dumbbell */
  const tgNoThink = $("#tg-nothink");
  const dbGroups = [
    { name: "L1 · Basic visual perception", rows: [...L1_COLS.map((c, i) => ({ label: c, a: T4K[2][i], b: OURS[2][i], c: NOTHINK[2][i] })), { label: "L1 average", a: T4K[3], b: OURS[3], c: NOTHINK[3], strong: true }] },
    { name: "L2 · Static spatial understanding", rows: [...L2_COLS.map((c, i) => ({ label: c, a: T4K[4][i], b: OURS[4][i], c: NOTHINK[4][i] })), { label: "L2 average", a: T4K[6], b: OURS[6], c: NOTHINK[6], strong: true }] },
    { name: "L3 · Mental world modeling", rows: [...L3_COLS.map((c, i) => ({ label: c, a: T4K[5][i], b: OURS[5][i], c: NOTHINK[5][i] })), { label: "L3 average", a: T4K[7], b: OURS[7], c: NOTHINK[7], strong: true }] },
  ];
  const dbEl = $("#ch-dumbbell");
  const lgDb = () => legend($("#lg-dumbbell"), [
    ...(tgNoThink.checked ? [{ name: "BAGEL no-think", color: "var(--ink-3)", shape: "ring" }] : []),
    { name: "BAGEL think-4k", color: "var(--gray-mark)", shape: "dot" },
    { name: "ThinkMorph-SSL", color: "var(--rose)", shape: "dot" },
  ]);
  lgDb();
  dumbbell(dbEl, dbGroups, { domain: [0, 100], step: 20, aName: "BAGEL think-4k", bName: "ThinkMorph-SSL", cName: "BAGEL no-think", showC: () => tgNoThink.checked, unit: "%" });
  tgNoThink.addEventListener("change", () => { lgDb(); dbEl._redraw(); });

  /* results table */
  (function resultsTable() {
    const box = $("#tbl-results"), tabs = $("#tbl-tabs"); if (!box) return;
    const cell = (v, cls = "") => `<td class="${cls}">${typeof v === "number" ? fmt2(v) : v}</td>`;
    function build(which) {
      const cols = which === "l1" ? [...L1_COLS, "L1 avg"] : [...L2_COLS, ...L3_COLS, "L2 avg", "L3 avg"];
      const vals = (r) => which === "l1" ? [...r[2], r[3]] : [...r[4], ...r[5], r[6], r[7]];
      const avgIdx = which === "l1" ? [5] : [8, 9];
      let head = which === "l1"
        ? `<tr class="lv"><th></th><th colspan="5">Level 1 · Basic visual perception</th><th class="avg">Avg</th></tr>`
        : `<tr class="lv"><th></th><th colspan="4">Level 2 · Static spatial</th><th colspan="4">Level 3 · Mental world modeling</th><th colspan="2" class="avg">Avg</th></tr>`;
      head += `<tr><th>Model</th>${cols.map((c, i) => `<th class="${avgIdx.includes(i) ? "avg" : ""}">${star(c)}</th>`).join("")}</tr>`;
      let bodyHtml = "", grp = null;
      RESULTS.forEach((r) => {
        if (r[1] !== grp && r[1] !== "ours") { grp = r[1]; bodyHtml += `<tr class="grp"><td colspan="${cols.length + 1}">${esc(grp)}</td></tr>`; }
        const v = vals(r);
        const cls = r[1] === "ours" ? "ours" : `m${r[0] === "BAGEL think-4k" ? " ref" : ""}`;
        bodyHtml += `<tr class="${cls}"><td>${esc(r[0])}</td>${v.map((x, i) => cell(x, avgIdx.includes(i) ? "avg" : "")).join("")}</tr>`;
        if (r[1] === "ours") {
          const b = vals(T4K);
          bodyHtml += `<tr class="delta"><td>Δ vs. think-4k</td>${v.map((x, i) => cell(fmtD(x - b[i]), avgIdx.includes(i) ? "avg" : "")).join("")}</tr>`;
        }
      });
      box.innerHTML = `<table class="rtable"><thead>${head}</thead><tbody>${bodyHtml}</tbody></table>`;
    }
    $$("button", tabs).forEach((b) => b.addEventListener("click", () => {
      $$("button", tabs).forEach((x) => x.setAttribute("aria-selected", x === b ? "true" : "false"));
      build(b.dataset.t);
    }));
    build("l1");
  })();

  /* ablations */
  legend($("#lg-fixed"), [{ name: "Stage 2 only", color: "var(--gray-mark)", shape: "dot" }, { name: "Stage 1 → Stage 2", color: "var(--rose)", shape: "dot" }]);
  dumbbell($("#ch-fixed"), [{ rows: FIXED_BUDGET.map((r) => ({ ...r, label: `${r.label}`, sub: r.sub })) }],
    { domain: [20, 70], step: 10, aName: "Stage 2 only", bName: "Stage 1 → Stage 2", unit: "%", rowH: 52, showSub: true, labMax: 110 });

  (function ablation() {
    const tabs = $("#abl-tabs"), el = $("#ch-abl"), note = $("#abl-note"); if (!el) return;
    let key = "order";
    const draw = () => {
      const a = ABL[key];
      legend($("#lg-abl"), a.series.map((se) => ({ name: se.name + (se.approx ? " (≈, read from figure)" : ""), color: se.color, shape: "line", dash: se.dash })));
      note.textContent = a.note;
      dataTable(el, ["Series", "Epoch 1", "Epoch 2", "Epoch 3", "Epoch 4"], a.series.map((se) => [se.name + (se.approx ? " (≈)" : ""), ...se.values.map((v) => String(v))]));
    };
    lineChart(el, () => ({ series: ABL[key].series.map((se) => ({ ...se, short: se.name.replace(" (ours)", "").replace("Stage 1", "S1").replace("Stage 2", "S2") })), xs: [1, 2, 3, 4], domain: [50, 70], step: 5 }));
    draw();
    $$("button", tabs).forEach((b) => b.addEventListener("click", () => {
      $$("button", tabs).forEach((x) => x.setAttribute("aria-selected", x === b ? "true" : "false"));
      key = b.dataset.k; draw(); el._redraw();
    }));
  })();

  legend($("#lg-use"), [{ name: "Without image", color: "var(--gray-mark)", shape: "dot" }, { name: "With image", color: "var(--rose)", shape: "dot" }]);
  dumbbell($("#ch-use"), [{ rows: IMAGE_USE }], { domain: [0, 80], step: 20, aName: "Without image", bName: "With image", unit: "%", fmt: (v) => v.toFixed(1), rowH: 52, showSub: true, labMax: 170 });
  legend($("#lg-defect"), [{ name: "No critical defect", color: "var(--gray-mark)", shape: "dot" }, { name: "Critical defect", color: "var(--amber)", shape: "dot" }]);
  dumbbell($("#ch-defect"), [{ rows: DEFECT }], { domain: [0, 80], step: 20, aName: "No critical defect", bName: "Critical defect", bColor: "var(--amber)", unit: "%", fmt: (v) => v.toFixed(1), rowH: 52, showSub: true, labMax: 170 });

  legend($("#lg-cost"), [{ name: "BAGEL (text)", color: "var(--gray-mark)", shape: "dot" }, { name: "ThinkMorph-SSL", color: "var(--rose)", shape: "dot" }, { name: "+ TeaCache", color: "var(--rose)", shape: "ring" }]);
  scatter($("#ch-cost"), COST, { xDomain: [0, 120], yDomain: [50, 75], xStep: 30, yStep: 5 });

  legend($("#lg-len"), [{ name: "BAGEL think-4k", color: "var(--gray-mark)" }, { name: "ThinkMorph-SSL", color: "var(--rose)" }]);
  pairBars($("#ch-len"), TRACE_LEN, { domain: [0, 6000], step: 2000, aName: "BAGEL think-4k", bName: "ThinkMorph-SSL", tickFmt: (t) => (t ? t / 1000 + "k" : "0") });

  /* bibtex copy */
  const copyBtn = $("#bib-copy");
  copyBtn?.addEventListener("click", async () => {
    const txt = $("#bib-text").innerText;
    try { await navigator.clipboard.writeText(txt); copyBtn.textContent = "Copied"; }
    catch { const r = document.createRange(); r.selectNodeContents($("#bib-text")); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); copyBtn.textContent = "Selected"; }
    setTimeout(() => (copyBtn.textContent = "Copy"), 1600);
  });

  /* lightbox */
  const lb = $("#lightbox");
  $$(".zoom-btn").forEach((b) => b.addEventListener("click", () => {
    const img = $("img", b); $("img", lb).src = img.src; $("img", lb).alt = img.alt;
    if (lb.showModal) lb.showModal(); else window.open(img.src);
  }));
  lb?.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lightbox-close")) lb.close(); });

  /* reveal */
  if (!reduceMotion && "IntersectionObserver" in window) {
    const els = $$(".chart-card, .fig, .stage, .corpus, .explorer, .callout");
    els.forEach((el) => el.classList.add("reveal"));
    const ro = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => ro.observe(el));
  }
})();
