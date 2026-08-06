# Flujo 04: Notificaciones en tiempo real (Socket.IO + Push)

Cubre el subsistema de notificaciones en vivo: eventos del backend
vía Socket.IO mientras el usuario esta en la app, y Web Push
Notifications vía VAPID cuando la app esta cerrada o en background.

## Diagrama general

```mermaid
flowchart LR
    BE["Backend<br/>(NestJS)"] -->|socket.io emit 'notification'| WS["WebSocketService<br/>(wrapper socket.io-client)"]
    BE -.->|Web Push<br/>(VAPID)| SW["Service Worker<br/>(SwPush)"]
    WS -->|toast + signal| UI["UI activa<br/>(in-app)"]
    WS -->|workOrderRefreshKey++| Lists["Listas de WorkOrders"]
    WS -->|workOrderStatusChanges[refId]| Detail["Detalle de WorkOrder"]
    SW -->|OS notification| BG["Usuario en background"]
    BG -->|click handler| URL["Abre URL en nueva tab"]
```

## 1. Canal Socket.IO (in-app)

`WebsocketService` (`core/services/websocket.service.ts:1`) es el
wrapper sobre `socket.io-client`.

### Configuracion (`websocket.service.ts:43-50`)

- Conexion autenticada: envia JWT en `auth.token`.
- `reconnection: true` con reintentos infinitos.
- `transports: ['websocket', 'polling']` (fallback automatico).
- Signal `connected: WritableSignal<boolean>` se actualiza en
  `connect` / `disconnect` / `connect_error`.

### Evento principal: `notification`

`WebsocketService` escucha el evento `notification` y por cada
`AppNotification` (`notification.interfaces.ts:23+`):

1. Incrementa contador `unread`.
2. Muestra toast via `MatSnackBar` + `ToastContentComponent`
   (`websocket.service.ts:104-118`), con icono mapeado por
   `NOTIFICATION_TOAST_ICONS[type]`.
3. Si `referenceType` es `'work_order'`, `'task'`, o trae
   `workOrderId` en metadata: **incrementa `workOrderRefreshKey`**
   para que las listas de WO re-fetcheen.
4. Si `type === 'work_order.status_changed'`: actualiza
   `workOrderStatusChanges[referenceId] = newStatus` para que el
   detalle de WO refresque el badge de status sin re-fetch completo.

## 2. Catalogo de eventos

`NotificationType` enum (`notification.interfaces.ts:1-22`),
**21 eventos** distribuidos por feature:

### WorkOrder (7)

| Evento | Cuando se emite |
|---|---|
| `WORK_ORDER_CREATED` | Creacion de WO. |
| `WORK_ORDER_STATUS_CHANGED` | Transicion de status (ver [02-workorder-lifecycle.md](./02-workorder-lifecycle.md)). |
| `WORK_ORDER_STATUS_DETAIL_CHANGED` | Cambio de `startedAt`, `completedAt`, etc. |
| `WORK_ORDER_TECHNICIAN_ASSIGNED` | Tecnico agregado al array `technicians[]`. |
| `WORK_ORDER_TECHNICIAN_UNASSIGNED` | Tecnico removido. |
| `WORK_ORDER_NOTE_ADDED` | Nota creada (ver `NoteType`: `diagnosis`, `issue`, `observation`, `internal`). |
| `WORK_ORDER_NOTE_UPDATED` | Nota editada. |
| `WORK_ORDER_NOTE_DELETED` | Nota eliminada. |
| `WORK_ORDER_MATERIAL_ADDED` | Material registrado manualmente. |

### Task (2)

| Evento | Cuando |
|---|---|
| `TASK_CREATED` | Item de checklist creado en WO. |
| `TASK_COMPLETED` | Item de checklist marcado completo. |

### Payment (3)

| Evento | Cuando |
|---|---|
| `PAYMENT_CREATED` | Pago en estado `pending` (ver [03-billing-payment.md](./03-billing-payment.md)). |
| `PAYMENT_APPROVED` | Pago transiciona a `approved`. |
| `PAYMENT_REJECTED` | Pago transiciona a `rejected`. |

### PendingItem (3)

| Evento | Cuando |
|---|---|
| `PENDING_ITEM_CREATED` | Pendiente creado. |
| `PENDING_ITEM_DUE_TODAY` | Cron job (backend) detecta vencimiento hoy. |
| `PENDING_ITEM_OVERDUE` | Cron job (backend) detecta atraso. |

### Inquiry (4)

| Evento | Cuando |
|---|---|
| `INQUIRY_CREATED` | Consulta creada. |
| `INQUIRY_ASSIGNED` | Consulta asignada a tecnico. |
| `INQUIRY_CONTACTED` | Status pasa a `contacted`. |
| `INQUIRY_REVIEWED` | Status pasa a `reviewed`. |

## 3. Busqueda de notificaciones (deep-link)

`notification.utils.ts:3-66` expone `getSearchTerm(notification)` que
genera un termino de busqueda para que el buscador global
(`global-search.service.ts:1`) navegue al recurso relacionado:

| `referenceType` | Termino generado |
|---|---|
| `work_order`, `task`, `payment` | `trackingCode` (regex `[A-Z]{2}-\w+`) o el valor de `metadata.trackingCode`. |
| `pending_item` | `title` o regex de fecha de vencimiento. |
| `inquiry` | `clientName` (regex `consulta de/para ...`) o `metadata.clientName`. |

Esto permite que el **highlight pulse** de las listas
(`AGENTS.md > Highlight pulse`) reciba el ID correcto desde una
notificacion y haga scroll + animacion al item.

## 4. Canal Web Push (background)

`PushNotificationService` (`core/services/push-notification.service.ts:1`)
usa `@angular/service-worker` (`SwPush`) + VAPID.

### Endpoints

- `GET /api/push/vapid-key` - obtiene `publicKey` del backend.
- `POST /api/push/subscribe` - envia `{ endpoint, keys: { p256dh, auth }, userAgent }`.
- `DELETE /api/push/unsubscribe`.

### Recepcion

`listenForMessages()` (`push-notification.service.ts:91-103`):

```typescript
this.swPush.messages.subscribe((msg: { notification: ..., data?: ... }) => {
  const n = msg.notification;
  self.registration.showNotification(n.title, {
    body: n.body,
    icon: n.icon,
    badge: n.badge,
    data: { url: msg.data?.url },
  });
});
```

`listenForClicks()` (`push-notification.service.ts:105-110`) escucha
`notificationclick` y abre `event.notification.data.url` en nueva
tab.

## 5. Permisos y UX

- El permission prompt **no se pide automaticamente** al login; el
  usuario debe activarlo desde el perfil.
- Si el browser bloquea el permission, se muestra un toast con CTA
  para abrir settings.
- El estado de suscripcion se persiste por usuario en el backend; el
  frontend consulta al `PushNotificationService.isEnabled()` antes
  de mostrar el toggle en el UI.

## ⚠️ Gaps conocidos

- **No hay campana de notificaciones en el header global con dropdown**
  - solo el `unread` count badge y los toasts efimeros. El historial
  completo de notificaciones (mark-as-read) no esta implementado en UI.
- **No hay agrupacion de eventos** - si el backend emite 5
  `WORK_ORDER_STATUS_CHANGED` en 2 segundos, el usuario ve 5 toasts
  separados. Sin debounce/aggregation.
- **El cron de PENDING_ITEM_DUE_TODAY/OVERDUE es backend-side**; el
  frontend no tiene scheduler local. Si el SW no esta activo, no
  llega push de vencimientos.

## Referencias en codigo

| Concepto | Ubicacion |
|---|---|
| Wrapper Socket.IO | `src/app/core/services/websocket.service.ts:1` |
| Config socket.io (auth, reconnection) | `src/app/core/services/websocket.service.ts:43` |
| `showNotificationToast` | `src/app/core/services/websocket.service.ts:104` |
| `workOrderRefreshKey` (signal) | `src/app/core/services/websocket.service.ts:1` |
| `workOrderStatusChanges` (signal map) | `src/app/core/services/websocket.service.ts:1` |
| `NotificationType` enum (21 valores) | `src/app/core/models/notification.interfaces.ts:1` |
| `AppNotification` interface | `src/app/core/models/notification.interfaces.ts:23` |
| `getSearchTerm()` (deep-link) | `src/app/core/utils/notification.utils.ts:3` |
| Filtrado por `referenceType` | `src/app/core/utils/notification.utils.ts:29,54` |
| PWA Push service (VAPID) | `src/app/core/services/push-notification.service.ts:1` |
| `listenForMessages()` | `src/app/core/services/push-notification.service.ts:91` |
| `listenForClicks()` | `src/app/core/services/push-notification.service.ts:105` |
| Buscador global (consume `getSearchTerm`) | `src/app/core/services/global-search.service.ts:1` |
| Feature `notifications` (UI listado) | `src/app/features/notifications/` |
| Consumo de WS en detalle WO | `src/app/features/work-orders/work-order-detail.component.ts:6` |
| Consumo de WS en lista WO | `src/app/features/work-orders/work-orders-list.component.ts:7` |
