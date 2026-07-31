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

## Últimas features implementadas (31/07/2026)

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

- 15 spec files con ~530 líneas de tests E2E
- 16 page objects para todas las entidades
- Fixture de auth con 3 roles (admin, tech, seller) + seed automático vía API
- Seed de datos de prueba: crea usuarios y data via `POST /api/auth/login` + `POST /api/users` + CRUD endpoints
- Waits deterministas en todos los specs (sin `waitForTimeout`)
- Pendiente: ejecutar contra backend real (requiere backend NestJS corriendo con seed)

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

## Resumen de prioridades pendientes

### 🔴 Alta prioridad (bloqueantes / UX rota)

1. ~~**BUG-003: Flicker en detalle de órdenes**~~ ✅ — Resuelto con `X-Skip-Loading` header.
2. ~~**Migrar 15 formularios a Signal Forms**~~ ✅ — 15/15 completado en 3 PRs.
3. ~~**BUG-002: Datepicker border cortado**~~ ✅ — Resuelto: `w-40` → `w-44`.
4. **BUG-005: Mobile work order detail UI/UX** — El detalle de orden en mobile se ve con scroll horizontal, layout roto, opciones de swipe que no funcionan bien. Requiere rediseño del template para mobile-first: stack vertical, sin overflow, acciones accesibles.

### 🟡 Media prioridad (valor de negocio / calidad)

5. ~~**Search global desde header**~~ ✅ — Completado en PRs #182–#186, #188, #191.
6. ~~**Tests de componentes**~~ ✅ — 470 tests pasando (25 archivos, 100% pass rate). Incluye global-search (23 tests), app, pipes, directives, guards, interceptors, list components.
7. **E2E tests (Playwright)** — 🔄 Avanzado: 15 spec files, 16 POs, seed fixture, auth auto-seed. Pendiente de ejecución contra backend real. Ver sección "Próxima sesión".
8. ~~**Google Maps + WhatsApp + Tap-to-Call**~~ ✅ — Completado. Iconos de acción en CopyFieldComponent (address → maps, phone → call + WhatsApp), InfoTabComponent, TechWorkOrderDetailComponent (nueva sección contacto), ClientDetailComponent. Fix: agregar `type: 'address'` faltante en clients-list y suppliers-list.

### 🟢 Baja prioridad (mejoras incrementales / polish)

9. **Offline mode** — PWA real para técnicos en campo. Complejidad alta.
10. **i18n: Portugués** — Patrón existe, agregar `pt.json`.
11. **Bulk actions** — Selección múltiple, exportar masivo.
12. **Kanban board** — Vista visual alternativa a tabla.

---

## Bugs conocidos

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

**Estado actual:** 470 tests pasando (25 archivos de test, 100% passing).

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

**Componentes / pipes / directives / guards / interceptors (323 tests, 19 archivos):**

- App, status-badge, copy-to-clipboard directive, role directive
- Pipes: currency-ars, relative-date, status-class, status-label
- Guards: auth.guard
- Interceptors: auth.interceptor
- List components: clients, payments, work-orders (date filtering), invoices, dashboard
- Nuevos: global-search.component (12 tests)

**Completado:** Service tests, global-search, pipes, directives, guards, interceptors, list components date-filtering.
**Pendiente:** E2E tests contra backend real (ver sección "Próxima sesión").

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

### 1. Ejecutar E2E tests contra backend real

Los tests están listos pero necesitan el backend corriendo con seed de datos:

```bash
# Levantar backend NestJS (puerto 3000)
# Luego ejecutar E2E:
pnpm test:e2e
```

Si fallan, depurar selectores de los POs contra la UI real. El seed automático
crea los usuarios y datos de prueba vía API. Ver `e2e/fixtures/seed.fixture.ts`.

**Archivos involucrados:** `e2e/tests/*.spec.ts`, `e2e/pages/*.page.ts`, `e2e/fixtures/seed.fixture.ts`

### 2. i18n: Portugués (esfuerzo bajo, impacto medio)

Copiar `public/i18n/es.json` → `public/i18n/pt.json` y traducir los textos.
Agregar `pt` al `TranslationService` y al selector de idioma en el header.

**Archivos a modificar:**

- `public/i18n/pt.json` (nuevo)
- `src/app/core/services/translation.service.ts` — agregar locale
- `src/app/shared/components/header/header.component.ts` — agregar opción al menú
- `public/i18n/es.json` + `public/i18n/en.json` — sincronizar keys faltantes

### 3. Bulk actions — selección múltiple en listas (esfuerzo medio)

Agregar checkbox en cada fila de tabla, botones de acción masiva (exportar, cambiar estado).
Reutilizar `ExportButtonsComponent` existente.

**Archivos involucrados:** 9 list components (clients, suppliers, work-orders, payments, expenses, billing, pending-items, inquiries, notifications)

### 4. Offline mode — PWA real (esfuerzo alto)

Cola de mutaciones para crear/editar offline, sync al reconectar.
Requiere investigación de IndexedDB o similar.

### 5. Kanban board — drag & drop de work orders (esfuerzo alto)

Vista alternativa por columnas de estado. Usar Angular CDK Drag & Drop.

### 6. ~~Google Maps + WhatsApp + Tap-to-Call (esfuerzo bajo-medio) — PRIORIDAD~~ ✅

Completado. CopyFieldComponent: `location_on` → Maps, `phone` → call, `chat` → WhatsApp. InfoTabComponent, TechWorkOrderDetailComponent (sección contacto), ClientDetailComponent. Fix: `type: 'address'` faltante en clients-list y suppliers-list.

### 7. BUG-005: Mobile work order detail UI/UX (esfuerzo medio) — PRIORIDAD

Rediseñar `tech-work-order-detail.component.ts` mobile-first: stack vertical, sin scroll horizontal, acciones accesibles. Verificar también `work-order-detail.component.ts` y `tech-layout.component.ts`.

### 7. BUG-005: Mobile work order detail UI/UX (esfuerzo medio)

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

### 11. Offline mode — Cola de mutaciones

**Valor:** PWA real. Crear/editar offline, sync al reconectar.

**Estado:** Pendiente (requiere investigación)

---

### 12. Migración a Signal Forms — Eliminar template-driven forms legacy (PR1: 7/15 ✅)

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

**Patrón destino:** Ver `ProfileSettingsComponent` (`src/app/features/profile/profile-settings.component.ts`) y `SettingsComponent` (`src/app/features/settings/settings.component.ts`) como referencia de Signal Forms ya implementados.

**Estado:** Pendiente

---

## Sugerencias adicionales (futuro)

| Feature                                   | Valor | Nota                      |
| ----------------------------------------- | ----- | ------------------------- |
| Biometric auth (huella/face ID)           | Medio | WebAuthn API              |
| Drag & drop en work orders (kanban board) | Medio | UX visual                 |
| Bulk actions (selección múltiple)         | Medio | Exportar, cambiar estado  |
| Dashboard: Widget de actividad reciente   | Bajo  | Timeline                  |
| Email templates (confirmación, factura)   | Medio | Requiere backend          |
| Multi-language: Portugués                 | Bajo  | Patrón i18n existente     |
| Dark mode: Coherencia total               | Bajo  | Ya funciona, polish menor |

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
- [x] Search global en header (9 entidades, debounce 300ms, grouped results, highlight en lista, sin flicker ni blur) — PRs #182–#186
- [x] Tests de componentes (470 tests pasando, 100% pass rate) — incluye global-search (23 tests)
- [x] E2E tests: 15 specs, 16 POs, seed fixture, waits deterministas — PRs #190–#193
- [x] Google Maps + WhatsApp + Tap-to-Call (iconos en CopyFieldComponent, InfoTabComponent, TechWorkOrderDetail, ClientDetail)

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
