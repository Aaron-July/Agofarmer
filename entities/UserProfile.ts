export enum UserRole {
  INNOVATOR = 'INNOVATOR',
  WORKER = 'WORKER',
  INVESTOR = 'INVESTOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name?: string;
  full_name?: string;
  role?: UserRole | string;
  user_type?: string;
  avatar?: string;
  photo_url?: string;
  location?: string;
  location_name?: string;
  bio?: string;
  skills?: string[];
  rating: number;

  // Extended properties
  user_email?: string;
  account_status?: string;
  created_date?: string;
  wallet_balance?: number;
  phone?: string;
  availability?: string;
  farm_name?: string;
  farm_size_acres?: number;
  id_verified?: boolean;
  verified?: boolean;
  total_reviews?: number;
  jobs_completed?: number;
  jobsCompleted?: number;
  hourly_rate?: number;
  hourlyRate?: number;
  specialty?: string;
  available?: boolean;
}
