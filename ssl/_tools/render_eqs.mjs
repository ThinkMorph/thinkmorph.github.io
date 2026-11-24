// Pre-render the two method equations (paper notation, section/3_method.tex) to static KaTeX HTML.
import katex from "katex";
import fs from "node:fs";
const eqs = {
  stage1: String.raw`\begin{aligned}
p_\theta(T_0, I_0, T_1 \mid I_c)
&= p_\theta(T_0 \mid I_c)\, p_\theta(I_0 \mid I_c, T_0) \\
&\phantom{=}\;\, p_\theta(T_1 \mid I_c, T_0, I_0)
\end{aligned}`,
  stage2: String.raw`(x^{\text{img}}, x^{\text{text}}) \rightarrow T_0 \rightarrow I_0 \rightarrow \cdots \rightarrow T_K`,
};
const out = {};
for (const [k, tex] of Object.entries(eqs)) out[k] = katex.renderToString(tex, { displayMode: true, output: "htmlAndMathml", throwOnError: true });
fs.writeFileSync(process.argv[2], JSON.stringify(out));
console.log(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length])));
