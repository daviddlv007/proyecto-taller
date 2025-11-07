import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  correo: string;
  nombre: string;
}

interface AuthContextType {
  user: User | null;
  role: 'vendor' | 'buyer' | null;
  login: (correo: string, contrasena: string, role: 'vendor' | 'buyer') => Promise<boolean>;
  register: (
    userData: { correo: string; contrasena: string; nombre: string },
    role: 'vendor' | 'buyer'
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'vendor' | 'buyer' | null>(null);
  const navigate = useNavigate();

  // Recuperar usuario y rol desde localStorage al montar el contexto
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // Inferir rol desde la URL o usar lógica específica
        const currentPath = window.location.pathname;
        if (currentPath.includes('/vendor')) {
          setRole('vendor');
        } else if (currentPath.includes('/buyer')) {
          setRole('buyer');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (correo: string, contrasena: string, selectedRole: 'vendor' | 'buyer') => {
    const res = await api.login(correo, contrasena, selectedRole);
    if (res.success && res.token) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
      setRole(selectedRole);
      navigate(selectedRole === 'vendor' ? '/vendor/dashboard' : '/buyer/home');
      return true;
    }
    return false;
  };

  const register = async (
    userData: { correo: string; contrasena: string; nombre: string },
    selectedRole: 'vendor' | 'buyer'
  ) => {
    const res = await api.register(userData, selectedRole);
    if (res.success) {
      setUser(res.user);
      setRole(selectedRole);
      navigate(selectedRole === 'vendor' ? '/vendor/dashboard' : '/buyer/home');
      return true;
    }
    return false;
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setRole(null);
    navigate('/login');
  };

  const isAuthenticated = !!user && !!api.getToken();

  return (
    <AuthContext.Provider value={{ user, role, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
