# TODO — Frontend Angular Tech Service

> Este archivo es el punto de partida para cualquier IA o desarrollador.
> Contiene el contexto del proyecto, patrones clave y las tareas priorizadas.

## Contexto rápido

- **Stack:** Angular 22, Signals-only, Tailwind CSS 4, Angular Material 22, SSR híbrido, PWA
- **Backend:** NestJS 11 en `http://localhost:3000/api/` — Swagger: `http://localhost:3000/api/docs`
- **Auth:** JWT Bearer token, roles: `admin` (acceso total), `technician` (solo sus órdenes), `seller`
- **Respuestas API:** `{ statusCode, data, timestamp }` — httpResource usa `parse` en 2do arg
- **i18n:** Custom JSON en `public/i18n/es.json` + `public/i18n/en.json`, TranslatePipe
- **SSR:** Landing (`/`) prerender, Portal (`/track`) server-rendered, Admin/Tech/Seller client-rendered
- **Package manager:** pnpm
- **Colores de marca:** Primary `#1E40AF`, Secondary `#059669`, Danger `#DC2626`, Warning `#D97706`

## Patrones de código (MUY IMPORTANTE — seguir siempre)

```typescript
// Servicios: usar @Service() (no @Injectable)
import { Service, inject, signal } from '@angular/core';
@Service()
export class ClientsService { ... }

// Queries GET: httpResource (reactivo, auto-cancela, eager)
// ⚠️ EXCEPCIÓN vistas de detalle: usar Route Resolver (ver AGENTS.md)
readonly clientsResource = httpResource<PaginatedResponse<Client>>(
  () => `/api/clients?page=${this.page()}`,
);

// Mutations POST/PUT/DELETE: HttpClient + .subscribe()
this.clientsService.create(dto).subscribe({
  next: () => this.clientsResource.reload(),
  error: () => {},
  complete: () => this.loading.set(false)
});

// i18n en templates: TranslatePipe
{{ 'clients.title' | translate }}

// SSR safety: isPlatformBrowser para acceso a window/document
if (isPlatformBrowser(this.platformId)) { ... }
```

## Convenciones

- Componentes standalone con `@Component`
- Lazy loading con `loadComponent()`
- Rutas hijas con `children: [...]`
- Materiales usados: MatTable, MatDialog, MatAutocomplete, MatPaginator, MatSort, MatButtonToggle, MatIconModule, MatChipsModule, MatExpansionPanel, MatAccordion
- Forms: Signal Forms exclusivamente (`form()`, `FormField`). Prohibido `FormsModule`, `NgForm`, `[(ngModel)]`. El código legacy que usa template-driven está pendiente de migración.
- Sidebar: `src/app/layouts/admin-layout/admin-layout.component.ts` — agregar items ahí
- Bottom nav (mobile): `src/app/shared/components/admin-bottom-nav/` — agregar/editar tabs ahí
- Bottom nav pattern: mismo patrón en `bottom-nav.component.ts` (técnico), `admin-bottom-nav.component.ts` (admin mobile), `seller-bottom-nav.component.ts` (vendedor)

---

## Últimas features implementadas (06/08/2026)

### Fix: Conversión de consulta a orden de trabajo end-to-end (PR frontend #236, backend #142)

- **Bug corregido:** `convert()` en `inquiry-detail.component.ts` llamaba al backend con `clientId`/`serviceTypeId` vacíos (`convert(inquiry.id, '', '')`), y el backend solo marcaba `status=CONVERTED` con `workOrderId=null` — **nunca creaba la orden de trabajo**.
- **Backend:** Nuevo `ConvertInquiryDto` (clientId+serviceTypeId requeridos, técnicos/prioridad/ubicación/diagnóstico/dirección/fechas opcionales). `convertToWorkOrder(id, dto)` valida REVIEWED+APPROVED, delega en `WorkOrdersService.create()` (genera tracking code + emite `workorder.created`), persiste `status=CONVERTED` + `workOrderId` real, cierra pending items vinculados (`referenceType='inquiry'`) vía `PendingItemsService.completeForReference()`, y devuelve la inquiry recargada con la relación `workOrder`.
- **Frontend:** Nuevo `ConvertInquiryDialogComponent` con Signal Forms — toggle cliente **Nuevo cliente** (pre-rellenado desde la inquiry, editable, se crea vía `clientsService.create`) o **Cliente existente** (autocomplete), selección de tipo de servicio, prioridad, ubicación, diagnóstico y dirección pre-rellenados, fechas. `InquiriesService.convert(id, dto)` envía el DTO completo. i18n es/en. 10 tests Vitest.
- **Verificación:** 555 tests frontend PASS, `npx ng build` OK, E2E Playwright contra backend real (cliente + work order `TS-1S8XJ` creados, inquiry → `converted` con `workOrderId`). Backend: 432 tests PASS + curl verificado (400 con body vacío, 201 con conversión).

## Últimas features implementadas (02/08/2026)

### Feature: CRUD completo de materiales, rediseño UI/UX y corrección de totales
- **Backend:** DTO `UpdateWorkOrderMaterialDto`, hook `@AfterLoad()` en `WorkOrderMaterial` para cálculo de `totalCost` y parseo de tipos decimales, método `updateMaterial` en `WorkOrdersService`, y endpoint `@Patch(':id/materials/:materialId')` en `WorkOrdersController` con tests unitarios.
- **Frontend:** Diálogo unificado `AddMaterialDialogComponent` para alta y edición de materiales, rediseño de `MaterialsTabComponent` con botones de editar y eliminar, mejor tamaño y proporcionado de iconos de Material Icons sin clipping, y función `getMaterialsTotal` / `getItemTotal` defensiva en la vista de detalle.
- **i18n:** Traducciones completas en `es.json` y `en.json`.

### Feature: CRUD completo de tareas (Edición, Eliminación) y filtrado de técnicos

- **Edición y Eliminación de Tareas:**
  - `TasksTabComponent` y `TechWorkOrderDetailComponent` ahora permiten editar y eliminar **cualquier tarea** (tanto pendientes como hechas/completadas).
  - Al hacer clic en editar (icono `edit`), se abre `AddTaskDialogComponent` pre-completando título, descripción y técnico asignado.
  - Al hacer clic en eliminar (icono `delete`), se abre `ConfirmDialogComponent` para solicitar confirmación y llama a `DELETE /api/work-orders/:id/tasks/:taskId` emitiendo toasts de notificación.
- **Filtrado de Técnicos en Selector:**
  - El diálogo de tareas muestra preferentemente solo los técnicos previamente asignados a la orden de trabajo. Si la orden no tiene técnicos asignados, muestra la lista completa de técnicos disponibles.
- **Permisos en Backend:**
  - Endpoint `DELETE :id/tasks/:taskId` actualizado para dar acceso a administradores y técnicos asignados a la orden.

### Fix: Asignación de tareas a órdenes de trabajo, feedback de errores y sincronización en tiempo real

- **Causa raíz arreglada en Backend (NestJS):** La consulta `findOne()` en `WorkOrdersService` no incluía la relación `tasks: { assignedTo: true }`. Al crear o recargar una orden, las tareas retornaban `undefined` y no se mostraban en pantalla.
- **Feedback al usuario en `AddTaskDialogComponent`:** Inyectados `ToastService` y `TranslationService` para emitir toasts de éxito ("Tarea agregada con éxito") o error con el mensaje retornado por el backend.
- **Sincronización en tiempo real vía WebSockets:**
  - Actualizado `WebsocketService` para incrementar `workOrderRefreshKey` ante notificaciones de tipo `task` (`task.created`, `task.completed`).
  - Agregado `effect()` en `WorkOrderDetailComponent` que escucha `workOrderRefreshKey()` y recarga la orden automáticamente en pantalla para todos los usuarios conectados sin recargar la página.
  - Mejorado el badge del técnico asignado a cada tarea en `TasksTabComponent` con icono de usuario y píldora estilizada.

## Últimas features implementadas (01/08/2026)

### Fix: Visibilidad y estilos del ícono de filtro en modo mobile y desktop (`MobileFilterBarComponent`, PR #216 + Fix)

- En modo mobile, el botón de filtros usaba un color azul estático `#2563eb` y no aplicaba el estilo filled. Además, en desktop `display: contents` causaba que algunos `mat-form-field` no se renderizaran.
- Solución:
  - Reescrito con `display: flex` para correcta visualización en desktop y mobile.
  - Sin filtros activos: Estilo **outlined** en el color primario de marca (`var(--color-primary)` para borde, texto e ícono).
  - Con filtros activos: Estilo **filled** con fondo en color primario (`var(--color-primary)`), y texto e ícono en color blanco (`#ffffff`).

### Fix: Adaptador `LocalDateAdapter` para evitar desfasaje de fechas por husos horarios GMT (PR #214)

- Solucionado problema donde fechas como `2026-08-01` se parseaban como UTC medianoche y al convertirse a hora local (GMT-3) mostraban el día anterior (`2026-07-31`).
- `LocalDateAdapter` extiende `NativeDateAdapter` parseando cadenas `YYYY-MM-DD` y `DD/MM/YYYY` como hora local estricta.
- Registrado globalmente como `DateAdapter` en `app.config.ts`.
- `toLocalDateString()` helper implementado en `payment-form.component.ts` e `info-tab.component.ts`.
- 4 tests unitarios dedicados en `local-date.adapter.spec.ts`.

### Feat: Focus primario dinámico en buscador global (`GlobalSearchComponent`, PR #215)

- El borde/anillo del input de búsqueda en el header aplica la variable CSS `--color-primary` de la marca durante el estado focus.

### Feat: Swipe entre tabs y reordenamiento de acciones en detalle de orden mobile (PR #213)

- Soporte de gestos táctiles (swipe) para cambiar entre pestañas (Info, Tareas, Materiales, Notas) en la vista de detalle de orden de trabajo en dispositivos móviles.
- Reordenamiento de botones de acción de cambio de estado para mejor accesibilidad táctil.

### Feature: Detalle opcional en cambios de estado (timeline)

- Nuevo campo `detail` opcional en `WorkOrderStatusLog` (backend: columna varchar, migration `1785600000000-AddDetailToWorkOrderStatusLogs`)
- Al cambiar un estado, el usuario puede incluir un detalle (ej: motivo de cancelación) — diálogo `StatusChangeDialogComponent` compartido (admin + técnico)
- El detalle se muestra en la línea de tiempo con botones de editar/eliminar (PATCH/DELETE `/api/work-orders/:id/status-logs/:logId/detail`)
- Seeds actualizados: TS-MT0007 y TS-PC0002 con `statusLogDetail` en su último log
- Timeline real-time: `TimelineTabComponent` + `TechWorkOrderDetailComponent` usan `httpResource` keyed en `websocketService.workOrderRefreshKey()` — un cambio de estado desde el técnico se refleja en el detalle del admin sin recargar
- Fix: key de traducción de estados snake_case→camelCase (`on_the_way`→`onTheWay`); agregadas keys `onTheWay`/`postponed` a `workOrders.statuses` en es/en
- **Real-time del detalle (PRs #133/#212):** actualizar/eliminar el detalle de un log emite la notificación `work_order.status_detail_changed` (backend: evento + handler + migración del enum PostgreSQL `1785474367000`) → admins y técnicos asignados ven el cambio sin recargar. Verificado two-tab en Playwright (editar y eliminar)

### Fix: Swipe colors mobile card (PR #205)

- Los fondos de colores del swipe (azul editar, rojo eliminar) se veían en las esquinas de las mobile cards incluso sin deslizar
- Causa: `overflow: visible !important` en `.swipe-card` + `margin-bottom: 16px` de Angular Material
- Solución: `overflow: hidden`, `!mb-0`, `[style.opacity]` controlado por signal `swiping()`
- Fondos ahora solo aparecen durante el gesto de swipe con transición suave de 0.2s
- `swiping` convertido de boolean privado a signal público para controlar opacity via binding Angular
- `swiping.set(false)` retrasado 300ms en swipe completado para mantener fondos visibles durante snap-back

### Mobile bottom nav + Search global responsive (PR #200)

- Nuevo `AdminBottomNavComponent` con 5 atajos: Dashboard, Órdenes, Clientes, Notificaciones (con badge), Configuración
- Solo visible en mobile (`lg:hidden`), desktop sin cambios
- Mismo patrón que `BottomNavComponent` de técnico: `signal` + `NavigationEnd`, color activo `var(--color-secondary)`, badge con `NotificationsService`
- `GlobalSearchComponent` ahora maneja modo responsive: icono lupa + panel desplegable en mobile; input visible en desktop
- Header renderiza `app-global-search` siempre sin wrapper responsive
- Padding `pb-20 lg:pb-6` en `<main>` para evitar contenido oculto detrás del bottom nav

### Search global desde header (PRs #182–#186, #188, #191, #198)

- Buscador global en el header con debounce de 300ms
- Busca en **10 entidades**: clients, work-orders, suppliers, service-types, skills, **users**, inquiries, expenses, pending-items, notifications
- Resultados agrupados por tipo de entidad con iconos
- Dropdown con animación suave (sin flicker, sin blur global)
- Navegación directa: detail page o lista con `?highlight=ID&search=title` para resaltar fila
- Filtros `search` agregados a 4 servicios (inquiries, expenses, pending-items, notifications) que no lo tenían
- 9 list components migrados de `route.snapshot` a `toSignal(route.queryParamMap) + effect()` para reaccionar a cambios de query params
- `loadingInterceptor` salta el overlay global cuando la request tiene `search` + `limit=3`
- 23 tests nuevos (service + component)

### Highlight pulse en listas (PR #198)

- Replicado patrón de `InquiriesListComponent` en `UsersListComponent`
- `highlightedId`: `computed` que depende de `resource.value()` — retorna ID solo cuando data está cargada
- `highlightApplied`: `signal` que gatea la clase `.highlight-pulse` en el template
- **Sin `effect()`** — usa subscripción RxJS a `Router.events` + `NavigationStart`/`NavigationEnd`
- `NavigationStart` captura `event.url` como URL anterior → `NavigationEnd` compara con la nueva
- Animación SOLO cuando la navegación viene de otra sección (ej: `/admin/dashboard` → `/admin/users`)
- Sin animación cuando ya estás en la misma sección (solo filtra la lista)
- Clase CSS global `.highlight-pulse` en `styles.css` (`@keyframes highlight-pulse`, 2s)
- `clearFilters` resetea `highlightApplied` + `routeHighlight` y navega a `/admin/users` sin params

### E2E Tests con Playwright (PRs #190–#193)

- 16 spec files con ~530 líneas de tests E2E
- 16 page objects para todas las entidades
- Fixture de auth con 3 roles (admin, tech, seller) + seed automático vía API
- Seed de datos de prueba: crea usuarios y data via `POST /api/auth/login` + `POST /api/users` + CRUD endpoints
- Waits deterministas en todos los specs (sin `waitForTimeout`)
- ✅ Ejecutado contra backend real (14/08/2026): 59/59 tests passing

### Notificaciones en tiempo real (22/07/2026)

- Conexión WebSocket en layouts via afterNextRender (solo browser)
- Proxy /socket.io para conexión LAN desde celular
- Auto-refresh de lista de notificaciones al recibir nuevas vía WebSocket (refreshCounter)
- Editar/eliminar notas desde notes-tab (admin only) con NoteDialogComponent
- workOrderRefreshKey para auto-refresh de detalle de orden al recibir notificaciones
- Routing role-aware en notificaciones: admin→/admin/work-orders/:id, tech→/tech/:id
- Nuevos tipos de notificación: iconos, colores, filtros en lista
- Eliminado NotificationToastComponent (vive en WebsocketService)

---

## Últimas features implementadas (15/08/2026)

### Feature: Bulk actions en listas (piloto clients + work-orders)

- **Backend (PR backend):** Nuevos endpoints bulk — `PATCH /api/work-orders/bulk-status` (`BulkUpdateWorkOrderStatusDto {ids, status}`, retorna `{succeeded:[{id,status}], failed:[{id,reason}]}`, valida transición por id sin abortar el lote, crea status logs y emite `workorder.status_changed` por éxito), `PATCH /api/clients/bulk-status` ({ids, isActive}) y `POST /api/clients/bulk-delete` (soft delete). Rutas declaradas ANTES de `:id`. DTOs con `IsUUID(...,{each:true})`. 9 tests unitarios nuevos. 441 tests PASS, lint OK.
- **Frontend:** Util `exportToCsv()` (`shared/utils/csv-export.util.ts`, BOM UTF-8, escapado de `,"` y newlines), componente toolbar `BulkActionsComponent` (`shared/components/bulk-actions/`, sticky bajo el header, select-all con indeterminate, conteo, clear, export CSV, cambiar estado, activar/desactivar, eliminar), `MobileCardComponent` ahora acepta `selectable`/`checked`/`selectionChange` (checkbox en mobile), `StatusChangeDialogComponent` extendido con `statusOptions` + `statusLabel` para cambio de estado masivo.
- **Integración:** clients-list (selección por fila + select-all página, export CSV de seleccionados, activar/desactivar masivo, delete masivo con confirmación) y work-orders-list (ídem + cambio de estado masivo vía diálogo). Services: `ClientsService.bulkUpdateStatus/bulkDelete`, `WorkOrdersService.bulkStatusChange`. i18n es/en/pt con bloque `bulk.*`. 65 tests nuevos (43 clients + 22 work-orders).
- **Verificación:** 578 tests PASS, `npx ng build` OK (solo prerender `/` pre-existente), lint OK.

### Feature: Bulk actions en las 7 listas restantes (15/08/2026)

- **Backend (PR backend):** 11 endpoints bulk nuevos replicando el patrón `{succeeded, failed}` por id con fallos aislados:
  - `PATCH /api/suppliers/bulk-status` + `POST /api/suppliers/bulk-delete`
  - `PATCH /api/payments/bulk-status` (reutiliza `update()` → emite `payment.status_changed` + setea `paidAt` al aprobar) + `POST /api/payments/bulk-delete`
  - `POST /api/expenses/bulk-delete`
  - `PATCH /api/pending-items/bulk-status` (reutiliza `update()`) + `POST /api/pending-items/bulk-delete`
  - `POST /api/inquiries/bulk-delete`
  - `POST /api/billing/invoices/bulk-issue` (draft→issued, ARCA por factura, fallos aislados) + `POST /api/billing/invoices/bulk-cancel`
  - `PATCH /api/notifications/bulk-read` (scoped al usuario)
  - Rutas bulk declaradas ANTES de `:id`. DTOs con `@IsUUID(undefined, {each:true})`. 22 tests unitarios nuevos → 463 tests PASS, lint OK (0 errores).
- **Frontend:**
  - i18n `bulk.*` generalizado con `{{entity}}` (activate/deactivate/delete/changeStatus/toast) + keys nuevas `issue`/`cancel`/`markRead` + `toast.issued`/`toast.cancelled`/`toast.markedRead` en es/en/pt. Clients/work-orders actualizados para pasar `{entity}`.
  - `BulkActionsComponent` extendido con `showIssue`/`showCancel`/`showMarkRead` + outputs `issue`/`cancelSelected`/`markRead` (desktop + mobile toolbar).
  - Servicios: `SuppliersService.bulkUpdateStatus/bulkDelete`, `PaymentsService.bulkUpdateStatus/bulkDelete`, `ExpensesService.bulkDelete`, `PendingItemsService.bulkUpdateStatus/bulkDelete`, `InquiriesService.bulkDelete`, `BillingService.bulkIssue/bulkCancel`, `NotificationsService.bulkMarkAsRead` + interfaces de resultado en modelos.
  - Integración en 7 list components: **suppliers** (activate/deactivate + delete + CSV), **payments** (status vía StatusChangeDialog + delete + CSV), **expenses** (delete + CSV), **pending-items** (status + delete + CSV), **invoices** (issue/cancel + CSV), **inquiries** (delete + CSV), **notifications** (mark-read + CSV, checkbox custom en cards — no usa MobileCard ni tabla).
  - 138 tests nuevos (bulk-actions 12, services 6, list components 5) → **716 tests PASS**.
- **Verificación:** 716 tests frontend PASS, `npx ng build` OK (solo prerender `/` pre-existente, confirmado también en `main` limpio), lint OK, backend 463 tests PASS + curl verificado (400 con body vacío, éxito con datos reales).

### i18n: Portugués (14/08/2026)

`public/i18n/pt.json` con las 883 keys de `es.json` traducidas a portugués. `pt` agregado a los selectores de idioma en header y settings.

---

## Últimas features implementadas (15/08/2026)

### Feature: Kanban board para work orders (drag & drop por estado)

- **Vista kanban:** Nueva ruta lazy `/admin/work-orders/kanban` con `KanbanBoardComponent` — columnas por los 8 estados (`pending, assigned, on_the_way, in_progress, postponed, completed, delivered, cancelled`), scroll horizontal, badges de estado/prioridad, avatares de técnicos, contador por columna, `scheduledDate` relativa. Toggle "Vista Kanban" en el header del listado (`work-orders-list.component.ts`) y botón "Ver tabla" de vuelta.
- **Drag & drop:** CDK `CdkDropListGroup` + `cdkDropList` por columna + `cdkDrag` por card. Reorder dentro de la misma columna es solo visual (el modelo no tiene campo de orden). Cruzar de columna llama `workOrdersService.update(id, { status })` → backend valida transición, crea status log y emite `work_order.status_changed` por websocket. Drop a `delivered` solo permitido si `serviceType.requiresDelivery`.
- **Validación de transiciones DRY:** Nueva `core/utils/work-order-transitions.util.ts` con `WORK_ORDER_TRANSITION_ACTIONS`, `getTransitionActions(status, requiresDelivery)` y `getAllowedTargetStatuses(status, requiresDelivery)`. `status-transition.component.ts` refactorizado para consumirla (sin cambio de comportamiento) — kanban y detalle comparten la misma matriz.
- **Real-time:** `boardResource` (`httpResource`) keyed en `websocketService.workOrderRefreshKey()` → refetch al recibir notificaciones de work_order/task.
- **UX:** `cdkDropListEnterPredicate` restringe drops a columnas válidas (highlight azul en columna destino válida durante el drag), card clicable → detalle (a11y: role=button, tabindex, Enter/Space), toasts de éxito/error. **Feedback de drag pulido:** `*cdkDragPreview` con sombra y rotación + `*cdkDragPlaceholder` dashed que preserva el layout + transición CSS `150ms cubic-bezier` → arrastre fluido sin saltos.
- **i18n:** keys `workOrders.kanban.*` + `workOrders.viewToggle.*` en es/en/pt.
- **Tests:** 32 nuevos (util 13, kanban-board 13, kanban-card 6).
- **Verificación:** 747 tests frontend PASS, lint OK (0 errores), `ng build` OK (solo prerender `/` pre-existente).

---

## Últimas features implementadas (16/08/2026)

### Feature: Offline mode — PWA real para técnicos en campo (cola de mutaciones + sync)

- **Objetivo:** el técnico sin señal crea/edita offline y todo se sincroniza al reconectar. Próximo paso obligatorio del proyecto (#14). Complejidad alta.
- **Backend (PRs backend `feat/auth-refresh-tokens`, `feat/idempotency`):**
  - **Refresh token rotation:** entidad `refresh_tokens` (token_hash sha256, TTL 14d configurable `JWT_REFRESH_TTL_DAYS`), `POST /api/auth/refresh` con rotación (revoca el usado), `POST /api/auth/logout` revoca todos. Migration `1786763909608-CreateRefreshTokens`.
  - **Idempotencia global:** entidad `idempotency_records` + `IdempotencyInterceptor` global EXTERNO (antes de `TransformInterceptor`). Dedupe por `sha256(userId|method|path|Idempotency-Key)`; replay devuelve la respuesta almacenada sin re-ejecutar; TTL 48h (purga lazy cada 50 requests). Migration `1786764000000-CreateIdempotencyRecords`.
- **Frontend (PR `feat/auth-refresh`):**
  - **Auth con refresh:** `AuthService.refresh()` rota la sesión; `authInterceptor` ante 401 hace refresh **single-flight** y reintenta la request (logout solo si el refresh falla). `LoginResponse.refreshToken`.
  - **Núcleo offline:** `ConnectivityService` (signal `online()` + corrección por fallo real de red), `OfflineQueueStore` (IndexedDB vía `idb`, estados `pending`/`blocked`, nunca se borra lo bloqueado), `OfflineGetCache` (cache persistente de GETs JSON, TTL 7d, LRU 500), `OfflineService` (motor de sync FIFO: 2xx→elimina, 4xx/401→blocked visible, red/5xx→conserva + backoff; replay reutiliza la Idempotency-Key; bump `workOrderRefreshKey` tras sync), `offlineInterceptor` (1ro en la cadena: online inyecta Idempotency-Key en mutaciones + cachea GETs; offline encola mutaciones con respuesta sintética `X-Offline-Queued` y sirve GETs desde cache).
  - **Detección robusta de red:** si una mutación online falla con status 0 (navigator.onLine poco confiable), se encola y se reporta offline. **Sonda de recuperación** cada 6s mientras esté offline detecta el retorno y dispara el sync.
  - **UI:** `OfflineBannerComponent` (estados offline/syncing/pending/blocked), `OfflineStatusButtonComponent` (badge en headers admin + tech), `SyncStatusPanelComponent` (dialog con pendientes/bloqueados, retry individual y reintentar todos). i18n `offline.*` (16 keys) en es/en/pt. `ToastService` con tipo `warning`.
  - **ngsw-config:** dataGroup `/api/work-orders*` `networkFirst` 24h (capa corta SW) + cache IDB 7d (capa larga).
  - **Deps:** `idb` + `fake-indexeddb` (dev) + util `generateUuid`.
- **Tests:** backend 479 PASS (16 refresh + 9 idempotencia), frontend **838 PASS** (33 núcleo + 12 UI + connectivity), **E2E 60/60 PASS** (incluye `offline.spec.ts`: crea cliente offline → reconecta → verifica sync y creación única sin duplicados con idempotencia end-to-end). `npx ng build` OK (solo prerender `/` pre-existente).

---

## Últimas features implementadas (16/08/2026)

### Feature: Bulk actions en las 3 listas restantes (service-types, skills, users)

- **Backend (PR backend):** 5 endpoints bulk nuevos replicando el patrón `{succeeded, failed}` por id con fallos aislados:
  - `PATCH /api/service-types/bulk-status` + `POST /api/service-types/bulk-delete`
  - `PATCH /api/skills/bulk-status` + `POST /api/skills/bulk-delete`
  - `PATCH /api/users/bulk-status` (solo `{ids, isActive}`, sin bulk-delete — decisión: eliminar usuarios en masa es riesgoso)
  - DTOs nuevos `bulk-service-type.dto.ts`, `bulk-skill.dto.ts`, `bulk-user.dto.ts` con `@IsArray/@ArrayNotEmpty/@IsUUID(each:true)/@IsBoolean` + interfaces de resultado. Rutas declaradas ANTES de `:id`.
  - 10 tests unitarios nuevos (service-types 4, skills 4, users 2) → 489 tests PASS, lint OK (0 errores, 14 warnings pre-existentes en `notifications.listener.ts`).
- **Frontend:**
  - Modelos: interfaces `BulkServiceTypeStatusResult`/`BulkServiceTypeDeleteResult`, `BulkSkillStatusResult`/`BulkSkillDeleteResult`, `BulkUserStatusResult` en los 3 `.interfaces.ts`.
  - Servicios: `bulkUpdateStatus(ids, isActive)` en `service-types.service.ts`/`skills.service.ts`/`users.service.ts` + `bulkDelete(ids)` en los 2 primeros.
  - Integración `BulkActionsComponent` en los 3 list components (checkbox fila + select-all página con indeterminate, toolbar sticky desktop + flotante mobile, CSV de seleccionados, toasts éxito/parcial/error vía i18n `bulk.*`):
    - **service-types-list:** activar/desactivar + eliminar masivo (showDelete) + CSV (name, description, estimatedDuration, status, createdAt).
    - **skills-list:** ídem + **nueva columna `isActive`** con `app-status-badge` en tabla y status `activeInactive` en mobile cards (antes no mostraba estado).
    - **users-list:** solo activar/desactivar (`[showDelete]="false"`) + CSV (name, email, phone, role, status, createdAt).
  - i18n: sin keys nuevas (bloque `bulk.*` ya es genérico con `{{entity}}`); paridad es/en/pt verificada.
- **Tests:** 3 service specs nuevos + 3 component specs (1 ampliado, 2 nuevos) → 49 tests nuevos → **879 tests PASS**.
- **Verificación:** `npx ng build` OK (solo prerender `/` pre-existente), `pnpm test` 879 PASS, `pnpm lint` OK (0 errores), backend 489 tests PASS + lint OK.

---

## Resumen de prioridades pendientes

### 🔴 Alta prioridad (bloqueantes / UX rota)

1. ~~**BUG-003: Flicker en detalle de órdenes**~~ ✅ — Resuelto con `X-Skip-Loading` header.
2. ~~**Migrar 15 formularios a Signal Forms**~~ ✅ — 15/15 completado en 3 PRs.
3. ~~**BUG-002: Datepicker border cortado**~~ ✅ — Resuelto: `w-40` → `w-44`.
4. ~~**BUG-005: Mobile work order detail UI/UX**~~ ✅ — Rediseño mobile-first completado: hero header hardware card, eliminación de gestos swipe erróneos, dock de acciones flotante/sticky en mobile, vista de tarjetas de materiales en mobile.
5. ~~**FEAT-007: Hardware Status Deck & Circular Swipe**~~ ✅ — Rediseñado el dock de acciones de cambio de estado y asignación de técnicos con jerarquía visual héroe, botones hápticos (`active:scale-95`), iconografía profesional con Material Icons (sin emojis), tooltiping y swipe circular continuo.

### 🟡 Media prioridad (valor de negocio / calidad)

6. ~~**Search global desde header**~~ ✅ — Completado en PRs #182–#186, #188, #191.
7. ~~**Tests de componentes**~~ ✅ — 474 tests pasando (26 archivos, 100% pass rate). Incluye global-search (23 tests), local-date.adapter (4 tests), app, pipes, directives, guards, interceptors, list components.
8. ~~**E2E tests (Playwright)**~~ ✅ — **59/59 tests pasando** contra backend real (16 spec files, 16 POs, seed fixture, auth auto-seed). Ejecutado el 14/08/2026. Ver sección "Próxima sesión".
9. ~~**Google Maps + WhatsApp + Tap-to-Call**~~ ✅ — Completado. Iconos de acción en CopyFieldComponent (address → maps, phone → call + WhatsApp), InfoTabComponent, TechWorkOrderDetailComponent (nueva sección contacto), ClientDetailComponent. Fix: agregar `type: 'address'` faltante en clients-list y suppliers-list.

### 🟢 Baja prioridad (mejoras incrementales / polish)

10. **Offline mode** — PWA real para técnicos en campo. Complejidad alta.
11. ~~**i18n: Portugués**~~ ✅ — `pt.json` con 883 keys + selector en header y settings (14/08/2026)
12. ~~**Bulk actions**~~ ✅ — Selección múltiple, exportar CSV, cambiar estado masivo. Completado en las 9 listas: clients, work-orders, suppliers, payments, expenses, pending-items, invoices, inquiries, notifications (15/08/2026). Ver sección "Bulk actions".
13. ~~**Kanban board**~~ ✅ — Vista visual alternativa a tabla con drag & drop por estado. Completado (16/08/2026): ruta `/admin/work-orders/kanban`, CDK Drag & Drop, validación de transiciones compartida (ver sección "Kanban board").

### ⏭️ Siguiente paso obligatorio

14. ~~**Offline mode — PWA real para técnicos en campo**~~ ✅ — Completado (16/08/2026): cola de mutaciones IndexedDB, sync automático al reconectar, refresh token rotation + idempotencia global en backend. Ver "Últimas features implementadas (16/08/2026)".

### 🟠 Bulk actions faltantes (deuda)

15. ~~**Bulk actions en service-types, skills y users**~~ ✅ — Completado (15/08/2026). Backend: `PATCH /api/service-types/bulk-status` + `POST /api/service-types/bulk-delete`, `PATCH /api/skills/bulk-status` + `POST /api/skills/bulk-delete`, `PATCH /api/users/bulk-status` (solo isActive, sin delete masivo — decisión de producto). DTOs bulk con `IsUUID(each:true)` y rutas ANTES de `:id`, patrón `{succeeded, failed}` con fallos aislados. Frontend: `BulkActionsComponent` integrado en las 3 listas — service-types (activar/desactivar + eliminar + CSV), skills (ídem + **nueva columna isActive** con badge en tabla y status en mobile cards), users (solo activar/desactivar + CSV). Ver sección "Bulk actions en las 3 listas restantes" abajo.

16. **Fix 14 warnings ESLint pre-existentes en backend** — `notifications.listener.ts` tiene 14 warnings `@typescript-eslint/no-floating-promises` (promises no await en métodos listener). Reportado 15/08/2026. ⏭️ Pendiente menor de deuda técnica.

---

## Bugs conocidos

### ~~BUG-006: Botón "Vista Kanban" no se mostraba correctamente~~ ✅

**Reportado (16/08/2026):** El botón para pasar al kanban estaba proyectado vía `ng-content` del `PageHeaderComponent`, que lo coloca a la izquierda del título en un flex con `justify-between`. En mobile el botón desbordaba el header (quedaba fuera del área visible, solo icono de 35px) y en general era fácil de perder.

**Fix:** Se quitó del `PageHeader` y se movió a la toolbar de filtros de `work-orders-list.component.ts` como un `mat-flat-button` con texto siempre visible y `ml-auto` (alineado a la derecha). Visible en todos los breakpoints.

**Archivo modificado:** `src/app/features/work-orders/work-orders-list.component.ts`

---

### ~~BUG-001: Material Button Colors — Color por defecto persiste~~ ✅

**Solucionado:** Cambiar hardcoded `#1E40AF` a `var(--color-primary, #1E40AF)` en `material-theme.scss`. El `App` component effect() setea `--color-primary` dinámicamente desde `BusinessSettingsService.settings()`.

**Archivos modificados:**

- `src/material-theme.scss` — botones usan `var(--color-primary, #1E40AF)` en vez de hardcoded
- `src/app/app.ts` — effect() setea `--color-primary` y `--color-secondary` en `document.documentElement`

---

### ~~BUG-002: Datepicker border cortado en desktop~~ ✅

**Solucionado:** El ancho `w-40` (160px) era insuficiente para `mat-form-field` con `appearance="outline"` + `mat-datepicker-toggle`. El outline SVG del borde derecho se recortaba.

**Fix:** Cambiar `w-40` → `w-44` (176px, iguala los campos select/search adyacentes) en 20 datepickers de 10 archivos. Eliminar 3 CSS overrides fallidos de `styles.css`.

**Archivos modificados:**

- 10 list components (clients, suppliers, service-types, work-orders, payments, expenses, invoices, inquiries, pending-items, reports-dashboard)
- `src/styles.css` — eliminados overrides de `mat-datepicker-toggle`, `mat-mdc-form-field-icon-suffix`, `mdc-notched-outline__trailing`

---

### ~~BUG-003: 🔴 Flicker en detail de órdenes~~ ✅

**Solucionado:** El flicker era causado por el overlay global del `LoadingSpinnerComponent` (full-screen con `bg-black/30 backdrop-blur-sm`) que se activaba cuando requests de child components (TimelineTabComponent → status-logs, InfoTabComponent → service-types) tardaban >300ms. El "punto azul" era el `<mat-spinner diameter="48">` del overlay.

**Fix implementado:**

1. Agregado header `X-Skip-Loading` al `loadingInterceptor` — requests con este header no activan el overlay global
2. `workOrderResolver` usa `X-Skip-Loading` para no mostrar overlay durante navegación
3. `TimelineTabComponent` refactorizado: `httpResource` → `HttpClient` + `signal()` manual + `X-Skip-Loading`
4. `InfoTabComponent` refactorizado: `httpResource` → `HttpClient` + `signal()` manual + `X-Skip-Loading` para service-types

**Archivos modificados:**

- `src/app/core/interceptors/loading.interceptor.ts` — soporte `X-Skip-Loading`
- `src/app/features/work-orders/work-order.resolver.ts` — usa `X-Skip-Loading`
- `src/app/shared/components/timeline-tab/timeline-tab.component.ts` — `HttpClient` + `X-Skip-Loading`
- `src/app/features/work-orders/tabs/info-tab.component.ts` — `HttpClient` + `X-Skip-Loading`

---

### ~~BUG-004: Fondos de colores del swipe visibles en mobile cards~~ ✅

**Solucionado:** Los fondos de colores del swipe (azul de editar, rojo de eliminar) se veían en las esquinas de las mobile cards incluso sin deslizar. Causa: `overflow: visible !important` en `.swipe-card` permitía que los fondos se filtraran por las esquinas redondeadas del `border-radius`, y `margin-bottom: 16px` del expansion panel de Angular Material creaba un gap inferior donde se veían los colores.

**Fix implementado:**

1. `overflow: visible !important` → `overflow: hidden` en `.swipe-card` — evita filtrado por border-radius
2. `!mb-0` en clases del `mat-expansion-panel` — elimina gap de 16px
3. `swiping` convertido de `boolean` privado a `signal(false)` público
4. `[style.opacity]="swiping() ? 1 : 0"` en `.swipe-actions` — control directo via binding Angular
5. `swiping.set(false)` retrasado 300ms en swipe completado — mantiene fondos visibles durante snap-back

**Archivos modificados:**

- `src/app/shared/components/mobile-card/mobile-card.component.ts` — overflow, margin, signal, opacity binding

**Behavior:**

| Estado           | Fondos                                |
| ---------------- | ------------------------------------- |
| Card colapsada   | Ocultos (opacity 0)                   |
| Card expandida   | Ocultos (opacity 0)                   |
| Deslizando       | Visibles con transición (opacity 1)   |
| Swipe completado | Se mantienen 300ms, luego desaparecen |
| Tap sin deslizar | Se ocultan inmediato                  |

---

## Próximos pasos priorizados (por valor al proyecto)

### ~~1. Push Notifications — PWA real-time en mobile~~ ✅

**Valor:** Feature diferenciador para PWA. Las notificaciones push llegan aunque la app esté cerrada en el celular. Sin costo de infraestructura ($0).

**Frontend:** `push-notification.service.ts` — suscripción, gestión de permisos
**Backend:** Módulo `push-notifications/` con entity, controller, service, web-push

---

### ~~2. ProfileSettingsComponent — Perfil de usuario~~ ✅

**Valor:** Completitud de gestión de usuarios. El admin puede editar su perfil.

---

### ~~3. PortalLayoutComponent — Layout dedicado para portal~~ ✅

**Valor:** Mejor organización del portal público. Separa el layout del contenido.

---

### ~~4. Reportes avanzados — Business intelligence~~ ✅

| Componente                    | Estado                            |
| ----------------------------- | --------------------------------- |
| ~~ProfitChartComponent~~      | ✅ Línea de ganancia en dashboard |
| ~~TechnicianDetailComponent~~ | ✅ KPIs + tabla + ExportButtons   |
| ~~ClientReportComponent~~     | ✅ KPIs + tabs + ExportButtons    |
| ~~ExportButtons~~             | ✅ Botones PDF en reportes        |
| ~~Client drill-down~~         | ✅ Top clients → client report    |

---

### ~~5. RelativeDatePipe + RoleDirective — UX polish~~ ✅

- ~~RelativeDatePipe~~ ✅ — Adoptado en 14+ componentes
- ~~RoleDirective~~ ✅ — Directiva structural `*role`

---

### ~~6. Payments CRUD — Editar, eliminar, crear pagos~~ ✅

**Valor:** CRUD completo para gestión de pagos.

**Frontend:** `payment-form.component.ts` (dialog crear/editar), edit/delete buttons en lista
**Backend:** PATCH + DELETE (soft/hard) endpoints, cascade WorkOrder→Payment

---

### ~~7. Material Button Colors — Coherencia visual~~ ✅

**Valor:** Unificar colores de botones Material con la paleta del proyecto.

**Implementado:** Custom palette `#1E40AF` en `material-theme.scss` + overrides CSS globales.

---

### ~~8. Mobile UI — Cards expandibles + Copy-to-clipboard~~ ✅

**Valor:** Mejora UX mobile. Tablas → cards expandibles + copiar teléfonos/emails + acciones nativas.

**Componentes creados:**

- `CopyToClipboardDirective` — copiar al portapapeles con toast feedback
- `CopyFieldComponent` — campo con valor + acción nativa (tel:, mailto:, maps:) + copia
- `MobileCardComponent` — expansion panel con swipe gestures (izq=borrar, der=editar)

**Integrado en:** 11 listas (clients, suppliers, work-orders, payments, expenses, invoices, pending-items, inquiries, users, service-types, skills)

**Features mobile:**

- Swipe gestures en cards contraídas (derecha=editar, izquierda=borrar)
- Accordion behavior (una card expandida a la vez)
- Edit/Delete buttons en footer de card expandida
- Fechas relativas en campos date (computed, no pipe)
- Sidebar overlay en mobile (w-60, fixed positioning)

---

### 9. Tests — Calidad y confianza

**Valor:** Permite deploy con confianza. Sin tests, cada cambio es un riesgo.

**Estado actual:** 474 tests pasando (26 archivos de test, 100% passing).

**Stack:** Vitest (configurado), Playwright (E2E)
**Orden:** ~~Service tests~~ ✅ → ~~Component tests (parcial)~~ ✅ → E2E tests (pendiente)

**Servicios testeados (147 tests, 6 archivos):**

- ~~auth.service.spec.ts~~ ✅ (39 tests)
- ~~clients.service.spec.ts~~ ✅ (18 tests)
- ~~work-orders.service.spec.ts~~ ✅ (27 tests)
- ~~billing.service.spec.ts~~ ✅ (18 tests)
- ~~reports.service.spec.ts~~ ✅ (23 tests)
- ~~notifications.service.spec.ts~~ ✅ (21 tests)
- ~~global-search.service.spec.ts~~ ✅ (11 tests, nuevo)

**Componentes / pipes / directives / guards / interceptors / utils (327 tests, 20 archivos):**

- App, status-badge, copy-to-clipboard directive, role directive
- Pipes: currency-ars, relative-date, status-class, status-label
- Guards: auth.guard
- Interceptors: auth.interceptor
- Utils: local-date.adapter (4 tests), date.utils (12 tests)
- List components: clients, payments, work-orders (date filtering), invoices, dashboard
- Nuevos: global-search.component (12 tests)

**Completado:** Service tests, global-search, pipes, directives, guards, interceptors, list components date-filtering, E2E contra backend real (59/59, 14/08/2026).

---

### ~~10. Search global desde header~~ ✅

**Valor:** Buscar en todas las entidades desde el header. UX significativamente mejorada.

**Implementación (PRs #182–#186, #188):**

| PR   | Qué agregó                                                                              |
| ---- | --------------------------------------------------------------------------------------- |
| #182 | Componente base: 3 entidades (clients, work-orders, suppliers), dropdown con resultados |
| #183 | 9 entidades + UI compacta + grouped results + help tooltip con entidades                |
| #184 | UI fixes: ancho + placeholder + búsqueda en 4 servicios que no la pasaban               |
| #185 | Highlight en tabla al navegar + `toSignal+effect` reactivo en 9 list components         |
| #186 | Skip loading global para search + removido spinner del dropdown + merge                 |
| #188 | Fix mocks de `ActivatedRoute` en tests rotos (clients, payments, work-orders)           |

**Entidades buscables (10):**

- `client`, `work-order` (detail page) + `supplier`, `service-type`, `skill`, **`user`**, `expense`, `pending-item` (list page con `?highlight=ID&search=title`)
- `inquiry` (detail page) + `notification` (list page sin highlight, no aplica)

**Patrón clave:** el `GlobalSearchService` hace `forkJoin` de 9 requests en paralelo con `catchError` por cada una. El `loadingInterceptor` salta el loading global cuando la URL tiene `?search=*&limit=3` (combinación única del global search).

---

## Próxima sesión — prioridades en orden

### ~~🔷 BRANDING: Logo B — check + hexágono + workflow line~~ ✅

**Completado (01/08/2026):** Creado `BrandLogoComponent` (`src/app/shared/components/brand-logo/brand-logo.component.ts`) e integrado en Landing Header, Landing Footer, Portal Tracking y Sidebar. Test unitario creado (`brand-logo.component.spec.ts`, 3 tests verdes).

**Decisión tomada (01/08/2026):** Se eligió la dirección **B** del logo — check dentro de hexágono con línea de workflow. Descartados: A (monograma TS + QR) y C (llave+engranaje).

**Concepto:** "Servicio completado, seguimiento activo". El check comunica garantía de trabajo terminado; el hexágono aporta solidez/ingeniería; la línea punteada con nodos evoca el timeline de tracking (la feature estrella del producto, código `TS-XXXXX` + QR).

#### Anatomía del SVG (viewBox 0 0 24 24, stroke = currentColor)

| Elemento          | Spec                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------- |
| **Hexágono**      | Pointy-top, r≈9.2, path: `M12 2.8 L20 7.4 L20 16.6 L12 21.2 L4 16.6 L4 7.4 Z`, stroke-width 2 |
| **Check**         | `polyline` `7.5,12.8 → 10.7,16 → 16.6,9.4`, stroke-width 2.5, round caps/joins                |
| **Workflow line** | `line` `x1=6.5 y1=19 x2=17.5 y2=19`, stroke-width 1.5, `stroke-dasharray="2.5 2.5"`           |
| **Nodos**         | 2 círculos rellenos (currentColor): `cx=6.5 cy=19 r=1.3` y `cx=17.5 cy=19 r=1.3`              |

**SVG de referencia (variante full):**

```html
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d="M12 2.8 L20 7.4 L20 16.6 L12 21.2 L4 16.6 L4 7.4 Z" />
  <polyline points="7.5,12.8 10.7,16 16.6,9.4" stroke-width="2.5" />
  <line x1="6.5" y1="19" x2="17.5" y2="19" stroke-width="1.5" stroke-dasharray="2.5 2.5" />
  <circle cx="6.5" cy="19" r="1.3" fill="currentColor" stroke="none" />
  <circle cx="17.5" cy="19" r="1.3" fill="currentColor" stroke="none" />
</svg>
```

#### Variantes

| Variante | Uso                            | Detalle                                            |
| -------- | ------------------------------ | -------------------------------------------------- |
| **full** | Header/footer/sidebar/login    | Hexágono + check + línea workflow + nodos (arriba) |
| **mark** | Favicon 16px, badges, chips    | Solo hexágono + check (sin línea ni nodos)         |
| **mono** | PWA icons, usos monocromáticos | full en color único (blanco o primary sólido)      |

#### Aplicaciones (reemplazar el wrench duplicado)

| Archivo                                                    | Línea actual        | Cambio                                                            |
| ---------------------------------------------------------- | ------------------- | ----------------------------------------------------------------- |
| `src/app/features/landing/landing-header.component.ts`     | ~15-17 (SVG wrench) | Usar `<app-brand-logo variant="full" />` + wordmark (sin cambios) |
| `src/app/features/landing/landing-footer.component.ts`     | ~13-15 (SVG wrench) | Ídem, tamaño `w-5 h-5`                                            |
| `src/app/layouts/admin-layout/admin-layout.component.ts`   | Verificar           | Reemplazar logo existente por el componente                       |
| `src/app/features/auth/login.component.ts` (o equivalente) | Verificar           | Ídem                                                              |
| `public/favicon.ico`                                       | —                   | Exportar variante **mark** a 16px                                 |
| `public/icons/icon-{72,96,128,144,152,192,384,512}.png`    | —                   | Re-exportar variante **mono** desde el SVG                        |
| `src/index.html` / `manifest.webmanifest`                  | —                   | Verificar que referencien los nuevos assets                       |

#### Arquitectura (DRY — hoy el SVG está copiado en 2+ archivos)

1. Crear `src/app/shared/components/brand-logo/brand-logo.component.ts`:
   - `@Component` standalone, `imports: []` (SVG inline, sin dependencias)
   - Inputs: `variant = input<'full' | 'mark'>('full')`, `size = input<string>('w-7 h-7')`
   - Clases: `text-[var(--color-primary)]` light / `dark:text-blue-400` dark (usa `currentColor`; hereda el branding multi-tenant dinámico que setea `--color-primary` desde BusinessSettings)
   - `aria-hidden="true"` (el wordmark "Tech Service" es texto accesible; el logo es decorativo)
2. **Integración multi-tenant:** verificar cómo el sidebar maneja el logo configurado del tenant (BusinessSettings). Si existe override por imagen, el componente debe aceptar input `imageUrl?: string` y priorizarla sobre el SVG.
3. Generar favicon + PWA icons: exportar desde el SVG (script o herramienta; en `public/icons/` ya existen los 8 tamaños).
4. Test unitario smoke: `brand-logo.component.spec.ts` — renderiza SVG en ambas variantes.

#### Pautas de uso (brand guidelines mínimas)

- **Clear space:** 25% del alto del hexágono alrededor del mark.
- **Tamaño mínimo:** 16px (mark) / 24px (full con wordmark).
- ❌ No rotar, no deformar (preservar aspect ratio 1:1), no cambiar colores fuera de la paleta.
- ❌ No usar `mark` con sombras ni strokes externos en favicon.
- ✅ El check nunca se usa solo sin hexágono (reserva el mark completo).

#### Verificación obligatoria

1. `npx ng build` → 0 errores (el error de prerender en `/` por timeout del backend es pre-existente, ignorar).
2. `pnpm test` → tests verdes (incluye el nuevo spec).
3. `pnpm lint` → sin warnings.
4. Revisión visual: landing light/dark, sidebar, login, favicon en pestaña del browser.
5. Prerender check: el logo SVG inline funciona en SSR sin `window`/`document` (no tocar `ThemeService` para esto).

**Nota para retomar:** tarea de implementación → agente `build`. La dirección creativa está cerrada; solo falta ejecución. Si el resultado visual del hexágono+check+timeline no convence en la revisión, la micro-variante B2 (workflow line saliendo del vértice inferior derecho, asimétrica) es el plan B autorizado sin re-discutir concepto.

---

### ~~0. Mergear feature "Real-time del detalle del timeline" (ramas `feat/status-detail-realtime`)~~ ✅

✅ Ya mergeado (PRs backend #133, frontend #212). El detalle del timeline se propaga en vivo a admins y técnicos asignados al editar/eliminar.

### ~~1. Ejecutar E2E tests contra backend real~~ ✅

**Completado (14/08/2026): 59/59 tests pasando contra backend real.**

Fixes necesarios para que la suite corriera contra el backend real:

- `e2e/fixtures/auth.fixture.ts` — credenciales admin: `admin@test.com` → `admin@techservice.local` (el backend real solo tiene `@techservice.local`).
- `e2e/fixtures/seed.fixture.ts` — `getAdminToken()` leía `body.data.token` pero el backend devuelve `data.accessToken` (el seed abortaba silenciosamente). Además faltaba `address` en el payload del proveedor (`CreateSupplierDto` requiere `address`, 400 BAD_REQUEST).
- `e2e/tests/login.spec.ts` — credencial de loading state actualizada.
- Selectores: la mat-table renderiza `<tr mat-row>` (no `<mat-row>`) → todos los POs/specs usan `tr[mat-row]`. Notificaciones: items son `main div[role="button"]`. Reportes: KPI cards usan `[class*="border-l-4"]`.
- i18n: títulos en español — skills `habilidad`, work-orders `órden`.
- Portal tracking: el input no tiene atributo `type` (Material) → selector `input[placeholder*="TS-"]`; no hay botón submit, se busca con Enter.

**Cómo ejecutar:** backend NestJS corriendo en puerto 3000 + `pnpm test:e2e`.

**Archivos involucrados:** `e2e/tests/*.spec.ts`, `e2e/pages/*.page.ts`, `e2e/fixtures/seed.fixture.ts`, `e2e/fixtures/auth.fixture.ts`

### ~~2. i18n: Portugués~~ ✅

**Completado (14/08/2026):** `public/i18n/pt.json` creado con las 883 keys de `es.json` traducidas a portugués (paridad verificada programáticamente: keys y placeholders `{{param}}` idénticos). `pt` agregado a los selectores de idioma en `header.component.ts` y `settings.component.ts`. `TranslationService` no requirió cambios (carga `${locale}.json` dinámicamente). Verificación: `ng build` OK (solo el error de prerender pre-existente), 555 tests PASS, lint OK.

### ~~3. Bulk actions — selección múltiple en listas (esfuerzo medio)~~ ✅

**Completado (15/08/2026):** Piloto en clients y work-orders. Checkbox por fila (desktop + mobile via MobileCard), toolbar bulk sticky con select-all de página (indeterminate), conteo, clear, export CSV (`exportToCsv` util), cambiar estado (work-orders vía `StatusChangeDialogComponent` con status select), activar/desactivar y eliminar masivo (clients). Backend: endpoints `bulk-status`/`bulk-delete` con resultado `{succeeded, failed}` por id. 65 tests nuevos. **Extendido a las 7 listas restantes** (suppliers, payments, expenses, pending-items, invoices, inquiries, notifications) con 11 endpoints bulk backend y 138 tests nuevos — ver "Últimas features implementadas (15/08/2026)".

### ~~4. Offline mode — PWA real (esfuerzo alto)~~ ✅

**Completado (16/08/2026):** Cola de mutaciones para crear/editar offline + sync al reconectar. Requirió refresh token rotation e idempotencia global en el backend. Ver "Últimas features implementadas (16/08/2026)".

### ~~5. Kanban board — drag & drop de work orders (esfuerzo alto)~~ ✅

**Completado (16/08/2026):** Vista por columnas de estado con Angular CDK Drag & Drop. Ruta `/admin/work-orders/kanban` + toggle en el listado. Ver sección "Kanban board".

### 6. ~~Google Maps + WhatsApp + Tap-to-Call (esfuerzo bajo-medio) — PRIORIDAD~~ ✅

Completado. CopyFieldComponent: `location_on` → Maps, `phone` → call, `chat` → WhatsApp. InfoTabComponent, TechWorkOrderDetailComponent (sección contacto), ClientDetailComponent. Fix: `type: 'address'` faltante en clients-list y suppliers-list.

### ~~7. BUG-005: Mobile work order detail UI/UX~~ ✅

Rediseño mobile-first completado (ver "Resumen de prioridades pendientes" → BUG-005).

### ~~7. BUG-005: Mobile work order detail UI/UX~~ ✅

**Problema:** El detalle de orden en mobile (`tech-work-order-detail`) tiene:

- Scroll horizontal no deseado (grid `grid-cols-2` sin responsive)
- Layout roto en pantallas pequeñas
- Acciones de swipe que no funcionan correctamente
- Contenido largo sin jerarquía clara

**Solución:** Rediseñar el template mobile-first:

- Stack vertical en mobile (`grid-cols-1` → `sm:grid-cols-2`)
- Acciones de estado como botones full-width o chips compactos
- Secciones colapsables o con accordion para contenido largo
- Fix del scroll container en tech-layout

**Archivos a modificar:**

| Archivo                                                           | Cambio                             |
| ----------------------------------------------------------------- | ---------------------------------- |
| `src/app/features/technician/tech-work-order-detail.component.ts` | Rediseño mobile-first del template |
| `src/app/features/work-orders/work-order-detail.component.ts`     | Evaluar si aplica el mismo fix     |
| `src/app/layouts/tech-layout/tech-layout.component.ts`            | Verificar scroll container         |

---

### ~~11. Offline mode — Cola de mutaciones~~ ✅

**Completado (16/08/2026):** Cola de mutaciones IndexedDB + sync automático + refresh token + idempotencia. Ver "Últimas features implementadas (16/08/2026)".

---

### ~~12. Migración a Signal Forms — Eliminar template-driven forms legacy~~ ✅ (15/15 en 3 PRs)

**Valor:** Consistencia con la arquitectura Signals-Only. Eliminar deuda técnica.

**15 componentes** usan `FormsModule`/`NgForm`/`[(ngModel)]` y deben migrarse a `form()` + `FormField`:

**Completados (PR1 — simples):**
| Componente | Archivo | Estado |
|---|---|---|
| PortalSearchComponent | `src/app/features/portal/portal-search.component.ts` | ✅ signal manual |
| SkillFormComponent | `src/app/features/skills/skill-form.component.ts` | ✅ Signal Forms |
| InquiryContactFormComponent | `src/app/features/inquiries/inquiry-contact-form.component.ts` | ✅ Signal Forms |
| ServiceTypeFormComponent | `src/app/features/service-types/service-type-form.component.ts` | ✅ Signal Forms |
| SupplierFormComponent | `src/app/features/suppliers/supplier-form.component.ts` | ✅ Signal Forms |
| InquiryFormComponent | `src/app/features/inquiries/inquiry-form.component.ts` | ✅ Signal Forms |
| TechnicianAssignmentDialogComponent | `src/app/features/work-orders/technician-assignment-dialog.component.ts` | ✅ signal manual |

**Completados (PR2 — medios):**
| Componente | Archivo | Estado |
|---|---|---|
| ClientFormComponent | `src/app/features/clients/client-form.component.ts` | ✅ Signal Forms |
| ExpenseFormComponent | `src/app/features/expenses/expense-form.component.ts` | ✅ Signal Forms |
| PaymentFormComponent | `src/app/features/payments/payment-form.component.ts` | ✅ Signal Forms |
| PendingItemFormComponent | `src/app/features/pending-items/pending-item-form.component.ts` | ✅ Signal Forms |
| SkillSelectorComponent | `src/app/features/users/skill-selector.component.ts` | ✅ signal manual |

**Completados (PR3 — complejos):**
| Componente | Archivo | Estado |
|---|---|---|
| WorkOrderFormComponent | `src/app/features/work-orders/work-order-form.component.ts` | ✅ Signal Forms |
| InvoiceFormComponent | `src/app/features/billing/invoice-form.component.ts` | ✅ Signal Forms |
| UserFormComponent | `src/app/features/users/user-form.component.ts` | ✅ Signal Forms |

**Patrón destino:** Ver `ProfileSettingsComponent` (`src/app/features/profile/profile-settings.component.ts`) y `SettingsComponent` (`src/app/features/settings/settings.component.ts`) como referencia de Signal Forms ya implementados.

**Estado:** ✅ Completado — 15/15 migrados en 3 PRs. Verificación en código: 0 archivos en `src/app` usan `FormsModule`/`NgForm`/`ngModel`.

---

## Sugerencias adicionales (futuro)

> Backlog de ideas para evaluar ANTES de iniciar pruebas directas de usuarios (alpha/beta). Priorizar según valor percibido y validación con usuarios reales.

| Feature                                   | Valor | Esfuerzo | Nota                                                     |
| ----------------------------------------- | ----- | -------- | -------------------------------------------------------- |
| Biometric auth (huella/face ID)           | Medio | Medio    | WebAuthn API, mejora login en campo                      |
| Drag & drop en work orders (kanban board) | Medio | Alto     | ✅ **Completado (16/08/2026)** — ver sección Kanban      |
| Bulk actions (selección múltiple)         | Medio | Medio    | ✅ **Completado (15/08/2026)** — 9 listas                |
| Dashboard: Widget de actividad reciente   | Bajo  | Bajo     | Timeline de eventos recientes                            |
| Email templates (confirmación, factura)   | Medio | Medio    | Requiere backend                                         |
| Multi-language: Portugués                 | Bajo  | Bajo     | ✅ **Completado (14/08/2026)**                           |
| Dark mode: Coherencia total               | Bajo  | Bajo     | Ya funciona, polish menor                                |
| Offline mode (PWA)                        | Alto  | Alto  | ✅ **Completado (16/08/2026)** — cola de mutaciones + sync |

### Otras ideas (validar con usuarios en alpha/beta)

| Idea                                                              | Valor | Nota                                                  |
| ----------------------------------------------------------------- | ----- | ----------------------------------------------------- |
| Notas de voz en work orders (grabar diagnóstico en campo)         | Alto  | MediaRecorder API, mejora UX del técnico              |
| Firma digital del cliente al entregar (canvas o touch)            | Alto  | Legal/papel cero, valor percibido alto                 |
| Fotos adjuntas (evidencia de reparación) en tasks/notas           | Alto  | Upload, thumbnails, storage backend                    |
| Check-in del técnico con geolocalización al llegar                | Medio | Maps API, timestamps                                   |
| Presupuestos/envíos de cotización por WhatsApp desde la orden     | Medio | Compartir PDF/imagen vía wa.me                         |
| Recordatorios automáticos de garantías (vencimientos)             | Medio | Push + dashboard                                       |
| Historial del cliente unificado (todas las órdenes en su perfil)  | Medio | Ya parcial en ClientReportComponent                     |
| Multi-sucursal / inventario por local                             | Medio | Requiere modelo de datos                               |
| Feedback del cliente post-entrega (rating + reseña)               | Bajo  | Link en tracking portal                                 |
| Exportación de reportes a Excel con formato                       | Bajo  | csv→xlsx vía lib                                      |
| Impresión directa (recibo/orden) en el local                      | Bajo  | window.print sobre vista optimizada                     |
| Search con filtros guardados (presets por técnico/equipo)         | Bajo  | localStorage prefs                                    |
| Accesos rápidos configurables (atajos de teclado)                 | Bajo  | Keyboard shortcuts                                    |
| Onboarding interactivo para nuevos usuarios                        | Bajo  | Tour guiado por secciones                              |

---

## Checklist rápido de features completadas

- [x] Auth (login, guards, interceptors, JWT isActive, role-based redirect)
- [x] Dashboard (KPIs, charts, widgets, drag-drop, profit chart)
- [x] Clients CRUD (list, form, search, pagination, detail)
- [x] Suppliers CRUD
- [x] Service Types CRUD
- [x] Work Orders (list, detail, tasks, materials, notes, status transitions, technician assignment)
- [x] Payments CRUD (list, filters, approve, edit, delete, create dialog)
- [x] Expenses CRUD
- [x] Billing (invoices CRUD, issue, cancel, PDF)
- [x] Reports (dashboard, income, expenses, profit chart, services ranking, technician ranking, export buttons, client drill-down)
- [x] Notifications (list, mark read, WebSocket, unreadCount, bell badge in header)
- [x] Pending Items (list, form, dashboard widget)
- [x] Inquiries (list, detail, contact, review, convert)
- [x] Convert inquiry → work order end-to-end (diálogo con cliente nuevo/existente, crea orden real) — PRs #236/#142
- [x] Landing Page (SSG/prerender, 6 sub-components) + Logo B (BrandLogoComponent) — 01/08/2026
- [x] Portal Tracking (search, result, timeline, tasks, notes, payments)
- [x] PWA (service worker, manifest, install prompt)
- [x] Push Notifications (VAPID keys, web-push, PushSubscription entity, PushNotificationService)
- [x] Technician View (cards, urgency, detail, bottom nav)
- [x] i18n (es + en, ~350+ keys)
- [x] Business Settings (multi-tenant branding: name, logo, colors, contact info)
- [x] Portal Layout (dedicated layout for public tracking pages)
- [x] Profile Settings (admin + tech profile editing, name, email, phone, password change)
- [x] Self-service Profile API (GET/PATCH /api/auth/profile, POST /api/auth/change-password)
- [x] Tech Layout logout button
- [x] Route fix: `:id` moved after specific routes in `/tech`
- [x] Role-based login redirect (admin→/admin, tech→/tech, seller→/seller)
- [x] Role-based route guards (`adminGuard` on `/admin`, `technicianGuard` on `/tech`)
- [x] RelativeDatePipe (fechas relativas: "hace 2 días", "en 3 horas")
- [x] RoleDirective (directiva structural `*role` para visibilidad por rol)
- [x] Material Button Colors (brand palette #1E40AF en material-theme.scss)
- [x] Mobile UI (cards expandibles, swipe gestures, copy-to-clipboard, accordion, tel:/mailto:/maps:)
- [x] Sidebar mobile overlay (w-60, fixed positioning, backdrop)
- [x] Dialog transparency fix (backgrounds sólidos en dark mode)
- [x] Search global en header (9 entidades, debounce 300ms, grouped results, highlight en lista, sin flicker ni blur) — PRs #182–#186
- [x] Tests de componentes y utils (474 tests pasando, 100% pass rate) — incluye global-search (23 tests) y local-date.adapter (4 tests)
- [x] E2E tests: 16 specs, 16 POs, seed fixture, waits deterministas — PRs #190–#193
- [x] E2E tests contra backend real: 59/59 passing (14/08/2026) — fixes de credenciales, seed, y selectores
- [x] Google Maps + WhatsApp + Tap-to-Call (iconos en CopyFieldComponent, InfoTabComponent, TechWorkOrderDetail, ClientDetail)
- [x] Kanban board (drag & drop por estado, ruta `/admin/work-orders/kanban`, validación de transiciones compartida) — 16/08/2026
- [x] LocalDateAdapter (adaptador de fecha local para prevención de desfasajes GMT) — PR #214
- [x] Swipe entre tabs y reordenamiento de acciones en detalle de orden mobile — PR #213
- [x] Estilos e ícono de MobileFilterBarComponent con color primario dinámico — PR #216

## Archivos de referencia útiles

| Archivo                                                                    | Qué muestra                                      |
| -------------------------------------------------------------------------- | ------------------------------------------------ |
| `src/app/app.routes.ts`                                                    | Todas las rutas definidas                        |
| `src/app/layouts/admin-layout/admin-layout.component.ts`                   | Sidebar + header + content                       |
| `src/app/layouts/tech-layout/tech-layout.component.ts`                     | Layout simple con BottomNav                      |
| `src/app/features/work-orders/work-order-detail.component.ts`              | Detalle con tabs y acciones                      |
| `src/app/features/clients/clients-list.component.ts`                       | CRUD list con mobile cards                       |
| `src/app/features/billing/invoice-form.component.ts`                       | Form con autocomplete signals                    |
| `src/app/core/services/notifications.service.ts`                           | Service con signals + WebSocket                  |
| `src/app/shared/components/bottom-nav/bottom-nav.component.ts`             | Bottom nav de técnico (detección de ruta activa) |
| `src/app/shared/components/admin-bottom-nav/admin-bottom-nav.component.ts` | Bottom nav de admin mobile (mismo patrón)        |
| `src/app/core/services/pwa.service.ts`                                     | Service PWA con isPlatformBrowser                |
| `src/app/core/services/push-notification.service.ts`                       | Service Push Notifications                       |
| `src/app/features/payments/payment-form.component.ts`                      | Dialog form crear/editar pagos                   |
| `src/app/shared/components/mobile-card/mobile-card.component.ts`           | Card expandible con swipe                        |
| `src/app/shared/components/copy-field/copy-field.component.ts`             | Campo con copy + acciones nativas                |
| `src/app/shared/directives/copy-to-clipboard.directive.ts`                 | Directive copiar al portapapeles                 |
| `src/material-theme.scss`                                                  | Brand palette para Material                      |
