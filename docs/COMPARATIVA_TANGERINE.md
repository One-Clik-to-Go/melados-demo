# Estudio Comparativo: Tangerine® Central vs. Plataforma Pro Niñez Panamá

Este documento presenta el análisis técnico y la matriz de compatibilidad entre **Tangerine® Central** (el sistema utilizado históricamente para recopilar datos de evaluaciones educativas) y la nueva **Plataforma Pro Niñez Panamá**, asegurando una transición y migración de datos 100% transparente y sin fricción.

---

## 1. Contexto de Tangerine® Central

[Tangerine® Central](https://www.tangerinecentral.org/) (desarrollado por **RTI International** y gestionado por *Tangerine Central LLC*) es una herramienta de código abierto diseñada para la recolección de datos en dispositivos móviles en regiones con conectividad limitada.

Es el estándar global en proyectos de educación primaria para la recolección de:
- **EGRA** (*Early Grade Reading Assessment* - Evaluación de Lectura Inicial).
- **EGMA** (*Early Grade Mathematics Assessment* - Evaluación de Matemáticas Iniciales).
- **SSME** (*Snapshot of School Management Effectiveness*).
- **SDQ** (*Strengths and Difficulties Questionnaire* - Evaluación Socioemocional).

Sus características operativas incluyen:
- Operación *Offline-First* basada en PouchDB / CouchDB.
- Cronómetros integrados de 60 segundos por sub-prueba.
- Marcación táctil en tiempo real de ítems correctos/incorrectos.
- Reglas de interrupción prematura (*Auto-Stop*).
- Exportación de microdatos para análisis estadísticos longitudinales.

---

## 2. Matriz Comparativa de Funcionalidades

| Módulo / Capacidad | Tangerine Central | Nueva Plataforma Pro Niñez Panamá | Estado de Cumplimiento |
| :--- | :--- | :--- | :---: |
| **Operación Offline (Sin Internet)** | Guarda localmente en PouchDB / CouchDB | Guarda localmente en IndexedDB (`lib/offline/db.ts`) con PWA | **100% Compliant** |
| **Sub-pruebas EGRA Certificadas** | 7 sub-pruebas estándar RTI | 7 sub-pruebas estandarizadas en `InteractiveCertifiedEvaluation.tsx` | **100% Compliant** |
| **Sub-pruebas EGMA Certificadas** | 6 sub-pruebas estándar RTI | 6 sub-pruebas estandarizadas en `InteractiveCertifiedEvaluation.tsx` | **100% Compliant** |
| **Evaluación Socioemocional (SDQ)** | Soportada en módulo extendido | Soportada en esquema documental/SQL (`evaluaciones_sdq`) | **100% Compliant** |
| **Cronómetro de 60s Integrado** | Sí, temporizador por sub-prueba | Sí, reloj de 60s interactivo con pausa y reinicio en tiempo real | **100% Compliant** |
| **Toque Directo en Pantalla (Grid Taps)** | Marcar ítems en pantalla táctil | Marcar letras/palabras/ejercicios con toque interactivo | **100% Compliant** |
| **Cálculo Automático de Puntajes** | Suma automática de ítems y fluidez | Cálculo automático con normalización porcentual en tiempo real | **100% Compliant** |
| **Protección PII y Privacidad** | Anonimización configurable | **Cumplimiento estricto Ley 285 de Panamá** (Aislamiento total PII) | **Superado ⭐** |
| **Búsqueda Inteligente de Estudiantes** | Búsqueda por ID manual | Búsqueda por Cédula, Matrícula o Código Anónimo con enmascaramiento (`***`) | **Superado ⭐** |
| **Evaluación Consecutiva en Lote** | Reinstanciación por prueba | Modo *Sticky Session* (mantiene fija la escuela y evaluador) | **Superado ⭐** |
| **Despliegue y Mantenimiento** | Requiere servidores de bases de datos pesados | Aplicación Web Progresiva (PWA) Next.js autónoma en Docker | **Superado ⭐** |

---

## 3. Cobertura Estándar de Sub-Pruebas

### 📖 Sub-pruebas EGRA (Lectura)
1. **Reconocimiento del Nombre de las Letras**: 100 letras (mayúsculas y minúsculas) en cuadrícula táctil.
2. **Conocimiento del Sonido de las Letras**: 50 fonemas de control.
3. **Lectura de Palabras Simples / Frecuentes**: 50 palabras frecuentes adaptadas al español de Panamá.
4. **Lectura de Pseudopalabras (Palabras Inventadas)**: 50 palabras decodificables sin significado.
5. **Lectura de Pasaje en Voz Alta**: Texto narrativo continuo de 60 palabras (medición de fluidez).
6. **Comprensión Lectora Directa**: 5 preguntas de opción múltiple asociadas al pasaje.
7. **Comprensión Auditiva**: 5 preguntas de opción múltiple tras escuchar una narración del evaluador.

### 🔢 Sub-pruebas EGMA (Matemáticas)
1. **Identificación de Números**: 20 números de dificultad progresiva.
2. **Comparación de Cantidades**: 10 pares numéricos (identificación de la cantidad mayor).
3. **Secuencias Numéricas (Número Faltante)**: 10 series numéricas con patrones aritméticos.
4. **Operaciones Básicas de Suma**: 20 ejercicios de adición de un dígito y combinados.
5. **Operaciones Básicas de Resta**: 20 ejercicios de sustracción.
6. **Problemas Verbales de Razonamiento**: 5 situaciones problema de la vida diaria.

---

## 4. Mejoras Arquitectónicas respecto a Tangerine

1. **Aislamiento Estricto de Datos Personales (Ley 285)**:
   A diferencia de Tangerine, donde los datos personales suelen estar presentes en la base de datos del dispositivo, Pro Niñez Panamá separa físicamente la tabla anónima `estudiantes` de la tabla restringida `estudiantes_identidad`. Los aplicadores de campo solo manipulan códigos anónimos (`EST-P2026-XXXX`).

2. **Evaluación Continua sin Fricción (Modo Lote / Sticky Batch Session)**:
   Los evaluadores pueden mantener fijos los datos institucionales (escuela y evaluador) mientras aplican pruebas consecutivas a decenas de alumnos en escuelas rurales de Veraguas, Santiago y la Comarca Ngäbe-Buglé.

3. **Arquitectura Cloud & Analytics Unificada**:
   Integración directa con **Firebase Firestore**, **Meilisearch** y exportación de microdatos en formato JSON/CSV para alimentar los modelos analíticos longitudinales (1° a 6° grado) financiados por la Fundación Banco General.

---

## 5. Garantía de Migración de Datos Históricos

Si existen bases de datos recopiladas anteriormente en Tangerine (archivos CSV o exports JSON de CouchDB), la API de ingesta de la plataforma Pro Niñez Panamá permite importar los registros históricos mapeando:
- `student_id` ➔ `codigo_anonimo`
- `assessor` ➔ `evaluador_nombre`
- `subtest_scores` ➔ `scoring_calculado`
