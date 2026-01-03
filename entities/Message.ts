export interface Message {
  id?: string;
  conversation_id?: string;
  sender_id?: string;
  sender_name?: string;
  receiver_id?: string;
  receiver_name?: string;
  content: string;
  message_type?: 'text' | 'image' | 'voice';
  attachment_url?: string;
  job_id?: string;
  read?: boolean;
  
  // Frontend specific / Compatibility fields
  senderId?: string;
  receiverId?: string;
  timestamp?: string;
  isAi?: boolean;
}