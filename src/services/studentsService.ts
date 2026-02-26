import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { Student, NewStudent } from '../types/student';

export const studentsService = {
  async fetchStudents(): Promise<Student[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async addStudent(student: NewStudent): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('students')
      .insert([student]);
    if (error) throw error;
  }
};
