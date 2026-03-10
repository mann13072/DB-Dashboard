export interface KPI {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  target?: number;
  trend?: 'up' | 'down' | 'stable';
  status: 'healthy' | 'warning' | 'critical';
  history?: { date: string; value: number }[];
}

export interface Asset {
  id: string; // RDS-PP ID e.g., COT-ICE4-001
  type: string;
  mtbf: number; // hours
  mttr: number; // hours
  status: 'operational' | 'maintenance' | 'failed';
  wheelsetWear: number; // mm
  doorFailures: number;
  hvacStatus: boolean;
  integrationReadiness: number; // 0-100
}

export interface Risk {
  id: string;
  name: string;
  probability: number; // 1-5
  impact: number; // 1-5
  category: string;
}

export interface PipelineLayer {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  latency: string;
}
