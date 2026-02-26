import { supabase, isSupabaseConfigured } from '../../../supabaseClient';
import { FinancialRecord, NewFinancialRecord, FinancialStatus } from '../types';

export const financialService = {
  async getFinancialRecords(): Promise<FinancialRecord[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('financial_records')
      .select('*')
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createFinancialRecord(record: NewFinancialRecord): Promise<FinancialRecord> {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('financial_records')
      .insert([record])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateFinancialStatus(id: string, status: FinancialStatus): Promise<void> {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('financial_records')
      .update({ status })
      .eq('id', id);
    
    if (error) throw error;
  },

  async cancelFinancialRecord(id: string): Promise<void> {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('financial_records')
      .update({ status: 'cancelled' })
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateDueDate(id: string, dueDate: string): Promise<void> {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('financial_records')
      .update({ due_date: dueDate })
      .eq('id', id);
    
    if (error) throw error;
  }
};
