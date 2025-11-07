import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../theme/ThemeProvider';

// Nuevo tipo de ruta compatible con handle
interface RouteConfig {
  path?: string;
  element?: React.ReactNode;
  handle?: {
    label?: string;
    icon?: React.ReactNode;
    sidebar?: boolean;
  };
}

interface GenericLayoutProps {
  routes: RouteConfig[];
  basePath: string;
}

export default function GenericLayout({ routes, basePath }: GenericLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(
    () => localStorage.getItem('drawerOpen') === 'true'
  );
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);
  const drawerWidth = 220;
  const miniDrawerWidth = 60;

  const toggleDrawer = () => {
    setDrawerOpen((prev) => {
      const next = !prev;
      localStorage.setItem('drawerOpen', next.toString());
      return next;
    });
  };

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  const { mode, toggleTheme } = useThemeContext();

  // Generar items del sidebar usando handle
  const menuItems = routes
    .filter((r) => r.handle?.sidebar !== false)
    .map((r) => ({
      label: r.handle?.label || r.path,
      to: r.path ? `${basePath}/${r.path}` : basePath,
      icon: r.handle?.icon || null,
    }));

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar position="fixed" color="primary" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AppSwap
          </Typography>

          {user && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ mr: 1 }}>
                {user.nombre}
              </Typography>
              <Tooltip title={`Cambiar a ${mode === 'light' ? 'modo oscuro' : 'modo claro'}`}>
                <IconButton color="inherit" onClick={toggleTheme}>
                  <Brightness4Icon />
                </IconButton>
              </Tooltip>
              <IconButton color="inherit" onClick={openMenu}>
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={menuOpen}
                onClose={closeMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </Menu>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : miniDrawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            overflowX: 'hidden',
            transition: 'none',
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <Tooltip key={item.to} title={drawerOpen ? '' : item.label || ''} placement="right">
              <ListItemButton
                component={Link}
                to={item.to || '#'}
                sx={{
                  minHeight: 48,
                  justifyContent: drawerOpen ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                {item.icon && (
                  <Box
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 2 : 'auto',
                      justifyContent: 'center',
                      display: 'flex',
                    }}
                  >
                    {item.icon}
                  </Box>
                )}
                {drawerOpen && <ListItemText primary={item.label} />}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          bgcolor: 'background.default',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
