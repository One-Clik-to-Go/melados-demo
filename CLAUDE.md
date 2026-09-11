# Guidelines for Claude and AI Agents

This repository contains the official web platform for **Proyecto MelaDos — Estudio Longitudinal de Impacto V2** (`https://proninezpanama.app`).

## Tech Stack Overview
- **Framework**: Next.js 14 (App Router) + TypeScript + TailwindCSS + Lucide Icons
- **Database**: Cloud Firestore (SDK Client & Admin) + Meilisearch (Instant Search)
- **Authentication**: Firebase Auth (Email/Pass & Google Sign-In) with SuperAdmin role simulator
- **PWA / Offline**: Service Worker (`public/service-worker.js`) with cache `proninez-cache-v0.0.1` and IndexedDB

## Key Project Rules & Conventions
1. **Zero Hardcoded Data**: All dynamic entities (Schools, Evaluators, Students, Evaluations) are persisted in Firestore and indexed in Meilisearch.
2. **Ley 285 Compliance**: Always decouple child identity PII (`estudiantes_identidad`) from academic scores (`evaluaciones_egra`, `evaluaciones_egma`).
3. **No Unauthenticated Redirect Loop**: Unauthenticated visitors at `/` must receive the institutional `<PublicLandingPage />` instantly without full-page loading locks.
4. **Light Theme Visual Identity**: Use official Proyecto MelaDos color tokens (`proninez-teal: #65bec2`, `proninez-green: #00973a`, `proninez-lime: #70b839`, `proninez-pink: #e96199`). Avoid dark mode default backgrounds.
5. **Deduplication**: Keep school registration normalized (`nombre_escuela.trim().toLowerCase()`) returning HTTP 409 Conflict on duplicates.

## Common Commands
- `npm run dev`: Start Next.js development server
- `npm run build`: Production build and typecheck
- `npx eslint .`: Lint codebase
