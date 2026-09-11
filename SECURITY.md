# 🛡️ Política de Seguridad y Cumplimiento — Ley 285 de Panamá

## 📜 Normativa Legal de Protección a la Niñez (Ley 285)

El sistema de información del **Estudio Longitudinal de Impacto Proyecto MelaDos** ha sido diseñado bajo estándares estrictos de protección de datos personales de menores de edad conforme a la **Ley 285 de Protección Integral a la Niñez y Adolescencia de la República de Panamá**.

### Principios Directores de Seguridad:
1. **Interés Superior del Menor**: El almacenamiento y procesamiento de datos personales de niños y niñas se limita exclusivamente a fines analíticos y de protección educativa.
2. **Minimización de Datos**: El sistema no almacena ni solicita más información identificable de la estrictamente necesaria para la vinculación administrativa.
3. **Decoupling Físico y Lógico (Online Decoupled Pattern)**: Ninguna base de datos de rendimiento académico o socioemocional almacena nombres, apellidos ni cédulas de los menores.

---

## 🔒 Arquitectura de Privacidad (Online Decoupled Pattern)

```
[ Colección / Tabla: estudiantes ]
├── id_estudiante (UUID v4)
├── codigo_anonimo (Ej: EST-2022-EB04)
├── tipo_grupo ("Programa" | "Control")
└── cet_origen, anio_nacimiento, genero
            │
            │ (Desacoplado - Privado)
            ▼
[ Colección / Tabla: estudiantes_identidad ]  ◄── Acceso EXCLUSIVO a Rol ADMIN
├── estudiante_id (UUID v4)
├── nombre_completo (PII)
└── cedula (PII)
```

---

## 🔑 Matriz de Acceso por Roles (RBAC)

| Recurso / Operación | Evaluador de Campo | Donante / Viewer | Administrador (Melanie) |
| :--- | :---: | :---: | :---: |
| **Registrar Evaluación EGRA/EGMA** | ✅ Permitido | ❌ Denegado | ✅ Permitido |
| **Ver Gráficos Agregados de Impacto** | ✅ Permitido | ✅ Permitido | ✅ Permitido |
| **Consultar Código Anónimo de Niño** | ✅ Permitido | ✅ Permitido | ✅ Permitido |
| **Desvelar Identidad Real (Nombre/Cédula)** | ❌ **DENEGADO (403)** | ❌ **DENEGADO (403)** | ✅ **PERMITIDO (API Protegida)** |
| **Exportar Expedientes Anonimizados** | ❌ Denegado | ✅ Permitido | ✅ Permitido |

---

## 🚨 Reporte de Vulnerabilidades

Si identifica alguna vulnerabilidad de seguridad o riesgo de fuga de datos en esta plataforma, por favor absténgase de divulgarla públicamente y notifique de inmediato a:

- **Equipo Tecnológico**: One Clik To Go (`tech@onecliktogo.com`)
- **Administración del Proyecto**: Melanie Alvarado (`malvarado@proninez.org.pa`)

Trataremos todos los reportes de seguridad con la más alta prioridad y confidencialidad.
