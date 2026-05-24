import { lazy, Suspense } from 'react';

const Plot = lazy(() =>
  Promise.all([
    import('react-plotly.js/factory'),
    import('plotly.js-dist-min'),
  ]).then(([{ default: createPlotlyComponent }, { default: Plotly }]) => ({
    default: createPlotlyComponent(Plotly),
  }))
);

export default function PlotBlock({ plotData = [], layout = {}, height = 400 }) {
  const mergedLayout = {
    autosize: true,
    height,
    margin: { l: 48, r: 24, t: 32, b: 48 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { family: 'var(--font-sans)', size: 12 },
    ...layout,
  };

  return (
    <div className="block-plot">
      <Suspense fallback={<div className="loading">Loading plot…</div>}>
        <Plot
          data={plotData}
          layout={mergedLayout}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: '100%' }}
        />
      </Suspense>
    </div>
  );
}
