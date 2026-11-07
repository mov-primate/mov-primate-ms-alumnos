# Research: Servicio de alumnos

## Decisiones clave

1. Usuario nuevo queda como alumno por defecto.
2. Solo superadmin puede cambiar roles.
3. Perfil y datos sensibles se filtran por alcance.
4. Todo cambio de rol/membresía es auditable.

## Resultado

Dominio de identidad consistente con reservas y permisos.

## Reglas globales incorporadas

- Rol inicial obligatorio: usuario.
- Superadmin controla cambios de rol y desactivación.
- Perfil debe exponer contador + historial de reservas.
- Perfil debe poder reflejar métricas de asistencia para paneles.
