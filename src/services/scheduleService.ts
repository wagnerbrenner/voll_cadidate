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
      .insert([schedule]);
    if (error) throw error;
  }
};
