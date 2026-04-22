---
name: test-rules
description: Testing rules for frontend with Vitest and backend with Go testing, including mocking and coverage requirements
---

# Test Rules - Vitest (Frontend) + Go Testing (Backend)

## Cobertura Mínima

- **Frontend**: 70% de cobertura
- **Backend**: 80% de cobertura
- Priorizar tests de lógica de negocio

---

## Frontend - Vitest

### Estructura de Tests

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
├── lib/
│   ├── api.ts
│   └── utils.ts
│       └── utils.test.ts
└── hooks/
    └── useAuth.test.ts
```

### Naming

- `{nombre}.test.ts` o `{nombre}.spec.ts`
- Descriptivo: `user_can_login.test.ts`
- Estructura: `describe` → `it` → `expect`

```typescript
describe('Button', () => {
  describe('onClick', () => {
    it('calls handler when clicked', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
```

### Types de Tests

1. **Unit Tests**: Componentes, funciones utilitarias
2. **Integration Tests**: Múltiples componentes
3. **E2E**: Flujos completos (Cypress/Playwright)

### Setup

```typescript
// vitest.setup.ts
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

### Mocking

```typescript
// Mock de módulo
vi.mock('@/lib/api', () => ({
  login: vi.fn(),
}));

// Mock de componente
vi.mock('next/image', () => ({
  default: (props: ImageProps) => <img {...props} />,
}));

// Mock de hook
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
mockUseAuth.mockReturnValue({ user: null });
```

### Testing Library

- Preferir `screen.getByRole` sobre `getByText`
- Queries en orden de prioridad: role → label → text → testId
- Testing user-centric, no implementation

```typescript
// ✅ Correcto
const submitButton = screen.getByRole('button', { name: /submit/i });

// ❌ Evitar
const button = screen.getByTestId('submit-btn');
```

### Helpers

```typescript
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options });
}

export * from '@testing-library/react';
export { customRender as render };
```

### Run Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# UI mode
npm run test:ui
```

---

## Backend - Go Testing

### Estructura de Tests

```
internal/
├── handlers/
│   ├── auth_handler.go
│   └── auth_handler_test.go
├── services/
│   ├── user_service.go
│   └── user_service_test.go
├── repository/
│   ├── user_repo.go
│   └── user_repo_test.go
└── integration/
    └── main_test.go
```

### Naming

- `{nombre}_test.go`
- Funciones con prefijo `Test`
- Tabla de tests para múltiples casos

```go
func TestUserService_Create(t *testing.T) {
    tests := []struct {
        name    string
        user    *models.User
        wantErr bool
    }{
        {
            name:    "valid user",
            user:    &models.User{Email: "test@example.com"},
            wantErr: false,
        },
        {
            name:    "invalid email",
            user:    &models.User{Email: "invalid"},
            wantErr: true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // test logic
        })
    }
}
```

### Tipos de Tests

1. **Unit Tests**: Funciones, métodos
2. **Integration Tests**: Handler con DB real
3. **Benchmark Tests**: Performance

### Setup/Teardown

```go
func TestMain(m *testing.M) {
    // setup
    code := m.Run()
    // teardown
    os.Exit(code)
}

func setup(t *testing.T) *DB {
    db := connectToTestDB()
    return db
}

func teardown(db *DB) {
    db.Close()
}
```

### Assertions

```go
import (
    "testing"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/require"
)

func TestSomething(t *testing.T) {
    result := DoSomething()
    
    // Hard fail
    assert.Equal(t, expected, result)
    
    // Soft fail, continue
    require.NoError(t, err)
}
```

### Mocking

```go
type MockUserRepository struct {
    mock.Mock
}

func (m *MockUserRepository) Create(user *models.User) error {
    args := m.Called(user)
    return args.Error(0)
}

func TestCreateUser(t *testing.T) {
    mockRepo := new(MockUserRepository)
    
    mockRepo.On("Create", mock.Anything).Return(nil)
    
    service := NewUserService(mockRepo)
    err := service.CreateUser(&models.User{})
    
    mockRepo.AssertExpectations(t)
}
```

### Testing Handlers

```go
func TestAuthHandler_Login(t *testing.T) {
    w := httptest.NewRecorder()
    c, _ := gin.CreateTestContext(w)
    
    c.Request = httptest.NewRequest("POST", "/login", strings.NewReader(`{"email":"test@test.com","password":"password"}`))
    c.Request.Header.Set("Content-Type", "application/json")
    
    handler := NewAuthHandler(mockService)
    handler.Login(c)
    
    assert.Equal(t, 200, w.Code)
}
```

### Integration Tests

```go
// tests/integration_test.go
func TestIntegration(t *testing.T) {
    if testing.Short() {
        t.Skip("Skipping integration tests")
    }
    
    // Setup test database
    db := setupTestDB()
    defer db.Close()
    
    // Run migrations
    // Test endpoints
}
```

### Benchmarking

```go
func BenchmarkLogin(b *testing.B) {
    for i := 0; i < b.N; i++ {
        DoLogin()
    }
}
```

```bash
go test -bench=.
go test -bench=. -benchmem
```

### Run Tests

```bash
# All tests
go test ./...

# Verbose
go test -v ./...

# Coverage
go test -cover ./...

# Specific package
go test ./internal/handlers/...

# Skip integration
go test -short ./...

# Race detector
go test -race ./...
```

---

## Best Practices

### General

1. **AAA Pattern**: Arrange → Act → Assert
2. **One expectation per test** cuando sea posible
3. **Tests independientes** entre sí
4. **Nombres descriptivos** explicandocaso
5. **Mantener tests actualizados** con código

### Frontend

- Test de comportamiento, no implementación
- No testear implementación detalles
- Usar data-testid solo como último recurso
- Simular interacciones reales del usuario

### Backend

- Tests de borde (edge cases)
- Tests de error
- Tests de concurrencia si aplica
- Tests de performance críticos

### CI/CD

- Correr tests en cada PR
- Bloquear merge si fallan
- Generar reporte de coverage
- Tests lentos en paralelo
