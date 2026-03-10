import { Card } from '@/components/ui/Card';
import { getOperationalKPIs, getWrenchTimeData, getWorkOrderData } from '@/data/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const pmpData = [
  { name: 'Planned', value: 80, color: '#2dd4bf' },
  { name: 'Unplanned', value: 20, color: '#f01414' },
];

const backlogData = [
  { name: 'Week 1', value: 4 },
  { name: 'Week 2', value: 3 },
  { name: 'Week 3', value: 2.5 },
  { name: 'Week 4', value: 2 },
];

const onboardingData = [
  { name: 'Native', progress: 85, color: '#2dd4bf' },
  { name: 'Gateway', progress: 60, color: '#fbbf24' },
  { name: 'Retrofit', progress: 30, color: '#f01414' },
];

const WRENCH_COLORS = ['#2dd4bf', '#fbbf24', '#f01414', '#94a3b8'];

export function OperationalView() {
  const kpis = getOperationalKPIs();
  const wrenchData = getWrenchTimeData();
  const workOrderData = getWorkOrderData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.id}>
            <div className="text-slate-500 text-sm font-medium mb-1">{kpi.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-slate-900">
                {kpi.value}{kpi.unit}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Target: {kpi.target}{kpi.unit}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="PMP Ratio (Planned vs Unplanned)" className="min-h-[300px]">
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pmpData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pmpData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">80/20</div>
                <div className="text-xs text-slate-500">Target</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Maintenance Backlog (Weeks)" className="min-h-[300px]">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={backlogData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }}
                />
                <Bar dataKey="value" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Machine Onboarding Progress" className="min-h-[300px]">
          <div className="h-full flex flex-col justify-center space-y-8">
            {onboardingData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">{item.name}</span>
                  <span className="text-slate-500 font-mono">{item.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${item.progress}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Wrench Time Distribution" className="min-h-[300px]">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wrenchData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {wrenchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={WRENCH_COLORS[index % WRENCH_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Work Order Status (Weekly)" className="min-h-[300px]">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workOrderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }}
                />
                <Legend />
                <Bar dataKey="open" stackId="a" fill="#94a3b8" name="Open" />
                <Bar dataKey="inProgress" stackId="a" fill="#fbbf24" name="In Progress" />
                <Bar dataKey="closed" stackId="a" fill="#2dd4bf" name="Closed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
