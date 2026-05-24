# Rota Topic Schema — LLM Content Generation Spec

Use this document as a system prompt or context when asking any LLM API to generate new educational content for the Rota platform.

---

## What you are generating

Rota is a browser-based learning platform. Content is stored as static JSON files. There are two kinds of files you may need to produce:

1. **A topic file** — one page of educational content, stored at  
   `frontend/public/content/subjects/<subject-id>/<topic-id>.json`

2. **A manifest entry** — a short object added to the `subjects[]` array in  
   `frontend/public/content/manifest.json`

Once files exist on disk the platform picks them up automatically — no rebuild is needed while the dev server is running.

---

## File 1: Topic JSON

### Top-level fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | kebab-case, unique within the subject (e.g. `"vector-spaces"`) |
| `title` | string | yes | Display title shown in the sidebar and page header |
| `estimatedMinutes` | number | no | Rough read time shown to learners |
| `blocks` | Block[] | yes | Ordered array of content blocks — see below |

### Block types

Every block object has a `"type"` field. The remaining fields depend on the type.

---

#### `text`

Prose content. Use for explanations, definitions, and transitions between blocks.

```json
{
  "type": "text",
  "content": "<p>Your HTML here. Supports <strong>bold</strong>, <em>italic</em>, <code>code</code>, <h2>, <h3>, <ul>, <ol>, <li>, <blockquote>, and <a href=\"...\">links</a>.</p>"
}
```

**Rules:**
- `content` is HTML, not Markdown — use `<p>`, `<strong>`, `<h3>` etc.
- Allowed tags: `p br strong em b i h2 h3 h4 ul ol li code pre blockquote a span`
- Keep `<h2>` for major section headings, `<h3>` for sub-headings within a section
- Do not put LaTeX inside text blocks — use a `math` block instead

---

#### `math`

A LaTeX / KaTeX expression. Use for equations, formulas, and definitions.

```json
{
  "type": "math",
  "display": true,
  "content": "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `content` | string | yes | LaTeX string. Escape backslashes: `\\frac`, `\\vec`, etc. |
| `display` | boolean | no | `true` = centred block equation (default). `false` = inline. |

**Common LaTeX patterns:**
```
Fraction:      \\frac{a}{b}
Square root:   \\sqrt{x}
Subscript:     x_i   or   x_{ij}
Superscript:   x^2   or   x^{n-1}
Vector:        \\vec{v}
Matrix:        \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}
Sum:           \\sum_{i=1}^{n} x_i
Limit:         \\lim_{h \\to 0}
Greek:         \\alpha \\beta \\theta \\sigma \\mu \\pi
Infinity:      \\infty
```

---

#### `chart`

A data chart rendered with Recharts. Use for visualising trends, comparisons, and distributions.

```json
{
  "type": "chart",
  "variant": "bar",
  "title": "Descriptive title shown above the chart",
  "data": [
    { "name": "Category A", "value1": 42, "value2": 18 },
    { "name": "Category B", "value1": 27, "value2": 35 }
  ],
  "keys": ["value1", "value2"],
  "colors": ["#4f46e5", "#10b981"]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `variant` | string | yes | One of: `"bar"` `"line"` `"area"` `"pie"` |
| `data` | object[] | yes | Each object is one data point. Must include `"name"` key for x-axis/labels. |
| `keys` | string[] | yes | Which keys from `data` to plot. Order matches `colors`. |
| `title` | string | no | Short descriptive title |
| `colors` | string[] | no | Hex color per key. Defaults to the subject theme color. |

**Variant guide:**
- `bar` — categorical comparisons (most common choice)
- `line` — continuous data over a sequence (trends, function values at sample points)
- `area` — like line but with filled area (distributions, cumulative values)
- `pie` — proportions (use sparingly; max ~5 slices)

---

#### `plot`

An interactive Plotly.js figure. Use for 3D surfaces, animated plots, or any visualisation needing Plotly's full feature set. This block is loaded lazily (does not affect page load time).

```json
{
  "type": "plot",
  "height": 400,
  "plotData": [
    {
      "type": "scatter",
      "mode": "lines",
      "x": [-3, -2, -1, 0, 1, 2, 3],
      "y": [9, 4, 1, 0, 1, 4, 9],
      "name": "x²",
      "line": { "color": "#4f46e5", "width": 2 }
    }
  ],
  "layout": {
    "title": "f(x) = x²",
    "xaxis": { "title": "x" },
    "yaxis": { "title": "f(x)" }
  }
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `plotData` | object[] | yes | Array of Plotly trace objects (same format as Plotly's `data` argument) |
| `layout` | object | no | Plotly layout object. `paper_bgcolor`, `height`, and `font` are set automatically. |
| `height` | number | no | Plot height in pixels. Default: `400` |

**Common Plotly trace types:** `scatter`, `bar`, `heatmap`, `surface`, `contour`, `histogram`

---

#### `visualization`

An interactive React component registered by name. Use for custom, highly interactive educational tools (e.g. draggable vector fields, animated simulations).

```json
{
  "type": "visualization",
  "component": "VectorSpace2D",
  "props": {
    "interactive": true,
    "vectors": [
      { "x": 3, "y": 1, "color": "#4f46e5", "label": "a" },
      { "x": 1, "y": 3, "color": "#10b981", "label": "b" }
    ]
  }
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `component` | string | yes | Must exactly match a key in `src/visualizations/registry.js` |
| `props` | object | no | Passed directly as React props to the component |

**Currently registered components:**

| Name | Props | Description |
|------|-------|-------------|
| `VectorSpace2D` | `vectors: [{x, y, color, label}]`, `interactive: boolean` | 2D coordinate grid with draggable vector arrows |
| `FunctionPlot` | `fnName: string`, `domain: [min,max]`, `range?: [min,max]`, `color?: string`, `label?: string` | Plots a named function. Valid `fnName` values: `"sin" "cos" "tan" "x^2" "x^3" "exp" "ln" "sqrt" "abs"` |

---

#### `embed`

A sandboxed iframe loading a standalone HTML file. Use for complex simulations or external interactive content.

```json
{
  "type": "embed",
  "src": "/content/subjects/physics/pendulum.html",
  "height": 500,
  "title": "Pendulum simulation"
}
```

The HTML file must be placed in `frontend/public/content/subjects/<subject>/`.  
The iframe has `sandbox="allow-scripts allow-same-origin"`.

---

#### `quiz`

A multiple-choice knowledge check with instant feedback and an explanation.

```json
{
  "type": "quiz",
  "question": "What is the derivative of f(x) = x³?",
  "options": ["x²", "3x²", "3x³", "x⁴/4"],
  "answer": 1,
  "explanation": "Using the power rule d/dx[xⁿ] = nxⁿ⁻¹: the derivative of x³ is 3x²."
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `question` | string | yes | The question text (plain text, no HTML) |
| `options` | string[] | yes | 2–4 answer choices (plain text). **Order matters.** |
| `answer` | number | yes | **Zero-based index** of the correct option in `options[]` |
| `explanation` | string | no | Shown after submission. Explain why the correct answer is right. |

**Quiz guidelines:**
- Include 2–4 quiz blocks per topic (placed throughout, not just at the end)
- Make wrong options plausible (not obviously silly)
- Keep question text under ~150 characters
- The `explanation` should be educational, not just "correct because it's correct"

---

## File 2: Manifest entry

When adding a **new subject**, add to `frontend/public/content/manifest.json`:

```json
{
  "id": "subject-id",
  "title": "Subject Title",
  "description": "One-sentence description shown on the catalog card.",
  "icon": "📐",
  "theme": {
    "primary": "#4f46e5",
    "accent": "#818cf8",
    "bg": "#eef2ff"
  },
  "topics": [
    {
      "id": "first-topic",
      "title": "First Topic Title",
      "file": "subject-id/first-topic.json",
      "estimatedMinutes": 20
    }
  ]
}
```

When adding a **new topic to an existing subject**, append to `topics[]`:

```json
{
  "id": "new-topic",
  "title": "New Topic Title",
  "file": "subject-id/new-topic.json",
  "estimatedMinutes": 15
}
```

**Theme colour suggestions** (pick one per subject):

| Palette | primary | accent | bg |
|---------|---------|--------|----|
| Indigo (maths) | `#4f46e5` | `#818cf8` | `#eef2ff` |
| Emerald (science) | `#059669` | `#34d399` | `#ecfdf5` |
| Amber (data/stats) | `#d97706` | `#fbbf24` | `#fffbeb` |
| Rose (CS/logic) | `#e11d48` | `#fb7185` | `#fff1f2` |
| Sky (physics) | `#0284c7` | `#38bdf8` | `#f0f9ff` |
| Violet (philosophy) | `#7c3aed` | `#a78bfa` | `#f5f3ff` |

---

## Complete worked example

Below is a complete, valid topic file covering "Eigenvalues" that demonstrates all block types.

```json
{
  "id": "eigenvalues",
  "title": "Eigenvalues & Eigenvectors",
  "estimatedMinutes": 25,
  "blocks": [
    {
      "type": "text",
      "content": "<p>An <strong>eigenvector</strong> of a matrix <em>A</em> is a non-zero vector <strong>v</strong> that only scales (not rotates) when multiplied by <em>A</em>. The scaling factor is the corresponding <strong>eigenvalue</strong> λ.</p>"
    },
    {
      "type": "math",
      "display": true,
      "content": "A\\vec{v} = \\lambda\\vec{v}"
    },
    {
      "type": "text",
      "content": "<h3>Finding Eigenvalues</h3><p>Rearranging: <em>(A − λI)v = 0</em>. For non-trivial solutions, the determinant must be zero:</p>"
    },
    {
      "type": "math",
      "display": true,
      "content": "\\det(A - \\lambda I) = 0"
    },
    {
      "type": "text",
      "content": "<h3>Example</h3><p>Find the eigenvalues of:</p>"
    },
    {
      "type": "math",
      "display": true,
      "content": "A = \\begin{bmatrix} 3 & 1 \\\\ 0 & 2 \\end{bmatrix}"
    },
    {
      "type": "math",
      "display": true,
      "content": "\\det\\begin{bmatrix} 3-\\lambda & 1 \\\\ 0 & 2-\\lambda \\end{bmatrix} = (3-\\lambda)(2-\\lambda) = 0 \\implies \\lambda_1 = 3,\\; \\lambda_2 = 2"
    },
    {
      "type": "visualization",
      "component": "VectorSpace2D",
      "props": {
        "interactive": true,
        "vectors": [
          { "x": 1, "y": 0, "color": "#4f46e5", "label": "e₁" },
          { "x": 0, "y": 1, "color": "#10b981", "label": "e₂" }
        ]
      }
    },
    {
      "type": "chart",
      "variant": "bar",
      "title": "Eigenvalues of sample matrices",
      "data": [
        { "name": "[[3,1],[0,2]]", "λ₁": 3, "λ₂": 2 },
        { "name": "[[4,0],[0,4]]", "λ₁": 4, "λ₂": 4 },
        { "name": "[[1,2],[2,1]]", "λ₁": 3, "λ₂": -1 }
      ],
      "keys": ["λ₁", "λ₂"],
      "colors": ["#4f46e5", "#10b981"]
    },
    {
      "type": "quiz",
      "question": "For a matrix A and eigenvector v with eigenvalue λ, which equation holds?",
      "options": ["Av = v + λ", "Av = λv", "Av = λ + v", "A + λ = v"],
      "answer": 1,
      "explanation": "By definition, Av = λv — applying A to an eigenvector just scales it by the eigenvalue λ."
    },
    {
      "type": "quiz",
      "question": "How do you find eigenvalues of a matrix A?",
      "options": [
        "Solve Av = 0",
        "Compute det(A)",
        "Solve det(A − λI) = 0",
        "Find the trace of A"
      ],
      "answer": 2,
      "explanation": "Eigenvalues satisfy det(A − λI) = 0, called the characteristic equation. Its solutions are the eigenvalues."
    }
  ]
}
```

---

## Content quality guidelines

### Pedagogical structure
- Open each topic with a plain-English definition before any formulas
- Introduce notation gradually; never use a symbol without defining it first
- Alternate block types — avoid more than 3 consecutive `text` or `math` blocks
- Close each topic with 2–4 `quiz` blocks spread throughout (not clustered at the end)

### Block selection guidance
- **Concept introduction** → `text` + `math`
- **Geometric intuition** → `visualization` (VectorSpace2D, FunctionPlot)
- **Numerical comparison** → `chart` (bar or line)
- **Precise scientific plot** → `plot` (Plotly scatter/surface)
- **Knowledge verification** → `quiz` (throughout, not just at end)

### Writing style
- Second-person, present tense ("the derivative is", "you can see that")
- Prefer concrete examples before abstract generalisations
- Keep `<p>` blocks to 2–4 sentences
- `quiz.explanation` should complete the learner's understanding, not just confirm correctness

### Field constraints
- `id` fields: lowercase letters, digits, hyphens only — no spaces or underscores
- `options[]` in quiz: 2–4 items; the correct one must be at index `answer`
- LaTeX in `math.content`: double-escape backslashes in JSON (`\\frac`, not `\frac`)
- Chart `data[].name` values: keep short (≤ 15 chars) so axis labels don't overlap

---

## Adding content: step-by-step

1. **Generate the topic JSON** — use this document as a system prompt and ask the LLM to produce `{ "id": ..., "title": ..., "blocks": [...] }`

2. **Save the file**  
   `frontend/public/content/subjects/<subject-id>/<topic-id>.json`

3. **Update the manifest**  
   Open `frontend/public/content/manifest.json` and append to the correct subject's `topics[]` array:
   ```json
   { "id": "topic-id", "title": "Topic Title", "file": "subject-id/topic-id.json", "estimatedMinutes": 20 }
   ```

4. **If it is a new subject**, add a full subject entry to `subjects[]` in the manifest.

5. **No rebuild needed** — the platform fetches content files at runtime. Refresh the browser.
