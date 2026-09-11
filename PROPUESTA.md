# 🚀 PROPUESTA TÉCNICA DE ARQUITECTURA: PROYECTO MELADOS
## Mecanismo de Ingestión, Validación y Presentación de Datos de Estimulación Temprana (CET)

Para transformar el flujo de trabajo manual y propenso a errores de Proyecto MelaDos en una plataforma interactiva robusta, proponemos la siguiente arquitectura de software para el **Proyecto MelaDos** utilizando **Next.js (App Router)**, **TypeScript**, y **Tailwind CSS**.

---

## ⚙️ 1. Mecanismo de Recepción de Información (Ingestión y Validación)

La recolección de datos en campo se puede seguir haciendo de forma offline (en tablets) o mediante plantillas de Excel, pero la carga al servidor centralizado debe gobernarse mediante un portal de importación inteligente.

```
 [ Excel / CSV de Campo ] ─► [ Portal Web de MelaDos ] ── (Pre-flight Validation) ──┐
                                                                                     ▼
 [ Base de Datos Limpia ] ◄── [ Desacoplamiento PII ] ◄── (Aceptado) ◄── [ Corrección en Caliente ]
```

### Flujo del Mecanismo de Ingestión:
1.  **Carga mediante Drag & Drop**: Melanie o las coordinadoras arrastran el archivo `.xlsx` o `.csv` al portal.
2.  **Validación en el Cliente (Pre-flight Check)**:
    *   La app parsea el archivo en memoria utilizando `xlsx` (SheetJS) o `PapaParse`.
    *   Usa un esquema de validación estricto escrito con **Zod** para validar fila por fila.
3.  **Detección y Limpieza de Anomalías**:
    *   Si se detecta un desplazamiento de columnas (ej: un número o fecha donde va el rango de evaluación), el importador lo señala visualmente y ofrece corregirlo o autolimpiarlo en caliente antes de guardar en la base de datos.
    *   Detecta duplicados de Cédulas o IDs del menor.
4.  **Carga Atomizada**: Una vez validado y aprobado el reporte de importación, los datos se suben a la base de datos mediante transacciones, asegurando que no queden registros a medias en caso de desconexión.

---

## 🔒 2. Seguridad de Datos e Identidad Desacoplada (Cumplimiento Ley 285)

Siguiendo las mejores prácticas del núcleo de MelaDos, implementaremos un patrón de desacoplamiento de identidad:

*   **Esquema de Base de Datos**:
    *   `estudiantes`: Almacena el UUID único, código de cohorte anónimo (ej: `MEL-2026-EB001`), sexo, área, centro (CET) y las evaluaciones.
    *   `estudiantes_identidad` (Acceso Restringido): Almacena físicamente el UUID del estudiante, su nombre, apellido y cédula real. Esta tabla se encripta y solo es accesible para usuarios con rol `ADMIN`.
*   **Estrategia de Roles (RBAC)**:
    *   `ADMIN` (Melanie Alvarado): Acceso a visualización de reportes, edición de estudiantes, re-identificación de nombres reales y administración de usuarios.
    *   `EVALUADOR` (Estimuladoras): Registro rápido de evaluaciones offline/online asignadas a códigos de cohorte. No pueden ver ni descargar listados consolidados de identidad.
    *   `VIEWER` (Donantes/Fundación): Dashboard analítico e interactivo con métricas agrupadas. Los nombres reales y cédulas están bloqueados a nivel de API para este rol.

---

## 📊 3. Mecanismo de Presentación (Dashboard Interactivo)

El dashboard interactivo presentará la data consolidada de forma ejecutiva con las siguientes capacidades:

1.  **Filtros Dinámicos Combinados**:
    *   *Centro (CET)*: Filtrar por Cañazas, El Bale, Juan Díaz, Burunga, Los Valles o todos.
    *   *Rango*: Filtrar estudiantes que cayeron en desarrollo 'Bajo' o 'Al límite' para priorizar intervenciones.
    *   *Género y Edad*: Segmentar el rendimiento motor, cognitivo y socioemocional por edades (meses) y sexo.
2.  **Visualización de Trayectoria (Cohortes Longitudinales)**:
    *   Gráficos de líneas que muestran el progreso del puntaje promedio de los niños de la 1ª a la 4ª evaluación, permitiendo ver si la estimulación está surtiendo efecto o si hay retrocesos en trimestres específicos.
3.  **Indicador de Retención y Cobertura**:
    *   Métrica visual del porcentaje de niños que se mantienen activos en el programa (evaluaciones completas) vs. deserción escolar.
4.  **Exportación de Reportes**:
    *   Botón para descargar resúmenes en PDF formateados ejecutivamente para reportar a directivos y donantes.
