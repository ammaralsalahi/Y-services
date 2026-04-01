export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'provider' | 'admin';
  location?: string;
  photo_url?: string;
  created_at: string;
}

export interface Provider {
  id: string;
  user_id: string;
  name: string;
  category: string;
  description: string;
  price_per_hour: number;
  rating: number;
  is_verified: boolean;
  availability: 'available' | 'busy' | 'offline';
  skills?: string[];
  photo_url?: string;
  location?: string;
}

export interface Service {
  id: string;
  name_en: string;
  name_ar: string;
  category: string;
  icon: string;
}

export interface ServiceRequest {
  id: string;
  user_id: string;
  provider_id: string;
  service_id: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  details: string;
  scheduled_at: string;
  location: string;
  created_at: string;
  provider_name?: string;
  service_name?: string;
}

export interface Message {
  id: string;
  request_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}
