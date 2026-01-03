export interface ToolBooking {
  id?: string;
  tool_id: string;
  tool_name?: string;
  tool_image?: string;
  renter_id: string;
  renter_name?: string;
  owner_id: string;
  owner_name?: string;
  start_date: string;
  end_date: string;
  rental_type?: 'hourly' | 'daily';
  total_amount?: number;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'cancelled';
  payment_status?: 'pending' | 'paid';
}