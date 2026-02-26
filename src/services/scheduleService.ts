import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { Schedule, NewSchedule } from '../types/schedule';

export const scheduleService = {
  async fetchSchedule(): Promise<Schedule[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('schedule')
      .select('*, students(name)')
      .order('class_date', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async addSchedule(schedule: NewSchedule): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('schedule')
      .insert([{ ...schedule, status: 'scheduled' }]);
    if (error) throw error;
  },

  async updateSchedule(id: string, schedule: Partial<NewSchedule>): Promise<void> {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('schedule')
      .update(schedule)
      .eq('id', id);
    if (error) throw error;
  },

  async cancelSchedule(id: string): Promise<void> {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('schedule')
      .update({ status: 'cancelled' })
      .eq('id', id);
    if (error) throw error;
  }
};
