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
- Forms: template-driven con signals (no ReactiveFormsModule)
- Sidebar: `src/app/layouts/admin-layout/admin-layout.component.ts` — agregar items ahí

---

## Bugs conocidos

### ~~BUG-001: Material Button Colors — Color por defecto persiste~~ ✅

**Solucionado:** Cambiar hardcoded `#1E40AF` a `var(--color-primary, #1E40AF)` en `material-theme.scss`. El `App` component effect() setea `--color-primary` dinámicamente desde `BusinessSettingsService.settings()`.

**Archivos modificados:**
- `src/material-theme.scss` — botones usan `var(--color-primary, #1E40AF)` en vez de hardcoded
- `src/app/app.ts` — effect() setea `--color-primary` y `--color-secondary` en `document.documentElement`

---

### BUG-002: Datepicker border cortado en desktop

**Problema:** El borde derecho del input de calendario (datepicker) se ve cortado en la vista desktop. El `mat-datepicker-toggle` dentro del `mat-form-field` con `appearance="outline"` y `class="w-40"` causa que el outline se corte.

**Intentos fallidos:**
- `margin-right: -4px` en `.mat-datepicker-toggle`
- `padding-right: 0` en `.mdc-notched-outline__trailing`

**Posible causa:** El ancho `w-40` (160px) es insuficiente para el input + el icono del toggle. O el `overflow: hidden` del contenedor padre corta el outline.

**Archivos involucrados:**
- Todos los componentes de lista con filtros de fecha (11 archivos)
- `src/styles.css` — overrides de form fields

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

| Componente | Estado |
|-----------|--------|
| ~~ProfitChartComponent~~ | ✅ Línea de ganancia en dashboard |
| ~~TechnicianDetailComponent~~ | ✅ KPIs + tabla + ExportButtons |
| ~~ClientReportComponent~~ | ✅ KPIs + tabs + ExportButtons |
| ~~ExportButtons~~ | ✅ Botones PDF en reportes |
| ~~Client drill-down~~ | ✅ Top clients → client report |

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

**Estado actual:** 147 tests pasando en 6 servicios prioritarios (cobertura ~60% de services).

**Stack:** Vitest (configurado), Playwright (E2E)
**Orden:** ~~Service tests~~ ✅ → Component tests (pendiente) → E2E tests (pendiente)

**Servicios testeados:**
- ~~auth.service.spec.ts~~ ✅ (39 tests — login, logout, token, roles, localStorage, edge cases)
- ~~clients.service.spec.ts~~ ✅ (18 tests — CRUD, filtros, edge cases)
- ~~work-orders.service.spec.ts~~ ✅ (27 tests — CRUD, notes, materials, tasks, technicians)
- ~~billing.service.spec.ts~~ ✅ (18 tests — CRUD, issue, cancel, PDF, edge cases)
- ~~reports.service.spec.ts~~ ✅ (23 tests — summary, income, expenses, profit, services, technicians, clients)
- ~~notifications.service.spec.ts~~ ✅ (21 tests — CRUD, unreadCount signal, markAsRead, markAllAsRead)

---

### 10. Search global

**Valor:** Buscar en todas las entidades desde el header. UX significantly improved.

**Estado:** Pendiente

---

### 11. Offline mode — Cola de mutaciones

**Valor:** PWA real. Crear/editar offline, sync al reconectar.

**Estado:** Pendiente (requiere investigación)

---

## Sugerencias adicionales (futuro)

| Feature | Valor | Nota |
|---------|-------|------|
| Biometric auth (huella/face ID) | Medio | WebAuthn API |
| Drag & drop en work orders (kanban board) | Medio | UX visual |
| Bulk actions (selección múltiple) | Medio | Exportar, cambiar estado |
| Dashboard: Widget de actividad reciente | Bajo | Timeline |
| Email templates (confirmación, factura) | Medio | Requiere backend |
| Multi-language: Portugués | Bajo | Patrón i18n existente |
| Dark mode: Coherencia total | Bajo | Ya funciona, polish menor |

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
- [x] Landing Page (SSG/prerender, 6 sub-components)
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

## Archivos de referencia útiles

| Archivo | Qué muestra |
|---------|-------------|
| `src/app/app.routes.ts` | Todas las rutas definidas |
| `src/app/layouts/admin-layout/admin-layout.component.ts` | Sidebar + header + content |
| `src/app/layouts/tech-layout/tech-layout.component.ts` | Layout simple con BottomNav |
| `src/app/features/work-orders/work-order-detail.component.ts` | Detalle con tabs y acciones |
| `src/app/features/clients/clients-list.component.ts` | CRUD list con mobile cards |
| `src/app/features/billing/invoice-form.component.ts` | Form con autocomplete signals |
| `src/app/core/services/notifications.service.ts` | Service con signals + WebSocket |
| `src/app/shared/components/bottom-nav/bottom-nav.component.ts` | Componente con detección de ruta activa |
| `src/app/core/services/pwa.service.ts` | Service PWA con isPlatformBrowser |
| `src/app/core/services/push-notification.service.ts` | Service Push Notifications |
| `src/app/features/payments/payment-form.component.ts` | Dialog form crear/editar pagos |
| `src/app/shared/components/mobile-card/mobile-card.component.ts` | Card expandible con swipe |
| `src/app/shared/components/copy-field/copy-field.component.ts` | Campo con copy + acciones nativas |
| `src/app/shared/directives/copy-to-clipboard.directive.ts` | Directive copiar al portapapeles |
| `src/material-theme.scss` | Brand palette para Material |
