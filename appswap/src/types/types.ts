export interface App {
  id: number;
  name: string;
  description: string;
  category: string;
  app_url: string;
  cover_image?: string;
  price: number;
  demo_url?: string;
}

export interface Payment {
  id: number;
  app_id: number;
  buyer_id: number;
  status: 'pending' | 'confirmed';
  qr_code: string;
  credentials?: string;
}

export interface Review {
  id: number;
  app_id: number;
  user_id: number;
  rating: number;
  comment: string;
}

export interface Stats {
  appId: number;
  downloads: number;
  reviews: number;
  average_rating: number;
  payments_received: number;
}

export interface Recommendation {
  id: number;
  user_id: number;
  idea: string;
}
