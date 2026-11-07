# Feature Specification: Servicio de alumnos y perfiles MovPrimate

**Feature Branch**: `001-mov-primate-ms-alumnos`

**Created**: 2026-11-04

**Status**: Draft

**Input**: User description: "Define el servicio de alumnos y perfiles para MovPrimate con membresía, estado, identidad y datos autorizados para alumno, administrador y superadmin."

## Clarifications

### Session 2026-11-05

- Q1: Rol inicial y transición a alumno → A: Usuario se registra como `usuario`. Solo superadmin puede convertir a `alumno` cuando valida pago y define cuota de clases.
- Q2: Gestión del contador de clases disponibles → A: `mov-primate-ms-alumnos` es fuente de verdad. Campo `available_classes` en perfil, solo superadmin puede editarlo.
- Q3: Estados de membresía → A: Aceptados 5 estados: `usuario`, `alumno_activo`, `alumno_sin_clases`, `alumno_bloqueado`, `alumno_inactivo`.
- Q4: admin vs administrador/profesor → A: Rol único `admin`. El administrador es profesor, sin división de atributo.
- Q5: Eventos de audit trail → A: `role_change`, `available_classes_change`, `email_change`, `membership_state_change`, `profile_update`, `deactivation`.

## User Scenarios & Testing

### User Story 1 - Alumno crea o accede a su perfil (Priority: P1)
El alumno crea su cuenta o ingresa con sus credenciales y accede al perfil del gimnasio.

**Why this priority**: El perfil es la base de los permisos, historial y acceso a reservas.

**Independent Test**: Un alumno autenticado puede consultar y actualizar su perfil sin afectar a otros usuarios.

**Acceptance Scenarios**:
1. **Given** que el alumno inicia sesión, **When** abre su perfil, **Then** ve su información personal, estado de membresía y datos de contacto autorizados.
2. **Given** que el perfil es incompleto o inválido, **When** se intenta guardar, **Then** el servicio rechaza la operación con error claro.

---

### User Story 2 - Admin consulta perfiles y roles de alumnos (Priority: P1)
El admin necesita consultar información del alumno relevante para validar reservas sin acceder a datos sensibles innecesarios.

**Why this priority**: El admin debe poder operar sobre las reservas sin exponer información más allá de lo necesario.

**Independent Test**: Un admin puede ver el perfil mínimo requerido para la validación.

**Acceptance Scenarios**:
1. **Given** que el admin busca un estudiante, **When** consulta su perfil, **Then** ve los datos operativos necesarios para la reserva y la validación.
2. **Given** que intenta ver información no autorizada, **When** ejecuta la petición, **Then** el servicio responde con acceso denegado.

---

### User Story 3 - Superadmin gestiona permisos y visibilidad global (Priority: P1)
El dueño del gimnasio requiere control sobre perfiles, roles y alcance de la operación para supervisar a alumnos y admins.

**Why this priority**: El dueño necesita visibilidad operativa sin romper el aislamiento de datos por perfil.

**Independent Test**: El superadmin puede consultar y administrar usuarios por rol con permisos explícitos.

**Acceptance Scenarios**:
1. **Given** que el superadmin entra al panel global, **When** consulta usuarios, **Then** ve el conjunto de perfiles y roles autorizados.
2. **Given** que un rol cambia, **When** se actualiza, **Then** la autorización se refleja en el servicio de alumnos y en la operación de reservas.

---

### User Story 4 - Estado de membresía y perfil son claros y trazables (Priority: P2)
El alumno y sus administradores deben entender el estado del miembro y su relación con la operación del gimnasio.

**Why this priority**: El ciclo de vida del alumno es esencial para la operación del negocio y para evitar errores de acceso.

**Independent Test**: El servicio expone el estado del alumno y la membresía de forma uniforme para todas las capas.

**Acceptance Scenarios**:
1. **Given** que un alumno tiene un estado activo, **When** consulta su perfil, **Then** tiene información clara sobre su membresía.
2. **Given** que el estado cambia a inactivo o bloqueado, **When** el servicio responde, **Then** la información refleja la restricción.

### Edge Cases

- ¿Qué sucede si un usuario intenta cambiar su rol sin permisos?
- ¿Cómo responde el servicio si un alumno intenta editar un dato que no es de su alcance?
- ¿Qué ocurre con perfiles incompletos en el momento de reservar?
- ¿Cómo se maneja un mismo correo o identidad duplicada?

## Requirements

### Functional Requirements

- **FR-001**: El servicio DEBE gestionar perfiles para usuario, alumno, admin (profesor) y superadmin con ciclo de vida explícito: usuario → alumno → admin (por superadmin).
- **FR-002**: El servicio DEBE mantener la identidad del usuario y sus datos básicos protegidos.
- **FR-003**: El servicio DEBE soportar la membresía y el estado del alumno con información clara y auditable (5 estados: usuario, alumno_activo, alumno_sin_clases, alumno_bloqueado, alumno_inactivo).
- **FR-004**: El servicio DEBE restringir acceso a datos sensibles según permisos y rol.
- **FR-005**: El servicio DEBE permitir consultar perfiles por alcance autorizado.
- **FR-006**: El servicio DEBE registrar cambios relevantes de perfil, rol y membresía con eventos específicos: role_change, available_classes_change, email_change, membership_state_change, profile_update, deactivation.
- **FR-007**: El servicio DEBE mantener contratos consistentes con BFF, API y microservicios del dominio.
- **FR-008**: El servicio DEBE prevenir la duplicación o incoherencia de identidad del alumno.
- **FR-009**: El servicio DEBE gestionar cuota de clases (`available_classes`) como fuente de verdad, editable solo por superadmin.

### Key Entities

- **Usuario**: estado transicional inicial de nuevo usuario (no validado, sin pago).
- **Alumno**: perfil con identidad, estado de membresía, cuota de clases disponibles, y historial de participación.
- **Admin**: usuario con permisos para revisión y validación de reservas (profesor es admin con capacidad pedagógica).
- **Superadmin**: dueño del gimnasio con alcance global, privilegios de administración, validación de pago y gestión de cuota de clases.
- **Perfil**: conjunto de datos del usuario (identidad, email, teléfono) y permisos asociados.
- **Membresía**: estado operativo del alumno: `usuario`, `alumno_activo`, `alumno_sin_clases`, `alumno_bloqueado`, `alumno_inactivo`.
- **Cuota de Clases**: contador `available_classes` gestionado por superadmin en perfil de alumno, fuente de verdad.

## Success Criteria

### Measurable Outcomes

- **SC-001**: El servicio mantiene perfiles válidos y autorizados para 100% de los actores del sistema.
- **SC-002**: El 100% de las consultas sensibles por rol requieren permisos explícitos.
- **SC-003**: Los perfiles y estados de membresía pueden consultarse sin duplicación ni inconsistencias.
- **SC-004**: Los cambios de perfil y permisos quedan trazados para auditoría y soporte.
- **SC-005**: Los admins y superadmin operan con la información mínima necesaria para su rol.

## Assumptions

- El servicio recibe identidad y permisos desde la capa de autenticación o middleware seguro.
- El estado del alumno puede cambiar según actividad, membresía y decisiones del negocio.
- La infraestructura persistente usa MongoDB con un modelo de perfiles y permisos claro.
- Los datos sensibles se comparten solo con usuarios autorizados.
- El rol de superadmin se usa solo para supervisión crítica y control excepcional.

## Reglas globales obligatorias (actualización Alumnos)

- Deben existir 4 roles: `superadmin`, `admin`, `alumno`, `usuario`.
- **Ciclo de vida de rol** (CLARIFICACIÓN Q1): Todo registro nuevo inicia como `usuario`. Solo `superadmin` puede convertir a `alumno` después de validar pago e inicializar cuota de clases.
- Solo `superadmin` puede:
  - cambiar rol de usuario a alumno/admin,
  - desactivar usuarios,
  - editar cuota de clases disponibles (`available_classes`).
- **Estados de membresía** (CLARIFICACIÓN Q3): El perfil de alumno mantiene estado en `membership_state`:
  - `usuario`: usuario no validado, sin pago, sin acceso a reservas.
  - `alumno_activo`: pagado, `available_classes` > 0, puede crear reservas.
  - `alumno_sin_clases`: pagado pero `available_classes` = 0, puede ver perfil/historial, NO puede reservar.
  - `alumno_bloqueado`: superadmin lo bloquea manualmente, invisible a panel admin, acceso limitado.
  - `alumno_inactivo`: inactivo por período de negocio, estado transicional.
- **Cuota de clases** (CLARIFICACIÓN Q2): `mov-primate-ms-alumnos` es fuente de verdad. Campo `available_classes` (número entero >= 0) en perfil, solo superadmin puede editarlo.
- El perfil de usuario debe exponer:
  - contador de reservas hechas,
  - historial de reservas,
  - `available_classes` (cuota actual).
- El dominio debe soportar estado de asistencia por reserva para consumo de panel admin/superadmin:
  `asistió`, `no asistió`, `justificó ausencia`.
- **Eventos auditables** (CLARIFICACIÓN Q5): Todo cambio debe registrarse con evento específico:
  - `role_change`: cambio de rol (usuario → alumno, etc.)
  - `available_classes_change`: superadmin edita cuota
  - `email_change`: alumno cambia email
  - `membership_state_change`: transición entre estados (alumno_activo → alumno_sin_clases, etc.)
  - `profile_update`: cambios en datos personales (teléfono, dirección, etc.)
  - `deactivation`: superadmin desactiva usuario.
