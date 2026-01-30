export interface Product {
  id: string; 
  name: string;
  description: Text; 
  price: number;
  stock: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  deleted_at?: Date | string | null; 
  
}

