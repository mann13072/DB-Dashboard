import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ExecutiveView } from '@/views/ExecutiveView';
import { OperationalView } from '@/views/OperationalView';
import { TechnicianView } from '@/views/TechnicianView';
import { WorkflowView } from '@/views/WorkflowView';
import { DiagnosticLabView } from '@/views/DiagnosticLabView';
import { RiskMatrix } from '@/components/widgets/RiskMatrix';
import { generateMockData } from '@/data/mockData';
import { MilestoneHeader } from '@/components/layout/Header';

export default function App() {
  const [currentView, setCurrentView] = useState<'executive' | 'operational' | 'technician' | 'workflow' | 'diagnostic'>('executive');
  const { pipeline } = generateMockData();

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-red-100 selection:text-red-900">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        pipeline={pipeline}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <MilestoneHeader />
        
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {currentView === 'executive' && 'Executive Strategy Dashboard'}
                {currentView === 'operational' && 'Operational Management Center'}
                {currentView === 'technician' && 'Technician Terminal (CDM)'}
                {currentView === 'workflow' && 'AI Workflow Automation'}
                {currentView === 'diagnostic' && 'Diagnostic Lab'}
              </h1>
              <div className="text-sm text-slate-500 font-mono">
                Last Sync: {new Date().toLocaleTimeString()}
              </div>
            </div>

            {currentView === 'executive' && (
              <div className="space-y-6">
                <ExecutiveView />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RiskMatrix />
                  {/* Placeholder for future expansion */}
                </div>
              </div>
            )}

            {currentView === 'operational' && <OperationalView />}
            
            {currentView === 'technician' && <TechnicianView />}

            {currentView === 'workflow' && <WorkflowView />}

            {currentView === 'diagnostic' && <DiagnosticLabView />}
          </div>
        </main>
      </div>
    </div>
  );
}
