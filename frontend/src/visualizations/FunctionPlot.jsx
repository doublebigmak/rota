import { useMemo } from 'react';

const W = 480;
const H = 320;

const FNS = {
  sin:  (x) => Math.sin(x),
  cos:  (x) => Math.cos(x),
  tan:  (x) => Math.tan(x),
  'x^2': (x) => x * x,
  'x^3': (x) => x * x * x,
  exp:  (x) => Math.exp(x),
  ln:   (x) => Math.log(x),
  sqrt: (x) => Math.sqrt(x),
  abs:  (x) => Math.abs(x),
};

export default function FunctionPlot({
  fnName = 'sin',
  domain = [-Math.PI * 2, Math.PI * 2],
  range = null,
  steps = 300,
  color = 'var(--color-primary)',
  label = null,
}) {
  const fn = FNS[fnName] || FNS.sin;
  const [xMin, xMax] = domain;

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const y = fn(x);
      if (isFinite(y)) pts.push([x, y]);
    }
    return pts;
  }, [fn, xMin, xMax, steps]);

  const yVals = points.map(([, y]) => y);
  const yMin = range ? range[0] : Math.min(...yVals);
  const yMax = range ? range[1] : Math.max(...yVals);

  const pad = { t: 24, r: 24, b: 36, l: 44 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  function toSVG(x, y) {
    const sx = pad.l + ((x - xMin) / (xMax - xMin)) * innerW;
    const sy = pad.t + (1 - (y - yMin) / (yMax - yMin)) * innerH;
    return [sx, sy];
  }

  // Build path
  let d = '';
  let penDown = false;
  for (const [x, y] of points) {
    if (!isFinite(y) || y < yMin - 0.5 * (yMax - yMin) || y > yMax + 0.5 * (yMax - yMin)) {
      penDown = false;
      continue;
    }
    const [sx, sy] = toSVG(x, y);
    if (!penDown) { d += `M ${sx} ${sy} `; penDown = true; }
    else d += `L ${sx} ${sy} `;
  }

  // Axis ticks
  const xTicks = [];
  const tickCount = 6;
  for (let i = 0; i <= tickCount; i++) {
    const x = xMin + (i / tickCount) * (xMax - xMin);
    const [sx] = toSVG(x, yMin);
    xTicks.push({ x, sx });
  }
  const yTicks = [];
  for (let i = 0; i <= 4; i++) {
    const y = yMin + (i / 4) * (yMax - yMin);
    const [, sy] = toSVG(xMin, y);
    yTicks.push({ y, sy });
  }

  // Zero axis lines
  const [, zeroY] = toSVG(xMin, 0);
  const [zeroX] = toSVG(0, yMin);
  const showZeroH = 0 >= yMin && 0 <= yMax;
  const showZeroV = 0 >= xMin && 0 <= xMax;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W }}>
        {/* Grid */}
        {yTicks.map(({ sy }, i) => (
          <line key={i} x1={pad.l} y1={sy} x2={pad.l + innerW} y2={sy} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {xTicks.map(({ sx }, i) => (
          <line key={i} x1={sx} y1={pad.t} x2={sx} y2={pad.t + innerH} stroke="#e2e8f0" strokeWidth={0.5} />
        ))}

        {/* Zero axes */}
        {showZeroH && <line x1={pad.l} y1={zeroY} x2={pad.l + innerW} y2={zeroY} stroke="#94a3b8" strokeWidth={1} />}
        {showZeroV && <line x1={zeroX} y1={pad.t} x2={zeroX} y2={pad.t + innerH} stroke="#94a3b8" strokeWidth={1} />}

        {/* Curve */}
        <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* X tick labels */}
        {xTicks.map(({ x, sx }) => (
          <text key={x} x={sx} y={pad.t + innerH + 16} fontSize={10} fill="#64748b" textAnchor="middle">
            {x % 1 === 0 ? x : x.toFixed(1)}
          </text>
        ))}
        {/* Y tick labels */}
        {yTicks.map(({ y, sy }) => (
          <text key={y} x={pad.l - 6} y={sy + 4} fontSize={10} fill="#64748b" textAnchor="end">
            {y % 1 === 0 ? y : y.toFixed(1)}
          </text>
        ))}

        {/* Label */}
        {label && (
          <text x={pad.l + innerW - 4} y={pad.t + 14} fontSize={12} fill={color} textAnchor="end" fontWeight="bold">
            {label}
          </text>
        )}
      </svg>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
        f(x) = {label || fnName}, x ∈ [{xMin.toFixed(2)}, {xMax.toFixed(2)}]
      </p>
    </div>
  );
}
