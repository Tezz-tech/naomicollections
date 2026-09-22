import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNaira } from '../../lib/format';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-grey-light bg-white px-3 py-2 shadow-lift">
      <p className="text-xs text-grey">{label}</p>
      <p className="mt-1 text-sm font-medium text-gold-dark">{formatNaira(payload[0].value)}</p>
      <p className="text-xs text-grey">{payload[0].payload.orders} order(s)</p>
    </div>
  );
}

export default function SalesChart({ data = [] }) {
  if (!data.length) {
    return <p className="flex h-64 items-center justify-center text-sm text-grey">No sales data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A9803F" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#A9803F" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#E5E5E5" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
          tick={{ fontSize: 11, fill: '#6B6B6B' }}
          axisLine={{ stroke: '#E5E5E5' }}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 11, fill: '#6B6B6B' }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#A9803F"
          strokeWidth={2}
          fill="url(#revenueFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
