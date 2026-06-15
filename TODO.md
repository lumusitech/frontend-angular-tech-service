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

- [ ] Instalar @nestjs/schedule
- [ ] Crear módulo pending-items:
  - [ ] Entity PendingItem (title, description, dueDate, type, priority, status, referenceType, referenceId, assignedToId, createdById)
  - [ ] Enums: PendingItemType, PendingItemPriority, PendingItemStatus
  - [ ] DTOs: CreatePendingItemDto, UpdatePendingItemDto, FilterPendingItemDto
  - [ ] Service: CRUD + validación por rol (technician solo de sus órdenes)
  - [ ] Controller: endpoints REST con guards
  - [ ] Cron job diario (8:00 AM) para notificar pendientes próximos/vencidos
- [ ] Nuevos tipos de notificación: pending_item.created, pending_item.due_today, pending_item.overdue
- [ ] Tests unitarios

### Backend: inquiries (módulo nuevo)

- [ ] Crear módulo inquiries:
  - [ ] Entity Inquiry (clientName, clientPhone, clientEmail, description, source, status, priority, assignedToId, createdById, technicianNotes, estimatedCost, recommendation, adminDecision, workOrderId)
  - [ ] Enums: InquirySource, InquiryStatus, InquiryRecommendation, InquiryDecision
  - [ ] DTOs: CreateInquiryDto, UpdateInquiryDto, FilterInquiryDto, ContactInquiryDto
  - [ ] Service: CRUD + workflow de estados + lógica de convert (crear Work Order)
  - [ ] Controller: endpoints REST con guards
- [ ] Nuevos tipos de notificación: inquiry.created, inquiry.assigned, inquiry.contacted, inquiry.reviewed
- [ ] Tests unitarios

### Frontend: pending-items

- [ ] Interfaces en core/models/pending-item.interfaces.ts
- [ ] Servicio en core/services/pending-items.service.ts
- [ ] PendingItemsListComponent (lista con filtros: status, type, priority, assignedTo)
- [ ] PendingItemFormComponent (dialog crear/editar)

### Frontend: inquiries

- [ ] Interfaces en core/models/inquiry.interfaces.ts
- [ ] Servicio en core/services/inquiries.service.ts
- [ ] InquiriesListComponent (lista con filtros: status, assignedTo, source)
- [ ] InquiryFormComponent (dialog crear consulta)
- [ ] InquiryDetailComponent (detalle con workflow de estados)
- [ ] InquiryContactFormComponent (técnico carga resultado de llamada)

### Frontend: Dashboard unificado

- [ ] PendingWorkWidgetComponent (muestra pendientes vencidos/hoy/próximos + consultas pendientes)
- [ ] Integración en dashboard.component.ts
- [ ] Nuevo item en sidebar: "Trabajo Pendiente" (/admin/pending-work)
- [ ] Badge en header: count de items vencidos + consultas nuevas

## Documentación por actualizar

- [ ] ROADMAP.md: marcar ~80+ items como completados
- [ ] ROADMAP.md: agregar componentes no documentados (PageHeader, ErrorState, TrackingCode, StatusLabelPipe, StatusClassPipe, SafeHtmlPipe, CurrencyArsPipe, dashboard.service, loading.service)
- [ ] ROADMAP.md: agregar secciones 22-23 (pending-items, inquiries)
- [ ] README.md: corregir tabla de rutas (/clients → /admin/clients)
- [ ] README.md: marcar PWA/i18n como "planificado, no implementado"

## Notas técnicas importantes

- httpResource usa `parse` en el 2do argumento, NO `transform` (no existe)
- Sort server-side: sortBy + order en params del httpResource
- matSortDisableClear en todas las tablas
- Loading spinner: resource.status() === 'loading' && !hasValue() (no isLoading())
- ConfirmDialog solo para acciones destructivas (cancelar)
- ConfirmDialog se importa en TS (no en template) para MatDialog.open()
