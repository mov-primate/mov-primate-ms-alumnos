# Quickstart: mov-primate-ms-alumnos

## Descripción General

**Servicio de Alumnos y Perfiles** es el microservicio responsable de gestionar:
- **Ciclo de vida de usuarios**: usuario → alumno → admin (solo superadmin)
- **Estados de membresía**: 5 estados (usuario, alumno_activo, alumno_sin_clases, alumno_bloqueado, alumno_inactivo)
- **Cuota de clases**: `available_classes` (fuente de verdad, editable solo por superadmin)
- **Audit trail**: 6 tipos de eventos (role_change, available_classes_change, email_change, membership_state_change, profile_update, deactivation)

## Arquitectura

### Bounded Contexts (DDD)

```
src/
├── members/           # User domain (registro, roles, identidad)
│   ├── domain/        # User schema y entidades
│   ├── application/   # UserService, UserController
│   └── infrastructure/# UserRepository
├── profiles/          # Profile domain (estados, cuota, reservas)
│   ├── domain/        # Profile schema
│   ├── application/   # ProfileService, ProfileController
│   └── infrastructure/# ProfileRepository
├── audit/             # Audit domain (trazabilidad)
│   ├── domain/        # AuditLog schema
│   ├── application/   # AuditService, AuditController
│   └── infrastructure/# AuditLogRepository
├── shared/            # Enums, exceptions, tipos comunes
│   ├── enums/         # RoleEnum, MembershipStateEnum, AuditEventEnum
│   └── exceptions/    # AccessDeniedException, DuplicateIdentityException
```

### Tecnología

- **Framework**: NestJS (Node.js/TypeScript)
- **Base de datos**: MongoDB + Mongoose
- **Testing**: Jest
- **Runtime**: Node.js 18+

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales MongoDB

# 3. Iniciar en desarrollo
npm run start:dev

# 4. Ejecutar tests
npm run test

# 5. Construir para producción
npm run build
```

## Endpoints Clave

### Usuarios (T005, T006, T015-T017)

```http
# Registrar nuevo usuario (rol inicial: "usuario")
POST /users/register
Content-Type: application/json

{
  "email": "nuevo@example.com",
  "password": "hashedPassword"
}
# Respuesta: { id, email, role: "usuario", isActive: true }

# Cambiar rol de usuario (solo superadmin)
PUT /users/:id/role
Authorization: Bearer {superadmin-token}
Content-Type: application/json

{
  "newRole": "alumno"  // "usuario" | "alumno" | "admin" | "superadmin"
}
# Respuesta: { id, email, role: "alumno" }

# Desactivar usuario (solo superadmin)
PUT /users/:id/deactivate
Authorization: Bearer {superadmin-token}
# Respuesta: { id, isActive: false }
```

### Perfiles (T009-T014)

```http
# Crear perfil (asociado a usuario)
POST /profiles
Content-Type: application/json

{
  "userId": "user123",
  "membershipState": "usuario"
}
# Respuesta: { id, userId, membershipState, availableClasses, reservations: [] }

# Obtener perfil propio
GET /profiles/user/:userId
Authorization: Bearer {user-token}
# Respuesta: Perfil del usuario actual

# Actualizar estado de membresía (T010 state machine)
PUT /profiles/:id/membership-state
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "newState": "alumno_activo"  // transición permitida por state machine
}
# Respuesta: { id, membershipState: "alumno_activo" }

# Actualizar cuota de clases (solo superadmin, T024)
PUT /profiles/:id/available-classes
Authorization: Bearer {superadmin-token}
Content-Type: application/json

{
  "availableClasses": 10
}
# Respuesta: { id, availableClasses: 10 }
# NOTA: Si availableClasses pasa a 0 y estado es "alumno_activo",
#       automáticamente transiciona a "alumno_sin_clases" (T027)
```

### Audit Trail (T018, T028)

```http
# Obtener audit log de usuario (solo superadmin)
GET /audit/logs/:userId
Authorization: Bearer {superadmin-token}
# Respuesta: [
#   {
#     id, userId, changedBy, eventType: "role_change",
#     oldValue: { role: "usuario" },
#     newValue: { role: "alumno" },
#     timestamp
#   },
#   ...
# ]

# Obtener todos los audit logs (solo superadmin)
GET /audit/logs
Authorization: Bearer {superadmin-token}
# Respuesta: Array de todos los eventos audit
```

## Flujos Clave

### Flujo 1: Nuevo Usuario → Alumno (T005, T023)

1. Usuario se registra con `/users/register`
   - Rol inicial: **"usuario"** (no "alumno")
   - `isActive: true`
   - Se crea Profile con `membershipState: "usuario"`

2. Superadmin valida pago y ejecuta:
   ```
   PUT /users/:id/role
   { "newRole": "alumno" }
   ```
   - Actualiza User.role a "alumno"
   - Evento audit: `role_change`

3. Superadmin asigna cuota:
   ```
   PUT /profiles/:id/available-classes
   { "availableClasses": 5 }
   ```
   - Evento audit: `available_classes_change`
   - Si T027: automáticamente transiciona a "alumno_activo"

### Flujo 2: Alumno Agota Cuota (T027)

1. Alumno tiene `availableClasses: 5`, estado `alumno_activo`
2. Superadmin reduce cuota a 0:
   ```
   PUT /profiles/:id/available-classes
   { "availableClasses": 0 }
   ```
3. **Automáticamente** transiciona:
   - Old: `membershipState: "alumno_activo"`
   - New: `membershipState: "alumno_sin_clases"` (T027)
   - Evento audit: `membership_state_change` (automático)

### Flujo 3: Superadmin Bloquea Alumno (T015, T016)

1. Superadmin ejecuta:
   ```
   PUT /profiles/:id/membership-state
   { "newState": "alumno_bloqueado" }
   ```
   - Evento audit: `membership_state_change`
   - Alumno no puede reservar clases

2. Para desbloquear:
   ```
   PUT /profiles/:id/membership-state
   { "newState": "alumno_activo" }  // u otro estado válido
   ```

## Matriz de Permisos

| Rol | Endpoints accesibles |
|-----|----------------------|
| **usuario** | GET /profiles/user/{self}, PUT /profiles/{self}/membership-state (limitado) |
| **alumno** | GET /profiles/user/{self}, GET /profiles/{self}/reservations |
| **admin** | GET /profiles/admin/{userId}, PUT /profiles/{id}/membership-state |
| **superadmin** | Todos los endpoints, PUT /users/{id}/role, PUT /users/{id}/deactivate, PUT /profiles/{id}/available-classes, GET /audit/logs |

## Testing

```bash
# Tests unitarios (fase 6 - T019)
npm run test:unit

# Tests de integración (fase 6 - T020)
npm run test:integration

# Tests de seguridad (fase 6 - T021)
npm run test:security

# Coverage completo
npm run test:cov
```

## 6 Eventos Audit Trail (T028)

| Evento | Disparador | Ejemplo |
|--------|-----------|---------|
| `role_change` | PUT /users/:id/role | usuario → alumno |
| `available_classes_change` | PUT /profiles/:id/available-classes | 5 → 3 |
| `email_change` | PUT /users/:id/email (futuro) | old@example.com → new@example.com |
| `membership_state_change` | PUT /profiles/:id/membership-state O automático (T027) | alumno_activo → alumno_sin_clases |
| `profile_update` | PUT /profiles/:id (futuro) | Actualización genérica de datos |
| `deactivation` | PUT /users/:id/deactivate | isActive: true → false |

## Validación Cross-Service

Este microservicio es consultado por:

- **BFF (FR-011)**: Pre-chequea `available_classes > 0` antes de permitir reserva
- **API (FR-013)**: Valida `available_classes` en operación de reserva
- **Agenda (FR-021)**: Valida `available_classes` antes de crear slot

**Garantía**: `available_classes` es fuente de verdad única en alumnos; no se sincroniza desde otros servicios.

## 5 Estados de Membresía (T010)

```
usuario (inicial)
    ↓ (superadmin promueve + asigna clases > 0)
alumno_activo (puede reservar)
    ↓ (T027: automático cuando available_classes = 0)
alumno_sin_clases (no puede reservar)
    
alumno_bloqueado (superadmin bloquea manualmente)
    
alumno_inactivo (período de negocio, superadmin)
```

## Próximos Pasos

1. **Verificar conexión MongoDB** en `.env`
2. **Ejecutar `npm install`** para instalar dependencias
3. **Ejecutar `npm run start:dev`** para iniciar en modo desarrollo
4. **Ejecutar `npm run test`** para validar tests (T019-T021)
5. **Integrar con BFF/API/Agenda** usando endpoints de este microservicio

## Soporte

Para preguntas sobre:
- **Roles y permisos**: Revisar `src/shared/enums/role.enum.ts`
- **Estados de membresía**: Revisar `src/profiles/domain/profile.schema.ts`
- **Audit trail**: Revisar `src/audit/domain/audit-log.schema.ts`
- **Lógica de negocio**: Revisar comentarios en servicios (T005-T028)

---

**Especificación**: `/specs/001-mov-primate-ms-alumnos/spec.md`
**Plan Técnico**: `/specs/001-mov-primate-ms-alumnos/plan.md`
**Contrato API**: `/specs/001-mov-primate-ms-alumnos/contracts/`
