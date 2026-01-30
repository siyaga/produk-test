export interface User {
  id: string; 
  email: string;
  password?: string; 
  provider: string;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  deleted_at?: Date | string | null; 
}


