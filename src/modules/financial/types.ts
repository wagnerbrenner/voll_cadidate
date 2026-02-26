export type FinancialType = 'payable' | 'receivable';
export type FinancialStatus = 'pending' | 'paid';

export interface FinancialRecord {
  id: string;
  student_id?: string;
  description: string;
  amount: number;
  type: FinancialType;
  status: FinancialStatus;
  due_date: string;
  created_at: string;
}

export interface NewFinancialRecord {
  student_id?: string;
  description: string;
  amount: number;
  type: FinancialType;
  status: FinancialStatus;
  due_date: string;
}
