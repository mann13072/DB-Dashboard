import { Card } from '@/components/ui/Card';
import { getExecutiveKPIs, getMaintenanceCostData, getComplianceTrendData, getSpiTrendData } from '@/data/mockData';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { AIWorkflowVisualizer } from '@/components/widgets/AIWorkflowVisualizer';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const COLORS = ['#f01414', '#555555', '#999999', '#cccccc'];

export function ExecutiveView() {
  const kpis = getExecutiveKPIs();
  const fleetAvail = kpis.find(k => k.id === 'fleet-avail');
  const maintCostData = getMaintenanceCostData();
  const complianceData = getComplianceTrendData();
  const spiData = getSpiTrendData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.filter(k => k.id !== 'fleet-avail').map((kpi) => (
          <Card key={kpi.id} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <TrendingUp className="w-12 h-12 text-slate-900" />
            </div>
            <div className="text-slate-500 text-sm font-medium mb-1">{kpi.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-slate-900">
                {kpi.value}{kpi.unit}
              </div>
              {kpi.target && (
                <div className="text-xs text-slate-500 font-mono">
                  Target: {kpi.target}{kpi.unit}
                </div>
              )}
            </div>
            <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#f01414] rounded-full" 
                style={{ width: `${Math.min(100, (Number(kpi.value) / Number(kpi.target)) * 100)}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Fleet Availability" className="lg:col-span-1 flex flex-col items-center justify-center min-h-[300px]">
          <div className="relative w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                innerRadius="70%" 
                outerRadius="100%" 
                barSize={20} 
                data={[{ name: 'Availability', value: fleetAvail?.value, fill: '#f01414' }]} 
                startAngle={90} 
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: '#f1f5f9' }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold text-slate-900">{fleetAvail?.value}%</span>
              <span className="text-sm text-slate-500">Target &gt;95%</span>
            </div>
          </div>
        </Card>

        <Card title="Financial Efficiency Trend" className="lg:col-span-2 min-h-[300px]">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f01414" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f01414" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#f01414' }}
                />
                <Area type="monotone" dataKey="value" stroke="#f01414" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Maintenance Cost Composition" className="min-h-[300px]">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={maintCostData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {maintCostData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Regulatory Compliance Trend" className="min-h-[300px]">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[90, 100]} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                <Line type="stepAfter" dataKey="value" stroke="#2dd4bf" strokeWidth={2} dot={{ r: 4, fill: '#2dd4bf' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIWorkflowVisualizer />
        <Card title="Project SPI Trend (Target ≥ 1.0)" className="min-h-[300px]">
          <div className="h-[430px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0.8, 1.2]} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                <Line type="monotone" dataKey="value" stroke="#f01414" strokeWidth={2} dot={{ r: 4, fill: '#f01414' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
