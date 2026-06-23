# TODO — Frontend Angular Tech Service

## Estado actual

- Angular 22, Signals-only, Tailwind CSS 4, Angular Material 22
- Backend API: httpResource para queries, HttpClient para mutations
- Backend response wrapper: { statusCode, data, timestamp } → httpResource usa `parse` en 2do arg
- Loading spinner global con debounce 300ms
- SSR híbrido: landing/portal → SSR, admin/tech → CSR
- pnpm como gestor de paquetes
- socket.io-client para WebSocket real-time
- Billing module completo (CRUD + PDF + workflow de estados)

## PRs Abiertos (pendientes de merge)

Ninguno — todos los PRs mergeados.

## Feature completada: Billing

### Frontend: billing
- [x] Interfaces en core/models/invoice.interfaces.ts
- [x] Servicio en core/services/billing.service.ts
- [x] InvoicesListComponent (tabla con filtros: status, tipo, cliente)
- [x] InvoiceFormComponent (dialog crear factura con autocomplete signals + httpResource)
- [x] InvoiceDetailComponent (detalle con workflow de estados: draft → issued → cancelled)
- [x] PDF download (blob response)
- [x] Status badge extendido para invoiceStatus e invoiceType
- [x] ConfirmDialogComponent soporta titleKey/messageKey para i18n
- [x] i18n completo (es.json + en.json, ~45 keys)
- [x] Ruta /admin/billing con children (list + :id detail)
- [x] Sidebar item "Facturación" ya existente

## Feature completada: Pending Items + Inquiries + Dashboard unificado

### Backend (completado via PRs separados)
- [x] pending-items module
- [x] inquiries module
- [x] notifications seed
- [x] technician task completion

### Frontend: pending-items
- [x] Interfaces en core/models/pending-item.interfaces.ts
- [x] Servicio en core/services/pending-items.service.ts
- [x] PendingItemsListComponent (lista con filtros: status, type, priority, assignedTo)
- [x] PendingItemFormComponent (dialog crear/editar)

### Frontend: inquiries
- [x] Interfaces en core/models/inquiry.interfaces.ts
- [x] Servicio en core/services/inquiries.service.ts
- [x] InquiriesListComponent (lista con filtros: status, assignedTo, source)
- [x] InquiryFormComponent (dialog crear consulta)
- [x] InquiryDetailComponent (detalle con workflow de estados)
- [x] InquiryContactFormComponent (técnico carga resultado de llamada)

### Frontend: Dashboard unificado
- [x] PendingItems widget en dashboard
- [x] Inquiries widget en dashboard (top 5 consultas nuevas)
- [x] Sidebar item "Trabajo Pendiente" (/admin/pending-items)
- [x] Sidebar item "Consultas" (/admin/inquiries)
- [x] Badge en header con count de notificaciones (WebSocket real-time)

### Frontend: Notifications
- [x] NotificationsListComponent (lista paginada con filtros)
- [x] NotificationsService (HTTP + unreadCount signal)
- [x] WebsocketService (Socket.IO con JWT auth)
- [x] Badge en header con count real
- [x] Highlight pulse animation al hacer click en notificación
- [x] Ruta /admin/notifications

### Frontend: Reports
- [x] ReportsDashboardComponent (selector de período + KPI cards)
- [x] IncomeChartComponent (line chart)
- [x] ExpensesChartComponent (bar chart)
- [x] ServicesRankingComponent (tabla + barras)
- [x] TechnicianRankingComponent (leaderboard)
- [x] ReportsService con 8 endpoints + 2 PDFs
- [x] CurrencyArsPipe para formato ARS consistente

### Frontend: Technician View
- [x] TechLayoutComponent (header mínimo, mobile-first)
- [x] TechWorkOrdersComponent (cards con urgencia, filtros)
- [x] TechWorkOrderDetailComponent (tasks checklist, materials, notes, status transitions)
- [x] UrgencyIndicatorComponent (colores por días restantes)
- [x] Rutas /tech + /tech/:id

### Frontend: UI Fixes
- [x] mat-select: [(value)] → [(ngModel)] + standalone
- [x] textarea: [value] → [(ngModel)] + standalone
- [x] MatDatepicker para todos los campos de fecha
- [x] DateAdapter provider global (app.config.ts)
- [x] Clickable rows en todas las listas CRUD
- [x] PageHeaderComponent con ng-content para botones
- [x] CurrencyArsPipe en reports para formato ARS consistente

### Frontend: i18n
- [x] 56 keys faltantes en formularios agregadas
- [x] workOrders.actions.* (botones de transición)
- [x] workOrders.detail.*, tasks.*, materials.*, notes.*, locations.*, technicians.*
- [x] notifications.* keys
- [x] pendingItems.types.*, priorities.*, statuses.*
- [x] reports.* keys
- [x] technician.* keys
- [x] billing.* keys (~45 keys)

## Feature completada: Landing Page (SSG/Prerender)

### Frontend: landing
- [x] LandingComponent (orquestador con 6 sub-componentes)
- [x] LandingHeaderComponent (logo, nav, dark mode toggle, login button)
- [x] LandingHeroComponent (título, subtítulo, CTA, mockup SVG inline del dashboard)
- [x] LandingFeaturesComponent (6 cards: work orders, tracking, payments, dashboard, multi-tenant, notifications)
- [x] LandingHowItWorksComponent (4 pasos con línea conectora)
- [x] LandingCtaComponent (CTA final con botón login)
- [x] LandingFooterComponent (logo, links, copyright)
- [x] Ruta '' → LandingComponent (reemplaza redirect a /login)
- [x] SSR: RenderMode.Prerender (HTML estático en build time)
- [x] i18n completo (es.json + en.json, ~40 keys landing.*)
- [x] Dark/light mode (ThemeService)
- [x] SEO: OG meta tags en index.html
- [x] Build exitoso (prerendered HTML)

## Feature completada: Portal Tracking

### Frontend: portal
- [x] Interfaces en core/models/portal.interfaces.ts (PortalResponse, PortalTask, PortalNote, PortalPaymentSummary)
- [x] Servicio en core/services/portal.service.ts (track by code)
- [x] PortalTrackingComponent (contenedor orquestador: search vs result)
- [x] PortalSearchComponent (form con input + botón rastrear)
- [x] PortalResultComponent (httpResource fetch + layout de resultados)
- [x] PortalStatusTimelineComponent (timeline vertical: pending → assigned → in_progress → completed → delivered)
- [x] PortalTasksComponent (progress bar + checklist de tareas)
- [x] PortalNotesComponent (notas públicas con icono por tipo)
- [x] PortalPaymentSummaryComponent (total pagado + estado + cuotas)
- [x] Rutas /track y /track/:code (SSR RenderMode.Server)
- [x] i18n completo (es.json + en.json, ~40 keys portal.*)
- [x] Build exitoso (browser + server bundles)

### Backend: portal controller
- [x] Agregado @ApiOkResponse({ type: PortalResponseDto }) para codegen de Swagger

## Documentación actualizada

- [x] ROADMAP.md: ~80+ items marcados como completados
- [x] ROADMAP.md: secciones pending-items, inquiries, notifications, reports, technician, billing, portal, pwa
- [x] README.md: tabla de rutas corregida (/admin/*), billing ya no es placeholder
- [x] README.md: i18n path corregido a `public/i18n/*.json`
- [x] README.md: sección PWA actualizada como implementada
- [x] ROADMAP.md: bottom nav de tech layout marcado como completado
- [x] TODO.md: este archivo

## Feature completada: PWA

### Frontend: PWA
- [x] `ng add @angular/pwa` (service worker + manifest + iconos)
- [x] `ngsw-config.json` con cacheo de assets, i18n JSON y API `/api/**` (networkFirst)
- [x] `manifest.webmanifest` con nombre, descripción, iconos, theme/background color
- [x] Meta tags `theme-color` y `apple-mobile-web-app-*` en `index.html`
- [x] `PwaService` con listener de `beforeinstallprompt` y `appinstalled`
- [x] `InstallPromptComponent` (banner flotante con i18n)
- [x] Ajuste de budgets de bundle en `angular.json`
- [x] Build de producción exitoso con `ngsw-worker.js` y `ngsw.json`

## Feature completada: BottomNav para vista técnico

### Frontend: technician bottom nav
- [x] `BottomNavComponent` con 3 tabs: Órdenes, Notificaciones, Perfil
- [x] Navegación manual con detección de tab activo por URL
- [x] Badge de notificaciones no leídas en tab correspondiente
- [x] Integrado en `TechLayoutComponent` con padding inferior para el contenido
- [x] Rutas `/tech/notifications` y `/tech/settings` agregadas
- [x] i18n keys `technician.nav.*` en `es.json` y `en.json`
- [x] Build de producción exitoso

## Próximos pasos priorizados (por valor al proyecto)

### 1. BusinessSettingsComponent — Multi-tenant (diferenciador comercial)

**Valor:** Permite vender el sistema a otros negocios con su propia marca. Es el feature que diferencia "un sistema más" de "una plataforma multi-tenant".

**Qué:** Configuración del negocio: nombre, logo, colores primarios/secundarios. Los colores se aplican como CSS variables en todo el sistema.

**Ruta:** `/admin/settings` (expandir el componente existente)

**Archivos:**
- Modificar: `src/app/features/settings/settings.component.ts` — agregar sección "Negocio"
- Crear: `src/app/core/services/business-settings.service.ts` (si no existe endpoint en backend)
- Modificar: `public/i18n/es.json` + `en.json` — keys `settings.business.*`

**Patrón:** Formulario con campos (name, logo URL, primaryColor, secondaryColor). Guardar con HttpClient. Aplicar colores como CSS variables via `document.documentElement.style.setProperty()`.

---

### 2. ClientDetailComponent — Completar CRUD de clientes

**Valor:** Cierra el flujo completo de gestión de clientes. Sin esto, solo se puede listar y crear, pero no ver el historial de un cliente.

**Qué:** Vista de detalle con datos del cliente, historial de órdenes, pagos y KPIs resumidos.

**Ruta:** `/admin/clients/:id`

**Archivos:**
- Crear: `src/app/features/clients/client-detail.component.ts`
- Modificar: `src/app/app.routes.ts` — agregar ruta `:id` como child de `clients`
- Modificar: `src/app/features/clients/clients-list.component.ts` — link a detalle en filas
- Modificar: `public/i18n/es.json` + `en.json` — keys `clients.detail.*`

**Patrón:** `httpResource` con ID desde `ActivatedRoute`. Layout con cards (Tailwind) como en `work-order-detail.component.ts`. Secciones: datos del cliente, órdenes asociadas (tabla), pagos, KPIs.

---

### 3. Push Notifications — PWA real-time en mobile

**Valor:** Feature diferenciador para PWA. Las notificaciones push llegan aunque la app esté cerrada en el celular. Sin costo de infraestructura ($0).

**Qué:** Suscripción a push notifications al hacer login. El backend envía push cuando ocurren eventos (nueva orden asignada, cambio de estado, vencimiento de pendiente).

**Ruta:** Se ejecuta automáticamente (service worker background)

**Frontend (archivos):**
- Modificar: `src/app/core/services/pwa.service.ts` — agregar lógica de suscripción push
- Crear: `src/app/core/services/push-notification.service.ts` — suscripción, gestión de permisos
- Modificar: `src/app/app.config.ts` — registrar service worker con VAPID key
- Modificar: `public/i18n/es.json` + `en.json` — keys `push.*`

**Backend (archivos):**
- Crear módulo `push-notifications/` en backend
- Entity `PushSubscription` (endpoint, keys, userId)
- Endpoint `POST /push/subscribe` + `POST /push/unsubscribe`
- Lógica de envío con `web-push` library cuando se emita notificación in-app

**Dependencias:** `web-push` en backend (npm package). VAPID keys generadas localmente (gratis).

**Costo:** $0 — Web Push es gratis, no necesita servicio externo.

---

### 4. NotificationBellComponent — Badge en header

**Valor:** UX core. Conecta con push notifications y con la lista de notificaciones existente. Muestra al admin que hay actividad sin abrir la página de notificaciones.

**Qué:** Icono de campana en el header de admin con badge rojo de notificaciones no leídas. Click lleva a `/admin/notifications`.

**Ruta:** En el header de admin-layout

**Archivos:**
- Crear: `src/app/shared/components/notification-bell/notification-bell.component.ts`
- Modificar: `src/app/layouts/admin-layout/admin-layout.component.ts` — agregar componente en header
- Modificar: `public/i18n/es.json` + `en.json` — keys `notifications.bell.*`

**Patrón:** Usar `NotificationsService.unreadCount()` signal. MatIconModule con `notifications`. Badge con count. Link a `/admin/notifications`. SSR-safe si es necesario.

---

### 5. ProfileSettingsComponent — Perfil de usuario

**Valor:** Completitud de gestión de usuarios. El admin puede editar su perfil, el técnico puede ver sus datos.

**Qué:** Formulario para editar nombre, email, contraseña del usuario logueado.

**Ruta:** `/admin/profile` o integrar en `/admin/settings`

**Archivos:**
- Crear: `src/app/features/settings/profile-settings.component.ts` (o integrar en settings)
- Modificar: `src/app/app.routes.ts` — agregar ruta si es componente separado
- Modificar: `public/i18n/es.json` + `en.json` — keys `settings.profile.*`

---

### 6. PortalLayoutComponent — Layout dedicado para portal

**Valor:** Mejor organización del portal público. Separa el layout del contenido. Mejor SEO y reutilización.

**Qué:** Layout minimal para rutas `/track` con logo del negocio (desde API) y sin sidebar.

**Ruta:** Se usa internamente en rutas `/track`

**Archivos:**
- Crear: `src/app/layouts/portal-layout/portal-layout.component.ts`
- Modificar: `src/app/app.routes.ts` — envolver rutas `/track` con PortalLayout
- Modificar: `public/i18n/es.json` + `en.json` — keys `portal.layout.*`

**Patrón:** Header minimal con logo + nombre. Sin sidebar. `router-outlet`. `min-h-svh`. Dark mode. Referencia: `tech-layout.component.ts`.

---

### 7. Reportes avanzados — Business intelligence

**Valor:** Da más herramientas de decisión al dueño del negocio. Los reportes son el cierre del ciclo operativo → financiero → estratégico.

**Componentes:**

| Componente | Qué muestra | Ruta |
|-----------|-------------|------|
| ProfitChartComponent | Ganancia neta (income - expenses - materials) | widget en dashboard |
| TechnicianDetailComponent | Performance individual de un técnico | `/admin/reports/technicians/:id` |
| ClientReportComponent | Historial completo de un cliente | `/admin/reports/clients/:id` |
| ExportButtons | Descarga de PDFs (budget, receipt) | botones en reports |

**Archivos por componente:**
- Crear: `src/app/features/reports/{component}.ts`
- Modificar: `src/app/app.routes.ts` — rutas para detail components
- Modificar: `src/app/features/reports/reports-dashboard.component.ts` — agregar ProfitChart

---

### 8. RelativeDatePipe + RoleDirective — UX polish

**Valor:** Mejor experiencia de usuario. Fechas más legibles, elementos visibles solo según rol.

#### 8a. RelativeDatePipe
- Crear: `src/app/shared/pipes/relative-date.pipe.ts`
- Formato: "hace 2 días", "en 3 días", "hace 1 hora"
- Usar en listas (createdAt, updatedAt, dueDate)

#### 8b. RoleDirective
- Crear: `src/app/shared/directives/role.directive.ts`
- `@Input() appRole: 'admin' | 'technician'`
- Mostrar/ocultar según `AuthService.user()?.role`

---

### 9. Tests — Calidad y confianza

**Valor:** Permite deploy con confianza. Sin tests, cada cambio es un riesgo. Pero se hace DESPUÉS de tener la base completa.

**Estado actual:** Solo `src/app/app.spec.ts` — cobertura ~0%.

**Stack:** Vitest (configurado), Playwright (E2E)

**Orden:** Service tests → Component tests → E2E tests

---

## Checklist rápido de features completadas

- [x] Auth (login, guards, interceptors)
- [x] Dashboard (KPIs, charts, widgets, drag-drop)
- [x] Clients CRUD (list, form, search, pagination)
- [x] Suppliers CRUD
- [x] Service Types CRUD
- [x] Work Orders (list, detail, tasks, materials, notes, status transitions, technician assignment)
- [x] Payments (list, filters, approve)
- [x] Expenses CRUD
- [x] Billing (invoices CRUD, issue, cancel, PDF)
- [x] Reports (dashboard, income, expenses, services ranking, technician ranking)
- [x] Notifications (list, mark read, WebSocket, unreadCount)
- [x] Pending Items (list, form, dashboard widget)
- [x] Inquiries (list, detail, contact, review, convert)
- [x] Landing Page (SSG/prerender, 6 sub-components)
- [x] Portal Tracking (search, result, timeline, tasks, notes, payments)
- [x] PWA (service worker, manifest, install prompt)
- [x] Technician View (cards, urgency, detail, bottom nav)
- [x] i18n (es + en, ~300+ keys)

## Archivos de referencia útiles

| Archivo | Qué muestra |
|---------|-------------|
| `src/app/app.routes.ts` | Todas las rutas definidas |
| `src/app/layouts/admin-layout/admin-layout.component.ts` | Sidebar + header + content |
| `src/app/layouts/tech-layout/tech-layout.component.ts` | Layout simple con BottomNav |
| `src/app/features/work-orders/work-order-detail.component.ts` | Detalle con tabs y acciones |
| `src/app/features/clients/clients-list.component.ts` | CRUD list con MatTable |
| `src/app/features/billing/invoice-form.component.ts` | Form con autocomplete signals |
| `src/app/core/services/notifications.service.ts` | Service con signals + WebSocket |
| `src/app/shared/components/bottom-nav/bottom-nav.component.ts` | Componente con detección de ruta activa |
| `src/app/core/services/pwa.service.ts` | Service PWA con isPlatformBrowser |
