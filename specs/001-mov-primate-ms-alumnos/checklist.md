# Requirements Quality Checklist: Servicio de alumnos y perfiles MovPrimate

**Purpose**: Revisar la calidad del dominio de usuarios, roles y acceso a datos.
**Created**: 2026-11-04
**Feature**: [spec.md](./spec.md)

## Perfiles y roles

- [ ] CHK001 El servicio gestiona alumno, administrador y superadmin como roles explícitos.
- [ ] CHK002 El usuario nuevo queda como alumno por defecto y solo el superadmin puede promulgarlo a administrador.
- [ ] CHK003 El servicio protege información sensible según rol y alcance.
- [ ] CHK004 Se mantiene consistencia en permisos para reservas, administración y supervisión.

## Estado y membresía

- [ ] CHK005 El estado de membresía del alumno queda visible, claro y auditable.
- [ ] CHK006 Los cambios de perfil, membresía y permisos quedan registrados.
- [ ] CHK007 La promoción o degradación de roles no rompe la integridad del sistema.

## Operabilidad

- [ ] CHK008 Se evitan duplicidades de identidad y perfiles inconsistentes.
- [ ] CHK009 El servicio cumple con los contratos de BFF, API y otros microservicios.
- [ ] CHK010 La solución es compatible con Docker Compose y despliegue en AWS.

## Reglas globales a verificar

- [ ] CHK011 Existen 4 roles: superadmin, admin, alumno, usuario.
- [ ] CHK012 El alta inicial de cuenta se registra como usuario.
- [ ] CHK013 Solo superadmin reasigna roles y desactiva usuarios.
- [ ] CHK014 Perfil incluye contador de reservas e historial de reservas.
- [ ] CHK015 El modelo contempla estado de asistencia: asistió/no asistió/justificó ausencia.
