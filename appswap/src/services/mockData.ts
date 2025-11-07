import type { App, Stats, Payment, Review, Recommendation } from '../types/types';

// Usuarios de prueba
export const mockUsers = [
  { user: 'vendor', pass: '1234', role: 'vendor' },
  { user: 'buyer', pass: '1234', role: 'buyer' },
];

// Apps iniciales (cumplen con los types: category y app_url incluidos)
export const mockApps: App[] = [
  {
    id: 1,
    name: 'Normal',
    description: 'Una app simple de prueba',
    category: 'General',
    app_url: 'https://normal.app',
    cover_image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Wikipedia',
    description: 'Consulta la Wikipedia desde tu app',
    category: 'Educación',
    app_url: 'https://wikipedia.org',
    cover_image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Calculator',
    description: 'Calculadora básica',
    category: 'Productividad',
    app_url: 'https://calculator.app',
    cover_image: 'https://via.placeholder.com/150',
  },
  {
    id: 4,
    name: 'Weather',
    description: 'App de clima',
    category: 'Clima',
    app_url: 'https://weather.app',
    cover_image: 'https://via.placeholder.com/150',
  },
];

export const mockStats: Stats[] = [
  { appId: 1, downloads: 1200, reviews: 45, average_rating: 4.7, payments_received: 3000.5 },
  { appId: 2, downloads: 3000, reviews: 150, average_rating: 4.9, payments_received: 7500 },
];

export const mockReviews: Review[] = [
  { id: 1, app_id: 1, userId: 301, rating: 5, comment: 'Excelente app!' },
  { id: 2, app_id: 1, userId: 302, rating: 4, comment: 'Muy útil' },
  { id: 3, app_id: 2, userId: 303, rating: 5, comment: 'Imprescindible' },
];

// Pagos y reviews vacíos
export const mockPayments: Payment[] = [
  { id: 201, app_id: 501, buyer_id: 301, status: 'pending', qr_code: 'qr_code_123' },
  { id: 202, app_id: 502, buyer_id: 302, status: 'confirmed', qr_code: 'qr_code_456' },
];

export const mockRecommendations: Recommendation[] = [
  { id: 1, user_id: 101, idea: 'Sugerencia de app de productividad' },
  { id: 2, user_id: 101, idea: 'Idea de app de finanzas personales' },
];
