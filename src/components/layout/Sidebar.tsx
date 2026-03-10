import { LayoutDashboard, Activity, Wrench, Workflow, Microscope, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PipelineLayer } from '@/types';

interface SidebarProps {
  currentView: 'executive' | 'operational' | 'technician' | 'workflow' | 'diagnostic';
  onChangeView: (view: 'executive' | 'operational' | 'technician' | 'workflow' | 'diagnostic') => void;
  pipeline: PipelineLayer[];
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentView, onChangeView, pipeline, isOpen, onClose }: SidebarProps) {
  const navItems = [
    { id: 'executive', label: 'Executive Strategy', icon: LayoutDashboard },
    { id: 'operational', label: 'Operational Mgmt', icon: Activity },
    { id: 'technician', label: 'Technician Terminal', icon: Wrench },
    { id: 'workflow', label: 'AI Workflow', icon: Workflow },
    { id: 'diagnostic', label: 'Diagnostic Lab', icon: Microscope },
  ] as const;

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-xl lg:shadow-sm z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-10",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Navigation</div>
            <button 
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  currentView === item.id
                    ? "bg-[#f01414] text-white shadow-md shadow-red-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

      <div className="mt-auto p-6 border-t border-slate-200 bg-slate-50/50">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">5-Layer Pipeline</div>
        <div className="space-y-3">
          {pipeline.map((layer, index) => (
            <div key={index} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="relative flex h-2 w-2">
                  {layer.status !== 'healthy' && (
                    <span className={cn(
                      "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                      layer.status === 'warning' ? "bg-amber-400" : "bg-red-400"
                    )}></span>
                  )}
                  <span className={cn(
                    "relative inline-flex rounded-full h-2 w-2",
                    layer.status === 'healthy' ? "bg-teal-500" :
                    layer.status === 'warning' ? "bg-amber-500" :
                    "bg-red-500"
                  )} />
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{layer.name}</span>
              </div>
              <span className="text-xs font-mono text-slate-500">{layer.latency}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 text-center bg-white">
        <div className="text-[10px] text-slate-400 font-mono">
          v2.4.0-RC1 • CDM-Compliant
        </div>
      </div>
    </div>
    </>
  );
}
