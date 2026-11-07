# Implementation Plan: Servicio de alumnos y perfiles MovPrimate

**Branch**: `001-mov-primate-ms-alumnos` | **Date**: 2026-11-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-mov-primate-ms-alumnos/spec.md`

## Summary

El servicio de alumnos y perfiles gestiona usuarios, roles, datos de identidad, membresía (5 estados), cuota de clases y permisos con ciclo de vida explícito. Usuario nuevo entra como `usuario` (no validado). Solo superadmin valida pago, convierte a `alumno`, define `available_classes` y puede promover a `admin`. Soporta transiciones de membresía (alumno_activo → alumno_sin_clases cuando cuota = 0, alumno_bloqueado por superadmin, etc.). El servicio no debe exponer información sensible fuera del alcance autorizado y debe registrar 6 tipos de eventos de audit trail.

## Technical Context

**Language/Version**: TypeScript, NestJS 12

**Primary Dependencies**: NestJS 12, MongoDB, authorization and profile validation modules

**Storage**: MongoDB for users, roles, memberships, and audit records

**Testing**: Unit tests for profile and role logic; integration tests for permission scopes

**Target Platform**: Microservice for user domain, local Docker Compose and AWS deployment

**Project Type**: Microservice

**Performance Goals**: Fast profile reads and constrained access checks for sensitive data

**Constraints**:
- Nuevo usuario entra como `usuario` (no validado, sin pago), no como alumno directo
- Solo superadmin puede validar pago, convertir a `alumno`, definir `available_classes`, y promover a `admin`
- 5 estados de membresía: usuario, alumno_activo, alumno_sin_clases, alumno_bloqueado, alumno_inactivo
- `available_classes` es fuente de verdad en alumnos; editable solo por superadmin
- Transición automática alumno_activo → alumno_sin_clases cuando `available_classes` = 0
- Sensitive data must be protected by role and scope
- Identity duplication must be prevented
- 6 eventos auditables: role_change, available_classes_change, email_change, membership_state_change, profile_update, deactivation

**Scale/Scope**:
- Users and profile records
- Role memberships
- Membership states and access rules
- Audit of changes

## Constitution Check

*GATE: Must pass before implementation.*

- Role model is explicit: usuario, alumno, admin, superadmin: PASS
- Ciclo de vida de rol: usuario → alumno (superadmin valida pago) → admin: PASS
- Available_classes es fuente de verdad en alumnos (solo superadmin edita): PASS
- 5 estados de membresía con transiciones explícitas: PASS
- Sensitive access is scoped by permissions: PASS
- Duplicate identities are prevented: PASS
- 6 eventos de audit trail registrados: PASS
- No constitutional violations identified

## Project Structure

### Documentation (this feature)

```text
specs/001-mov-primate-ms-alumnos/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── members/
├── profiles/
├── roles/
├── permissions/
├── audit/
└── shared/

tests/
├── unit/
├── integration/
└── contract/
```

**Structure Decision**: The service will split by profile, membership, role, and permission contexts to keep access boundaries explicit and auditable.

## Complexity Tracking

No constitutional violations were identified, so no complexity exceptions are required.

## Addendum de alcance obligatorio

- Introducir rol inicial `usuario` y transición controlada a `alumno`/`admin`.
- Incorporar capacidad de desactivación de usuarios por superadmin.
- Incorporar contador de reservas e historial de reservas en perfil.
- Persistir y exponer estado de asistencia asociado al alumno.
