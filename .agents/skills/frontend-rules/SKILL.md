---
name: frontend-rules
description: Next.js 14+ App Router with TypeScript, TailwindCSS, Server Components, React Hook Form, and Vitest
---

# Frontend Rules - Next.js + TailwindCSS

## General

- Usar **Next.js 14+ App Router**
- Usar **TypeScript** en todo el código
- Usar **TailwindCSS** para estilos
- Componentes en **Server Components** por defecto, usar `use client` solo cuando sea necesario

## Estructura de Archivos

```
src/
├── app/                    # App Router
│   ├── (auth)/            # Route groups
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/               # Componentes reutilizables
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   └── [feature]/        # Componentes por feature
├── lib/                   # Utilidades
├── hooks/                 # Custom hooks
└── types/                 # TypeScript types
```

## Componentes

### Nombrado
- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useAuth.ts`)
- **Utilidades**: camelCase (`formatDate.ts`)
- **Constantes**: UPPER_SNAKE_CASE

### Componentes UI
- Crear componentes pequeños y reutilizables
- Usar composition: `<Button><Icon /></Button>`
- Un componente por archivo
- Exportar como default el componente principal

### Props
- Definir interfaz explícita para props
- Usar `React.FC<Props>` o тип inference
- Required props sin valor por defecto van primero
- Opcionales al final

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
```

## TypeScript

- **Strict mode** siempre activado
- Tipos explícitos en funciones públicas
- Evitar `any`, usar `unknown` si es necesario
- Usar utility types: `Pick`, `Omit`, `Partial`

```typescript
// ✅ Correcto
interface User {
  id: string;
  name: string;
  email: string;
}

type UserPreview = Pick<User, 'id' | 'name'>;

// ❌ Evitar
type UserAny = any;
```

## TailwindCSS

### Clases
- Ordenar clases: layout → spacing → visual → state
- Usar shorthand cuando sea posible
- Evitar valores hardcoded, usar config

```tsx
// ✅ Correcto
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">

// ❌ Evitar
<div className="display: flex; padding: 16px; background-color: #fff;">
```

### Colores
- Usar tokens de Tailwind: `bg-primary-500`, `text-gray-900`
- Definir colores en `tailwind.config.ts`
- No usar colores hex directamente

### Responsive
- Mobile-first: `md:`, `lg:`, `xl:`
- Móviles sin prefijo, desktop con prefijo

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
```

## State Management

- **React Server Components** para data fetching
- **useState** para estado local simple
- **useReducer** para estado complejo
- **Context** solo para auth/theme global
- Evitar prop drilling: usar composition

## Data Fetching

- Usar **Server Actions** para mutaciones
- Usar **fetch** con caching en Server Components
- Loading states con `loading.tsx`
- Error handling con `error.tsx`

```typescript
// Server Action
async function createAnalysis(data: AnalysisInput) {
  'use server';
  const result = await fetch('/api/analysis', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.json();
}
```

## Formularios

- Usar **React Hook Form** + **Zod**
- Validación client-side y server-side
- Mostrar errores de forma clara
- Loading state durante submit

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = useForm({ schema });
```

## API Client

- Crear cliente centralizado en `lib/api.ts`
- Tipos para requests y responses
- Manejo de errores centralizado
- Interceptors para auth token

```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## Imágenes

- Usar `next/image` para optimización
- Definir width/height siempre
- Usar `placeholder` para loading
- Lazy loading por defecto

## Testing con Vitest

- Tests unitarios para componentes
- Tests de integración para flujos
- Mock de API calls
- Coverage mínimo: 70%

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('button click', async () => {
  render(<Button>Click me</Button>);
  await userEvent.click(screen.getByRole('button'));
});
```

## Imports

- Order: external → internal → relative
- Alias paths en `tsconfig.json`

```typescript
import React from 'react';           // External
import { Button } from '@/components'; // Internal
import { formatDate } from './utils';   // Relative
```

## Errores

- Try-catch en operaciones async
- User-friendly error messages
- Log de errores en desarrollo
- No exponer información sensible

## Performance

- Code splitting automático con App Router
- Dynamic imports para componentes pesados
- Memoización con `useMemo`/`useCallback` solo si hay problemas de performance
- Optimizar imágenes
- LOS COMPONENTES DEBEN CUMPLIR UNA SOLA FUNCION.
- FUNCIONES TYPESCRIPT DE COMPONENTES DEBEN ESTAR FUERA DEL COMPONENTE (EN CARPETA /UTILS)
- La mayor cantidad de componentes deben ser SSR, los pequeños componentes que contienen estado deben usar 'use client'

## Accesibilidad

- Semantic HTML
- ARIA labels cuando sea necesario
- Keyboard navigation
- Focus states visibles
- Color contrast WCAG AA
