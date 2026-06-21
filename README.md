# Frontend Angular Tech Service

Sistema de gestion de servicios tecnicos (reparaciones, instalacion de camaras, electricidad, etc.).
Frontend Angular 22 con SSR hibrido, PWA, Tailwind CSS y Angular Material.

Consume la API del backend NestJS. Documentacion interactiva: `http://localhost:3000/api/docs`

## Stack

| Capa          | Tecnologia             | Detalle                                                |
| ------------- | ---------------------- | ------------------------------------------------------ |
| Framework     | Angular 22             | Standalone, signals, signal forms, resource API        |
| SSR           | `@angular/ssr`         | Hibrido: SSG landing, SSR portal, CSR admin            |
| PWA           | `@angular/pwa`         | Instalable, offline parcial                            |
| Styling       | Tailwind CSS 4         | Utility-first, mobile-first (primario)                 |
| UI Components | Angular Material 22    | Dialog, Table, Autocomplete, Sidenav (sin tema custom) |
| Charts        | Chart.js + ng2-charts  | Line, bar, donut, pie                                  |
| Testing       | Vitest                 | Unit tests                                             |
| i18n          | `@angular/localize`    | Espanol (default), Ingles (futuro)                     |
| Fonts         | Inter + JetBrains Mono | Google Fonts                                           |

## Requisitos

- Node.js 20+
- pnpm
- Backend NestJS corriendo en `http://localhost:3000/api/`

## Instalacion

```bash
# Clonar el repo
git clone https://github.com/lumusitech/frontend-angular-tech-service.git
cd frontend-angular-tech-service

# Instalar dependencias
pnpm install

# Generar tipos desde Swagger (backend tiene que estar corriendo)
pnpm sync:types

# Iniciar servidor de desarrollo (con SSR)
ng serve --open
```

La app corre en `http://localhost:4200`.

## Build

```bash
ng build                                          # Build con SSR + prerender
node dist/frontend-angular-tech-service/server/server.js  # Run SSR server localmente
```

## Deploy

Auto-deploy via GitHub a Firebase App Hosting en push a main.

```bash
firebase deploy
```

## Rendering Strategy (SSR Hibrido)

| Ruta           | Modo            | Descripcion               |
| -------------- | --------------- | ------------------------- |
| `/`            | SSG (prerender) | Landing page informativa  |
| `/login`       | CSR             | Autenticacion             |
| `/track`       | SSR             | Portal publico (SEO)      |
| `/track/:code` | SSR             | Tracking de ordenes (SEO) |
| `/admin/**`    | CSR             | Dashboard y CRUDs         |
| `/tech/**`     | CSR             | Vista del tecnico         |

Configurado en `src/app/app.routes.server.ts`.

## Scripts

```bash
ng serve                    # Dev server con SSR (localhost:4200)
ng build                    # Build con SSR + prerender
ng test                     # Unit tests (Vitest)
ng extract-i18n             # Extraer mensajes para i18n
pnpm sync:types          # Generar interfaces desde Swagger
firebase deploy             # Deploy a Firebase
```

## Estructura del proyecto

```
src/
├── main.ts                  Browser bootstrap
├── main.server.ts           Server bootstrap
├── app/
│   ├── app.config.ts        Browser providers
│   ├── app.config.server.ts Server providers
│   ├── app.routes.ts        Client routes
│   ├── app.routes.server.ts RenderMode por ruta
│   ├── core/                Auth, services, models, guards, interceptors
│   ├── shared/              Componentes reutilizables
│   ├── layouts/             Admin, Tech, Portal layouts
│   ├── features/            Modulos lazy-loaded
│   │   ├── landing/         Landing page (SSG)
│   │   ├── auth/            Login (CSR)
│   │   ├── dashboard/       KPIs, charts
│   │   ├── clients/         CRUD clientes
│   │   ├── suppliers/       CRUD proveedores
│   │   ├── service-types/   Catalogo de servicios
│   │   ├── work-orders/     Ordenes de trabajo (core)
│   │   ├── payments/        Pagos
│   │   ├── expenses/        Gastos operativos
│   │   ├── billing/         Facturacion
│   │   ├── reports/         Reportes financieros
│   │   ├── notifications/   Notificaciones in-app
│   │   ├── settings/        Configuracion
│   │   ├── technician/      Vista del tecnico
│   │   └── portal/          Tracking publico (SSR)
│   ├── i18n/                Archivos de traduccion
│   └── styles/              Tailwind, themes, Material overrides
server.ts                    Express server (SSR entry)
```

## Usuarios del sistema

| Rol            | Acceso                                          | Dispositivo     |
| -------------- | ----------------------------------------------- | --------------- |
| **Admin**      | Dashboard completo, CRUD, reportes, facturacion | Desktop, tablet |
| **Technician** | Sus ordenes asignadas, tareas, materiales       | Mobile          |
| **Client**     | Tracking de su orden (sin login)                | Mobile          |

## Rutas principales

| Ruta               | Rol        | Descripcion                          |
| ------------------ | ---------- | ------------------------------------ |
| `/`                | Publico    | Landing page informativa del sistema |
| `/login`           | Publico    | Inicio de sesion                     |
| `/dashboard`       | Admin      | KPIs y resumen                       |
| `/clients`         | Admin      | Gestion de clientes                  |
| `/suppliers`       | Admin      | Gestion de proveedores               |
| `/service-types`   | Admin      | Catalogo de servicios                |
| `/work-orders`     | Admin/Tech | Ordenes de trabajo                   |
| `/work-orders/:id` | Admin/Tech | Detalle de orden                     |
| `/payments`        | Admin      | Historial de pagos                   |
| `/expenses`        | Admin      | Gastos operativos                    |
| `/billing`         | Admin      | Facturacion                          |
| `/reports`         | Admin      | Reportes financieros                 |
| `/notifications`   | Admin/Tech | Notificaciones                       |
| `/settings`        | Admin      | Configuracion del negocio            |
| `/tech`            | Tech       | Mis ordenes del dia                  |
| `/track`           | Publico    | Buscar orden por codigo              |
| `/track/:code`     | Publico    | Tracking de orden                    |

## API del Backend

- **Base URL:** `http://localhost:3000/api/`
- **Auth:** JWT Bearer token en header `Authorization: Bearer <token>`
- **Swagger UI:** `http://localhost:3000/api/docs`
- **Swagger JSON:** `http://localhost:3000/api/docs-json`

### Formato de respuestas

Exitosas:

```json
{
  "statusCode": 200,
  "data": { ... },
  "timestamp": "2026-06-02T..."
}
```

Error:

```json
{
  "statusCode": 400,
  "message": "error message",
  "error": "BadRequest",
  "timestamp": "..."
}
```

### PDFs

Los endpoints de PDF (`/reports/work-orders/:id/budget`, `/reports/payments/:id/receipt`, `/billing/invoices/:id/pdf`) devuelven raw bytes. Usar `responseType: 'blob'` en HttpClient.

## Multi-tenant

El portal y los PDFs usan la configuracion del negocio (nombre, logo, colores) que se carga desde la API. El admin puede cambiar estos valores desde `/settings`.

## PWA

La app es instalable como PWA en dispositivos mobiles. El primer request es server-rendered (SSR/SSG), las siguientes navegaciones las maneja el service worker (CSR). El service worker cachea respuestas de API para soporte offline parcial.

## i18n

- Idioma default: Espanol (Argentina)
- Archivos de traduccion: `src/i18n/messages.es.xlf`
- Generar mensajes: `ng extract-i18n`
- Build con idiomas: `ng build --localize`

## Sync de tipos con Backend

```bash
pnpm sync:types
```

Genera `src/app/core/models/api.interfaces.ts` con todas las interfaces del backend desde el spec OpenAPI.

## Viewport units (mobile-first)

- `dvh` — layouts principales (se adapta al browser chrome)
- `svh` — contenido above-the-fold (login, portal)
- `rem` — espaciado, tipografia, paddings
- Evitar `vh` (bug en mobile Safari/Chrome)

## Colores (default, configurable)

```
Primario:    #1E40AF (azul)
Secundario:  #059669 (verde)
Peligro:     #DC2626 (rojo)
Advertencia: #D97706 (naranja)
Neutral:     #1F2937 / #6B7280 / #F9FAFB
```

## Hosting

- **Opcion 1 (recomendada): Firebase App Hosting** — Primer-party de Google, hecho para Angular SSR. Plan Blaze (pay-as-you-go): gratis para ~8 usuarios/dia. Auto-deploy via GitHub.
- **Opcion 2: Vercel** — Hobby plan gratuito: 100GB bandwidth, 4hrs compute/mes. Adapter via AnalogJS.

## Links utiles

- [Backend repo](https://github.com/lumusitech/backend-nestjs-tech-service)
- [Swagger docs](http://localhost:3000/api/docs)
- [Angular Material](https://material.angular.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ROADMAP.md](./ROADMAP.md) — Checklist completo y decisiones tecnicas
