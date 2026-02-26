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

  async addStudent(student: NewStudent): Promise<Student> {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateStudent(id: string, student: Partial<NewStudent>): Promise<void> {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('students')
      .update(student)
      .eq('id', id);
    
    if (error) throw error;
  },

  async deleteStudent(id: string): Promise<void> {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
