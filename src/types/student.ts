export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  plan: string;
  created_at: string;
}

export interface NewStudent {
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: string;
}
