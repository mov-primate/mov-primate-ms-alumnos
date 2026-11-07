# Tasks: Servicio de alumnos y perfiles MovPrimate

**Input**: Design documents from `/specs/001-mov-primate-ms-alumnos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup

- [x] T001 Initialize NestJS microservice with user domain structure
- [x] T002 Configure MongoDB connection and repository layer
- [x] T003 [P] Define user, role, member, and membership models
- [x] T004 [P] Set up validation and security abstractions

## Phase 2: Foundational

- [x] T005 [CLARIFICACIÓN Q1] Implement default user role assignment (usuario, no alumno) for new users; only superadmin converts to alumno after payment validation
- [x] T006 Implement role map and permission matrix for usuario, alumno, admin, superadmin
- [x] T007 Implement access scoping for sensitive user data
- [x] T008 Implement duplicate identity checks

## Phase 3: User Story 1 - Profile creation and access (Priority: P1)

- [x] T009 [P] [US1] Implement user profile creation and update endpoints with membership state tracking
- [x] T010 [US1] [CLARIFICACIÓN Q3] Implement 5-state membership state machine (usuario, alumno_activo, alumno_sin_clases, alumno_bloqueado, alumno_inactivo)
- [x] T011 [US1] Restrict profile data based on role and ownership

## Phase 4: User Story 2 - Admin visibility (Priority: P1)

- [x] T012 [P] [US2] [CLARIFICACIÓN Q4] Implement limited profile query endpoint for admin (no profesor separate)
- [x] T013 [US2] Enforce least-privilege access for admin visibility
- [x] T014 [US2] Validate denial for unauthorized data access

## Phase 5: User Story 3 - Superadmin role management (Priority: P1)

- [x] T015 [P] [US3] Implement role listing and management endpoint for superadmin
- [x] T016 [US3] Implement promotion and demotion logic for users (usuario → alumno, alumno → admin)
- [x] T017 [US3] Enforce superadmin-only access to role changes
- [x] T018 [US3] [CLARIFICACIÓN Q5] Log 6 audit events: role_change, available_classes_change, email_change, membership_state_change, profile_update, deactivation

## Phase 6: Final validation

- [x] T019 [P] Unit tests for role and membership logic
- [x] T020 Integration tests for access scope and role changes
- [x] T021 Security tests for unauthorized access and duplicate identity prevention
- [x] T022 Quickstart and documentation validation

## Tareas globales obligatorias (complementarias)

- [x] T023 [CLARIFICACIÓN Q1] Implementar rol inicial `usuario` (no `alumno`) en alta de cuenta; solo superadmin convierte a `alumno` tras validar pago.
- [x] T024 [CLARIFICACIÓN Q2] Implementar campo `available_classes` en perfil de alumno y operación superadmin para editar cuota; es fuente de verdad.
- [x] T025 Exponer contador de reservas e historial de reservas en perfil.
- [x] T026 Agregar estructura de asistencia por reserva para consumo de admin/superadmin.
- [x] T027 [CLARIFICACIÓN Q3] Implementar transiciones automáticas de membresía: alumno_activo → alumno_sin_clases cuando `available_classes` = 0.
- [x] T028 [CLARIFICACIÓN Q5] Implementar eventos de audit trail: role_change, available_classes_change, email_change, membership_state_change, profile_update, deactivation.
