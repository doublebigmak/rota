import { registry } from '../../visualizations/registry';

export default function VisualizationBlock({ component, props = {} }) {
  const Component = registry[component];

  if (!Component) {
    return (
      <div className="block-viz" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
        Visualization <code style={{ margin: '0 4px' }}>{component}</code> not found in registry.
      </div>
    );
  }

  return (
    <div className="block-viz">
      <Component {...props} />
    </div>
  );
}
