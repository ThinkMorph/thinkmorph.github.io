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

  const LEVELS = {
    L1: { name: "Basic visual perception", ours: OURS[3], base: T4K[3] },
    L2: { name: "Static spatial understanding", ours: OURS[6], base: T4K[6] },
    L3: { name: "Mental world modeling", ours: OURS[7], base: T4K[7] },
  };

  /* ────────────────────────────── helpers ────────────────────────────── */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fmt2 = (v) => v.toFixed(2);
  const fmtD = (v) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(2);
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
    const L = LEVELS[el.dataset.level];
    el.innerHTML = `<span class="lv">${el.dataset.level}</span><span class="name">${esc(L.name)}</span><span class="val">${fmt2(L.ours)}<small>${fmtD(L.ours - L.base)}</small></span>`;
  });

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
    const els = $$(".fig, .stage, .corpus, .explorer, .table-scroll");
    els.forEach((el) => el.classList.add("reveal"));
    const ro = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => ro.observe(el));
  }
})();
