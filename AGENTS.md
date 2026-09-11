# AGENTS.md — AI Agent Operating Standards

## Repository Context
- **Project**: Proyecto MelaDos (Estudio Longitudinal de Impacto 2022–2028)
- **Partners**: Asociación Proyecto MelaDos Panameña, Fundación Banco General, One Clik To Go
- **Version**: `0.0.1`

## Architecture Map
- `src/app/page.tsx`: Main application router (Landing for unauthenticated visitors / Dashboard workspace for logged-in users).
- `src/app/evaluar/page.tsx`: Mobile Field Evaluation console (PWA Offline / EGRA & EGMA certified sub-tests).
- `src/app/documentacion/page.tsx`: In-app interactive user manual documentation center.
- `src/components/admin/ManagementPortal.tsx`: Dynamic Admin portal for Schools, Evaluators, Students, and Evaluation Audits.
- `src/lib/meilisearch/client.ts`: Meilisearch search client and Firestore sync engine.
- `src/lib/version.ts`: Single source of truth for `APP_VERSION = '0.0.1'` and `CACHE_VERSION`.
- `docs/`: Markdown user manuals for GitHub.
- `firestore.rules`: Role-based security rules for Cloud Firestore.

## Developer Workflows
- **Git Branching**: Follow `VERSIONING.md`. Always create Pull Requests to `develop` before merging to `main`.
- **Release Tagging**: Tag official production releases using `git tag -a vX.Y.Z`.
