import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import StoreIcon from '@mui/icons-material/Store';

const LayoutPublic: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Para Usuarios', path: '/for-buyers' },
    { label: 'Para Desarrolladores', path: '/for-vendors' },
    { label: 'Contacto', path: '/contact' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          {/* Logo */}
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')} sx={{ mr: 1 }}>
            <StoreIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 700 }}
            onClick={() => navigate('/')}
          >
            AppSwap
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button key={item.path} color="inherit" onClick={() => handleNavigation(item.path)}>
                  {item.label}
                </Button>
              ))}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/login')}
                sx={{ ml: 2 }}
              >
                Iniciar Sesión
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => navigate('/register')}>
                Registrarse
              </Button>
            </Box>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen} edge="end">
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                {navItems.map((item) => (
                  <MenuItem key={item.path} onClick={() => handleNavigation(item.path)}>
                    {item.label}
                  </MenuItem>
                ))}
                <MenuItem onClick={() => handleNavigation('/login')}>Iniciar Sesión</MenuItem>
                <MenuItem onClick={() => handleNavigation('/register')}>Registrarse</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} AppSwap - Plataforma de intercambio de aplicaciones entre
            desarrolladores y usuarios
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LayoutPublic;
