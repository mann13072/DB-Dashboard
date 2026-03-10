import { Card } from '@/components/ui/Card';
import { generateMockData, getFailureRateData } from '@/data/mockData';
import { Asset } from '@/types';
import { AlertTriangle, CheckCircle, XCircle, Search, Cpu, Thermometer, Disc } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

interface AssetModalProps {
  asset: Asset | null;
  onClose: () => void;
}

function AssetModal({ asset, onClose }: AssetModalProps) {
  if (!asset) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="text-teal-500" />
                Digital Machine Passport
              </h2>
              <p className="text-slate-500 text-sm font-mono mt-1">{asset.id}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 uppercase mb-3">Technical Schema</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Asset Type</span>
                    <span className="text-slate-900 font-medium">{asset.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">MTBF</span>
                    <span className="text-slate-900 font-mono font-medium">{asset.mtbf}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">MTTR</span>
                    <span className="text-slate-900 font-mono font-medium">{asset.mttr}h</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 uppercase mb-3">Integration Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Readiness Score</span>
                    <span className="text-teal-600 font-bold">{asset.integrationReadiness}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500" 
                      style={{ width: `${asset.integrationReadiness}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 uppercase mb-3">Live Diagnostics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Disc className="w-4 h-4 text-slate-400" />
                      <span>Wheelset Wear</span>
                    </div>
                    <span className={`font-mono font-bold ${asset.wheelsetWear > 2.5 ? 'text-red-600' : 'text-teal-600'}`}>
                      {asset.wheelsetWear}mm
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <AlertTriangle className="w-4 h-4 text-slate-400" />
                      <span>Door Failures</span>
                    </div>
                    <span className={`font-mono font-bold ${asset.doorFailures > 3 ? 'text-red-600' : 'text-slate-900'}`}>
                      {asset.doorFailures}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Thermometer className="w-4 h-4 text-slate-400" />
                      <span>HVAC Status</span>
                    </div>
                    <span className={`font-mono font-bold ${asset.hvacStatus ? 'text-teal-600' : 'text-red-600'}`}>
                      {asset.hvacStatus ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg text-sm font-medium transition-colors"
            >
              Close Passport
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function TechnicianView() {
  const { assets } = generateMockData();
  const failureRateData = getFailureRateData();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssets = assets.filter(a => 
    a.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scatterData = assets.map(a => ({
    x: a.mtbf,
    y: a.mttr,
    z: 100,
    name: a.id,
    type: a.type
  }));

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
              <Disc className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase font-bold">Wheelset Wear Rate</div>
              <div className="text-xl font-bold text-slate-900">1.2mm <span className="text-xs font-normal text-slate-500">/ 10k km</span></div>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase font-bold">Door Failure Rate</div>
              <div className="text-xl font-bold text-slate-900">0.8% <span className="text-xs font-normal text-slate-500">Top Cause</span></div>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
              <Thermometer className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase font-bold">HVAC Availability</div>
              <div className="text-xl font-bold text-slate-900">98.5%</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
              <CheckCircle className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <div className="text-slate-500 text-xs uppercase font-bold">Defect Accuracy</div>
              <div className="text-xl font-bold text-slate-900">99.2%</div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Failure Rate by Component" className="min-h-[300px]">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={failureRateData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }}
                  />
                  <Bar dataKey="value" fill="#f01414" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="MTBF vs MTTR Analysis" className="min-h-[300px]">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="MTBF" 
                    unit="h" 
                    stroke="#64748b" 
                    fontSize={12}
                    label={{ value: 'MTBF (Hours)', position: 'bottom', fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="MTTR" 
                    unit="h" 
                    stroke="#64748b" 
                    fontSize={12}
                    label={{ value: 'MTTR (Hours)', angle: -90, position: 'left', fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 p-3 rounded shadow-lg">
                            <p className="text-slate-900 font-bold text-sm">{data.name}</p>
                            <p className="text-slate-500 text-xs">{data.type}</p>
                            <p className="text-slate-500 text-xs mt-1">MTBF: {data.x}h | MTTR: {data.y}h</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Assets" data={scatterData} fill="#2dd4bf" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card title="Asset Reliability Table (CDM)" className="overflow-hidden">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by RDS-PP ID or Type..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-teal-500 transition-colors placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">RDS-PP ID</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">MTBF</th>
                  <th className="px-6 py-3">MTTR</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">{asset.id}</td>
                    <td className="px-6 py-4 text-slate-600">{asset.type}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        asset.status === 'operational' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                        asset.status === 'maintenance' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">{asset.mtbf}h</td>
                    <td className="px-6 py-4 font-mono text-slate-600">{asset.mttr}h</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedAsset(asset)}
                        className="text-teal-600 hover:text-teal-700 font-bold text-xs uppercase tracking-wide"
                      >
                        View Passport
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <AssetModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
    </>
  );
}
