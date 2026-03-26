export interface Task {
  id: string;
  caseNumber: string;
  stepName: string;
  category: 'FC-Judicial' | 'FC-NonJudicial';
  region: string;
  client: string;
  priority: number;
  slaDeadline: string;
  assignedRole: 'processor' | 'attorney';
  status: 'pending' | 'in-progress';
  borrower: string;
  propertyAddress: string;
  milestoneAtRisk: string;
  revenueAtRisk: number;
  schemaRef: string;
}

export type SortField = 'priority' | 'slaDeadline' | 'revenueAtRisk';

export interface TaskFilters {
  client: string[];
  region: string[];
  category: string[];
  status: string[];
}
