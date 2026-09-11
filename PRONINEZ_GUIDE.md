# Guía Maestra de Arquitectura e Implementación: Proyecto Proyecto MelaDos (V2)

Este documento es el plano técnico oficial para el desarrollo de la plataforma del **Estudio Longitudinal de Impacto del programa de Estimulación Temprana** de la **Asociación Proyecto MelaDos Panameña**, financiado por la **Fundación Banco General** e implementado por **One Clik To Go**.

---

## 📋 1. Resumen Ejecutivo y Contexto de Negocio

El proyecto consiste en dar seguimiento longitudinal durante la educación primaria (de 1° a 6° grado) a dos cohortes de estudiantes:

- **Grupo Programa**: Niños que egresaron de los Centros de Estimulación Temprana (CET) gestionados por la Asociación Proyecto MelaDos Panameña.
- **Grupo Control**: Niños de comunidades y escuelas similares que no pasaron por el programa CET, sirviendo como grupo de comparación científica.

El objetivo de la plataforma es demostrar científicamente, con datos estructurados y modelos analíticos, el impacto a largo plazo de la Estimulación Temprana en la lectoescritura (EGRA), el rendimiento matemático (EGMA), y el bienestar socioemocional (SDQ).

---

## 🛠️ Ecosistema Tecnológico de Soporte

- **Alojamiento Core**: Servidor VPS de Melanie (`mel-vps` en Hetzner) administrado mediante **Coolify**.
- **Framework de Frontend y API**: Next.js 14 (Stand-alone en contenedor Docker).
- **Capa de Datos Local (Tablet)**: IndexedDB en el navegador (PWA compatible con tablets Android para operación 100% offline).
- **Capa de Datos en la Nube**: Firebase (Cloud Firestore) para almacenamiento y agregación estadística.
- **Seguridad**: Control de Acceso Basado en Roles (RBAC) con aislamiento absoluto de datos personales (PII) bajo Ley 285.

---

## 🔒 2. Estrategia de Privacidad y Cumplimiento (Ley 285 de Panamá)

El principal reto técnico y legal es salvaguardar los datos de los menores de edad y prevenir la re-identificación no autorizada de su rendimiento escolar por parte de terceros (evaluadores de campo, donantes o visualizadores externos).

```
   [ FRONTEND / DISPOSITIVO EN CAMPO ]
       │ (Usa únicamente código anónimo)
       ▼
   [ API GATEWAY (Next.js API Routes) ]  ◄── (Verifica JWT + Rol de Usuario)
       │
       ├─► (Rol: EVALUADOR / VIEWER) ──► Retorna únicamente datos de pruebas anónimas
       │
       └─► (Rol: ADMIN / Melanie) ─────► Realiza JOIN con 'estudiantes_identidad' y
                                         resuelve el Nombre Real en pantalla
```

### 🛡️ Reglas de Aislamiento de Identidad (Online Decoupled Pattern):
1. **Aislamiento de PII**: La tabla/colección principal de estudiantes es 100% anónima. No almacena nombres, apellidos ni cédulas. Se identifica visualmente únicamente mediante un Código Anónimo de Cohorte (Ej: `EST-2022-EB04`) y se indexa internamente mediante un `id_estudiante` (UUID).
2. **Desacoplamiento Físico de Identidades**: La información identificable (Cédula Juvenil y Nombre Completo) se almacena en la tabla secundaria `estudiantes_identidad`, vinculada por el UUID del estudiante.
3. **Control estricto de Roles (RBAC)**:
   - **ADMIN (Melanie Alvarado / Directores autorizados)**: Tienen acceso total de lectura y escritura en la API para consultar la identidad de un niño cuando el sistema dispare una alerta de alta deserción o bajo rendimiento.
   - **EVALUADOR (Voluntarios de campo)**: Solo tienen acceso a registrar y guardar nuevas evaluaciones asociadas a un `codigo_anonimo`. La API nunca les retornará nombres reales.
   - **VIEWER (Donantes / Fundación Banco General)**: Solo visualizan dashboards agregados, analíticos y resúmenes estadísticos. Tienen bloqueado el acceso a la resolución de identidades a nivel de API.

---

## 💾 3. Esquema de Base de Datos Relacional (DDL en SQL)

```sql
-- 1. TABLA DE ESCUELAS / PUNTOS DE ESTUDIO
CREATE TABLE escuelas (
    id_escuela VARCHAR(36) PRIMARY KEY,
    nombre_escuela VARCHAR(100) NOT NULL,
    sede_region VARCHAR(50) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA PRINCIPAL DE ESTUDIANTES (Anónimo)
CREATE TABLE estudiantes (
    id_estudiante VARCHAR(36) PRIMARY KEY,
    codigo_anonimo VARCHAR(20) UNIQUE NOT NULL,
    tipo_grupo VARCHAR(20) NOT NULL CHECK (tipo_grupo IN ('Programa', 'Control')),
    cet_origen VARCHAR(50) NOT NULL,
    generacion_egreso_cet INT,
    nivel_egreso_cet VARCHAR(15) CHECK (nivel_egreso_cet IN ('Alto', 'Medio', 'Bajo', 'Al limite', 'Normal')),
    genero VARCHAR(10) CHECK (genero IN ('M', 'F')),
    anio_nacimiento INT NOT NULL,
    asistio_kinder BOOLEAN DEFAULT TRUE,
    escuela_actual_id VARCHAR(36) REFERENCES escuelas(id_escuela),
    grado_actual INT CHECK (grado_actual BETWEEN 1 AND 6),
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2b. DATOS PERSONALES RESTRINGIDOS (SOLO ROL ADMIN)
CREATE TABLE estudiantes_identidad (
    estudiante_id VARCHAR(36) PRIMARY KEY REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
    nombre_completo VARCHAR(150) NOT NULL,
    cedula VARCHAR(30) UNIQUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. EVALUACIÓN DE LECTOESCRITURA (EGRA)
CREATE TABLE evaluaciones_egra (
    id_evaluacion_egra VARCHAR(36) PRIMARY KEY,
    estudiante_id VARCHAR(36) REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
    grado_evaluado INT NOT NULL CHECK (grado_evaluado IN (2, 6)),
    fecha_aplicacion DATE NOT NULL,
    evaluador_nombre VARCHAR(100) NOT NULL,
    recon_letras_score INT DEFAULT 0,
    lectura_oral_score INT DEFAULT 0,
    comprension_score INT DEFAULT 0,
    fluidez_score INT DEFAULT 0,
    score_total DECIMAL(5,2) NOT NULL,
    observaciones TEXT,
    sincronizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. EVALUACIÓN DE MATEMÁTICAS (EGMA)
CREATE TABLE evaluaciones_egma (
    id_evaluacion_egma VARCHAR(36) PRIMARY KEY,
    estudiante_id VARCHAR(36) REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
    grado_evaluado INT NOT NULL CHECK (grado_evaluado IN (2, 6)),
    fecha_aplicacion DATE NOT NULL,
    evaluador_nombre VARCHAR(100) NOT NULL,
    numeracion_score INT DEFAULT 0,
    conteo_score INT DEFAULT 0,
    operaciones_score INT DEFAULT 0,
    logica_score INT DEFAULT 0,
    score_total DECIMAL(5,2) NOT NULL,
    observaciones TEXT,
    sincronizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. EVALUACIÓN SOCIOEMOCIONAL (SDQ)
CREATE TABLE evaluaciones_sdq (
    id_evaluacion_sdq VARCHAR(36) PRIMARY KEY,
    estudiante_id VARCHAR(36) REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
    fecha_aplicacion DATE NOT NULL,
    scoring_conductual INT,
    scoring_hiperactividad INT,
    scoring_emocional INT,
    scoring_prosocial INT,
    scoring_pares INT,
    score_total_dificultades INT,
    sincronizado_api BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. REGISTRO ESCOLAR ANUAL
CREATE TABLE seguimiento_escolar (
    id_seguimiento VARCHAR(36) PRIMARY KEY,
    estudiante_id VARCHAR(36) REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
    anio_escolar INT NOT NULL,
    grado INT NOT NULL CHECK (grado BETWEEN 1 AND 6),
    porcentaje_asistencia DECIMAL(5,2) NOT NULL,
    promedio_lectura_boletin DECIMAL(3,2),
    promedio_matematica_boletin DECIMAL(3,2),
    repitente BOOLEAN DEFAULT FALSE,
    desercion BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(estudiante_id, anio_escolar)
);

-- 7. COLA DE SINCRONIZACIÓN OFFLINE-FIRST
CREATE TABLE sync_queue (
    id_transaccion VARCHAR(36) PRIMARY KEY,
    tabla_destino VARCHAR(50) NOT NULL,
    operacion_tipo VARCHAR(10) NOT NULL CHECK (operacion_tipo IN ('INSERT', 'UPDATE')),
    payload_json TEXT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_sync VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado_sync IN ('PENDIENTE', 'COMPLETADO', 'ERROR')),
    reintentos INT DEFAULT 0,
    ultimo_error TEXT
);
```

---

## 📳 4. Modelo Documental NoSQL & Flujo Offline-First

Estructura de Payload JSON enviada por la Tablet de Campo a la API de Ingesta:

```json
{
  "id_transaccion": "d3b07384-d113-4ec2-a5d6-c68e1c6b8471",
  "meta": {
    "dispositivo_id": "tablet_veraguas_03",
    "evaluador_nombre": "Voluntario UCPN",
    "fecha_captura": "2026-08-14T07:14:00Z"
  },
  "estudiante": {
    "codigo_anonimo": "EST-2022-EB04",
    "tipo_grupo": "Programa",
    "cet_origen": "El Bale",
    "generacion_egreso_cet": 2022,
    "escuela_actual_id": "esc-el-bale-01",
    "grado_actual": 2
  },
  "evaluacion_academicas": {
    "instrumento": "EGRA",
    "grado_evaluado": 2,
    "respuestas": {
      "seccion_letras": {
        "tiempo_empleado_segundos": 60,
        "letras_leidas_correctamente": 45,
        "intentos_totales": 50
      },
      "seccion_lectura_oral": {
        "palabras_leidas_correctamente": 28,
        "tiempo_empleado_segundos": 60
      },
      "seccion_comprension": {
        "preguntas_formuladas": 5,
        "respuestas_correctas": 3
      }
    },
    "scoring_calculado": {
      "recon_letras_score": 45,
      "lectura_oral_score": 28,
      "comprension_score": 60.00,
      "fluidez_score": 28,
      "score_total_calculado": 44.33
    }
  }
}
```

---

## 🛠️ 5. Estructura del Repositorio Next.js

```
src/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   └── match-estudiante/
│   │   │       └── route.ts         # Endpoint restringido (Solo Admin)
│   │   ├── evaluations/
│   │   │   └── ingest/
│   │   │       └── route.ts         # Endpoint de ingesta de cola (EVALUADOR)
│   │   └── dashboard/
│   │       └── stats/
│   │           └── route.ts         # Estadísticas agregadas (VIEWER)
│   ├── layout.tsx
│   └── page.tsx                     # Consola con Tabs por Rol
├── components/
│   ├── admin/                       # Tabla de identidades (Ley 285)
│   ├── evaluator/                   # Formularios de campo EGRA/EGMA
│   ├── viewer/                      # Gráficos interactivos de impacto
│   ├── layout/                      # Header, Switcher de Roles
│   └── offline/                     # Barra de Sync & Estado Offline
├── lib/
│   ├── auth/                        # RBAC & Token helpers
│   ├── firebase/                    # Admin SDK y Firestore client
│   └── offline/                     # Manager de IndexedDB y Sync
└── middleware.ts                    # Protección por Rol en Edge
```
