# RateYourProject

Plataforma de análisis de proyectos técnicos mediante inteligencia artificial. Los usuarios pueden subir sus archivos Markdown para obtener una evaluación hexagonal de hireabilidad basada en seniority y rol (Frontend, Backend, DevOps).

## Funcionalidades

- **Análisis de Proyectos**: Sube archivos `.md` de tu proyecto y recibe un análisis completo
- **Gráfico Hexagonal**: Visualización de hireabilidad en 6 dimensiones clave
- **Múltiples Roles**: Evaluación personalizada para Frontend, Backend y DevOps
- **Niveles de Seniority**: Análisis adaptado a Junior, Mid-Level, Senior y Lead
- **Versión Premium**: Recomendaciones avanzadas mediante RAG y Prompt Engineering

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS
- **Testing**: Vitest
- **Language**: TypeScript

### Backend 
- **Language**: Go
- **API**: REST
- **Database**: PostgreSQL (Supabase)

### AI
- **Model**: gpt-5.4-nano (OPEN AI)
- **Integración**: Prompt Engineering + RAG (Premium)

## Requisitos Previos

- Node.js 18+
- Go 1.21+
- PostgreSQL (Supabase)
- API Key de Open AI

## Instalación

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
go mod download
go run cmd/server/main.go
```

### Variables de Entorno

#### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8080
```

#### Backend (.env)
```
PORT=8080
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
OPEN_AI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
```

## Estructura del Proyecto

```
/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/      # App Router pages
│   │   ├── components/ # UI components
│   │   ├── lib/      # Utilities
│   │   └── services/ # API clients
│   └── tests/        # Vitest tests
├── backend/          # Go application
│   ├── cmd/         # Entry points
│   ├── internal/    # Private packages
│   │   ├── handlers/ # HTTP handlers
│   │   ├── services/ # Business logic
│   │   ├── models/   # Data models
│   │   └── repository/ # Database access
│   └── tests/       # Go tests
└── skills/          # Agent rules
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Usuario actual

### Análisis
- `POST /api/analysis` - Crear análisis
- `GET /api/analysis/:id` - Obtener análisis
- `GET /api/analysis` - Listar análisis del usuario

### Premium (RAG)
- `POST /api/premium/recommendations` - Obtener recomendaciones

## Testing

### Frontend
```bash
cd frontend
npm run test
npm run test:coverage
```

### Backend
```bash
cd backend
go test ./...
go test -cover ./...
```

## Flujo de Usuario

1. **Landing Page**: Usuario llega a la página principal
2. **Registro/Login**: Autenticación requerida para usar
3. **Input**: Usuario ingresa seniority y rol
4. **Upload**: Sube archivos `.md` del proyecto
5. **Análisis**: OpenAI procesa y genera evaluación
6. **Resultado**: Gráfico hexagonal de hireabilidad
7. **Premium**: Recomendaciones personalizadas (pago)

## Roadmap

- [ ] Landing page pública
- [ ] Sistema de autenticación
- [ ] Chat/input para subir MD
- [ ] Integración OpenAI básica
- [ ] Gráfico hexagonal
- [ ] Análisis por rol (Frontend/Backend/DevOps)
- [ ] Sistema de pagos
- [ ] RAG + Prompt Engineering premium
- [ ] Más roles (Data Science, Mobile, etc.)
- [ ] Historial de análisis
- [ ] Exportar resultados

## Licencia

MIT
