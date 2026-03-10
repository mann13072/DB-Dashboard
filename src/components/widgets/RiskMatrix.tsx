import { Card } from '@/components/ui/Card';
import { generateMockData } from '@/data/mockData';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export function RiskMatrix() {
  const { risks } = generateMockData();

  // Transform data for scatter plot
  const data = risks.map(r => ({
    x: r.probability,
    y: r.impact,
    z: 100, // Bubble size
    name: r.name,
    id: r.id,
    category: r.category
  }));

  return (
    <Card title="Project Risk Matrix (Raz & Michael)" className="h-full min-h-[400px]">
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Probability" 
              domain={[0, 6]} 
              tickCount={6}
              stroke="#64748b"
              label={{ value: 'Probability (1-5)', position: 'bottom', fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Impact" 
              domain={[0, 6]} 
              tickCount={6}
              stroke="#64748b"
              label={{ value: 'Impact (1-5)', angle: -90, position: 'left', fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-slate-200 p-3 rounded shadow-lg">
                      <p className="text-slate-900 font-bold text-sm">{data.id}: {data.name}</p>
                      <p className="text-slate-500 text-xs">{data.category}</p>
                      <p className="text-slate-500 text-xs mt-1">Prob: {data.x} | Impact: {data.y}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Background Zones */}
            <ReferenceLine x={2.5} stroke="#cbd5e1" strokeDasharray="3 3" />
            <ReferenceLine y={2.5} stroke="#cbd5e1" strokeDasharray="3 3" />
            
            <Scatter name="Risks" data={data}>
              {data.map((entry, index) => {
                const riskScore = entry.x * entry.y;
                const color = riskScore >= 15 ? '#f01414' : riskScore >= 8 ? '#fbbf24' : '#2dd4bf';
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
