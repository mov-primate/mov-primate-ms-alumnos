# Contracts: Servicio de alumnos

- POST /users
- GET /users/{id}
- PATCH /users/{id}/role
- PATCH /users/{id}/deactivate
- GET /profiles/{userId}
- GET /profiles/{userId}/reservation-stats

Reglas:
- usuario nuevo: usuario.
- cambio de rol: exclusivo superadmin.
- desactivación: exclusiva superadmin.
