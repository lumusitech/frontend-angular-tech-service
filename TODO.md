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

## Próximos pasos (frontend)

- Tests unitarios y E2E

## Mejoras a futuro

### Seguridad
- [ ] CORS abierto (*) en WebSocket gateway
- [ ] Sin rate limiting (@nestjs/throttler)
- [ ] Sin Helmet para headers de seguridad
- [ ] Sin refresh tokens

### Arquitectura
- [ ] Sin validación de config en ConfigModule (fallas silenciosas en runtime)
- [ ] sortBy en paginación sin whitelist de columnas permitidas
- [ ] no-explicit-any: off en ESLint contradice la convención del proyecto
- [ ] Listener de notificaciones de 379 líneas, podría dividirse por dominio

### Testing
- [ ] Sin threshold mínimo de cobertura
- [ ] Controllers, guards, interceptors y filters sin unit tests

### Operaciones
- [ ] Sin health check endpoint (/health)
- [ ] Sin graceful shutdown (SIGTERM/SIGINT)
- [ ] Sin logging estructurado con requestId/userId
