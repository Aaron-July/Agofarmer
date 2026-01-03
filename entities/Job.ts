import { User } from './UserProfile';

export type JobType = 'planting' | 'harvesting' | 'clearing' | 'irrigation' | 'livestock' | 'transport' | 'other';
export type PayType = 'hourly' | 'daily' | 'fixed';
export type JobStatus = 'open' | 'requested' | 'accepted' | 'in_progress' | 'completed' | 'reviewed' | 'cancelled';

export interface Job {
  id: string;
  title: string;
  job_type?: string;
  description: string;
  required_skills?: string[];
  pay_rate?: number;
  pay_type?: string;
  duration_days?: number;
  start_date?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  farmer_id?: string;
  farmer_name?: string;
  farmer_photo?: string;
  assigned_worker_id?: string;
  assigned_worker_name?: string;
  status: string;
  workers_count_needed?: number;
  applicants?: any[];
  payment_status?: string;
  upfront_paid?: boolean;
  completion_paid?: boolean;
  images?: string[];

  // Legacy / Mock Data compatibility
  postedBy?: User;
  createdAt?: string;
  created_date?: string;
  tags?: string[];
  budget?: number;
  location?: string;
}
