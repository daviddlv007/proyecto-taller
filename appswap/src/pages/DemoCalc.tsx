import { useEffect } from 'react';

export default function DemoCalc() {
  useEffect(() => {
    // Redirigir al HTML estático en public/demo-calc/
    window.location.href = '/demo-calc/index.html';
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <p style={{ color: 'white', fontSize: '20px' }}>Cargando CalculadoraPro...</p>
    </div>
  );
}
