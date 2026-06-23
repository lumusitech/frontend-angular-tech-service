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
| i18n          | Custom JSON (TranslatePipe + TranslationService) | ES (default) + EN, archivos en public/i18n/    |
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
| i18n           | Espanol (default), Ingles (futuro)                   | Custom JSON + TranslatePipe (no @angular/localize)                                                          |
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

- [x] `npx @angular/cli@latest new frontend-angular-tech-service --ssr --routing --style=css`
- [x] `git init` + commit inicial
- [x] Configure hybrid rendering (`app.routes.server.ts` con RenderMode por ruta)
- [x] Install Angular Material (`ng add @angular/material`) — componentes, sin tema custom
- [x] Configure Tailwind CSS 4 como estilos primarios (`@import 'tailwindcss'` en styles.css)
- [x] Import Material prebuilt theme despues de Tailwind en styles.css
- [x] Install Chart.js + ng2-charts
- [x] Install `swagger-typescript-api` (dev dependency)
- [x] Configure fonts (Inter + JetBrains Mono via Google Fonts)
- [x] Configure i18n (`@angular/localize`) — Implementado con approach custom (JSON + TranslatePipe)
- [x] Configure PWA (`ng add @angular/pwa`) — Implementado
- [x] Setup environment files with API URL
- [x] Configure proxy para desarrollo (`proxy.conf.json` → localhost:3000)
- [x] Generate types from Swagger (`pnpm sync:types`)
- [x] Setup CLAUDE.md with project conventions
- [x] Verify `ng build` funciona (SSR + prerender + PWA)
- [x] Push a GitHub

### 1. `core/` — Nucleo de la App

- [x] Auth service (login, logout, token storage, isAuthenticated)
- [x] Auth guard (admin, technician roles)
- [x] HTTP interceptor (JWT token, error handling, base URL `/api/`)
- [x] HTTP interceptor (loading spinner global)
- [x] API services (typed, one per backend module):
  - [x] AuthService
  - [x] UsersService
  - [x] ClientsService
  - [x] SuppliersService
  - [x] ServiceTypesService
  - [x] WorkOrdersService
  - [x] PaymentsService
  - [x] ExpensesService
  - [x] BillingService
  - [x] ReportsService
  - [x] NotificationsService
  - [x] PortalService
  - [x] SettingsService (dashboard layout, theme, user preferences)
  - [x] DashboardService
  - [x] PendingItemsService
  - [x] InquiriesService
- [x] Models/interfaces (generated from Swagger or manual)
- [x] Route definitions (lazy-loaded feature modules)

### 2. `shared/` — Componentes Reutilizables

- [x] HeaderComponent (topbar with search, dark mode toggle, language switcher, user avatar)
- [x] SidebarComponent (collapsible, icon-only on mobile, text on desktop)
- [x] BottomNavComponent (5 tabs max for technician view)
- [ ] CardComponent (Material card with header, content, actions) — No implementado, se usan cards inline con Tailwind
- [ ] DataTableComponent (Material table with sorting, pagination, filters) — No implementado, se usa MatTable directamente
- [x] StatusBadgeComponent (colored badge: pending, in_progress, completed, cancelled)
- [x] UrgencyIndicatorComponent (days remaining + color: red/yellow/green/white)
- [x] LoadingSpinnerComponent (full-page and inline)
- [x] EmptyStateComponent (icon + message + action button)
- [x] ConfirmDialogComponent (Material dialog with confirm/cancel)
- [x] PageHeaderComponent (title + subtitle + action button)
- [x] ErrorStateComponent (error icon + message + retry button)
- [x] TrackingCodeComponent (format: `TS-XXXXX`) — Implementado como componente
- [ ] RelativeDatePipe (hace 2 dias, en 3 dias)
- [x] CurrencyArsPipe (formato argentino: $1.234,56)
- [x] StatusLabelPipe (traduce estados a labels)
- [x] StatusClassPipe (retorna clases CSS para badges)
- [x] SafeHtmlPipe (bypass sanitizer para SVG icons)
- [x] TranslatePipe (i18n custom con JSON files)
- [ ] RoleDirective (show/hide based on role)

### 3. `layouts/` — Layouts

- [x] AdminLayoutComponent
  - [x] Sidebar (collapsible, navigation items with icons)
  - [x] Topbar (search, dark mode toggle, language switcher, user menu)
  - [x] Content area with breadcrumbs
  - [x] Responsive: sidebar collapses to icon-only on tablet, hidden on mobile
- [x] TechLayoutComponent
      - [x] Bottom tab bar (5 tabs max: Órdenes, Notificaciones, Perfil)
      - [x] Header with business name + avatar
      - [x] Content area

- [ ] PortalLayoutComponent
  - [ ] Minimal header with business logo + name (from API settings)
  - [ ] No sidebar, no navigation
  - [ ] Full-screen content area

### 4. `features/auth/` — Autenticacion

- [x] LoginComponent (CSR — no necesita SEO)
  - [x] Email + password form (Tailwind styled, Material form fields opcionales)
  - [x] Login button
  - [x] Error display (invalid credentials)
  - [x] Redirect to dashboard on success
  - [x] `min-h-svh` (above the fold)
- [x] Auth flow
  - [x] Store token in localStorage
  - [x] Attach token to all requests via interceptor
  - [x] Redirect to login on 401
  - [x] Role-based route guards

### 5. `features/dashboard/` — Dashboard Admin

- [x] KPIs cards
  - [x] Ordenes activas / completadas hoy
  - [x] Ingresos del mes vs mes anterior (trend arrow)
  - [x] Ganancia neta
  - [x] Ticket promedio
- [x] Charts
  - [x] Monthly income trend (line chart, 6 months)
  - [x] Work orders by status (donut chart)
  - [x] Top 5 services (bar chart)
- [x] Quick actions
  - [x] Nueva orden de trabajo
  - [x] Nuevo cliente
  - [x] Pendientes
  - [x] Ver gastos
- [x] Top Clients widget
- [x] Pending Items widget
- [x] Dashboard layout customization (drag-drop widget reorder, toggle visibility)

### 6. `features/clients/` — Clientes

- [x] ClientsListComponent
  - [x] DataTable with columns: name, email, phone, isActive, createdAt
  - [x] Search/filter bar
  - [x] Server-side pagination
  - [x] Server-side sorting
  - [x] Actions: edit, delete, view detail
- [x] ClientFormComponent (create/edit dialog)
  - [x] Form fields: name, email, phone, address, internetProvider, internetPlan, cuit, ivaCondition, isActive
  - [x] Validation (required, email format, CUIT format)
- [ ] ClientDetailComponent — No implementado

### 7. `features/suppliers/` — Proveedores

- [x] SuppliersListComponent (DataTable)
- [x] SupplierFormComponent (create/edit)
- [x] Same CRUD pattern as clients

---

### 8. `features/service-types/` — Tipos de Servicio

- [x] ServiceTypesListComponent (DataTable)
- [x] ServiceTypeFormComponent (create/edit)
- [x] Same CRUD pattern

### 9. `features/work-orders/` — Ordenes de Trabajo (CORE)

- [x] WorkOrdersListComponent
  - [x] DataTable with columns: trackingCode, status, priority, client, serviceType, scheduledDate, createdAt
  - [x] Filters: status, priority
  - [x] Color-coded status badges
  - [x] Server-side sorting + pagination
- [x] WorkOrderDetailComponent
  - [x] Header: trackingCode, status badge, priority, client info
  - [x] Tabs or sections:
    - [x] Info general (diagnosis, dates, warranty, location)
    - [x] Tasks (checklist with progress)
    - [x] Materials (table with costs, supplier)
    - [x] Notes (internal + public)
  - [x] Actions: change status, assign technicians, add note, add material, add task
- [x] WorkOrderFormComponent (create/edit dialog)
  - [x] Client selector (autocomplete)
  - [x] Service type selector
  - [x] Priority selector
  - [x] Location selector (workshop/client)
  - [x] Scheduled date
  - [x] Diagnosis (optional)
- [x] StatusTransitionComponent
  - [x] Visual flow: pending -> assigned -> in_progress -> completed -> delivered
  - [x] Only valid transitions shown as buttons
  - [x] Confirmation dialog for cancel
- [x] TechnicianAssignmentComponent (dialog multi-select)
- [x] AddNoteDialogComponent
- [x] AddMaterialDialogComponent
- [x] AddTaskDialogComponent

### 10. `features/payments/` — Pagos

- [x] PaymentsListComponent
  - [x] DataTable: amount, method, status, provider, workOrder trackingCode, paidAt, createdAt
  - [x] Filters: status, method
  - [x] Server-side sorting + pagination
  - [x] Approve button for pending payments
- [ ] PaymentFormComponent — No implementado (pagos se crean desde work order detail)

### 11. `features/expenses/` — Gastos

- [x] ExpensesListComponent
  - [x] DataTable: description, amount, category, date, isRecurring, createdAt
  - [x] Filters: category
  - [x] Server-side sorting + pagination
- [x] ExpenseFormComponent
  - [x] Category selector (enum), amount, date, description, isRecurring
  - [x] Notes (optional)

### 12. `features/billing/` — Facturacion

- [x] InvoicesListComponent
  - [x] DataTable: invoiceNumber, invoiceType (A/B/C), status, clientName, total, createdAt
  - [x] Filters: status, type, client name (accent-insensitive)
- [x] InvoiceDetailComponent
  - [x] Full invoice data (number, type, concept, client info, totals)
  - [x] CAE info (for issued invoices)
  - [x] Actions: issue (draft → issued), cancel (issued → cancelled), download PDF
- [x] InvoiceFormComponent (create draft)
  - [x] Invoice type selector (A, B, C)
  - [x] Client autocomplete (server-side search with unaccent)
  - [x] Work order autocomplete (server-side search with unaccent)
  - [x] Auto-fill client data on select (CUIT, address, IVA condition)
  - [x] Subtotal, IVA, total
- [x] BillingService (CRUD + issue + cancel + downloadPdf)
- [x] Invoice interfaces (entity, filters, enums)
- [x] Status badge for invoiceStatus and invoiceType
- [x] i18n keys (es.json + en.json, ~45 keys)

### 13. `features/reports/` — Reportes

- [x] ReportsDashboardComponent
  - [x] Period selector (daily, weekly, monthly, yearly, custom range)
  - [x] KPI summary cards
- [x] IncomeChartComponent (line chart, monthly trend)
- [x] ExpensesChartComponent (bar chart by category)
- [ ] ProfitChartComponent (income - expenses - materials)
- [x] ServicesRankingComponent (top services table + chart)
- [x] TechnicianRankingComponent (leaderboard: completed, avg time, revenue)
- [ ] TechnicianDetailComponent (individual performance)
- [ ] ClientReportComponent (client history: orders, payments, KPIs)
- [ ] ExportButtons (PDF download for budget/receipt)

### 14. `features/notifications/` — Notificaciones

- [x] NotificationsListComponent
  - [x] List with type icon, title, message, timestamp
  - [x] Unread indicator
  - [x] Mark as read / mark all as read
- [ ] NotificationBellComponent (topbar badge with unread count)
- [x] WebSocketService
  - [x] Connect with JWT token
  - [x] Listen for new notifications
  - [x] Update unread count in real-time
  - [x] Reconnect on disconnect

### 15. `features/settings/` — Configuracion

- [ ] BusinessSettingsComponent (multi-tenant) — No implementado
- [ ] ProfileSettingsComponent — No implementado
- [x] ThemeService
  - [x] Light/dark mode toggle
  - [x] Persist in localStorage + API

### 16. `features/technician/` — Vista Tecnico

- [x] TechWorkOrdersComponent (my assigned orders)
  - [x] Card-based layout (not table)
  - [x] Each card shows:
    - [x] Tracking code
    - [x] Client name
    - [x] Service type
    - [x] Status badge
    - [x] Urgency indicator (days remaining + color)
    - [x] Progress bar (tasks completed / total)
    - [x] Scheduled date
  - [x] Filters: status, urgency
  - [x] Sort by: urgency (most urgent first)
- [x] TechWorkOrderDetailComponent
  - [x] Tasks checklist (mark complete)
  - [x] Add materials used
  - [x] Add notes
  - [x] View diagnosis
  - [x] Status transition (in_progress -> completed)
- [x] UrgencyColorCoding:
  - [x] Red (#DC2626): overdue or due today
  - [x] Yellow (#D97706): 1-3 days remaining
  - [x] Green (#059669): 4+ days remaining
  - [x] Gray (#6B7280): no date set

### 17. `features/portal/` — Portal Publico

- [x] PortalTrackingComponent (no auth required)
  - [x] Input: tracking code (manual input or from URL `/track/:code`)
  - [x] Auto-fetch on URL param
- [x] PortalSearchComponent (form with input + track button)
- [x] PortalResultComponent (fetch + layout with httpResource)
  - [x] Status timeline (vertical, visual)
    - [x] Completed steps: green with checkmark
    - [x] Current step: blue with pulse animation
    - [x] Pending steps: gray
    - [x] Cancelled: red with X
    - [x] Postponed: orange
  - [x] Info card (service type, client, location, dates, diagnosis)
  - [x] Tasks summary (progress bar + checklist)
  - [x] Public notes (diagnosis, issue, observation — no internal)
  - [x] Payment summary (total paid, status, installments)
  - [x] Error state (404 friendly message + retry)
- [x] PortalStatusTimelineComponent (visual vertical timeline)
- [x] PortalTasksComponent (progress bar + task checklist)
- [x] PortalNotesComponent (notes with type icon + date)
- [x] PortalPaymentSummaryComponent (total + status + installments)
- [x] PortalService (track by code)
- [x] Portal interfaces (PortalResponse, PortalTask, PortalNote, PortalPaymentSummary)
- [x] i18n (es.json + en.json, ~40 keys)
- [x] SSR compatible (RenderMode.Server configured in app.routes.server.ts)

### 18. PWA Configuration

- [x] Service worker setup (`ng add @angular/pwa`)
- [x] SSR + PWA interaction: primer request es SSR/SSG, siguientes son CSR via service worker
- [x] Offline support (cache API responses con ngsw-config.json data groups)
- [x] Install prompt (add to home screen)
- [x] App manifest (name, icons, theme color)
- [ ] Push notifications setup (future)

### 19. i18n

- [x] Implementado con approach custom (JSON + TranslatePipe + TranslationService)
- [x] Spanish (`public/i18n/es.json`) — default, completo
- [x] English (`public/i18n/en.json`) — completo
- [x] Language switcher in header
- [x] Persist locale in localStorage
- [ ] `@angular/localize` — No implementado (se usó approach custom)

### 20. Testing

- [ ] Component unit tests (Karma/Jest)
- [ ] Service unit tests (mock HTTP)
- [ ] E2E tests (Cypress or Playwright)
- [ ] Accessibility tests (axe-core)

### 21. `features/landing/` — Landing Page (SSG/Prerender)

- [x] LandingComponent (orquestador con 6 sub-componentes, prerenderizada en build time)
  - [x] Hero section: nombre del sistema, tagline, CTA a login, mockup SVG inline
  - [x] Features section: 6 tarjetas con iconos mostrando funcionalidades clave
    - [x] Gestion de ordenes de trabajo
    - [x] Tracking publico para clientes
    - [x] Control de pagos y facturacion
    - [x] Dashboard con KPIs y reportes
    - [x] Multi-tenant (configurable por negocio)
    - [x] Notificaciones en tiempo real
  - [x] How it works: 4 pasos con linea conectora (1. Crear orden → 2. Asignar tecnico → 3. Cliente trackea → 4. Cobrar)
  - [x] CTA final: boton de login
  - [x] Footer con info de contacto
  - [x] Todo en Tailwind CSS, responsive mobile-first
  - [x] Dark/light mode (ThemeService)
  - [x] SEO meta tags (title, description, og:title, og:description, og:type)
  - [x] SSR: contenido visible sin JavaScript (RenderMode.Prerender)
  - [x] i18n (es.json + en.json, ~40 keys landing.*)

### 22. `features/pending-items/` — Trabajo Pendiente

- [x] Interfaces en core/models/pending-item.interfaces.ts
- [x] Servicio en core/services/pending-items.service.ts
- [x] PendingItemsListComponent (DataTable con sort, pagination, filtros: status, type, priority, assignedTo)
- [x] PendingItemFormComponent (dialog crear/editar)
- [x] Ruta /admin/pending-items
- [x] Sidebar nav item
- [x] Dashboard widget (muestra top 5 pendientes por dueDate)

### 23. `features/inquiries/` — Consultas

- [x] Interfaces en core/models/inquiry.interfaces.ts (Inquiry, enums, DTOs, filters)
- [x] Servicio en core/services/inquiries.service.ts (CRUD + contact + review + convert)
- [x] InquiriesListComponent (DataTable con sort, pagination, badges de status/source)
- [x] InquiryFormComponent (dialog crear/editar)
- [x] InquiryDetailComponent (detalle con workflow de estados: new → contacted → reviewed → approved/rejected → converted)
- [x] InquiryContactFormComponent (técnico carga resultado de llamada)
- [x] Rutas /admin/inquiries + /admin/inquiries/:id
- [x] Sidebar nav item con icono help
- [x] i18n completo (es.json + en.json)

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
pnpm sync:types          # Genera interfaces desde OpenAPI spec

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
