export interface Order {
  id: string; 
  user_id: string;
  product_id: string;
  invoice_code: string;
  quantity: number;
  total_price: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  deleted_at?: Date | string | null; 
  
}

