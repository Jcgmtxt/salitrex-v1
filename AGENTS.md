# AGENTS.md

This file provides guidelines and conventions for AI agents working in this codebase.

## Stack Tecnológico

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **ORM:** SQLModel / SQLAlchemy
- **DB:** PostgreSQL (SQLite para desarrollo local)
- **Migraciones:** Alembic
- **Auth:** JWT (python-jose) + bcrypt (passlib)
- **Validación:** Pydantic v2
- **Storage:** AWS S3 (boto3)

### Frontend
- **Runtime:** Bun
- **Framework:** React 19
- **Lenguaje:** TypeScript (strict mode)
- **Routing:** TanStack Router
- **Estilos:** Tailwind CSS v4 + Shadcn/UI
- **Forms:** React Hook Form + Zod
- **Iconos:** Lucide React

---

## Comandos de Desarrollo

### Backend (Python)

```bash
# Navegar al backend
cd backend

# Crear/entrar al virtual environment
python -m venv venv && source venv/bin/activate  # Linux/Mac
python -m venv venv && venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
alembic upgrade head

# Iniciar servidor de desarrollo
uvicorn app.main:app --reload

# Crear nueva migración
alembic revision --autogenerate -m "descripción"
```

### Frontend (Bun)

```bash
# Navegar al frontend
cd frontend

# Instalar dependencias
bun install

# Desarrollo con HMR
bun run dev

# Build de producción
bun run build

# Servidor de producción
bun run start

# Ver opciones de build
bun run build.ts --help
```

### Base de datos

```bash
# Reset completo de migraciones (cuidado: elimina datos)
cd backend
alembic downgrade base && alembic upgrade head
```

**Nota:** El proyecto actualmente no tiene testing ni linting configurado.

---

## Convenciones Backend (Python)

### Imports

Orden obligatorio, separado por línea en blanco:
1. Standard library
2. Third-party packages
3. Local imports

```python
# 1. stdlib
from datetime import datetime
from typing import Optional
import enum

# 2. third-party
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Field, Session, SQLModel, select

# 3. local
from app.core.security import get_current_user
from app.core.config import settings
```

### Nomenclatura

- Variables y funciones: `snake_case`
- Clases: `PascalCase`
- Constantes: `UPPER_SNAKE_CASE`
- Archivos de módulos: `snake_case.py`

### Modelos SQLModel

```python
from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    __tablename__ = "users"  # explícito si difiere de class name

    id: Optional[UUID] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)
```

### Enums

Usar herencia `str` para compatibilidad con JSON:

```python
class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    VIEWER = "viewer"
```

### Excepciones HTTP

```python
from fastapi import HTTPException, status

raise HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Recurso no encontrado"
)
```

### Docstrings

```python
async def get_user(user_id: UUID, db: Session = Depends(get_db)) -> User:
    """Obtiene un usuario por su ID.
    
    Args:
        user_id: UUID del usuario
        db: Sesión de base de datos
        
    Returns:
        Usuario encontrado
        
    Raises:
        HTTPException: Si el usuario no existe
    """
```

---

## Convenciones Frontend (TypeScript/React)

### Path Aliases

Usar alias configurados en `tsconfig.json`:
```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authSchemas } from "@/schemas/auth";
```

### Nomenclatura

- Componentes: `PascalCase.tsx`
- Funciones/hooks: `camelCase`
- Archivos de utilidad: `kebab-case.ts`
- Schemas Zod: `nombreSchemas.ts`

### Props Interfaces

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "default", className, ...props }: ButtonProps) {
  // ...
}
```

### Componentes UI (Shadcn)

- Ubicación: `src/components/ui/`
- Usar `class-variance-authority` para variantes
- Props con tipos explícitos

### Schemas Zod

```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

---

## Convenciones API

### Autenticación
- Header: `Authorization: Bearer <token_jwt>`
- Todos los endpoints protegidos usan `Depends(get_current_user)`

### Formato de Datos
- Fechas: ISO 8601 UTC (`2024-01-15T10:30:00Z`)
- IDs: UUID v4
- Campos JSON: `snake_case`
- Paginación: offset-limit (`?offset=0&limit=20`)

### Responses de Error

```json
{
  "detail": "Mensaje descriptivo del error"
}
```

---

## Contribución

### Git Workflow

1. Crear branch desde `main`:
   ```bash
   git checkout -b feature/nombre-descriptivo
   # o
   git checkout -b fix/descripcion-del-bug
   ```

2. Commits atómicos y descriptivos:
   ```bash
   git commit -m "feat(auth): add password reset flow"
   git commit -m "fix(crm): handle null vehicle in get_client"
   git commit -m "docs: update API response examples"
   ```

3. Prefijos de commit:
   - `feat:` nueva funcionalidad
   - `fix:` corrección de bug
   - `refactor:`重构 sin cambio de comportamiento
   - `docs:` documentación
   - `test:` pruebas
   - `chore:` tareas de mantenimiento

### Reglas Importantes

- **NUNCA** commitear secrets, API keys, o `.env`
- Todos los archivos sensibles van en `.gitignore`
- Variables de entorno en `.env.example` (template sin valores reales)
- Ejecutar `alembic upgrade head` después de cambios de modelo

### Code Review

- Tests para nuevas features
- Documentar cambios en docstrings
- Seguir convenciones de nomenclatura existentes

---

## Reglas Generales

- Modularidad: cada módulo en su propia carpeta (`app/modules/<nombre>/`)
- No duplicar lógica: compartir en `app/core/` o `src/lib/`
- Types explícitos en TypeScript, type hints en Python
- Mantener archivos pequeños y enfocados
- Documentar decisiones no obvias con comentarios

---

## Habilidades y Reglas Globales Activas

Para optimizar el desarrollo, la arquitectura y las pruebas en este proyecto, se aplicarán activamente por defecto las siguientes habilidades globales instaladas en el sistema:
1. **senior-architect / senior-devops**: Diseñar y estructurar componentes reutilizables, flujos de trabajo escalables y garantizar buenas prácticas de clean code y modularidad.
2. **senior-frontend / senior-backend**:
   - **Frontend**: Cumplir estrictamente con tipado estricto en TypeScript, estructuración con React 19 y Shadcn/UI, y evitar "AI-slop" mediante el uso de la habilidad **hallmark**.
   - **Backend**: Implementar buenas prácticas en FastAPI, tipado robusto con Pydantic v2 y SQLModel, y estructurar respuestas consistentes.
3. **tdd-guide / pw (Playwright Pro)**: Utilizar un enfoque guiado por pruebas (Test-Driven Development) escribiendo primero las validaciones y pruebas E2E correspondientes.
4. **tech-debt-tracker**: Escanear y registrar proactivamente la deuda técnica antes de realizar refactorizaciones o reestructurar código existente.