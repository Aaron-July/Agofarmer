export interface Notification {
  id?: string;
  user_id: string;
  title: string;
  message: string;
  type: 'job_application' | 'job_accepted' | 'job_completed' | 'payment' | 'booking_request' | 'booking_approved' | 'message' | 'review' | 'system';
  reference_id?: string;
  read?: boolean;
  created_date?: string;
}