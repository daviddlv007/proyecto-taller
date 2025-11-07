import os

# === Ruta base (desde donde se ejecuta el script) ===
BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "src")

# === Estructura de carpetas ===
dirs = [
    "services",
    "components",
    "pages",
    "pages/buyer",
    "pages/vendor",
    "types",
    "contexts"
]

# === Archivos y contenido ===
files = {
    # Reset CSS
    "index.css": """/* Reset simple y estilo base */
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { width: 100%; height: 100%; font-family: system-ui, sans-serif; background-color: #f9f9f9; color: #333; }
""",

    # Tipos
    "types/types.ts": """export interface App { id: number; name: string; desc: string; }
export interface Payment { id: number; amount: number; confirmed?: boolean; }
export interface Review { id: number; text: string; appId?: number; }
""",

    # Mock API
    "services/api.ts": """import type { App, Payment, Review } from '../types/types';

let mockToken: string | null = null;
let apps: App[] = [];
let payments: Payment[] = [];
let reviews: Review[] = [];

export const api = {
  login: async (user: string, pass: string) => {
    const success = (user === 'vendor' && pass === '1234') || (user === 'buyer' && pass === '1234');
    mockToken = success ? 'mock-token' : null;
    return { success, token: mockToken };
  },
  logout: async () => { mockToken = null; return { success: true }; },
  register: async (u: any) => ({ success: true, user: u }),
  getToken: () => mockToken,
  getVendorApps: async (): Promise<App[]> => apps,
  getBuyerApps: async (): Promise<App[]> => apps,
  uploadApp: async (a: Partial<App>) => { const app = { id: Date.now(), ...a } as App; apps.push(app); return { success: true, app }; },
  deleteApp: async (id: number) => { apps = apps.filter(a => a.id !== id); return { success: true }; },
  getPayments: async (): Promise<Payment[]> => payments,
  confirmPayment: async (id: number) => { payments = payments.map(p => p.id === id ? { ...p, confirmed: true } : p); return { success: true }; },
  makePayment: async ({ amount }: { amount: number }) => { const p: Payment = { id: Date.now(), amount }; payments.push(p); return { success: true, payment: p }; },
  getReviews: async (): Promise<Review[]> => reviews,
  submitReview: async ({ appId, text }: { appId?: number; text: string }) => { const r: Review = { id: Date.now(), text, appId }; reviews.push(r); return { success: true, review: r }; },
  getVendorRecommendations: async () => ["Mejora UI", "Agregar funciones premium"],
  getBuyerRecommendations: async () => ["Prueba esta app", "Explora apps nuevas"],
  getBuyerPurchases: async (): Promise<App[]> => apps.filter((_, i) => i % 2 === 0),
};
""",

    # AuthContext
    "contexts/AuthContext.tsx": """import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: string | null;
  login: (u: string, p: string, role: 'vendor'|'buyer') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (u: string, p: string, role: 'vendor'|'buyer') => {
    const r = await api.login(u, p);
    if (r.success) { setUser(u); navigate(role === 'vendor' ? '/vendor' : '/buyer'); }
    return r.success;
  };

  const logout = () => { api.logout(); setUser(null); navigate('/login'); };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider'); return context; };
""",

    # Layouts Vendor y Buyer actualizados para usar rutas dinámicas
    "components/LayoutVendor.tsx": """import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItemButton, ListItemText, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';
import { vendorRoutes } from '../pages/vendor/routes';  // <-- import rutas dinámicas

const drawerWidth = 220;

export default function LayoutVendor() {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  const menuItems = vendorRoutes[0].children?.map(route => ({
    label: (route.element as any)?.type?.name || route.path,
    to: `/vendor/${route.path}`
  })) || [];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>AppSwap - Vendedor</Typography>
          {user && <Button color="inherit" onClick={logout}>Logout ({user})</Button>}
        </Toolbar>
      </AppBar>

      <Drawer variant="persistent" open={open} sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: drawerWidth } }}>
        <Toolbar />
        <List>
          {menuItems.map(item => (
            <ListItemButton key={item.to} component={Link} to={item.to} onClick={() => setOpen(false)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
""",

    "components/LayoutBuyer.tsx": """import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItemButton, ListItemText, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';
import { buyerRoutes } from '../pages/buyer/routes';  // <-- import rutas dinámicas

const drawerWidth = 220;

export default function LayoutBuyer() {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  const menuItems = buyerRoutes[0].children?.map(route => ({
    label: (route.element as any)?.type?.name || route.path,
    to: `/buyer/${route.path}`
  })) || [];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>AppSwap - Comprador</Typography>
          {user && <Button color="inherit" onClick={logout}>Logout ({user})</Button>}
        </Toolbar>
      </AppBar>

      <Drawer variant="persistent" open={open} sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: drawerWidth } }}>
        <Toolbar />
        <List>
          {menuItems.map(item => (
            <ListItemButton key={item.to} component={Link} to={item.to} onClick={() => setOpen(false)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
""",

    # Login / Register
    "pages/Login.tsx": """import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Link as MuiLink } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ user: '', pass: '' });
  const [role, setRole] = useState<'vendor'|'buyer'>('vendor');
  const [error, setError] = useState('');

  const handle = async () => {
    const success = await login(form.user, form.pass, role);
    if (!success) setError('Credenciales incorrectas');
  };

  return (
    <Box maxWidth={360} mx="auto" mt={12} display="flex" flexDirection="column" gap={2}>
      <Typography variant="h5" textAlign="center">Iniciar sesión</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Usuario" value={form.user} onChange={e => setForm({ ...form, user: e.target.value })} fullWidth />
      <TextField label="Contraseña" type="password" value={form.pass} onChange={e => setForm({ ...form, pass: e.target.value })} fullWidth />
      <select value={role} onChange={e => setRole(e.target.value as 'vendor'|'buyer')}>
        <option value="vendor">Vendedor</option>
        <option value="buyer">Comprador</option>
      </select>
      <Button variant="contained" onClick={handle} fullWidth>Ingresar</Button>
      <Typography textAlign="center" variant="body2">
        ¿No tienes cuenta? <MuiLink component={Link} to="/register">Regístrate aquí</MuiLink>
      </Typography>
    </Box>
  );
}
""",

    "pages/Register.tsx": """import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { api } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ user: '', pass: '' });
  const [msg, setMsg] = useState('');

  const handle = async () => {
    const r = await api.register(form);
    setMsg(r.success ? '✅ Registro completado' : '❌ Error');
  };

  return (
    <Box maxWidth={360} mx="auto" mt={12} display="flex" flexDirection="column" gap={2}>
      <Typography variant="h5" textAlign="center">Registro</Typography>
      {msg && <Alert severity={msg.startsWith('✅') ? 'success' : 'error'}>{msg}</Alert>}
      <TextField label="Usuario" value={form.user} onChange={e => setForm({ ...form, user: e.target.value })} fullWidth />
      <TextField label="Contraseña" type="password" value={form.pass} onChange={e => setForm({ ...form, pass: e.target.value })} fullWidth />
      <Button variant="contained" onClick={handle} fullWidth>Registrar</Button>
    </Box>
  );
}
""",

    # App + AppRoutes
    "App.tsx": """import React from 'react';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
""",

    "AppRoutes.tsx": """import React from 'react';
import { useRoutes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { vendorRoutes } from './pages/vendor/routes';
import { buyerRoutes } from './pages/buyer/routes';

export default function AppRoutes() {
  const routes = [
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    ...vendorRoutes,
    ...buyerRoutes,
    { path: '*', element: <div>404 - Página no encontrada</div> }
  ];

  return useRoutes(routes);
}
""",

    # Vendor / Buyer routes
    "pages/vendor/vendorRoutes.tsx": """import React from 'react';
import type { RouteObject } from 'react-router-dom';
import LayoutVendor from '../../components/LayoutVendor';
import Dashboard from './Dashboard';
import Apps from './AppsList';
import Payments from './Payments';
import Reviews from './Reviews';

export const vendorRoutes: RouteObject[] = [
  {
    path: '/vendor',
    element: <LayoutVendor />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'apps', element: <Apps /> },
      { path: 'payments', element: <Payments /> },
      { path: 'reviews', element: <Reviews /> },
    ],
  },
];

export default vendorRoutes;
""",

    "pages/buyer/buyerRoutes.tsx": """import React from 'react';
import type { RouteObject } from 'react-router-dom';
import LayoutBuyer from '../../components/LayoutBuyer';
import Dashboard from './Dashboard';
import Apps from './AppsList';
import Purchases from './Purchases';
import Reviews from './Reviews';

export const buyerRoutes: RouteObject[] = [
  {
    path: '/buyer',
    element: <LayoutBuyer />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'apps', element: <Apps /> },
      { path: 'purchases', element: <Purchases /> },
      { path: 'reviews', element: <Reviews /> },
    ],
  },
];

export default buyerRoutes;
""",

# === MAIN.TSX ===
"main.tsx": """import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
"""
}

# === Crear carpetas ===
for d in dirs:
    path = os.path.join(BASE_DIR, d)
    os.makedirs(path, exist_ok=True)

# === Crear archivos ===
for rel_path, content in files.items():
    file_path = os.path.join(BASE_DIR, rel_path)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Creado: {file_path}")

print("\n🎉 Proyecto React con layouts separados, Outlet y rutas modernas listo para usar")
