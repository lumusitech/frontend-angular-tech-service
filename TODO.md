# TODO — Frontend Angular Tech Service

> Este archivo es el punto de partida para cualquier IA o desarrollador.
> Contiene el contexto del proyecto, patrones clave y las tareas priorizadas.

## Contexto rápido

- **Stack:** Angular 22, Signals-only, Tailwind CSS 4, Angular Material 22, SSR híbrido, PWA
- **Backend:** NestJS 11 en `http://localhost:3000/api/` — Swagger: `http://localhost:3000/api/docs`
- **Auth:** JWT Bearer token, roles: `admin` (acceso total), `technician` (solo sus órdenes)
- **Respuestas API:** `{ statusCode, data, timestamp }` — httpResource usa `parse` en 2do arg
- **i18n:** Custom JSON en `public/i18n/es.json` + `public/i18n/en.json`, TranslatePipe
- **SSR:** Landing (`/`) prerender, Portal (`/track`) server-rendered, Admin/Tech client-rendered
- **Package manager:** pnpm

## Patrones de código (MUY IMPORTANTE — seguir siempre)

```typescript
// Servicios: usar @Service() (no @Injectable)
import { Service, inject, signal } from '@angular/core';
@Service()
export class ClientsService { ... }

// Queries GET: httpResource (reactivo, auto-cancela, eager)
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
- Materiales usados: MatTable, MatDialog, MatAutocomplete, MatPaginator, MatSort, MatButtonToggle, MatIconModule, MatChipsModule
- Forms: template-driven con signals (no ReactiveFormsModule)
- Sidebar: `src/app/layouts/admin-layout/admin-layout.component.ts` — agregar items ahí

## Próximos pasos priorizados

### 1. ClientDetailComponent (completar CRUD de clientes)

**Qué:** Vista de detalle de un cliente con su historial de órdenes, pagos y datos.
**Dependencias:** Ninguna.
**Ruta:** `/admin/clients/:id`

Archivos a crear/modificar:
- Crear: `src/app/features/clients/client-detail.component.ts`
- Modificar: `src/app/app.routes.ts` — agregar ruta `:id` como child de `clients`
- Modificar: `src/app/features/clients/clients-list.component.ts` — agregar link a detalle
- Crear/Modificar: `public/i18n/es.json` + `en.json` — keys `clients.detail.*`

Patrón a seguir:
- Usar `httpResource` con param de ID desde `ActivatedRoute`
- Layout con cards (Tailwind) como en `src/app/features/work-orders/work-order-detail.component.ts`
- Secciones: datos del cliente, órdenes asociadas (tabla), KPIs resumidos

---

### 2. PortalLayoutComponent (layout dedicado para portal público)

**Qué:** Layout minimal para el portal de tracking, con logo del negocio desde API.
**Dependencias:** Ninguna.
**Ruta:** Se usa internamente en rutas `/track`.

Archivos a crear/modificar:
- Crear: `src/app/layouts/portal-layout/portal-layout.component.ts`
- Modificar: `src/app/app.routes.ts` — envolver rutas `/track` con PortalLayout
- Modificar: `public/i18n/es.json` + `en.json` — keys `portal.layout.*` si es necesario

Patrón a seguir:
- Header minimal con logo + nombre del negocio (desde settings API)
- Sin sidebar, sin navegación
- `router-outlet` para contenido
- Mobile-first, `min-h-svh`
- Dark mode support
- Referencia: `src/app/layouts/tech-layout/tech-layout.component.ts` (simple, sin sidebar)

---

### 3. NotificationBellComponent (badge en header)

**Qué:** Icono de campana en el header de admin con badge de notificaciones no leídas.
**Dependencias:** NotificationsService ya existe con `unreadCount` signal.
**Posición:** En el header de admin-layout, al lado del avatar.

Archivos a crear/modificar:
- Crear: `src/app/shared/components/notification-bell/notification-bell.component.ts`
- Modificar: `src/app/layouts/admin-layout/admin-layout.component.ts` — agregar el componente
- Modificar: `public/i18n/es.json` + `en.json` — keys `notifications.bell.*`

Patrón a seguir:
- Usar `NotificationsService.unreadCount()` signal
- `MatIconModule` con `notifications` icon
- Badge rojo con count (similar a como se hace en BottomNavComponent)
- Link a `/admin/notifications` al hacer click
- SSR-safe: inyectar `PLATFORM_ID` y usar `isPlatformBrowser` si es necesario para WebSocket

---

## Próximos pasos priorizados (por valor al proyecto)

### 1. ~~BusinessSettingsComponent — Multi-tenant (diferenciador comercial)~~ ✅ COMPLETADO

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
- [x] Business Settings (multi-tenant branding: name, logo, colors, contact info)

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
