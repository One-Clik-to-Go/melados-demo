# Manual de Gestión de Escuelas y Control Anti-Duplicados

Este manual describe el funcionamiento del módulo de gestión de escuelas e instituciones educativas en la plataforma **Pro Niñez Panamá**.

---

## 1. Registro de Nuevas Escuelas

Desde la pestaña **Centro de Gestión e Identidades (Admin)**:
1. Diríjase a la sub-pestaña **Escuelas e Instituciones**.
2. Complete el formulario indicando:
   - **Nombre completo de la escuela** (ej. *Escuela San Pedro Nolasco*).
   - **Sede / Región** (ej. *Veraguas - Cañazas*).
3. Presione **Guardar Escuela**.

---

## 2. Algoritmo Anti-Duplicados (Deduplicación por Normalización)

Para garantizar la integridad de las pruebas aplicadas y evitar la multiplicación no deseada de nombres de escuelas:
- El servidor procesa el nombre eliminando espacios al inicio y final y convirtiéndolo a minúsculas.
- Si el nombre ya existe en la base de datos de Firestore, el endpoint `POST /api/schools` rechaza el registro con un error **HTTP 409 Conflict** (*La escuela ya se encuentra registrada*).
- Las escuelas existentes quedan vinculadas automáticamente mediante su identificador único `id_escuela`.
