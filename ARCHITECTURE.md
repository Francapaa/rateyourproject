# Arquitectura Técnica

## Visión General

RateYourProject es una aplicación full-stack que permite analizar proyectos técnicos mediante OpenAI. La arquitectura sigue el patrón cliente-servidor con REST API.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  Database   │
│  (Next.js)  │     │     (Go)    │     │  (Supabase) │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  OpenAI API │
                    └─────────────┘
```

## Componentes

### Frontend (Next.js + TailwindCSS)

#### Estructura de Directorios
```
frontend/src/
├── app/                    # App Router
│   ├── (auth)/            # Rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Rutas protegidas
│   │   ├── analysis/
│   │   └── profile/
│   ├── api/               # API Routes (proxy)
│   ├── layout.tsx
│   ├── page.tsx          # Landing page
│   └── globals.css
├── components/
│   ├── ui/               # Componentes base
│   ├── analysis/         # Componentes de análisis
│   └── auth/             # Componentes de auth
├── lib/
│   ├── api.ts            # Cliente API
│   ├── auth.ts           # Utilidades auth
│   └── utils.ts          # Utilidades generales
├── hooks/                # Custom hooks
├── types/                # TypeScript types
└── services/             # Servicios externos
```

#### Stack Tecnológico
- **Next.js 14+**: App Router, Server Components
- **TailwindCSS**: Utility-first CSS
- **TypeScript**: Tipado estático
- **Vitest**: Testing framework
- **React Hook Form**: Manejo de formularios
- **Zod**: Validación de esquemas

### Backend (Go)

#### Estructura de Directorios
```
backend/
├── cmd/
│   └── server/
│       └── main.go       # Entry point
├── internal/
│   ├── config/          # Configuración
│   ├── handlers/        # HTTP handlers
│   │   ├── auth/
│   │   └── analysis/
│   ├── middleware/      # HTTP middleware
│   ├── models/         # Modelos de datos
│   ├── repository/     # Acceso a datos
│   ├── services/       # Lógica de negocio
│   │   ├── ai/         # Integración OpenAI
│   │   └── rag/       # RAG (Premium)
│   └── utils/          # Utilidades
├── migrations/         # Migraciones DB
├── tests/              # Tests integration
└── go.mod
```

#### Stack Tecnológico
- **Go 1.21+**: Lenguaje
- **Gin/Gorilla**: Router HTTP
- **GORM**: ORM
- **PostgreSQL**: Base de datos
- **JWT**: Autenticación
- **testing**: Testing stdlib

### Base de Datos (PostgreSQL - Supabase)

#### Schema

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analyses
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    seniority VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    files_content TEXT NOT NULL,
    result JSONB,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Premium Recommendations (RAG)
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Índices
```sql
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_recommendations_analysis_id ON recommendations(analysis_id);
```

## Flujo de Datos

### Flujo de Análisis Básico

1. Usuario autenticado envía archivos MD
2. Frontend envía a `/api/analysis`
3. Backend valida y guarda en DB
4. Backend llama a OpenAI API
5. OpenAI procesa y retorna análisis
6. Backend guarda resultado y retorna al frontend
7. Frontend renderiza gráfico hexagonal

### Flujo Premium (RAG)

1. Usuario premium envía solicitud
2. Backend consulta base de conocimiento
3. Combina contexto con prompt original
4. OpenAI genera recomendaciones personalizadas
5. Respuesta optimizada retornada

## API Design

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/register | Registrar usuario |
| POST | /api/auth/login | Login, retorna JWT |
| GET | /api/auth/me | Obtener usuario actual |

### Análisis

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/analysis | Crear análisis |
| GET | /api/analysis/:id | Obtener análisis |
| GET | /api/analysis | Listar análisis usuario |
| DELETE | /api/analysis/:id | Eliminar análisis |

### Premium

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/premium/recommendations | Recomendaciones RAG |

## Seguridad

### Autenticación
- JWT en cookies httpOnly (production)
- Passwords hasheadas con bcrypt
- Rate limiting en endpoints auth

### Validación
- Zod en frontend
- Validación manual en backend
- Sanitización de inputs

### API
- CORS configurado
- Helmet headers
- HTTPS en producción

## Configuración por Entorno

### Desarrollo
- DB local o Docker
- Hot reload
- Logs detallados

### Producción
- Supabase
- Variables de entorno seguras
- Logs estructurados (JSON)
- Cache Redis (futuro)

## Diagramas de Secuencia

### Análisis Básico
```
Usuario → Frontend → Backend → OpenAI → Backend → Frontend → Usuario
                     ↓
                   DB
```

### Premium con RAG
```
Usuario → Frontend → Backend → RAG Store + PROMPT ENGINEERING → OpenAI → Backend → Frontend → Usuario
                          ↓
                        DB
```

## Escalabilidad

### Horizontal
- Frontend: Vercel/Netlify
- Backend: Contenedores (Docker/K8s)
- DB: Supabase (auto-scaling)

### Caching (Futuro)
- Redis para sesiones
- Cache de análisis frecuentes
- CDN para assets estáticos


## Monitoreo

- Logs estructurados
- Métricas de API
- Alertas de errores
- Health checks
