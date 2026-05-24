import { useRef, useState, useCallback, useEffect } from 'react';

const W = 480;
const H = 400;
const ORIGIN_X = W / 2;
const ORIGIN_Y = H / 2;
const SCALE = 44; // pixels per unit
const GRID_RANGE = 5;

function toScreen(x, y) {
  return [ORIGIN_X + x * SCALE, ORIGIN_Y - y * SCALE];
}

function fromScreen(sx, sy) {
  return [(sx - ORIGIN_X) / SCALE, -(sy - ORIGIN_Y) / SCALE];
}

function Arrow({ x1, y1, x2, y2, color, label }) {
  const [sx1, sy1] = toScreen(x1, y1);
  const [sx2, sy2] = toScreen(x2, y2);

  const dx = sx2 - sx1;
  const dy = sy2 - sy1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return null;

  const angle = Math.atan2(dy, dx);
  const headLen = 12;
  const tipX = sx2;
  const tipY = sy2;
  const leftX = tipX - headLen * Math.cos(angle - Math.PI / 6);
  const leftY = tipY - headLen * Math.sin(angle - Math.PI / 6);
  const rightX = tipX - headLen * Math.cos(angle + Math.PI / 6);
  const rightY = tipY - headLen * Math.sin(angle + Math.PI / 6);

  return (
    <g>
      <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke={color} strokeWidth={2.5} />
      <polygon points={`${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`} fill={color} />
      {label && (
        <text
          x={sx2 + (dx / len) * 16}
          y={sy2 - (dy / len) * 4}
          fill={color}
          fontSize={14}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}

export default function VectorSpace2D({ vectors = [], interactive = false }) {
  const [vecs, setVecs] = useState(() =>
    vectors.map((v) => ({ ...v }))
  );
  const [dragging, setDragging] = useState(null);
  const svgRef = useRef(null);

  const getSVGPoint = useCallback((e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const sx = ((clientX - rect.left) / rect.width) * W;
    const sy = ((clientY - rect.top) / rect.height) * H;
    return fromScreen(sx, sy);
  }, []);

  const handleMouseDown = useCallback((i) => (e) => {
    if (!interactive) return;
    e.preventDefault();
    setDragging(i);
  }, [interactive]);

  const handleMouseMove = useCallback((e) => {
    if (dragging === null) return;
    const [nx, ny] = getSVGPoint(e);
    const clamped = [
      Math.max(-GRID_RANGE + 0.5, Math.min(GRID_RANGE - 0.5, nx)),
      Math.max(-GRID_RANGE + 0.5, Math.min(GRID_RANGE - 0.5, ny)),
    ];
    setVecs((prev) => prev.map((v, i) => i === dragging ? { ...v, x: clamped[0], y: clamped[1] } : v));
  }, [dragging, getSVGPoint]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseUp]);

  // Compute sum vector if more than one
  const hasSum = vecs.length >= 2;
  const sumX = vecs.reduce((acc, v) => acc + v.x, 0);
  const sumY = vecs.reduce((acc, v) => acc + v.y, 0);

  const gridLines = [];
  for (let i = -GRID_RANGE; i <= GRID_RANGE; i++) {
    const [x1] = toScreen(-GRID_RANGE, i);
    const [x2] = toScreen(GRID_RANGE, i);
    const [, y1] = toScreen(i, -GRID_RANGE);
    const [, y2] = toScreen(i, GRID_RANGE);
    const [sx] = toScreen(i, 0);
    const [, sy] = toScreen(0, i);
    gridLines.push(
      <line key={`h${i}`} x1={x1} y1={sy} x2={x2} y2={sy} stroke="#e2e8f0" strokeWidth={i === 0 ? 1.5 : 0.5} />,
      <line key={`v${i}`} x1={sx} y1={y1} x2={sx} y2={y2} stroke="#e2e8f0" strokeWidth={i === 0 ? 1.5 : 0.5} />,
    );
    if (i !== 0 && Math.abs(i) <= GRID_RANGE) {
      gridLines.push(
        <text key={`lx${i}`} x={sx} y={ORIGIN_Y + 14} fontSize={10} fill="#94a3b8" textAnchor="middle">{i}</text>,
        <text key={`ly${i}`} x={ORIGIN_X - 14} y={sy + 4} fontSize={10} fill="#94a3b8" textAnchor="middle">{-i}</text>,
      );
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      {interactive && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
          Drag the vector tips to explore.
        </p>
      )}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', maxWidth: W, cursor: dragging !== null ? 'grabbing' : 'default', userSelect: 'none' }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        {gridLines}

        {/* Sum vector (dashed) */}
        {hasSum && (
          <Arrow x1={0} y1={0} x2={sumX} y2={sumY} color="#94a3b8" label="a+b" />
        )}

        {/* Individual vectors */}
        {vecs.map((v, i) => {
          const [sx, sy] = toScreen(v.x, v.y);
          return (
            <g key={i}>
              <Arrow x1={0} y1={0} x2={v.x} y2={v.y} color={v.color || 'var(--color-primary)'} label={v.label} />
              {interactive && (
                <circle
                  cx={sx} cy={sy} r={8}
                  fill={v.color || 'var(--color-primary)'}
                  fillOpacity={0.8}
                  style={{ cursor: 'grab' }}
                  onMouseDown={handleMouseDown(i)}
                  onTouchStart={handleMouseDown(i)}
                />
              )}
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={W - 12} y={ORIGIN_Y - 6} fontSize={12} fill="#64748b" fontWeight="bold">x</text>
        <text x={ORIGIN_X + 6} y={14} fontSize={12} fill="#64748b" fontWeight="bold">y</text>
      </svg>

      {/* Live readout */}
      <div style={{ display: 'flex', gap: '24px', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
        {vecs.map((v, i) => (
          <span key={i} style={{ color: v.color }}>
            <strong>{v.label || `v${i+1}`}</strong> = ({v.x.toFixed(1)}, {v.y.toFixed(1)})
          </span>
        ))}
        {hasSum && (
          <span style={{ color: '#94a3b8' }}>
            <strong>sum</strong> = ({sumX.toFixed(1)}, {sumY.toFixed(1)})
          </span>
        )}
      </div>
    </div>
  );
}
