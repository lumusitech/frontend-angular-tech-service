# ROADMAP — Frontend Angular Tech Service

## Descripcion

Frontend Angular 22 para el sistema de gestion de servicios tecnologicos.
SSR hibrido: landing page y portal publico server-rendered, admin y vista tecnico client-rendered.
PWA instalable en dispositivos moviles.
Consume la API del backend NestJS (`/api/`).
Documentacion de la API: `http://localhost:3000/api/docs`

## Stack Tecnologico

| Capa          | Tecnologia                                       | Version                                       |
| ------------- | ------------------------------------------------ | --------------------------------------------- |
| Framework     | Angular                                          | 22 (standalone, signals, control flow, SSR)   |
| SSR           | `@angular/ssr`                                   | Hibrido (render mode por ruta)                |
| UI Components | Angular Material                                 | 22+ (componentes accesibles, sin tema custom) |
| Estilos       | Tailwind CSS                                     | 4 (primario, utility-first)                   |
| Graficas      | Chart.js + ng2-charts                            | latest                                        |
| i18n          | `@angular/localize`                              | built-in                                      |
| PWA           | `@angular/pwa`                                   | built-in                                      |
| HTTP          | Angular HttpClient + interceptors                | built-in                                      |
| Estado        | Angular Signals                                  | built-in                                      |
| Fonts         | Inter (headings + body) + JetBrains Mono (codes) | Google Fonts                                  |
| Viewport      | `dvh`/`svh` (mobile-first)                       | CSS moderno                                   |

## Decisiones Tecnicas

| Decision       | Eleccion                                             | Razon                                                                                                                       |
| -------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| SSR            | Hibrido                                              | Landing y portal publico con SSR (SEO). Admin y tech con CSR (performance). Render mode por ruta via `app.routes.server.ts` |
| Multi-tenant   | Si (configurable)                                    | Logo, nombre, colores configurables por el admin. Preparado para venta a otros negocios                                     |
| Repos          | Separado del backend                                 | API es el contrato. Swagger codegen mantiene tipos sincronizados                                                            |
| Styling        | Tailwind CSS 4                                       | Primario para layout, spacing, colores, responsive, tipografia                                                              |
| UI Library     | Angular Material                                     | Solo componentes accesibles: dialog, table, autocomplete, sidenav. Sin tema custom                                          |
| PWA            | Si                                                   | Instalable en home screen de mobile, offline parcial                                                                        |
| Hosting        | Firebase App Hosting (1ro) / Vercel (2do)            | Gratuito para trafico bajo (~8 usuarios/dia). Auto-deploy via GitHub. SSR soportado nativamente                             |
| Tecnico UX     | Lista con urgencia                                   | Sin calendario. Indicadores claros: dias restantes, color coding                                                            |
| Viewport units | `dvh` layouts, `svh` above-the-fold, `rem` espaciado | Evita bug de `vh` en mobile                                                                                                 |
| i18n           | Espanol (default), Ingles (futuro)                   | `@angular/localize` con archivos `.xlf`                                                                                     |
| Codegen        | `swagger-typescript-api`                             | Genera interfaces TypeScript desde OpenAPI spec                                                                             |

## Paleta de Colores (default, configurable por tenant)

```
Primario:    #1E40AF (azul profesional)
Secundario:  #059669 (verde, completado)
Peligro:     #DC2626 (rojo, errores, cancelado)
Advertencia: #D97706 (naranja, pendientes, alertas)
Neutral:     #1F2937 / #6B7280 / #F9FAFB (grises)
```

## Tipografia

```
Headings:    Inter (600-700 semibold/bold)
Body:        Inter (400 regular)
Monospace:   JetBrains Mono (400, codigos de tracking)
```

## Unidades de Medida (mobile-first)

```
Layouts:        h-dvh (altura dinamica)
Above-the-fold: min-h-svh (garantiza visibilidad)
Inmersivo:      h-lvh (pantalla completa)
Espaciado:      rem (padding, margins, gaps)
Fuente:         rem (text-sm, text-base, text-lg, etc.)
```

## Rendering Strategy (SSR Hibrido)

| Ruta            | RenderMode      | Razon                                                        |
| --------------- | --------------- | ------------------------------------------------------------ |
| `/`             | Prerender (SSG) | Landing page informativa. Estatica en build time. SEO optimo |
| `/login`        | Client (CSR)    | Autenticacion. No necesita SEO                               |
| `/track`        | Server (SSR)    | Portal publico. Formulario de busqueda. SEO                  |
| `/track/:code`  | Server (SSR)    | Resultado de tracking dinamico. SEO                          |
| `/admin/**`     | Client (CSR)    | Dashboard, CRUDs. Solo usuarios autenticados                 |
| `/tech/**`      | Client (CSR)    | Vista tecnico. Solo autenticados                             |
| `**` (fallback) | Client (CSR)    | Cualquier otra ruta                                          |

Configurado en `src/app/app.routes.server.ts`:

```ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'track', renderMode: RenderMode.Server },
  { path: 'track/:code', renderMode: RenderMode.Server },
  { path: 'admin/**', renderMode: RenderMode.Client },
  { path: 'tech/**', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client },
];
```

**Comportamiento con PWA:** El primer request es server-rendered (SSR/SSG).
Las siguientes navegaciones las maneja el service worker (CSR).

## Estructura del Proyecto

```
src/
├── main.ts                        # Browser bootstrap
├── main.server.ts                 # Server bootstrap
├── app/
│   ├── app.config.ts              # Browser providers (router, service worker)
│   ├── app.config.server.ts       # Server providers (SSR routes)
│   ├── app.routes.ts              # Client routes
│   ├── app.routes.server.ts       # RenderMode por ruta (Client, Server, Prerender)
│   ├── core/
│   │   ├── auth/                  Login, guards, interceptors
│   │   ├── services/              API services (typed)
│   │   └── models/                Interfaces (generadas desde Swagger)
│   ├── shared/
│   │   ├── components/            Reutilizables
│   │   │   ├── header/
│   │   │   ├── sidebar/
│   │   │   ├── bottom-nav/
│   │   │   ├── card/
│   │   │   ├── data-table/
│   │   │   ├── status-badge/
│   │   │   ├── loading-spinner/
│   │   │   ├── empty-state/
│   │   │   └── confirm-dialog/
│   │   ├── pipes/                 Date, currency, tracking-code
│   │   └── directives/            Role-based visibility
│   ├── layouts/
│   │   ├── admin-layout/          Sidebar + topbar + content
│   │   ├── tech-layout/           Bottom nav + header
│   │   └── portal-layout/         Minimal + branding
│   ├── features/
│   │   ├── landing/               Landing page informativa (SSG/prerender)
│   │   ├── auth/                  Login (CSR)
│   │   ├── dashboard/             KPIs, charts, quick actions
│   │   ├── clients/               CRUD + detail
│   │   ├── suppliers/             CRUD
│   │   ├── service-types/         CRUD
│   │   ├── work-orders/           Lista + detail + timeline
│   │   ├── payments/              Lista + filtros
│   │   ├── expenses/              CRUD + filtros
│   │   ├── billing/               Facturas (emitir, ver, PDF)
│   │   ├── reports/               Charts + export
│   │   ├── notifications/         Lista + real-time (WebSocket)
│   │   ├── settings/              Configuracion (branding, perfil)
│   │   ├── technician/            Vista tecnico (mis ordenes, urgencia)
│   │   └── portal/                Tracking publico (sin auth, SSR)
│   ├── i18n/
│   │   ├── messages.es.xlf
│   │   └── messages.en.xlf
│   └── styles/
│       ├── tailwind.css
│       ├── themes.css             Light/dark + tenant colors
│       └── material-overrides.css
server.ts                          # Express server (SSR entry point)
```

---

## Checklist por Modulo

### 0. Setup Inicial

- [ ] `npx @angular/cli@latest new frontend-angular-tech-service --ssr --routing --style=css`
- [ ] `git init` + commit inicial
- [ ] Configure hybrid rendering (`app.routes.server.ts` con RenderMode por ruta)
- [ ] Install Angular Material (`ng add @angular/material`) — componentes, sin tema custom
- [ ] Configure Tailwind CSS 4 como estilos primarios (`@import 'tailwindcss'` en styles.css)
- [ ] Import Material prebuilt theme despues de Tailwind en styles.css
- [ ] Install Chart.js + ng2-charts
- [ ] Install `swagger-typescript-api` (dev dependency)
- [ ] Configure fonts (Inter + JetBrains Mono via Google Fonts)
- [ ] Configure i18n (`@angular/localize`)
- [ ] Configure PWA (`ng add @angular/pwa`)
- [ ] Setup environment files with API URL
- [ ] Configure proxy para desarrollo (`proxy.conf.json` → localhost:3000)
- [ ] Generate types from Swagger (`npm run sync:types`)
- [ ] Setup CLAUDE.md with project conventions
- [ ] Verify `ng build` funciona (SSR + prerender + PWA)
- [ ] Push a GitHub

### 1. `core/` — Nucleo de la App

- [ ] Auth service (login, logout, token storage, isAuthenticated)
- [ ] Auth guard (admin, technician roles)
- [ ] HTTP interceptor (JWT token, error handling, base URL `/api/`)
- [ ] HTTP interceptor (loading spinner global)
- [ ] API services (typed, one per backend module):
  - [ ] AuthService
  - [ ] UsersService
  - [ ] ClientsService
  - [ ] SuppliersService
  - [ ] ServiceTypesService
  - [ ] WorkOrdersService
  - [ ] PaymentsService
  - [ ] ExpensesService
  - [ ] BillingService
  - [ ] ReportsService
  - [ ] NotificationsService
  - [ ] PortalService
  - [ ] SettingsService (business config)
- [ ] Models/interfaces (generated from Swagger or manual)
- [ ] Route definitions (lazy-loaded feature modules)

### 2. `shared/` — Componentes Reutilizables

- [ ] HeaderComponent (topbar with search, notifications bell, user avatar)
- [ ] SidebarComponent (collapsible, icon-only on mobile, text on desktop)
- [ ] BottomNavComponent (5 tabs max for technician view)
- [ ] CardComponent (Material card with header, content, actions)
- [ ] DataTableComponent (Material table with sorting, pagination, filters)
- [ ] StatusBadgeComponent (colored badge: pending, in_progress, completed, cancelled)
- [ ] UrgencyIndicatorComponent (days remaining + color: red/yellow/green/white)
- [ ] LoadingSpinnerComponent (full-page and inline)
- [ ] EmptyStateComponent (icon + message + action button)
- [ ] ConfirmDialogComponent (Material dialog with confirm/cancel)
- [ ] TrackingCodePipe (format: `TS-XXXXX`)
- [ ] RelativeDatePipe (hace 2 dias, en 3 dias)
- [ ] CurrencyArsPipe (formato argentino: $1.234,56)
- [ ] RoleDirective (show/hide based on role)

### 3. `layouts/` — Layouts

- [ ] AdminLayoutComponent
  - [ ] Sidebar (collapsible, navigation items with icons)
  - [ ] Topbar (search, notifications, user menu)
  - [ ] Content area with breadcrumbs
  - [ ] Responsive: sidebar collapses to icon-only on tablet, hidden on mobile
- [ ] TechLayoutComponent
  - [ ] Bottom tab bar (5 tabs: Ordenes, Calendario, Notificaciones, Perfil)
  - [ ] Header with business name + avatar
  - [ ] Content area
- [ ] PortalLayoutComponent
  - [ ] Minimal header with business logo + name (from API settings)
  - [ ] No sidebar, no navigation
  - [ ] Full-screen content area

### 4. `features/auth/` — Autenticacion

- [ ] LoginComponent (CSR — no necesita SEO)
  - [ ] Email + password form (Tailwind styled, Material form fields opcionales)
  - [ ] Login button
  - [ ] Error display (invalid credentials)
  - [ ] Redirect to dashboard on success
  - [ ] `min-h-svh` (above the fold)
- [ ] Auth flow
  - [ ] Store token in localStorage
  - [ ] Attach token to all requests via interceptor
  - [ ] Redirect to login on 401
  - [ ] Role-based route guards

### 5. `features/dashboard/` — Dashboard Admin

- [ ] KPIs cards
  - [ ] Ordenes activas / completadas hoy
  - [ ] Ingresos del mes vs mes anterior (trend arrow)
  - [ ] Tecnicos disponibles
  - [ ] Pagos pendientes
- [ ] Charts
  - [ ] Monthly income trend (line chart, 6 months)
  - [ ] Work orders by status (donut chart)
  - [ ] Top 5 services (bar chart)
  - [ ] Payment method distribution (pie chart)
- [ ] Quick actions
  - [ ] Nueva orden de trabajo
  - [ ] Nuevo cliente
  - [ ] Ver reportes
- [ ] Recent activity feed

### 6. `features/clients/` — Clientes

- [ ] ClientsListComponent
  - [ ] DataTable with columns: name, email, phone, isActive
  - [ ] Search/filter bar
  - [ ] Pagination
  - [ ] Actions: edit, delete, view detail
- [ ] ClientFormComponent (create/edit dialog or page)
  - [ ] Form fields: name, email, phone, address, internetProvider, internetPlan, cuit, ivaCondition
  - [ ] Validation (required, email format, CUIT format)
- [ ] ClientDetailComponent
  - [ ] Client info
  - [ ] Work orders list (related)
  - [ ] Payment history

### 7. `features/suppliers/` — Proveedores

- [ ] SuppliersListComponent (DataTable)
- [ ] SupplierFormComponent (create/edit)
- [ ] Same CRUD pattern as clients

### 8. `features/service-types/` — Tipos de Servicio

- [ ] ServiceTypesListComponent (DataTable)
- [ ] ServiceTypeFormComponent (create/edit)
- [ ] Same CRUD pattern

### 9. `features/work-orders/` — Ordenes de Trabajo (CORE)

- [ ] WorkOrdersListComponent
  - [ ] DataTable with columns: trackingCode, status, priority, client, serviceType, scheduledDate, assignedTechnicians
  - [ ] Filters: status, priority, date range, technician, client
  - [ ] Color-coded status badges
  - [ ] Priority icons
- [ ] WorkOrderDetailComponent
  - [ ] Header: trackingCode, status badge, priority, client info
  - [ ] Tabs or sections:
    - [ ] Info general (diagnosis, dates, warranty)
    - [ ] Timeline (status history, notes)
    - [ ] Tasks (checklist with progress bar)
    - [ ] Materials (table with costs, supplier)
    - [ ] Payments (list, create payment)
    - [ ] Notes (internal + public)
  - [ ] Actions: change status, assign technicians, add note, add material, add task
- [ ] WorkOrderFormComponent (create/edit)
  - [ ] Client selector (autocomplete)
  - [ ] Service type selector
  - [ ] Priority selector
  - [ ] Location selector (workshop/client)
  - [ ] Scheduled date
  - [ ] Diagnosis (optional)
- [ ] StatusTransitionComponent
  - [ ] Visual flow: pending -> assigned -> in_progress -> completed -> delivered
  - [ ] Only valid transitions shown as buttons
  - [ ] Confirmation dialog for cancel
- [ ] TechnicianAssignmentComponent
  - [ ] Multi-select of technicians
  - [ ] Replace all technicians on save
- [ ] TimelineComponent
  - [ ] Vertical timeline with status changes, notes, payments
  - [ ] Color-coded by type

### 10. `features/payments/` — Pagos

- [ ] PaymentsListComponent
  - [ ] DataTable: amount, method, status, provider, workOrder trackingCode, paidAt
  - [ ] Filters: status, method, date range
- [ ] PaymentFormComponent
  - [ ] Amount, method selector, provider, description
  - [ ] Installments (for credit card)
- [ ] PaymentStatusBadgeComponent (pending, approved, rejected, refunded, cancelled)

### 11. `features/expenses/` — Gastos

- [ ] ExpensesListComponent
  - [ ] DataTable: description, amount, category, date, isRecurring
  - [ ] Filters: category, date range, isRecurring
  - [ ] Category icons
- [ ] ExpenseFormComponent
  - [ ] Category selector (enum), amount, date, description, isRecurring
  - [ ] Notes (optional)

### 12. `features/billing/` — Facturacion

- [ ] InvoicesListComponent
  - [ ] DataTable: invoiceNumber, invoiceType (A/B/C), status, clientName, total, issuedAt
  - [ ] Filters: status, type, date range, client
- [ ] InvoiceDetailComponent
  - [ ] Full invoice data (formatted like an Argentine invoice)
  - [ ] CAE info
  - [ ] Actions: issue, cancel, download PDF
- [ ] InvoiceFormComponent (create draft)
  - [ ] Invoice type selector (A, B, C)
  - [ ] Client info (auto-fill from client data)
  - [ ] Subtotal, IVA, total
  - [ ] Work order selector
- [ ] IssueInvoiceButton (draft -> issued, calls ARCA stub)
- [ ] DownloadPdfButton (GET /billing/invoices/:id/pdf)

### 13. `features/reports/` — Reportes

- [ ] ReportsDashboardComponent
  - [ ] Period selector (daily, weekly, monthly, yearly, custom range)
  - [ ] KPI summary cards
- [ ] IncomeChartComponent (line chart, monthly trend)
- [ ] ExpensesChartComponent (bar chart by category)
- [ ] ProfitChartComponent (income - expenses - materials)
- [ ] ServicesRankingComponent (top services table + chart)
- [ ] TechnicianRankingComponent (leaderboard: completed, avg time, revenue)
- [ ] TechnicianDetailComponent (individual performance)
- [ ] ClientReportComponent (client history: orders, payments, KPIs)
- [ ] ExportButtons (PDF download for budget/receipt)

### 14. `features/notifications/` — Notificaciones

- [ ] NotificationsListComponent
  - [ ] List with type icon, title, message, timestamp
  - [ ] Unread indicator
  - [ ] Mark as read / mark all as read
- [ ] NotificationBellComponent (topbar badge with unread count)
- [ ] WebSocketService
  - [ ] Connect with JWT token
  - [ ] Listen for new notifications
  - [ ] Update unread count in real-time
  - [ ] Reconnect on disconnect

### 15. `features/settings/` — Configuracion

- [ ] BusinessSettingsComponent (multi-tenant)
  - [ ] Business name
  - [ ] Logo upload (preview)
  - [ ] Primary color picker
  - [ ] Address, phone, email
  - [ ] CUIT
- [ ] ProfileSettingsComponent
  - [ ] Change password
  - [ ] Update name/email
- [ ] ThemeService
  - [ ] Apply primary color as CSS custom property
  - [ ] Light/dark mode toggle
  - [ ] Persist in localStorage

### 16. `features/technician/` — Vista Tecnico

- [ ] TechWorkOrdersComponent (my assigned orders)
  - [ ] Card-based layout (not table)
  - [ ] Each card shows:
    - [ ] Tracking code
    - [ ] Client name
    - [ ] Service type
    - [ ] Status badge
    - [ ] Urgency indicator (days remaining + color)
    - [ ] Progress bar (tasks completed / total)
    - [ ] Scheduled date
  - [ ] Filters: status, urgency
  - [ ] Sort by: urgency (most urgent first)
- [ ] TechWorkOrderDetailComponent
  - [ ] Tasks checklist (mark complete)
  - [ ] Add materials used
  - [ ] Add notes
  - [ ] View diagnosis
  - [ ] Status transition (in_progress -> completed)
- [ ] UrgencyColorCoding:
  - [ ] Red (#DC2626): overdue or due today
  - [ ] Yellow (#D97706): 1-3 days remaining
  - [ ] Green (#059669): 4+ days remaining
  - [ ] Gray (#6B7280): no date set

### 17. `features/portal/` — Portal Publico

- [ ] PortalTrackingComponent (no auth required)
  - [ ] Input: tracking code (manual input or from URL `/track/:code`)
  - [ ] Auto-fetch on URL param
- [ ] TrackingResultComponent
  - [ ] Business branding (logo, name, colors from API settings)
  - [ ] Status timeline (vertical, visual)
    - [ ] Completed steps: green with checkmark
    - [ ] Current step: blue with pulse animation
    - [ ] Pending steps: gray
  - [ ] Tasks summary (completed count / total)
  - [ ] Payment summary (total paid, pending)
  - [ ] Download buttons (budget PDF, receipt PDF)
- [ ] TrackingNotFoundComponent
  - [ ] Friendly message: "No se encontro ninguna orden con ese codigo"
  - [ ] Retry input

### 18. PWA Configuration

- [ ] Service worker setup (`ng add @angular/pwa`)
- [ ] SSR + PWA interaction: primer request es SSR/SSG, siguientes son CSR via service worker
- [ ] Offline support (cache API responses con ngsw-config.json data groups)
- [ ] Install prompt (add to home screen)
- [ ] App manifest (name, icons, theme color)
- [ ] Push notifications setup (future)

### 19. i18n

- [ ] Configure `@angular/localize`
- [ ] Extract messages (`ng extract-i18n`)
- [ ] Spanish (`messages.es.xlf`) — default
- [ ] English (`messages.en.xlf`) — future
- [ ] All user-facing strings marked with `$localize`

### 20. Testing

- [ ] Component unit tests (Karma/Jest)
- [ ] Service unit tests (mock HTTP)
- [ ] E2E tests (Cypress or Playwright)
- [ ] Accessibility tests (axe-core)

### 21. `features/landing/` — Landing Page (SSG/Prerender)

- [ ] LandingComponent (prerenderizada en build time)
  - [ ] Hero section: nombre del sistema, tagline, CTA a login
  - [ ] Features section: tarjetas con iconos mostrando funcionalidades clave
    - [ ] Gestion de ordenes de trabajo
    - [ ] Tracking publico para clientes
    - [ ] Control de pagos y facturacion
    - [ ] Dashboard con KPIs y reportes
    - [ ] Multi-tenant (configurable por negocio)
  - [ ] How it works: pasos simples (1. Crear orden → 2. Asignar tecnico → 3. Cliente trackea → 4. Cobrar)
  - [ ] Screenshots/mockups del sistema
  - [ ] CTA final: boton de login
  - [ ] Footer con info de contacto
  - [ ] Todo en Tailwind CSS, responsive mobile-first
  - [ ] SEO meta tags (title, description, og:image)
  - [ ] SSR: contenido visible sin JavaScript

---

## Comandos Utiles

```bash
# Development
ng serve                    # Dev server con SSR en localhost:4200
ng serve --open             # Abrir automaticamente

# Build
ng build                    # Build con SSR + prerender
ng build --configuration=production
node dist/frontend-angular-tech-service/server/server.js  # Run SSR server localmente

# Deploy (Firebase App Hosting)
firebase deploy             # Deploy a Firebase

# Generate
ng g component features/clients/client-list
ng g service core/services/clients
ng g guard core/auth/admin
ng g interceptor core/interceptors/auth

# Types from Swagger
npm run sync:types          # Genera interfaces desde OpenAPI spec

# Tests
ng test                     # Unit tests
ng e2e                      # E2E tests

# i18n
ng extract-i18n             # Extraer mensajes
ng build --localize         # Build con todos los idiomas
```

---

## Sync de Tipos con Backend

```bash
# package.json scripts
"scripts": {
  "sync:types": "swagger-typescript-api -p http://localhost:3000/api/docs-json -o src/app/core/models -n api.interfaces.ts --no-client"
}
```

Genera `src/app/core/models/api.interfaces.ts` con todas las interfaces del backend.

---

## Notas

- **Backend API:** `http://localhost:3000/api/` (con prefijo /api/)
- **Swagger docs:** `http://localhost:3000/api/docs`
- **Auth:** JWT Bearer token en header `Authorization: Bearer <token>`
- **Respuestas exitosas:** `{ statusCode, data, timestamp }` — siempre acceder via `response.data`
- **Respuestas de error:** `{ statusCode, message, error, timestamp }`
- **PDFs:** Endpoints de PDF devuelven raw bytes, usar `responseType: 'blob'` en HttpClient
- **WebSocket:** Socket.IO con `{ auth: { token: "<jwt>" } }`
- **Paginacion:** `{ data, total, page, limit, totalPages }`
- **Roles:** `admin` (acceso total), `technician` (solo sus ordenes)
- **Multi-tenant:** Business settings (name, logo, colors) se cargan desde API y se aplican como CSS variables

## Notas SSR

- Angular 22 soporta rendering hibrido via `app.routes.server.ts`
- Landing page prerenderizada en build time (SSG) — HTML estatico, sin JS para contenido
- Portal publico renderizado en server por request (SSR) — SEO dinamico
- Admin y Tech son CSR — mas rapido, sin overhead de SSR para usuarios autenticados
- PWA service worker toma control despues del primer request SSR
- Para deploy: Node.js server requerido para SSR (Firebase App Hosting o Vercel)
- Cold start minimo en Firebase/Vercel con trafico bajo (~8 usuarios/dia)

## Hosting

- **Opcion 1 (recomendada): Firebase App Hosting**
  - Primer-party de Google, hecho para Angular SSR
  - Plan Blaze (pay-as-you-go): gratis para ~8 usuarios/dia
  - Auto-deploy via GitHub en push a main
  - Requiere tarjeta de credito pero no genera cargos con este trafico

- **Opcion 2: Vercel**
  - Hobby plan gratuito: 100GB bandwidth, 4hrs compute/mes
  - Auto-deploy via GitHub
  - Adapter via AnalogJS (community, no official)
  - Restriccion: non-commercial en plan gratuito
