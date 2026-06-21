# TODO — Frontend Angular Tech Service

## Estado actual

- Angular 22, Signals-only, Tailwind CSS 4, Angular Material 22
- Backend API: httpResource para queries, HttpClient para mutations
- Backend response wrapper: { statusCode, data, timestamp } → httpResource usa `parse` en 2do arg
- Loading spinner global con debounce 300ms
- SSR híbrido: landing/portal → SSR, admin/tech → CSR

## PRs Abiertos (pendientes de merge)

| #   | Título                                   | Branch                                    | Estado |
| --- | ---------------------------------------- | ----------------------------------------- | ------ |
| 28  | Locale es-AR + optional chaining         | fix/locale-and-payments-optional-chaining | Open   |
| 29  | Sortable tables + createdAt              | feat/sortable-tables-createdat            | Open   |
| 30  | Loading spinner inteligente + preloading | perf/loading-spinner-preloading           | Open   |
| 31  | Debounce 300ms loading spinner           | perf/loading-spinner-debounce             | Open   |

## Próxima Feature: Pending Items + Inquiries + Dashboard unificado

### Backend: pending-items (módulo nuevo)

- [x] Instalar @nestjs/schedule
- [x] Crear módulo pending-items:
  - [x] Entity PendingItem (title, description, dueDate, type, priority, status, referenceType, referenceId, assignedToId, createdById)
  - [x] Enums: PendingItemType, PendingItemPriority, PendingItemStatus
  - [x] DTOs: CreatePendingItemDto, UpdatePendingItemDto, FilterPendingItemDto
  - [x] Service: CRUD + validación por rol (technician solo de sus órdenes)
  - [x] Controller: endpoints REST con guards
  - [x] Cron job diario (8:00 AM) para notificar pendientes próximos/vencidos
- [x] Nuevos tipos de notificación: pending_item.created, pending_item.due_today, pending_item.overdue
- [x] Tests unitarios

### Backend: inquiries (módulo nuevo)

- [x] Crear módulo inquiries:
  - [x] Entity Inquiry (clientName, clientPhone, clientEmail, description, source, status, priority, assignedToId, createdById, technicianNotes, estimatedCost, recommendation, adminDecision, workOrderId)
  - [x] Enums: InquirySource, InquiryStatus, InquiryRecommendation, InquiryDecision
  - [x] DTOs: CreateInquiryDto, UpdateInquiryDto, FilterInquiryDto, ContactInquiryDto
  - [x] Service: CRUD + workflow de estados + lógica de convert (crear Work Order)
  - [x] Controller: endpoints REST con guards
- [x] Nuevos tipos de notificación: inquiry.created, inquiry.assigned, inquiry.contacted, inquiry.reviewed
- [x] Tests unitarios

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

- [ ] PendingWorkWidgetComponent (muestra pendientes vencidos/hoy/próximos + consultas pendientes)
- [x] Integración en dashboard.component.ts (pending items widget)
- [x] Nuevo item en sidebar: "Trabajo Pendiente" (/admin/pending-items)
- [ ] Badge en header: count de items vencidos + consultas nuevas

## Documentación por actualizar

- [x] ROADMAP.md: marcar ~80+ items como completados
- [x] ROADMAP.md: agregar componentes no documentados (PageHeader, ErrorState, TrackingCode, StatusLabelPipe, StatusClassPipe, SafeHtmlPipe, CurrencyArsPipe, dashboard.service, loading.service)
- [x] ROADMAP.md: agregar secciones 22-23 (pending-items, inquiries)
- [ ] README.md: corregir tabla de rutas (/clients → /admin/clients)
- [ ] README.md: marcar PWA/i18n como "planificado, no implementado"

## Notas técnicas importantes

- httpResource usa `parse` en el 2do argumento, NO `transform` (no existe)
- Sort server-side: sortBy + order en params del httpResource
- matSortDisableClear en todas las tablas
- Loading spinner: resource.status() === 'loading' && !hasValue() (no isLoading())
- ConfirmDialog solo para acciones destructivas (cancelar)
- ConfirmDialog se importa en TS (no en template) para MatDialog.open()
