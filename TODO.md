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

### ~~1. PortalLayoutComponent (layout dedicado para portal público)~~ ✅

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

## Próximos pasos priorizados (por valor al proyecto)

### 1. Push Notifications — PWA real-time en mobile

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

### 2. ProfileSettingsComponent — Perfil de usuario

**Valor:** Completitud de gestión de usuarios. El admin puede editar su perfil, el técnico puede ver sus datos.

**Qué:** Formulario para editar nombre, email, contraseña del usuario logueado.

**Ruta:** `/admin/profile` o integrar en `/admin/settings`

**Archivos:**
- Crear: `src/app/features/settings/profile-settings.component.ts` (o integrar en settings)
- Modificar: `src/app/app.routes.ts` — agregar ruta si es componente separado
- Modificar: `public/i18n/es.json` + `en.json` — keys `settings.profile.*`

---

### ~~3. PortalLayoutComponent — Layout dedicado para portal~~ ✅

**Valor:** Mejor organización del portal público. Separa el layout del contenido. Mejor SEO y reutilización.

**Qué:** Layout minimal para rutas `/track` con logo del negocio (desde API) y sin sidebar.

**Ruta:** Se usa internamente en rutas `/track`

**Archivos:**
- Crear: `src/app/layouts/portal-layout/portal-layout.component.ts`
- Modificar: `src/app/app.routes.ts` — envolver rutas `/track` con PortalLayout
- Modificar: `public/i18n/es.json` + `en.json` — keys `portal.layout.*`

**Patrón:** Header minimal con logo + nombre. Sin sidebar. `router-outlet`. `min-h-svh`. Dark mode. Referencia: `tech-layout.component.ts`.

---

### 4. Reportes avanzados — Business intelligence

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

### 5. RelativeDatePipe + RoleDirective — UX polish

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

### 6. Tests — Calidad y confianza

**Valor:** Permite deploy con confianza. Sin tests, cada cambio es un riesgo. Pero se hace DESPUÉS de tener la base completa.

**Estado actual:** Solo `src/app/app.spec.ts` — cobertura ~0%.

**Stack:** Vitest (configurado), Playwright (E2E)

**Orden:** Service tests → Component tests → E2E tests

---

## Checklist rápido de features completadas

- [x] Auth (login, guards, interceptors)
- [x] Dashboard (KPIs, charts, widgets, drag-drop)
- [x] Clients CRUD (list, form, search, pagination, detail)
- [x] Suppliers CRUD
- [x] Service Types CRUD
- [x] Work Orders (list, detail, tasks, materials, notes, status transitions, technician assignment)
- [x] Payments (list, filters, approve)
- [x] Expenses CRUD
- [x] Billing (invoices CRUD, issue, cancel, PDF)
- [x] Reports (dashboard, income, expenses, services ranking, technician ranking)
- [x] Notifications (list, mark read, WebSocket, unreadCount, bell badge in header)
- [x] Pending Items (list, form, dashboard widget)
- [x] Inquiries (list, detail, contact, review, convert)
- [x] Landing Page (SSG/prerender, 6 sub-components)
- [x] Portal Tracking (search, result, timeline, tasks, notes, payments)
- [x] PWA (service worker, manifest, install prompt)
- [x] Technician View (cards, urgency, detail, bottom nav)
- [x] i18n (es + en, ~300+ keys)
- [x] Business Settings (multi-tenant branding: name, logo, colors, contact info)
- [x] Portal Layout (dedicated layout for public tracking pages with business branding)

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
