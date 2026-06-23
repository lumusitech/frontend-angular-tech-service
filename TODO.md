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

### 4. BusinessSettingsComponent (multi-tenant)

**Qué:** Configuración del negocio: nombre, logo, colores. Actualizar el settings.component existente.
**Dependencias:** Endpoint del backend para business settings (verificar en Swagger).
**Ruta:** `/admin/settings` (ya existe)

Archivos a crear/modificar:
- Modificar: `src/app/features/settings/settings.component.ts` — agregar sección de negocio
- Crear: `src/app/core/services/business-settings.service.ts` (si no existe)
- Modificar: `public/i18n/es.json` + `en.json` — keys `settings.business.*`

Patrón a seguir:
- Formulario con campos: name, logo (URL o upload), primaryColor, secondaryColor
- Persistir en backend y aplicar como CSS variables
- Color picker simple o inputs hex
- Guardar con HttpClient (mutation), no httpResource

---

### 5. ProfileSettingsComponent (perfil de usuario)

**Qué:** Perfil del usuario logueado: nombre, email, cambio de contraseña.
**Dependencias:** Endpoint del backend para user profile (verificar en Swagger).
**Ruta:** `/admin/profile` o integrar en `/admin/settings`

Archivos a crear/modificar:
- Crear: `src/app/features/settings/profile-settings.component.ts` (o integrar en settings)
- Modificar: `src/app/app.routes.ts` — agregar ruta si es componente separado
- Modificar: `public/i18n/es.json` + `en.json` — keys `settings.profile.*`

---

### 6. Reportes avanzados (4 componentes)

**Qué:** Completar el módulo de reportes con componentes faltantes.

#### 6a. ProfitChartComponent
- Crear: `src/app/features/reports/profit-chart.component.ts`
- Modificar: `src/app/features/reports/reports-dashboard.component.ts` — agregar componente
- Datos: combinar income, expenses y materials cost por período
- Usar `ReportsService` existente

#### 6b. TechnicianDetailComponent
- Crear: `src/app/features/reports/technician-detail.component.ts`
- Modificar: `src/app/app.routes.ts` — agregar ruta `/admin/reports/technicians/:id`
- Datos: historial individual del técnico (endpoint del backend)
- Patrón: httpResource con ID de técnico

#### 6c. ClientReportComponent
- Crear: `src/app/features/reports/client-report.component.ts`
- Ruta: `/admin/reports/clients/:id`
- Datos: historial del cliente (endpoint del backend)

#### 6d. ExportButtons
- Crear: `src/app/features/reports/export-buttons.component.ts`
- Botones para descargar PDFs (budget, receipt) desde reports
- Usar `responseType: 'blob'` en HttpClient

---

### 7. RelativeDatePipe + RoleDirective (mejoras UX)

#### 7a. RelativeDatePipe
- Crear: `src/app/shared/pipes/relative-date.pipe.ts`
- Formato: "hace 2 días", "en 3 días", "hace 1 hora"
- Usar en listas donde se muestra createdAt, updatedAt

#### 7b. RoleDirective
- Crear: `src/app/shared/directives/role.directive.ts`
- `@Input() appRole: 'admin' | 'technician'`
- Mostrar/ocultar elementos según rol del usuario
- Usar `AuthService.user()?.role`

---

### 8. Tests (DESPUÉS de completar features anteriores)

**Estado actual:** Solo existe `src/app/app.spec.ts` — cobertura prácticamente cero.

Stack: Vitest (ya configurado en `angular.json`)

Orden sugerido:
1. Service unit tests (mock HTTP)
2. Component unit tests
3. E2E tests (Playwright)

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
| `src/app/layouts/tech-layout/tech-layout.component.ts` | Layout de técnico con BottomNav |
| `src/app/features/work-orders/work-order-detail.component.ts` | Ejemplo de detalle con tabs y acciones |
| `src/app/features/clients/clients-list.component.ts` | Ejemplo de CRUD list con MatTable |
| `src/app/features/billing/invoice-form.component.ts` | Ejemplo de form con autocomplete signals |
| `src/app/core/services/notifications.service.ts` | Ejemplo de service con signals + WebSocket |
| `src/app/shared/components/bottom-nav/bottom-nav.component.ts` | Ejemplo de componente con detección de ruta activa |
