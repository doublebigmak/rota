import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['var(--color-primary)', 'var(--color-primary-light)', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ChartBlock({ variant = 'bar', title, data = [], keys = [], colors }) {
  const palette = colors || COLORS;

  const common = {
    data,
    margin: { top: 8, right: 16, left: 0, bottom: 8 },
  };

  let chart;
  switch (variant) {
    case 'line':
      chart = (
        <LineChart {...common}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          {keys.length > 1 && <Legend />}
          {keys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} stroke={palette[i % palette.length]} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      );
      break;
    case 'area':
      chart = (
        <AreaChart {...common}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          {keys.length > 1 && <Legend />}
          {keys.map((k, i) => (
            <Area key={k} type="monotone" dataKey={k} stroke={palette[i % palette.length]} fill={palette[i % palette.length]} fillOpacity={0.2} />
          ))}
        </AreaChart>
      );
      break;
    case 'pie':
      chart = (
        <PieChart>
          <Pie data={data} dataKey={keys[0] || 'value'} nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      );
      break;
    default: // bar
      chart = (
        <BarChart {...common}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          {keys.length > 1 && <Legend />}
          {keys.map((k, i) => (
            <Bar key={k} dataKey={k} fill={palette[i % palette.length]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      );
  }

  return (
    <div className="block-chart">
      {title && <div className="block-chart-title">{title}</div>}
      <ResponsiveContainer width="100%" height={280}>
        {chart}
      </ResponsiveContainer>
    </div>
  );
}
