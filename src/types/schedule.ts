import { Student } from './student';

export interface Schedule {
  id: string;
  student_id: string;
  class_date: string;
  class_time: string;
  duration: number;
  description: string;
  created_at: string;
  students?: {
    name: string;
  };
}

export interface NewSchedule {
  student_id: string;
  class_date: string;
  class_time: string;
  duration: number;
  description: string;
}
