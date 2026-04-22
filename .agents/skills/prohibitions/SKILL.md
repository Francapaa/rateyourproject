---
name: prohibitions
description: Prohibited practices across security, frontend, backend, testing, and general coding standards
---

# Prohibitions - What NOT to Do

Esta guía lista prácticas que están **prohibidas** en el proyecto. No hacer estas cosas bajo ninguna circunstancia.

---

## Seguridad

### ❌ NO guardar secrets en código

```typescript
// ❌ PROHIBIDO
const apiKey = "sk-1234567890abcdef";
const password = "miPassword123";

// ✅ CORRECTO
const apiKey = process.env.GEMINI_API_KEY;
const password = process.env.JWT_SECRET;
```

**COOKIES**
- NUNCA GUARDARLAS EN LOCALSTORAGE (ASI EVITAMOS XSS)
- ALMACENARLAS SIEMPRE EN LAS COOKIES


```go
// ❌ PROHIBIDO
jwtSecret := "my-super-secret-key"

// ✅ CORRECTO
jwtSecret := os.Getenv("JWT_SECRET")
```

### ❌ NO exponer información sensible en logs

```typescript
// ❌ PROHIBIDO
console.log('User login:', user.password);

// ✅ CORRECTO
logger.info('User login', { userId: user.id });
```

### ❌ NO hacer SQL injection

```typescript
// ❌ PROHIBIDO
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// ✅ CORRECTO - usar parameterized queries
const query = 'SELECT * FROM users WHERE id = $1';
```

**QUERIES**
- NUNCA hacer queries n+1
- NUNCA USAR * para select (especificar los datos que queres traer)
- Las tablas DEBEN tener INDICES PARA BUSQUEDA


```go
// ❌ PROHIBIDO
db.Exec("SELECT * FROM users WHERE id = " + id)

// ✅ CORRECTO
db.Exec("SELECT * FROM users WHERE id = ?", id)
```

### ❌ NO validar solo en frontend

```typescript
// ❌ PROHIBIDO - Solo validación client-side
const schema = z.object({ email: z.string().email() });

// ✅ CORRECTO - Validar también en backend
// frontend + backend validation
```

---

## Código Frontend

### ❌ NO usar console.log en producción

```typescript
// ❌ PROHIBIDO
console.log('debug:', data);
console.error('error:', err);

// ✅ CORRECTO - Usar logger
import { logger } from '@/lib/logger';
logger.debug('data:', data);
logger.error('error:', err);
```

### ❌ NO usar any

```typescript
// ❌ PROHIBIDO
const data: any = response;
function parse(value: any): any { }

// ✅ CORRECTO - Tipos explícitos
interface ResponseData { id: string; name: string; }
const data: ResponseData = response;
function parse(value: unknown): ResponseData { }
```

### ❌ NO usar index.js/ts para componentes

```typescript
// ❌ PROHIBIDO
export { Button } from './index';  // ambiguous

// ✅ CORRECTO
export { Button } from './Button';
```

### ❌ NO usar style inline

```tsx
// ❌ PROHIBIDO
<div style={{ color: 'red', padding: '10px' }}>

// ✅ CORRECTO - TailwindCSS
<div className="text-red-500 p-4">
```

### ❌ NO anidar demasiado

```tsx
// ❌ PROHIBIDO - 5+ niveles
<div>
  <div>
    <div>
      <div>
        <div>{content}</div>
      </div>
    </div>
  </div>
</div>

// ✅ CORRECTO - Componentes separados
<Card>
  <CardHeader>
    <Title />
  </CardHeader>
  <CardBody>
    {content}
  </CardBody>
</Card>
```

### ❌ NO usar class components

```tsx
// ❌ PROHIBIDO
class UserProfile extends React.Component { }

// ✅ CORRECTO - Functional components
const UserProfile = () => { };
```

### ❌ NO omitir keys en listas

```tsx
// ❌ PROHIBIDO
users.map(user => <li>{user.name}</li>);

// ✅ CORRECTO
users.map((user: UserType) => <li key={user.id}>{user.name}</li>);
```

### ❌ NO hacer fetch en useEffect sin cleanup

```tsx
// ❌ PROHIBIDO
useEffect(() => {
  fetch('/api/data').then(setData);
}, []);

// ✅ CORRECTO
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/data', { signal: controller.signal })
    .then(setData);
  return () => controller.abort();
}, []);
```

---

## Código Backend

### ❌ NO usar variables globales para estado

```go
// ❌ PROHIBIDO
var db *sql.DB

func Connect() {
    db = sql.Open(...)
}

// ✅ CORRECTO - Dependency injection
type Server struct {
    db *sql.DB
}

func NewServer(db *sql.DB) *Server {
    return &Server{db: db}
}
```

### ❌ NO ignorar errores

```go
// ❌ PROHIBIDO
data, _ := json.Unmarshal(body, &user)

// ✅ CORRECTO
data, err := json.Unmarshal(body, &user)
if err != nil {
    return err
}
```

### ❌ NO hardcodear puertos

```go
// ❌ PROHIBIDO
router.Run(":3000")

// ✅ CORRECTO
router.Run(os.Getenv("PORT"))
```

### ❌ NO crear panic intencionales para control flow

```go
// ❌ PROHIBIDO
if user == nil {
    panic("user not found")
}

// ✅ CORRECTO
if user == nil {
    return nil, errors.New("user not found")
}
```

### ❌ NO usar go fmt para archivos

```go
// ❌ PROHIBIDO - goroutines sin WaitGroup
go process()

// ✅ CORRECTO
var wg sync.WaitGroup
wg.Add(1)
go func() {
    defer wg.Done()
    process()
}()
wg.Wait()
```

### ❌ NO concatenar strings para SQL

```go
// ❌ PROHIBIDO
query := "SELECT * FROM users WHERE email = '" + email + "'"

// ✅ CORRECTO - Parameterized
query := "SELECT * FROM users WHERE email = $1"
db.Query(query, email)
```

### ❌ NO usar time.Now() sin timezone

```go
// ❌ PROHIBIDO
createdAt := time.Now()

// ✅ CORRECTO - UTC o zona explícita
createdAt := time.Now().UTC()
```

---

## Git / Commits

### ❌ NO commitear archivos con secrets

```
# .gitignore debe incluir
.env
*.pem
credentials.json
*.log
```

### ❌ NO hacer commit de código roto

- Tests deben pasar antes de commit
- No hacer commit con `// TODO: fix this`

---

## Testing

### ❌ NO escribir tests que siempre pasan

```typescript
// ❌ PROHIBIDO
test('always passes', () => {
    expect(true).toBe(true);
});

// ✅ CORRECTO - Test real
test('button is disabled when loading', () => {
    render(<Button loading>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
});
```

### ❌ NO hardcodear URLs en tests

```typescript
// ❌ PROHIBIDO
fetch('http://localhost:3000/api/users')

// ✅ CORRECTO - Usar variable de entorno
fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
```

### ❌ NO testear implementación, no comportamiento

```typescript
// ❌ PROHIBIDO
test('calls setState', () => {
    const setState = vi.fn();
    render(<Counter />);
    expect(setState).toHaveBeenCalled();
});

// ✅ CORRECTO
test('increments counter', () => {
    render(<Counter />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('1')).toBeInTheDocument();
});
```

---

## General

### ❌ NO dejar código comentado

```typescript
// ❌ PROHIBIDO
// const oldLogic = () => { ... }

// ✅ CORRECTO - Eliminar o usar feature flags
```

### ❌ NO hacer魔法 (magic numbers)

```typescript
// ❌ PROHIBIDO
if (status === 2) { ... }

// ✅ CORRECTO
const ACTIVE_STATUS = 2;
if (status === ACTIVE_STATUS) { }
```

```go
// ❌ PROHIBIDO
if user.Type == 1 { }

// ✅ CORRECTO
const UserTypeAdmin = 1
if user.Type == UserTypeAdmin { }
```

### ❌ NO crear archivos muy grandes

- Máximo 200-300 líneas por archivo
- Separar en módulos si crece demasiado

### ❌ NO usar sincronización donde no hace falta

```typescript
// ❌ PROHIBIDO - sync en funciones server
async function getData() {
    return fetch('/api/data'); // async ya es no-bloqueante
}

// ✅ CORRECTO - simple y directo
async function getData() {
    return fetch('/api/data');
}
```

---


## Resumen Visual

| Categoría | Prohibido |
|-----------|-----------|
| Seguridad | Secrets en código, logs sensibles, SQL injection, Tokens en COOKIES |
| Frontend | console.log, any, style inline, class components |
| Backend | Global state, ignore errors, hardcoded ports |
| Tests | Tests vacíos, hardcoded URLs |
| General | Código comentado, magic numbers |
