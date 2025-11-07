# 📋 Estándares de Codificación - AppSwap

## 🎯 Objetivo
Implementar estándares de codificación reconocidos mundialmente para garantizar código limpio, mantenible y profesional en el proyecto AppSwap.

## 🏗️ Arquitectura de Calidad

### Capas de Estándares Aplicados

| Capa | Estándar | Implementación |
|------|----------|----------------|
| **Calidad de Software** | ISO/IEC 25010 | Mantenibilidad, usabilidad, rendimiento |
| **Codificación y Estilo** | TypeScript + ESLint Rules | ESLint + Prettier automatizado |
| **Control de Versiones** | Git + Automatización | Husky + lint-staged |
| **Formato de Código** | Prettier Standard | Configuración unificada |

## 🛠️ Stack de Herramientas

### Tecnologías Core
- **React 19**: Biblioteca UI con hooks y componentes funcionales
- **TypeScript 5.9**: Tipado estático y mejor DX
- **Vite 7**: Build tool moderno y rápido
- **Material-UI 7**: Sistema de diseño profesional

### Herramientas de Calidad
- **ESLint 9**: Análisis estático con flat config
- **Prettier 3.2**: Formateo automático de código
- **Husky 9**: Git hooks para automatización
- **lint-staged 15**: Revisión de archivos en staging

## 📐 Configuración de Estándares

### ESLint Configuration (Flat Config)
```javascript
// eslint.config.js
export default defineConfig([
  {
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      prettierConfig
    ],
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error'
    }
  }
]);
```

### Prettier Configuration
```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5",
  "arrowParens": "always"
}
```

### Lint-staged Configuration
```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

## 🚀 Scripts de Desarrollo

| Script | Propósito | Uso |
|--------|-----------|-----|
| `npm run dev` | Servidor de desarrollo | Desarrollo local |
| `npm run build` | Build de producción | CI/CD |
| `npm run lint` | Análisis de código | Revisión manual |
| `npm run lint:fix` | Corrección automática | Reparación de errores |
| `npm run format` | Formateo de código | Estandarización |
| `npm run format:check` | Verificar formateo | CI/CD checks |
| `npm run quality` | Revisión completa | Pre-commit validation |
| `npm run quality:fix` | Corrección completa | Reparación integral |

## 🔄 Flujo de Trabajo Automatizado

```
(1) Desarrollo en React/TypeScript
         ↓
(2) ESLint (Análisis en tiempo real en VS Code)
         ↓
(3) Prettier (Formateo automático al guardar)
         ↓
(4) git add <archivos>
         ↓
(5) git commit
         ↓
(6) Pre-commit hook ejecuta lint-staged
         ↓
(7) ESLint --fix + Prettier en archivos staged
         ↓
(8) Commit realizado (si no hay errores)
```

## 📏 Métricas de Calidad (ISO/IEC 25010)

### Mantenibilidad ✅
- Código consistente con reglas TypeScript/ESLint
- Documentación integrada con JSDoc
- Tipado estático completo
- Componentes reutilizables

### Usabilidad ✅
- Interfaces claras y consistentes
- Material-UI para UX profesional
- Responsive design
- Accesibilidad (a11y) con semantic HTML

### Rendimiento ✅
- Build optimizado con Vite
- Code splitting automático
- Tree shaking habilitado
- Lazy loading de rutas

### Fiabilidad ✅
- Validación automática pre-commit
- TypeScript previene errores en tiempo de compilación
- ESLint detecta problemas de lógica
- Prettier elimina inconsistencias de formato

## 🎮 Configuración del Editor

### VS Code (Configuración Incluida)
El proyecto incluye `.vscode/settings.json` con:
- ✅ Formateo al guardar automático
- ✅ Corrección automática de ESLint
- ✅ Organización de imports
- ✅ Integración con TypeScript

### Extensiones Recomendadas (.vscode/extensions.json)
1. **ESLint** - dbaeumer.vscode-eslint
2. **Prettier** - esbenp.prettier-vscode
3. **TypeScript** - ms-vscode.vscode-typescript-next
4. **React Snippets** - dsznajder.es7-react-js-snippets

### Configuración Manual (Otros Editores)
Si usas otro editor:
1. Habilitar formateo automático con Prettier
2. Integrar ESLint para análisis en tiempo real
3. Configurar auto-save
4. Habilitar TypeScript Language Server

## 🔧 Resolución de Problemas

### Error de ESLint
```bash
npm run lint:fix
```

### Error de Formateo
```bash
npm run format
```

### Revisión Completa
```bash
npm run quality:fix
```

### Regenerar Husky
```bash
rm -rf .husky
npx husky init
# Luego edita .husky/pre-commit y agrega: npx lint-staged
```

### Errores de Tipado TypeScript
```bash
# Verificar errores
npm run build

# Limpiar cache
rm -rf node_modules/.vite
```

## 📚 Reglas Específicas del Proyecto

### TypeScript
- ✅ **Uso obligatorio de tipos**: No usar `any` (warnings)
- ✅ **Variables no usadas**: Error (excepto con prefijo `_`)
- ✅ **Inferencia de tipos**: Aprovechar cuando sea obvio
- ✅ **Interfaces sobre types**: Para objetos y props de componentes

### React
- ✅ **Functional Components**: Solo usar functional, no class components
- ✅ **Hooks**: Usar hooks de React correctamente
- ✅ **Props destructuring**: Destructurar props en parámetros
- ✅ **React.FC**: Evitar, tipar props directamente

### Imports
- ✅ **Orden de imports**: React → Third-party → Local
- ✅ **Absolute imports**: Configurados desde `src/`
- ✅ **Named exports**: Preferir sobre default exports

### Console.log
- ⚠️ **Warning**: `console.log` genera warning
- ✅ **Permitidos**: `console.warn` y `console.error`
- 🎯 **Producción**: Todos removidos en build

## 🏁 Checklist de Calidad

Antes de cada commit (automático con hooks):

- [x] ✅ ESLint sin errores
- [x] ✅ Prettier aplicado
- [x] ✅ TypeScript sin errores
- [x] ✅ Imports organizados
- [x] ✅ Variables no usadas eliminadas
- [x] ✅ Build exitoso

## 📊 Estadísticas del Proyecto

```bash
# Ver estadísticas de calidad
npm run lint 2>&1 | tail -5

# Contar archivos TypeScript
find src -name "*.tsx" -o -name "*.ts" | wc -l

# Ver problemas por archivo
npm run lint
```

## 🔍 Comandos de Verificación

### Verificar Formateo
```bash
npm run format:check
```

### Verificar Linting
```bash
npm run lint
```

### Verificar Todo
```bash
npm run quality
```

### Corregir Todo
```bash
npm run quality:fix
```

## 🎓 Buenas Prácticas Implementadas

### 1. Separación de Responsabilidades
```
src/
├── components/     # Componentes UI reutilizables
├── features/       # Características por dominio
├── services/       # Lógica de negocio/API
├── contexts/       # Estado global con Context API
├── types/          # Definiciones de TypeScript
└── theme/          # Configuración de tema
```

### 2. Nomenclatura Consistente
- **Componentes**: PascalCase (Ej: `BuyerAppCard.tsx`)
- **Funciones**: camelCase (Ej: `handleSubmit`)
- **Constantes**: UPPER_SNAKE_CASE (Ej: `API_BASE_URL`)
- **Tipos/Interfaces**: PascalCase (Ej: `UserProfile`)

### 3. Documentación en Código
```typescript
/**
 * Componente para mostrar tarjeta de aplicación
 * @param app - Datos de la aplicación
 * @param onPurchase - Callback al comprar
 */
export const AppCard = ({ app, onPurchase }: AppCardProps) => {
  // ...
};
```

### 4. Manejo de Errores
```typescript
try {
  await api.purchaseApp(appId);
  toast.success('¡Compra exitosa!');
} catch (error) {
  console.error('Error al comprar:', error);
  toast.error('Error al procesar la compra');
}
```

## 🚦 Estado de Implementación

- ✅ ESLint configurado con TypeScript
- ✅ Prettier configurado y funcionando
- ✅ Husky instalado y activo
- ✅ lint-staged configurado
- ✅ VS Code settings incluidos
- ✅ Scripts npm actualizados
- ✅ Pre-commit hooks funcionando
- ✅ Formateo automático en ~45 archivos

## 📈 Mejoras Futuras

1. **Testing**: Integrar Jest + React Testing Library
2. **Coverage**: Reportes de cobertura de código
3. **CI/CD**: GitHub Actions para validación automática
4. **Commit Lint**: Conventional commits con commitlint
5. **Changelog**: Generación automática con semantic-release

---

## 📖 Referencias

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [React Best Practices](https://react.dev/learn)
- [ISO/IEC 25010 - Quality Model](https://iso25000.com/index.php/normas-iso-25000/iso-25010)

---

**✨ Estándares de codificación aplicados exitosamente en AppSwap**
