# TODO — Frontend Angular Tech Service

## Estado actual

- Angular 22, Signals-only, Tailwind CSS 4, Angular Material 22
- Backend API: httpResource para queries, HttpClient para mutations
- Backend response wrapper: { statusCode, data, timestamp } → httpResource usa `parse` en 2do arg
- Loading spinner global con debounce 300ms
- SSR híbrido: landing/portal → SSR, admin/tech → CSR
- pnpm como gestor de paquetes
- socket.io-client para WebSocket real-time

## PRs Abiertos (pendientes de merge)

| #   | Título                                   | Branch                                    | Estado |
| --- | ---------------------------------------- | ----------------------------------------- | ------ |
| 28  | Locale es-AR + optional chaining         | fix/locale-and-payments-optional-chaining | Open   |
| 29  | Sortable tables + createdAt              | feat/sortable-tables-createdat            | Open   |
| 30  | Loading spinner inteligente + preloading | perf/loading-spinner-preloading           | Open   |
| 31  | Debounce 300ms loading spinner           | perf/loading-spinner-debounce             | Open   |

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

## Documentación actualizada

- [x] ROADMAP.md: ~80+ items marcados como completados
- [x] ROADMAP.md: secciones pending-items, inquiries, notifications, reports, technician
- [x] README.md: tabla de rutas corregida (/admin/*)
- [x] README.md: i18n marcado como implementado (custom JSON)
- [x] TODO.md: este archivo

## Próximos pasos (frontend)

- Completar Billing (facturas CRUD + PDFs)
- Completar Portal tracking (reemplazar stub)
- Agregar Landing Page (SSG/prerender)
- Configurar PWA (service worker, offline, install prompt)
- Technician View: BottomNavComponent para mobile
- Tests unitarios y E2E
