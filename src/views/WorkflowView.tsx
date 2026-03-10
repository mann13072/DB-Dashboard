import React, { useCallback, useRef, useState, useEffect } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, MarkerType, Position, ReactFlowProvider, Panel, Node, ReactFlowInstance, Connection, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import { Brain, Zap, CheckCircle, Plus, Trash2, Save, Play } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const flowKey = 'ai-workflow-cottbus-v1';

const initialNodes = [
  // Step 1: Input
  {
    id: '1',
    type: 'input',
    data: { label: 'Data Std Layer\n(Listener: Phase 2)' },
    position: { x: 50, y: 300 },
    style: { background: '#f8fafc', border: '1px solid #94a3b8', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', width: 180 },
    sourcePosition: Position.Right,
  },
  // Step 2: AI Logic
  {
    id: '2',
    data: { label: 'AI Transformation\n(Logic & Routing)' },
    position: { x: 300, y: 300 },
    style: { background: '#eff6ff', border: '1px solid #3b82f6', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#1e40af', width: 180 },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  // Stream A: Compliance
  {
    id: '3',
    data: { label: 'SHA-256 Hashing\nService' },
    position: { x: 600, y: 150 },
    style: { background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#334155', width: 160 },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  {
    id: '4',
    data: { label: 'WORM Immutable\nStorage' },
    position: { x: 850, y: 150 },
    style: { background: '#64748b', border: '1px solid #475569', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#ffffff', width: 160 }, // Slate Grey
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  {
    id: '5',
    type: 'output',
    data: { label: 'Audit Dashboard\nLog' },
    position: { x: 1100, y: 150 },
    style: { background: '#EC1C24', border: '1px solid #b91c1c', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#ffffff', width: 160 }, // DB Red
    targetPosition: Position.Left,
  },
  // Stream B: Predictive
  {
    id: '6',
    data: { label: 'Historical Baseline\n(Cold Storage)' },
    position: { x: 300, y: 500 },
    style: { background: '#64748b', border: '1px solid #475569', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#ffffff', width: 160 }, // Slate Grey
    sourcePosition: Position.Right,
  },
  {
    id: '7',
    data: { label: 'Evaluate RUL\n(Remaining Useful Life)' },
    position: { x: 600, y: 450 },
    style: { background: '#eff6ff', border: '1px solid #3b82f6', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#1e40af', width: 180 },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  {
    id: '8',
    type: 'output',
    data: { label: 'ERP Maint. Ticket\n(High Priority)' },
    position: { x: 900, y: 400 },
    style: { background: '#EC1C24', border: '1px solid #b91c1c', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#ffffff', width: 160 }, // DB Red
    targetPosition: Position.Left,
  },
  {
    id: '9',
    type: 'output',
    data: { label: 'Floor Supervisor\nTablet Alert' },
    position: { x: 900, y: 500 },
    style: { background: '#EC1C24', border: '1px solid #b91c1c', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#ffffff', width: 160 }, // DB Red
    targetPosition: Position.Left,
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#64748b', strokeWidth: 2 } },
  // Compliance Branch
  { id: 'e2-3', source: '2', target: '3', label: 'TestProtocol == True', style: { stroke: '#64748b' }, labelStyle: { fill: '#64748b', fontWeight: 700 } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#64748b' } },
  { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#EC1C24' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#EC1C24' } },
  // Predictive Branch
  { id: 'e2-7', source: '2', target: '7', label: 'Vib > 95th %', style: { stroke: '#3b82f6' }, labelStyle: { fill: '#3b82f6', fontWeight: 700 } },
  { id: 'e6-7', source: '6', target: '7', animated: false, style: { stroke: '#94a3b8', strokeDasharray: '5,5' }, label: 'Baseline Data' },
  { id: 'e7-8', source: '7', target: '8', animated: true, style: { stroke: '#EC1C24' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#EC1C24' } },
  { id: 'e7-9', source: '7', target: '9', animated: true, style: { stroke: '#EC1C24' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#EC1C24' } },
];

let id = 10;
const getId = () => `${id++}`;

export function WorkflowView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customLabel, setCustomLabel] = useState('');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const restoreFlow = () => {
      const flow = JSON.parse(localStorage.getItem(flowKey) || 'null');

      if (flow) {
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
      }
    };

    restoreFlow();
  }, [setNodes, setEdges]);

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
      // Visual feedback could be added here
      const btn = document.getElementById('save-btn');
      if (btn) {
         const originalContent = btn.innerHTML;
         btn.innerHTML = '<span class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg> Saved!</span>';
         setTimeout(() => btn.innerHTML = originalContent, 2000);
      }
    }
  }, [rfInstance]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onAddNode = useCallback((type: string, label: string, style: any) => {
    const newNode: Node = {
      id: getId(),
      type: type === 'input' ? 'input' : type === 'output' ? 'output' : 'default',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: { label: label },
      style: style,
      sourcePosition: type !== 'output' ? Position.Right : undefined,
      targetPosition: type !== 'input' ? Position.Left : undefined,
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string, nodeStyle: any) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', nodeLabel);
    event.dataTransfer.setData('application/reactflow/style', JSON.stringify(nodeStyle));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!rfInstance) return;

      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');
      const styleString = event.dataTransfer.getData('application/reactflow/style');
      
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const style = JSON.parse(styleString);

      const position = rfInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: label },
        style: style,
        sourcePosition: type !== 'output' ? Position.Right : undefined,
        targetPosition: type !== 'input' ? Position.Left : undefined,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [rfInstance, setNodes]
  );

  const handleAddCustomNode = () => {
    if (customLabel) {
      onAddNode('default', customLabel, { background: '#ffffff', border: '1px solid #94a3b8', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', width: 150 });
      setCustomLabel('');
      setIsAddingCustom(false);
    }
  };

  const onDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, [setNodes, setEdges]);

  return (
    <div className="h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-500" />
            <span>AI Models: <strong>2</strong></span>
          </div>
          <div className="hidden xs:block h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500" />
            <span>Latency: <strong>45ms</strong></span>
          </div>
          <div className="hidden xs:block h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-teal-500" />
            <span>Last Run: <strong>Success</strong></span>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <button 
                id="save-btn"
                onClick={onSave}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs md:text-sm font-medium transition-colors"
            >
                <Save className="w-4 h-4" /> Save
            </button>
            <button 
                onClick={onDeleteSelected}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-md text-xs md:text-sm font-medium transition-colors"
            >
                <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs md:text-sm font-medium transition-colors shadow-sm shadow-red-200">
                <Play className="w-4 h-4" /> Execute
            </button>
        </div>
      </div>

      <div className="flex-1 w-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden relative shadow-inner" ref={reactFlowWrapper} onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            fitView
            attributionPosition="bottom-right"
            deleteKeyCode={['Backspace', 'Delete']}
          >
            <Background color="#cbd5e1" gap={16} />
            <Controls className="bg-white border-slate-200 shadow-sm" />
            
            <Panel position="top-left" className="bg-white/90 backdrop-blur p-2 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Add Nodes (Drag or Click)</div>
                <div 
                    draggable
                    onDragStart={(event) => onDragStart(event, 'input', 'New Source', { background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', width: 150 })}
                    onClick={() => onAddNode('input', 'New Source', { background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', width: 150 })}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors text-left cursor-grab active:cursor-grabbing"
                >
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div> Input Source
                </div>
                <div 
                    draggable
                    onDragStart={(event) => onDragStart(event, 'default', 'AI Model', { background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#991b1b', width: 180 })}
                    onClick={() => onAddNode('default', 'AI Model', { background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#991b1b', width: 180 })}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors text-left cursor-grab active:cursor-grabbing"
                >
                    <div className="w-2 h-2 rounded-full bg-red-400"></div> AI Model
                </div>
                <div 
                    draggable
                    onDragStart={(event) => onDragStart(event, 'default', 'Processing', { background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#1e40af', width: 180 })}
                    onClick={() => onAddNode('default', 'Processing', { background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#1e40af', width: 180 })}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors text-left cursor-grab active:cursor-grabbing"
                >
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div> Processing
                </div>
                <div 
                    draggable
                    onDragStart={(event) => onDragStart(event, 'output', 'Action', { background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#166534', width: 150 })}
                    onClick={() => onAddNode('output', 'Action', { background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: 'bold', color: '#166534', width: 150 })}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors text-left cursor-grab active:cursor-grabbing"
                >
                    <div className="w-2 h-2 rounded-full bg-green-400"></div> Action
                </div>
                <div className="h-px bg-slate-200 my-1"></div>
                {isAddingCustom ? (
                    <div className="flex flex-col gap-2 p-2 bg-slate-50 rounded-md border border-slate-200">
                        <input 
                            type="text" 
                            value={customLabel} 
                            onChange={(e) => setCustomLabel(e.target.value)} 
                            placeholder="Node Label" 
                            className="text-xs p-1 border border-slate-300 rounded w-full"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddCustomNode();
                                if (e.key === 'Escape') setIsAddingCustom(false);
                            }}
                        />
                        <div className="flex gap-2">
                            <button onClick={handleAddCustomNode} className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 flex-1">Add</button>
                            <button onClick={() => setIsAddingCustom(false)} className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded hover:bg-slate-300 flex-1">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsAddingCustom(true)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors text-left"
                    >
                        <Plus className="w-3 h-3 text-slate-500" /> Custom Node...
                    </button>
                )}
            </Panel>

            <Panel position="top-right" className="bg-white/90 backdrop-blur p-2 rounded-lg border border-slate-200 shadow-sm text-xs space-y-1">
              <div className="font-bold text-slate-700 mb-1">Legend</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-100 border border-slate-400"></div> Listener/Input</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-50 border border-blue-400"></div> AI Logic</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-500 border border-slate-600"></div> Data Storage</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-600 border border-red-700"></div> Action (DB Red)</div>
            </Panel>
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
