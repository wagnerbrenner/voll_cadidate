export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  plan: string;
  plan_start_date: string;
  created_at: string;
}

export interface NewStudent {
  name: string;
  email: string;
  phone: string;
  plan: string;
  plan_start_date: string;
  status: string;
}
