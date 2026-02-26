import { supabase } from '../../../supabaseClient';
import { Student } from '../../../types/student';
import { NewFinancialRecord } from '../../financial/types';

const BASE_MONTHLY_PRICE = 49.90;

const PLAN_CONFIG = {
  'Mensal': { months: 1, discount: 0 },
  'Trimestral': { months: 3, discount: 0.05 },
  'Semestral': { months: 6, discount: 0.10 },
  'Anual': { months: 12, discount: 0.15 },
} as const;

export const subscriptionService = {
  calculateDiscountedPrice(plan: string): number {
    const config = PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG];
    if (!config) return BASE_MONTHLY_PRICE;
    
    const discountedPrice = BASE_MONTHLY_PRICE * (1 - config.discount);
    return parseFloat(discountedPrice.toFixed(2));
  },

  generateInstallments(student: Student): NewFinancialRecord[] {
    const config = PLAN_CONFIG[student.plan as keyof typeof PLAN_CONFIG];
    if (!config) return [];

    const monthlyAmount = this.calculateDiscountedPrice(student.plan);
    const startDate = new Date(student.plan_start_date);
    const installments: NewFinancialRecord[] = [];

    for (let i = 0; i < config.months; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i);
      
      const monthName = dueDate.toLocaleString('pt-BR', { month: 'long' });
      const year = dueDate.getFullYear();
      const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

      installments.push({
        student_id: student.id,
        description: `Mensalidade - ${student.name} - ${capitalizedMonth}/${year}`,
        amount: monthlyAmount,
        type: 'receivable',
        status: 'pending',
        due_date: dueDate.toISOString().split('T')[0]
      });
    }

    return installments;
  },

  async createFinancialRecordsForStudent(student: Student): Promise<void> {
    const installments = this.generateInstallments(student);
    if (installments.length === 0) return;

    const { error } = await supabase
      .from('financial_records')
      .insert(installments);

    if (error) throw error;
  }
};
