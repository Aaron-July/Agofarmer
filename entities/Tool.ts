import { User } from './UserProfile';

export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  images?: string[];
  hourly_rate?: number;
  daily_rate?: number;
  owner_id?: string;
  owner_name?: string;
  owner_phone?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  availability_status?: string;
  condition?: string;
  specifications?: string;
  rating: number;
  total_reviews?: number;

  // Legacy / Mock Data compatibility
  pricePerDay?: number;
  owner?: User;
  image?: string;
  available?: boolean;
  location?: string;
}
