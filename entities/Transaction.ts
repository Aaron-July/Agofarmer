export interface Transaction {
  id?: string;
  user_id: string;
  type: 'job_payment' | 'job_earning' | 'tool_rental_payment' | 'tool_rental_earning' | 'withdrawal' | 'deposit';
  amount: number;
  description?: string;
  reference_id?: string;
  status?: 'pending' | 'completed' | 'failed';
  payment_method?: 'wallet' | 'card' | 'mobile_money' | 'cash';
  created_date?: string;
}