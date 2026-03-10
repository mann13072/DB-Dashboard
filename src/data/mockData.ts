import { Asset, KPI, PipelineLayer, Risk } from '../types';

// Simulated Data Stream
export const generateMockData = () => {
  const assets: Asset[] = [
    { id: 'COT-ICE4-001', type: 'ICE 4', mtbf: 2150, mttr: 3.2, status: 'operational', wheelsetWear: 1.2, doorFailures: 2, hvacStatus: true, integrationReadiness: 95 },
    { id: 'COT-ICE4-002', type: 'ICE 4', mtbf: 1800, mttr: 4.5, status: 'maintenance', wheelsetWear: 2.8, doorFailures: 5, hvacStatus: false, integrationReadiness: 80 },
    { id: 'COT-ICE3-015', type: 'ICE 3', mtbf: 2400, mttr: 2.1, status: 'operational', wheelsetWear: 0.5, doorFailures: 0, hvacStatus: true, integrationReadiness: 100 },
    { id: 'COT-REG-089', type: 'Regio', mtbf: 1200, mttr: 5.0, status: 'failed', wheelsetWear: 3.1, doorFailures: 8, hvacStatus: true, integrationReadiness: 60 },
    { id: 'COT-LOC-202', type: 'Locomotive', mtbf: 3000, mttr: 1.5, status: 'operational', wheelsetWear: 1.0, doorFailures: 1, hvacStatus: true, integrationReadiness: 90 },
  ];

  const risks: Risk[] = [
    { id: 'R1', name: 'Supply Chain Delay', probability: 4, impact: 5, category: 'External' },
    { id: 'R2', name: 'Integration Error', probability: 3, impact: 4, category: 'Technical' },
    { id: 'R3', name: 'Regulatory Change', probability: 2, impact: 5, category: 'Legal' },
    { id: 'R4', name: 'Staff Shortage', probability: 4, impact: 3, category: 'Operational' },
    { id: 'R5', name: 'Data Breach', probability: 1, impact: 5, category: 'Security' },
  ];

  const pipeline: PipelineLayer[] = [
    { name: 'Edge Layer', status: 'healthy', latency: '12ms' },
    { name: 'Connectivity', status: 'healthy', latency: '45ms' },
    { name: 'Standardization', status: 'warning', latency: '120ms' },
    { name: 'Platform', status: 'healthy', latency: '80ms' },
    { name: 'Application', status: 'healthy', latency: '200ms' },
  ];

  return { assets, risks, pipeline };
};

export const getMaintenanceCostData = () => [
  { name: 'Labor', value: 45 },
  { name: 'Spare Parts', value: 35 },
  { name: 'Overhead', value: 15 },
  { name: 'External Services', value: 5 },
];

export const getComplianceTrendData = () => [
  { month: 'Jan', value: 98 },
  { month: 'Feb', value: 99 },
  { month: 'Mar', value: 98.5 },
  { month: 'Apr', value: 100 },
  { month: 'May', value: 100 },
  { month: 'Jun', value: 100 },
];

export const getSpiTrendData = () => [
  { month: 'Jan', value: 0.95 },
  { month: 'Feb', value: 0.98 },
  { month: 'Mar', value: 1.02 },
  { month: 'Apr', value: 1.05 },
  { month: 'May', value: 1.04 },
  { month: 'Jun', value: 1.05 },
];

export const getWrenchTimeData = () => [
  { name: 'Wrench Time', value: 48 },
  { name: 'Travel', value: 15 },
  { name: 'Material Wait', value: 20 },
  { name: 'Admin/Meetings', value: 17 },
];

export const getWorkOrderData = () => [
  { name: 'Mon', open: 12, inProgress: 18, closed: 45 },
  { name: 'Tue', open: 15, inProgress: 22, closed: 40 },
  { name: 'Wed', open: 10, inProgress: 25, closed: 50 },
  { name: 'Thu', open: 8, inProgress: 28, closed: 48 },
  { name: 'Fri', open: 5, inProgress: 30, closed: 55 },
];

export const getFailureRateData = () => [
  { name: 'Doors', value: 35 },
  { name: 'HVAC', value: 25 },
  { name: 'Brakes', value: 15 },
  { name: 'Propulsion', value: 10 },
  { name: 'IT/Network', value: 15 },
];

export const getExecutiveKPIs = () => ([
  { id: 'fleet-avail', label: 'Fleet Availability', value: 96.5, unit: '%', target: 95, status: 'healthy' },
  { id: 'cost-km', label: 'Cost per Monitored Km', value: 4.25, unit: '€', target: 4.50, status: 'healthy' },
  { id: 'maint-cost', label: 'Maint. Cost % of RAV', value: 2.8, unit: '%', target: 3.0, status: 'healthy' },
  { id: 'reg-comp', label: 'Regulatory Compliance', value: 100, unit: '%', target: 100, status: 'healthy' },
  { id: 'proj-spi', label: 'Project SPI', value: 1.05, unit: '', target: 1.0, status: 'healthy' },
]);

export const getOperationalKPIs = () => ([
  { id: 'pm-comp', label: 'PM Compliance', value: 97.2, unit: '%', target: 95, status: 'healthy' },
  { id: 'maint-backlog', label: 'Maintenance Backlog', value: 2.5, unit: 'weeks', target: 4, status: 'healthy' },
  { id: 'wrench-time', label: 'Wrench Time', value: 48, unit: '%', target: 45, status: 'healthy' },
]);
