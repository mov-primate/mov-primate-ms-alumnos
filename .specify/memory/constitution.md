# Constitución del microservicio de alumnos MovPrimate

## Principios fundamentales

### I. Responsabilidad sobre los datos del alumno
El servicio de alumnos debe custodiar la identidad, el perfil, el estado de membresía y la información operativa del estudiante. Debe poder distinguir entre alumno, administrador/profesor y superadmin.

### II. Privacidad y consentimiento
La información de los alumnos debe protegerse y compartirse solo con servicios o administradores autorizados. Los datos sensibles nunca deben exponerse públicamente.

### III. Claridad en el ciclo de vida del miembro
El estado del alumno, su membresía y su evolución dentro del gimnasio deben ser explícitos, coherentes y trazables. Debe existir un control claro de acceso por rol y de historial de cambios.

### IV. Fiabilidad de los registros
Los datos del estudiante deben validarse antes de actualizarse, con un modelo consistente y evidencia de auditoría cuando sea necesario.

### V. Disciplina de integración
Los demás servicios deben consumir los datos del alumno a través de contratos definidos y no duplicar el modelo canónico del alumno. Los cambios en perfil o permisos deben revisarse con el resto de dominios.

## Restricciones del producto

- Los clientes son alumnos del gimnasio
- Los administradores requieren una vista ordenada de los miembros
- Los datos se almacenan en MongoDB
- El servicio debe soportar referencias de reservas y metadatos de membresía
- Debe mantener separación por rol y control de acceso explícito

## Flujo de trabajo de desarrollo

- Cada nuevo campo de alumno debe revisarse por impacto en reservas y autorizaciones.
- Los requisitos deben aclararse antes de implementar cambios.
- Los contratos con otros servicios deben versionarse y probarse.
- El servicio debe mantener alineación con el flujo de trabajo de Spec Kit del proyecto.
- Los cambios en autorización, estado y perfil deben validarse por seguridad y dominio.

## Gobernanza

El servicio de alumnos debe preservar la integridad de la información de membresía y del perfil de los estudiantes en todo momento. Cualquier cambio que afecte permisos, identidad, membresía o datos sensibles debe revisarse antes de fusionarse.

**Versión**: 1.0.1 | **Ratificada**: 2026-11-04 | **Última modificación**: 2026-11-04