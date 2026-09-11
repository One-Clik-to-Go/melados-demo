# Proyecto MelaDos — Estudio Longitudinal de Impacto

[![Despliegue Producción](https://img.shields.io/badge/Producci%C3%B3n-https%3A%2F%2Fproninezpanama.app-00973a)](https://proninezpanama.app)
[![Ley 285 Compliant](https://img.shields.io/badge/Ley_285-Protecci%C3%B3n_Infantil-65bec2)](https://proninezpanama.app/privacidad)
[![Next.js](https://img.shields.io/badge/Framework-Next.js_14-000000)](https://nextjs.org)

Plataforma oficial del **Estudio Longitudinal de Impacto (2022–2028)** de los **Centros de Estimulación Temprana (CET)** de la **Asociación Proyecto MelaDos Panameña**, financiado por la **Fundación Banco General** e implementado tecnológicamente por **One Clik To Go**.

---

## 🌟 Características Principales

1. **🎨 Diseño e Identidad Institucional**:
   - Sistema de diseño en **Modo Claro** acorde a [proninezpanama.org](https://proninezpanama.org).
   - Paleta cromática oficial: *Teal (`#65bec2`)*, *Verde (`#00973a`)*, *Lima (`#70b839`)*, *Rosado (`#e96199`)*.
   - Tipografía *Hanken Grotesk* + *Inter*.

2. **🔐 Autenticación y Consola SuperAdmin**:
   - Inicio de sesión mediante **Correo/Contraseña** y **Google Sign-In**.
   - **Simulador de Roles en Tiempo Real**: Permite al SuperAdmin evaluar en vivo las vistas `ADMIN`, `EVALUADOR` y `REPORTE / AUDITOR`.
   - Control de permisos y asignación de colaboradores.

3. **📱 Consola Móvil de Evaluación de Campo (EGRA & EGMA Certificadas)**:
   - Acceso sin login obligatorio mediante enlace directo (`/evaluar`).
   - **Protocolo Certificado EGRA** (7 Sub-pruebas de lectoescritura).
   - **Protocolo Certificado EGMA** (6 Sub-pruebas de matemáticas).
   - **Modo Sesión Activa (Lote)**: Mantiene fijada la escuela y el evaluador para evaluar niños secuencialmente en campo con un solo toque.
   - **Soporte PWA / Offline**: Guarda automáticamente en **IndexedDB** local cuando no hay red y sincroniza al detectar internet.

4. **🏢 Centro de Gestión Administrativa Dinámica (Cero Hardcode)**:
   - **Gestión de Escuelas**: Sistema CRUD con prevención automática de escuelas duplicadas por nombre/normalización.
   - **Gestión de Evaluadores**: Administración de equipo de campo y permisos.
   - **Cohorte de Estudiantes**: Alta de nuevos alumnos, asignación de escuela y grupo (Programa CET vs Control).
   - **Auditoría de Pruebas**: Histórico completo de evaluaciones aplicadas con buscador y filtros por instrumento.

5. **🛡️ Cumplimiento Normativo (Ley 285 de Panamá)**:
   - Esquema de desacoplamiento de identidad (*Online Decoupled Pattern*).
   - Aislamiento de microdatos académicos asociados exclusivamente a códigos anónimos (`EST-P2026-XXXX`).

---

## 📚 Documentación Técnica en GitHub (`docs/`)

- [📑 Manual de Evaluaciones EGRA & EGMA](docs/MANUAL_EVALUACIONES.md)
- [📊 Estudio Comparativo: Tangerine® Central vs Proyecto MelaDos](docs/COMPARATIVA_TANGERINE.md)
- [🏢 Manual de Gestión de Escuelas](docs/MANUAL_ESCUELAS.md)
- [👥 Manual de Usuarios, Permisos y Roles](docs/MANUAL_USUARIOS_Y_ROLES.md)
- [🛡️ Cumplimiento Normativo Ley 285](docs/LEY_285_PROTECCION_DATOS.md)

---

## 🚀 Estructura de Rutas de la Aplicación

| Ruta | Descripción | Acceso |
| :--- | :--- | :--- |
| `/` | Landing Pública Institucional (si no autenticado) / Dashboard Principal (si autenticado) | Público / Protegido |
| `/login` | Pantalla de inicio de sesión segura con Google y Correo | Público |
| `/evaluar` | Consola móvil para aplicación de pruebas EGRA/EGMA en campo | Enlace Directo (Público) |
| `/terminos` | Términos y Condiciones de Uso del Sistema | Público |
| `/privacidad` | Política de Privacidad y Protección de Datos conforme a Ley 285 | Público |

---

## 🛠️ Tecnologías Utilizadas

- **Framework Web**: Next.js 14 (App Router) + TypeScript
- **Estilos y Componentes**: TailwindCSS + Lucide Icons + Recharts
- **Base de Datos & Auth**: Firebase Firestore + Firebase Auth (SDK Client & Admin)
- **Almacenamiento Local Offline**: IndexedDB (PWA Ready)
- **Infraestructura**: Coolify PaaS sobre VPS Hetzner (`mel-vps`) con SSL TLS 1.3 de Cloudflare.

---

## 📋 Variables de Entorno

Crear un archivo `.env.local` con la siguiente estructura:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyA..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="proninez-ca117.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="proninez-ca117"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="proninez-ca117.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"

FIREBASE_PROJECT_ID="proninez-ca117"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-...@proninez-ca117.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

---

## 📜 Licencia y Créditos

Propietario del Proyecto: **Asociación Proyecto MelaDos Panameña**  
Patrocinador: **Fundación Banco General**  
Desarrollador Tecnológico: **One Clik To Go**
