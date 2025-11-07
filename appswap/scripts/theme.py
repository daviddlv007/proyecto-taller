import os

# Obtener la ruta donde está este script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Asumimos que src/ está en el mismo nivel que scripts/
src_path = os.path.join(script_dir, "..", "src")
src_path = os.path.abspath(src_path)

# Crear carpeta theme
theme_path = os.path.join(src_path, "theme")
os.makedirs(theme_path, exist_ok=True)

# 1️⃣ themes.ts
themes_ts = """import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#ff4081' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none' } } },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: { default: '#121212' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none' } } },
  },
});
"""

with open(os.path.join(theme_path, "themes.ts"), "w") as f:
    f.write(themes_ts)

# 2️⃣ ThemeProvider.tsx
theme_provider_tsx = """import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './themes';
import { GlobalStyles } from './GlobalStyles';

type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: 'light',
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
"""

with open(os.path.join(theme_path, "ThemeProvider.tsx"), "w") as f:
    f.write(theme_provider_tsx)

# 3️⃣ GlobalStyles.tsx
global_styles_tsx = """import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

export const GlobalStyles = () => (
  <MuiGlobalStyles
    styles={{
      body: {
        margin: 0,
        padding: 0,
        fontFamily: '"Roboto", sans-serif',
      },
      a: {
        textDecoration: 'none',
        color: 'inherit',
      },
    }}
  />
);
"""

with open(os.path.join(theme_path, "GlobalStyles.tsx"), "w") as f:
    f.write(global_styles_tsx)

print(f"✅ Carpeta 'theme' creada en {theme_path} con themes.ts, ThemeProvider.tsx y GlobalStyles.tsx")
