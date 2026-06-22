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

| #   | Título                      | Branch               | Estado |
| --- | --------------------------- | -------------------- | ------ |
| 56  | feat: billing module        | feat/billing-module  | Open   |

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

## Documentación actualizada

- [x] ROADMAP.md: ~80+ items marcados como completados
- [x] ROADMAP.md: secciones pending-items, inquiries, notifications, reports, technician, billing
- [x] README.md: tabla de rutas corregida (/admin/*)
- [x] README.md: i18n marcado como implementado (custom JSON)
- [x] TODO.md: este archivo

## Próximos pasos (frontend)

- Completar Portal tracking (reemplazar stub)
- Agregar Landing Page (SSG/prerender)
- Configurar PWA (service worker, offline, install prompt)
- Technician View: BottomNavComponent para mobile
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
