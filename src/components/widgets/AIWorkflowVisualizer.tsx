import { Card } from '@/components/ui/Card';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, MarkerType, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { Brain, Zap, Database, MessageSquare, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'IoT Sensor Stream (MQTT)' },
    position: { x: 50, y: 100 },
    style: { background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', width: 150 },
    sourcePosition: Position.Right,
  },
  {
    id: '2',
    data: { label: 'Anomaly Detection (Isolation Forest)' },
    position: { x: 300, y: 50 },
    style: { background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#991b1b', width: 180 },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  {
    id: '3',
    data: { label: 'Predictive Maint. (LSTM Model)' },
    position: { x: 300, y: 150 },
    style: { background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#1e40af', width: 180 },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  {
    id: '4',
    data: { label: 'Work Order Gen (SAP)' },
    position: { x: 600, y: 100 },
    style: { background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#166534', width: 150 },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  {
    id: '5',
    type: 'output',
    data: { label: 'Technician Alert (Push)' },
    position: { x: 850, y: 100 },
    style: { background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#92400e', width: 150 },
    targetPosition: Position.Left,
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#64748b' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#64748b' } },
  { id: 'e2-4', source: '2', target: '4', label: 'Threshold > 0.8', style: { stroke: '#ef4444' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e3-4', source: '3', target: '4', label: 'RUL < 7 Days', style: { stroke: '#3b82f6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
  { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#10b981' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
];

export function AIWorkflowVisualizer() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <Card title="AI Workflow Automation (n8n Style Visualizer)" className="h-[500px] flex flex-col">
      <div className="flex items-center gap-4 mb-4 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-500" />
          <span>AI Models Active: <strong>2</strong></span>
        </div>
        <div className="h-4 w-px bg-slate-300" />
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Avg. Latency: <strong>45ms</strong></span>
        </div>
        <div className="h-4 w-px bg-slate-300" />
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal-500" />
          <span>Last Run: <strong>Success (12s ago)</strong></span>
        </div>
      </div>
      
      <div className="flex-1 w-full bg-slate-50 rounded-lg border border-slate-200 overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#cbd5e1" gap={16} />
          <Controls className="bg-white border-slate-200 shadow-sm" />
        </ReactFlow>
        
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded border border-slate-200 shadow-sm text-xs space-y-1">
          <div className="font-bold text-slate-700 mb-1">Legend</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-200 border border-slate-400"></div> Input Source</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-100 border border-red-300"></div> Anomaly Detection</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-100 border border-blue-300"></div> Predictive Model</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-100 border border-green-300"></div> Action/Integration</div>
        </div>
      </div>
    </Card>
  );
}
