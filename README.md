# RateYourProject

Plataforma de análisis de proyectos técnicos mediante inteligencia artificial. Los usuarios pueden subir sus archivos Markdown para obtener una evaluación hexagonal de hireabilidad basada en seniority y rol (Frontend, Backend, DevOps).

## Funcionalidades

- **Análisis de Proyectos**: Sube archivos `.md` de tu proyecto y recibe un análisis completo
- **Gráfico Hexagonal**: Visualización de hireabilidad en 6 dimensiones clave
- **Múltiples Roles**: Evaluación personalizada para Frontend, Backend y DevOps
- **Niveles de Seniority**: Análisis adaptado a Junior, Mid-Level, Senior y Lead
- **Versión Premium**: Recomendaciones avanzadas, o pivote de ideas dependiendo del producto

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



## Requisitos Previos

- Node.js 18+
- Go 1.21+
- PostgreSQL (Supabase)
  

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

