# Data Model: Servicio de alumnos

- User: id, email, role, status
- Profile: userId, fullName, contact, membershipState
- RoleChange: id, userId, fromRole, toRole, changedBy, changedAt
- ReservationStats: userId, totalReservations, reservationsHistory[]
- AttendanceStats: userId, attendedCount, missedCount, justifiedCount

Reglas:
- role inicial = usuario.
- role change solo por superadmin.
- deactivation solo por superadmin.
