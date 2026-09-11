# Protección de Datos Infantiles conforme a la Ley 285 de Panamá

Este documento detalla la arquitectura de privacidad implementada en la plataforma **Pro Niñez Panamá** para cumplir con la **Ley 285 de 15 de febrero de 2022** (Protección Integral de la Niñez y Adolescencia).

---

## 1. Patrón de Desacoplamiento de Identidad (*Online Decoupled Pattern*)

Para proteger el derecho a la privacidad de los menores evaluados en el estudio longitudinal de estimulación temprana:

1. **Colección Pública de Evaluaciones (`evaluaciones_egra` / `evaluaciones_egma`)**:
   - Almacena únicamente puntajes cuantitativos de lectura y matemáticas.
   - Vinculada exclusivamente a un código anónimo de cohorte (ej. `EST-P2026-1001`).
   - Libre de nombres de niños, apellidos, cédulas o direcciones familiares.

2. **Colección Aislada de Identidad (`estudiantes_identidad`)**:
   - Almacena la resolución de identidades protegidas.
   - Protegida por reglas estrictas de Firestore (`firestore.rules`) accesibles únicamente por administradores autorizados de la Asociación Pro Niñez Panameña.
