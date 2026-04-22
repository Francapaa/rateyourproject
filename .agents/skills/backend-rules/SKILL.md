---
name: backend-rules
description: Go backend rules with Gin, Clean Architecture, Repository pattern, JWT auth, and GORM
---

# Backend Rules - Go

## General

- Usar **Go 1.21+**
- Usar **Gin** como router
- **Clean Architecture** en la estructura
- **DRIZZLE** como ORM
- Patrón **Repository** para acceso a datos

## Estructura de Proyecto

```
cmd/
├── server/
│   └── main.go           # Entry point
internal/
├── config/               # Configuración
├── handlers/            # HTTP handlers
│   ├── auth/
│   └── analysis/
├── middleware/          # HTTP middleware
├── models/              # Structs y modelos
├── repository/         # Database access
├── services/           # Business logic
│   ├── ai/
│   └── rag/
└── utils/              # Utilidades
```

## Nombrado

- **Archivos**: snake_case (`user_handler.go`)
- **Funciones**: PascalCase exportadas, camelCase privadas
- **Variables**: camelCase, constantes UPPER_SNAKE_CASE
- **Paquetes**: nombres simples, evitar redundancia

## Handlers

- Un archivo por recurso
- Naming: `{recurso}_handler.go`
- Prefijo `Handler` en struct

```go
type AuthHandler struct {
    authService *services.AuthService
}

func NewAuthHandler(as *services.AuthService) *AuthHandler {
    return &AuthHandler{authService: as}
}
```

### Métodos HTTP
- Prefijo según método: `HandleLogin`, `HandleGetUser`
- Request/Response como structs separados

```go
type LoginRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
    Token string `json:"token"`
    User  User   `json:"user"`
}
```

## Servicios

- Lógica de negocio separada de handlers
- Inyección de dependencias
- Interfaces para repositorios

```go
type UserRepository interface {
    Create(user *models.User) error
    FindByID(id string) (*models.User, error)
    FindByEmail(email string) (*models.User, error)
}
```

## Modelos

- Structs para DB y JSON
- Tags para JSON y GORM
- Timestamps consistentes

```go
type User struct {
    ID           uuid.UUID `json:"id" gorm:"type:uuid;primary_key"`
    Email        string    `json:"email" gorm:"uniqueIndex;not null"`
    PasswordHash string    `json:"-" gorm:"not null"`
    Name         string    `json:"name"`
    IsPremium    bool      `json:"is_premium" gorm:"default:false"`
    CreatedAt    time.Time `json:"created_at"`
    UpdatedAt    time.Time `json:"updated_at"`
}
```

## Repository

- CRUD operations
- Queries complejos en métodos separados
- Usar transacciones cuando sea necesario

```go
func (r *UserRepository) Create(user *models.User) error {
    return r.db.Create(user).Error
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
    var user models.User
    err := r.db.Where("email = ?", email).First(&user).Error
    if err != nil {
        return nil, err
    }
    return &user, nil
}
```

## Middleware

- Logging, Auth, CORS, Rate Limiting
- Wrapper de función

```go
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.JSON(401, gin.H{"error": "unauthorized"})
            c.Abort()
            return
        }
        c.Next()
    }
}
```

## Error Handling

- Errores como valores, no exceptions
- Wrap errors con contexto

```go
import "fmt"

func (s *UserService) GetUser(id string) (*models.User, error) {
    user, err := s.repo.FindByID(id)
    if err != nil {
        return nil, fmt.Errorf("finding user %s: %w", id, err)
    }
    return user, nil
}
```

## Validación

- Usar librería de validación (`govi`, `ozzo-validation`)
- Validar en handler y servicio
- Mensajes de error claros

## Autenticación

- JWT para tokens
- Passwords hasheados con bcrypt
- Tokens en headers, no en body

```go
import "golang.org/x/crypto/bcrypt"

func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    return string(bytes), err
}

func CheckPassword(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}
```

## Configuración

- Variables de entorno
- Usar `.env` en desarrollo
- Estructura de config

```go
type Config struct {
    Port        string
    DatabaseURL string
    JWTSecret   string
    GeminiAPIKey string
}

func Load() *Config {
    return &Config{
        Port:        getEnv("PORT", "8080"),
        DatabaseURL: getEnv("DATABASE_URL", ""),
        JWTSecret:   getEnv("JWT_SECRET", ""),
    }
}
```

## Logging

- Usar logger estructurado (`zap`, `logrus`)
- Distinguir niveles: Debug, Info, Warn, Error
- No loggear passwords o secrets

## API Response

- Formato consistente

```go
type APIResponse struct {
    Success bool        `json:"success"`
    Data    interface{} `json:"data,omitempty"`
    Error   string      `json:"error,omitempty"`
}

func Success(c *gin.Context, data interface{}) {
    c.JSON(200, APIResponse{Success: true, Data: data})
}

func Error(c *gin.Context, status int, message string) {
    c.JSON(status, APIResponse{Success: false, Error: message})
}
```

## Testing

- Tests en archivos `_test.go`
- Table-driven tests cuando sea posible
- Mock de dependencias
- Tests de integración en `/tests`

## Dependencias

- Módulos Go (`go.mod`)
- Revisar dependencias regularmente
- Evitar dependencias innecesarias

## Seguridad

- Sanitizar inputs
- SQL injection: usar GORM parameterized
- No exponer datos sensibles en logs
- Headers de seguridad (Helmet)

## Concurrencia

- Goroutines para operaciones async
- WaitGroups cuando sea necesario
- Channels para comunicación
- Evitar race conditions
