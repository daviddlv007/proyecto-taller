import { toast } from 'react-toastify';
import type { App, Payment, Review, Stats } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Función para obtener headers con autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Función helper para hacer peticiones con manejo de errores
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Error desconocido' }));
      const errorMessage = error.detail || `Error ${response.status}: ${response.statusText}`;

      // Mostrar toast de error solo si no es un error de autenticación (para no duplicar mensajes)
      if (response.status !== 401) {
        toast.error(errorMessage);
      }

      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    // Errores de red (sin conexión, timeout, etc.)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const networkError = 'Error de conexión. Verifica tu red e intenta nuevamente.';
      toast.error(networkError, {
        autoClose: 5000,
      });
      throw new Error(networkError);
    }
    throw error;
  }
};

export const api = {
  // --------------------------
  // Autenticación
  // --------------------------
  login: async (correo: string, contrasena: string, role: 'vendor' | 'buyer') => {
    try {
      console.log(`📡 Enviando login a: ${API_BASE_URL}/${role}/auth/login`);
      const data = await apiRequest(`/${role}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ correo, contrasena }),
      });

      console.log('📥 Respuesta del backend:', data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, token: data.token, role };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { success: false, token: null, error: (error as Error).message };
    }
  },

  register: async (
    userData: { correo: string; contrasena: string; nombre: string },
    role: 'vendor' | 'buyer'
  ) => {
    try {
      const data = await apiRequest(`/${role}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  getToken: () => localStorage.getItem('token'),

  // --------------------------
  // Apps (Vendedor)
  // --------------------------
  getApps: async (): Promise<App[]> => {
    const data = await apiRequest('/vendor/apps');
    return data;
  },

  getAppById: async (id: number): Promise<App> => {
    return await apiRequest(`/vendor/apps/${id}`);
  },

  createApp: async (appData: Partial<App>): Promise<App> => {
    return await apiRequest('/vendor/apps', {
      method: 'POST',
      body: JSON.stringify(appData),
    });
  },

  updateApp: async (id: number, appData: Partial<App>): Promise<App> => {
    return await apiRequest(`/vendor/apps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appData),
    });
  },

  deleteApp: async (id: number): Promise<{ message: string }> => {
    return await apiRequest(`/vendor/apps/${id}`, {
      method: 'DELETE',
    });
  },

  // --------------------------
  // Apps (Comprador)
  // --------------------------
  getBuyerApps: async (): Promise<App[]> => {
    const data = await apiRequest('/buyer/apps');
    return data.apps;
  },

  executeApp: async (appId: number) => {
    return await apiRequest(`/buyer/apps/${appId}/execute`);
  },

  // --------------------------
  // Pagos
  // --------------------------
  getPayments: async (): Promise<Payment[]> => {
    return await apiRequest('/vendor/payments');
  },

  getBuyerPayments: async (): Promise<Payment[]> => {
    return await apiRequest('/buyer/payments');
  },

  createPayment: async (paymentData: { app_id: number; qr_code: string }): Promise<Payment> => {
    return await apiRequest('/buyer/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  confirmPayment: async (id: number): Promise<Payment> => {
    return await apiRequest(`/vendor/payments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'confirmed' }),
    });
  },

  // --------------------------
  // Reviews
  // --------------------------
  getAppReviews: async (appId: number): Promise<Review[]> => {
    return await apiRequest(`/vendor/apps/${appId}/reviews`);
  },

  getMyReviews: async (): Promise<Review[]> => {
    return await apiRequest('/buyer/reviews');
  },

  createReview: async (reviewData: {
    app_id: number;
    rating: number;
    comment: string;
  }): Promise<Review> => {
    return await apiRequest('/buyer/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // --------------------------
  // Stats de apps
  // --------------------------
  getAppStats: async (appId: number): Promise<Stats> => {
    return await apiRequest(`/vendor/apps/${appId}/stats`);
  },

  // --------------------------
  // Recomendaciones
  // --------------------------
  getVendorRecommendations: async (userId: number) => {
    const data = await apiRequest('/vendor/recommendations', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
    return data.recommendations;
  },

  getBuyerRecommendations: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const data = await apiRequest('/buyer/recommendations', {
      method: 'POST',
      body: JSON.stringify({ user_id: user.id }),
    });
    return data; // Ahora el backend devuelve directamente la lista de apps
  },

  // --------------------------
  // Machine Learning
  // --------------------------
  getPriceSuggestion: async (appId: number) => {
    return await apiRequest(`/ml/price-suggestion/${appId}`, {
      method: 'POST',
    });
  },

  getMLRecommendations: async (userId: number, topK: number = 6) => {
    return await apiRequest(`/ml/recommendations/${userId}?top_k=${topK}`);
  },

  // --------------------------
  // Compras
  // --------------------------
  getBuyerPurchases: async () => {
    const data = await apiRequest('/buyer/purchases');
    return data.purchases;
  },
};
