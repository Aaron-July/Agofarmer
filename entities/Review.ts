export interface Review {
  id?: string;
  reviewer_id: string;
  reviewer_name?: string;
  reviewer_photo?: string;
  reviewed_user_id: string;
  job_id?: string;
  tool_id?: string;
  rating: number;
  comment?: string;
  images?: string[];
  review_type?: 'job' | 'tool';
  created_date?: string;
}