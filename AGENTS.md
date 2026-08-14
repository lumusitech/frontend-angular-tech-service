# AGENTS.md — Tech Service Frontend


## Contexto del Proyecto

Frontend Angular 22 para sistema de gestión de servicios técnicos.
**Stack:** Angular 22, Signals, httpResource, Tailwind CSS 4, Angular Material 22
**Backend asociado:** NestJS 11 (Tech Service API) en `localhost:3000`
**Credenciales de Dev/Test:** `admin@techservice.local` / `admin123`


---

## Comportamiento del Agente

- **Claridad ante todo:** Si una petición no está clara o falta información, preguntar antes de ejecutar. No asumir requisitos implícitos.
- **Acción directa:** Tareas simples y bien definidas se ejecutan directamente.
- **Validación de cambios complejos:** Refactors, nuevas features o decisiones de arquitectura requieren confirmar entendimiento antes de actuar.
- **Documentación continua:** Si se introduce una nueva restricción ("nunca X", "siempre Y"), documentarla en este archivo.
- **Verificación pre-finalización:** Antes de marcar una tarea como completada, verificar que los endpoints del backend que consume la feature modificada respondan correctamente (200 OK) y que `ng build` compile sin errores. Si se modificó el backend, validar también `pnpm lint` y `pnpm test:unit`.


---

## Principios de Arquitectura

- **DRY / KISS / SoC / YAGNI / SOLID:** Sin over-engineering.
- **Componentes pequeños:** Una sola responsabilidad. Composición sobre configuración.
- **Lógica de dominio:** TypeScript nativo, sin acoplamiento a infraestructura.
- **Abstracciones:** Si se necesita una herramienta externa (ej. UUID), depender de interfaces, no de la implementación concreta.
- **Organización de código:** `core/`, `shared/`, `features/`, `layouts/`. Carpetas planas dentro de `features/`, una por dominio.


---

## RESTRICCIÓN CRÍTICA: Signals-Only

### PROHIBIDO ABSOLUTAMENTE

- ❌ `Observable`, `Subject`, `BehaviorSubject`, `ReplaySubject`
- ❌ `subscribe()`, `pipe()`, `map()`, `filter()`, `tap()`, `switchMap()`, `mergeMap()`
- ❌ `import { ... } from 'rxjs'` (excepto `HttpErrorResponse`, `catchError`, `throwError` en interceptors, y `firstValueFrom` si es estrictamente necesario)
- ❌ `@Injectable({ providedIn: 'root' })` → usar `@Service()`
- ❌ **`httpResource` en componentes de detalle.** En Angular 22, `httpResource` causa un doble fetch fantasma al montar el componente, generando un pestañeo (flicker) donde los datos aparecen, desaparecen y reaparecen. Para componentes de detalle se debe usar `HttpClient` directo con `signal()` manual. Ver excepción abajo.
- ❌ Servicios que devuelvan `Promise` para consultas
- ❌ Uso directo de `fetch()` nativo del navegador
- ❌ Template-driven forms (`FormsModule`, `NgForm`, `[(ngModel)]`) → usar exclusivamente **Signal Forms**

### OBLIGATORIO USAR

- ✅ `@Service()` para servicios (singleton automático)
- ✅ `httpResource()` para consultas GET (reactivo, auto-cancela, eager)
- ✅ `HttpClient` **solo para mutaciones** POST/PUT/DELETE (devuelve `Observable`, no hay alternativa)
- ✅ `signal()`, `computed()`, `effect()`, `linkedSignal()`
- ✅ Signal Forms (`form()`, `FormField`) para **todos** los formularios, sin excepción
- ✅ `resource()` con `fetch` solo si no se necesita el stack HTTP de Angular


---

## ⚠️ EXCEPCIÓN: Route Resolver para vistas de detalle

**Contexto:** En Angular 22, `httpResource` y `HttpClient` en el constructor
causan un pestañeo (flicker) en vistas de detalle. El componente renderiza
sin datos (estado vacío) y luego con datos cuando la respuesta llega.

**Solución correcta:** Usar un **Route Resolver** que precarga los datos
ANTES de que el componente se cree. Así el componente nace con los datos
listos y nunca pasa por un estado vacío.

```typescript
// work-order.resolver.ts
export const workOrderResolver: ResolveFn<WorkOrder> = (route) => {
  const http = inject(HttpClient);
  return firstValueFrom(http.get<WorkOrder>(`/api/work-orders/${route.paramMap.get('id')}`));
};

// app.routes.ts
{ path: ':id', component: DetailComponent, resolve: { workOrder: workOrderResolver } }

// detail.component.ts — simplificado, sin constructor ni httpResource
readonly data = signal<Entity>(this.route.snapshot.data['workOrder']);

load(): void {
  this.service.getById(id).subscribe({ next: (data) => this.data.set(data) });
}
```

**`httpResource` sigue siendo la opción correcta para:**
- Listas con filtros reactivos
- Consultas que cambian por signals
- Componentes sin problemas de flicker (dashboard, reportes, etc.)


---

## Patrones de Código

### Consultas GET → httpResource

`httpResource` es la API estándar de Angular 22 para fetching reactivo:
- **Eager:** inicia la petición inmediatamente
- **Auto-cancela:** cancela peticiones anteriores si params cambian
- **Reactivo:** refetch automático cuando signals dependientes cambian

```typescript
import { Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-clients-list',
  template: `
    @if (clientsResource.isLoading()) {
      <app-spinner />
    } @else if (clientsResource.hasValue()) {
      @for (client of clientsResource.value().data; track client.id) {
        <div>{{ client.name }}</div>
      }
    }
  `,
})
export class ClientsListComponent {
  readonly page = signal(1);

  readonly clientsResource = httpResource<PaginatedResponse<Client>>(
    () => `/api/clients?page=${this.page()}`,
  );
}
```

### Mutaciones POST/PUT/DELETE → HttpClient + signals

Para mutaciones se usa `HttpClient` dentro de un `@Service()`. El componente
usa `.subscribe()` actualizando signals locales. **HttpClient es la única excepción
RxJS porque Angular no ofrece alternativa para mutaciones.**

```typescript
// Servicio
import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class ClientsService {
  private http = inject(HttpClient);

  create(dto: CreateClientDto) {
    return this.http.post<Client>('/api/clients', dto);
  }

  update(id: string, dto: UpdateClientDto) {
    return this.http.patch<Client>(`/api/clients/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<void>(`/api/clients/${id}`);
  }
}
```

```typescript
// Componente
@Component({...})
export class ClientsListComponent {
  private clientsService = inject(ClientsService);

  readonly clientsResource = httpResource<PaginatedResponse<Client>>(
    () => `/api/clients?page=${this.page()}`
  );
  readonly loading = signal(false);

  createClient(dto: CreateClientDto): void {
    this.loading.set(true);
    this.clientsService.create(dto).subscribe({
      next: () => this.clientsResource.reload(),
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }

  deleteClient(id: string): void {
    this.clientsService.delete(id).subscribe({
      next: () => this.clientsResource.reload(),
    });
  }
}
```

### Formularios → Signal Forms (obligatorio)

**No se permite `FormsModule`, `NgForm`, ni `[(ngModel)]`.**
Todo formulario debe usar la API de Signal Forms de Angular.

```typescript
import { Component, signal } from '@angular/core';
import { form, FormField, required, email } from '@angular/forms/signals';

@Component({
  imports: [FormField],
  template: `
    <form [form]="clientForm" (submit)="onSubmit()">
      <input formControlName="name" />
      <input formControlName="email" />
      <button type="submit" [disabled]="!clientForm.valid() || saving()">
        Guardar
      </button>
    </form>
  `,
})
export class ClientFormComponent {
  readonly model = signal({ name: '', email: '' });
  readonly saving = signal(false);

  readonly clientForm = form(this.model, (schemaPath) => {
    required(schemaPath.name, { message: 'Nombre requerido' });
    email(schemaPath.email, { message: 'Email inválido' });
  });

  onSubmit(): void {
    if (this.clientForm.invalid()) return;
    this.saving.set(true);
    // llamar al servicio...
  }
}
```


---

## Excepciones Permitidas (RxJS)

1. **Interceptors de Angular:** La API de interceptors (`HttpInterceptorFn`) requiere `Observable`, `pipe`, `catchError`, `throwError` y `HttpErrorResponse`. Esto es aceptable porque es la API de Angular, no código de aplicación.

2. **`firstValueFrom`:** Solo en casos excepcionales de integración con librerías externas que devuelvan `Observable`.

3. **`.subscribe()` en mutaciones:** Única forma de ejecutar un `HttpClient.post/put/patch/delete`. Solo dentro de componentes, nunca anidado ni compuesto con operadores RxJS.

4. **`MatDialog.afterClosed().subscribe()`:** Para obtener el resultado de un diálogo. No tiene alternativa en signals.


---

## UI, Estilos y Accesibilidad

- **Estilos:** Tailwind CSS 4 como primario. Angular Material para componentes accesibles (tablas, diálogos, snackbar, form fields, datepickers).
- **Iconos:** Material Icons via `MatIconModule`. Importación explícita por componente, sin barrels.
- **Accesibilidad (a11y):** No es opcional. HTML semántico, roles ARIA cuando aplique, foco gestionado, contraste suficiente, etiquetas en campos de formulario.
- **Viewport:** `dvh` para layouts, `svh` para above-the-fold, `rem` para espaciado.
- **Fuentes:** Inter (headings + body) + JetBrains Mono (códigos y tracking codes).
- **Responsive:** Mobile-first. La app se usa en campo (técnicos) y escritorio (admin).
- **Tema:** Soporte light/dark completo vía CSS custom properties + `ThemeService`.


---

## Convenciones de Desarrollo

- **Servicios:** `@Service()` — no `@Injectable`. Singleton automático.
- **Componentes:** Standalone con `@Component`. No usar `@NgModule`.
- **Routing:** Lazy loading con `loadComponent()`. Guards como funciones (`CanActivateFn`).
- **SSR:** Híbrido — `Prerender` para landing, `Server` para portal de tracking, `Client` para admin/tech/seller.
- **Imports:** Directos y explícitos. **Sin barrels** (`index.ts` con `export *`).
- **i18n:** `TranslationService` + `TranslatePipe` con JSON en `public/i18n/{locale}.json`. La pipe soporta interpolación `{{param}}`.
- **Toast:** `toastService.show(message, 'success'|'error'|'warning'|'info')`.
- **Diálogos:** `MatDialog.open()` + `.afterClosed().subscribe()` para formularios de create/edit.
- **Loading global:** `LoadingService` con deferred indicator (300ms debounce).
- **Package manager:** `pnpm` exclusivamente. `pnpm install`, `pnpm add`, etc.
- **Runtime:** Node.js ≥ 18. Preferir ESM y sintaxis moderna.


---

## Decisiones de Dominio

| Decisión | Detalle |
|---|---|
| **QR** | Generación delegada al frontend. El backend provee los datos; el frontend renderiza la imagen QR. |
| **Reportes** | Patrón BFF. El backend computa todo y genera PDFs; el frontend solo renderiza el resultado. |
| **Tracking Code** | Formato `TS-XXXXX` (ej: `TS-A1B2C3`). El backend genera el código; el frontend lo muestra. |
| **Notificaciones** | Socket.IO. El frontend escucha eventos `notification` emitidos por el backend en tiempo real. |
| **Secretos** | Nunca exponer claves (ej: `MERCADOPAGO_PUBLIC_KEY`) hardcodeadas en código fuente. Usar `environments/`. |
| **Auth** | JWT Bearer token en header `Authorization`. Token almacenado en `localStorage` (`auth_token`). |
| **PWA** | Service Worker con `@angular/service-worker`. Estrategia `networkFirst` para `/api`, precaching de assets. Push notifications vía `PushNotificationService` + VAPID. |


---

## Backend API Contract

- **Base URL:** `/api/` (proxy en desarrollo → `localhost:3000`)
- **Autenticación:** JWT Bearer token en header `Authorization`
- **Swagger:** `http://localhost:3000/api/docs`
- **Respuesta exitosa:** `{ statusCode, data, timestamp }` — el interceptor `apiResponseInterceptor` desenvuelve `data` automáticamente.
- **Respuesta error:** `{ statusCode, message, error, timestamp }`
- **Paginación:** `{ data, total, page, limit, totalPages }`


---

## Testing

| Capa | Herramienta | Comando |
|---|---|---|
| Unit | Vitest (`vi.fn()`, `vi.spyOn()`, no Jasmine) | `pnpm test` |
| E2E | Playwright (chromium) | `pnpm test:e2e` |
| Mutation | Stryker + Vitest runner | `pnpm test:mutate` |

- Añadir o actualizar tests cuando se cambie comportamiento.
- No se acepta código con errores de tipos, lint o tests fallidos.
- Los tests usan `TestBed.configureTestingModule()` con providers mock para servicios.


---

## REGLA OBLIGATORIA: Verificación con `ng build`

**Después de CUALQUIER cambio en TypeScript, templates o estilos, ejecutar:**

```bash
npx ng build
```

**Por qué:** `ng build` captura errores que `tsc --noEmit` NO detecta:
- Errores de templates Angular (binding, interpolación, structural directives)
- Errores de `httpResource` (overload mismatches, tipos de arguments)
- Warnings de dependencias CommonJS
- Errores de prerendering/SSR
- Errores de bundling y chunks

**Flujo obligatorio:**
1. Hacer cambios
2. `npx ng build` → verificar 0 errores
3. Si hay errores, corregir antes de continuar
4. Actualizar `TODO.md` si se agregó una feature, se completó una tarea pendiente o surgieron nuevos requisitos
5. El error de prerender en `/` (timeout a `/api/business-settings`) es pre-existente y esperado cuando el backend no está corriendo — ignorar ese error específico


---

## Pull Requests y Commits

- **Nunca commitear directamente a `main`.** Todo cambio pasa por PR.
- **Branch naming:** `feat/nombre`, `fix/nombre`, `docs/nombre`, `refactor/nombre`.
- **PRs pequeños y enfocados.** Explicar qué cambió, por qué y cómo se verificó.
- **Pre-commit:** `pnpm test && pnpm lint`.
- **Commits:** Mensajes descriptivos en español.


---

## Construcción de documentación

- **ROADMAP.md**: Archivo de planificación a largo plazo con tabla de próximos pasos priorizados. Ver ROADMAP.md para la estructura.
- **TODO.md**: Archivo de contexto rápido con últimas features, bugs conocidos y próxima sesión. Ver TODO.md para el estado actual.
- **ROADMAP.md** y **TODO.md** se actualizan al finalizar cada tarea (al recibir OK del usuario).
- **`docs/domain/`**: Flujos de negocio transversales documentados archivo por archivo con diagramas Mermaid y referencias `archivo:línea` al código real. Índice en `docs/domain/README.md`. Cubren Inquiry → Pending → WorkOrder, ciclo de vida de la WorkOrder, Invoice/Payment, y notificaciones en tiempo real.


---

## Highlight pulse en listas (global search)

Para listas que reciben navegación con `?highlight=ID&search=text` desde el buscador global:

```typescript
// Signals internos
private readonly _routeHighlight = signal<string | null>(null);
private readonly _clearHighlight = signal(false);

// highlightedId es un computed que depende del resource data
readonly highlightedId = computed(() => {
  const data = this.resource.value();
  const loading = this.resource.isLoading();
  const cleared = this._clearHighlight();
  const routeHighlight = this._routeHighlight();
  if (!data || cleared || loading) return null;
  const match = data.data.find((row) => row.id === routeHighlight);
  return match?.id ?? null;
});

// Template
[class.highlight-pulse]="highlightedId() === row.id && !_clearHighlight()"
```

**Reglas:**
- `highlightedId` es **computed** (no signal) — depende del resource data para evitar animación antes de que lleguen los datos
- Efecto de animación solo cuando la navegación **cambia de sección** (comparar path anterior con nuevo)
- **Sin `effect()`** — usar `NavigationStart` + `NavigationEnd` con `takeUntilDestroyed`
- CSS global: clase `.highlight-pulse` + `@keyframes highlight-pulse` en `styles.css` (2s pulse)
- `clearFilters` debe resetear `_routeHighlight` y `_clearHighlight`

**Patrón completo en:** `src/app/features/users/users-list.component.ts`, `src/app/features/inquiries/inquiries-list.component.ts`


```bash
pnpm start                 # Dev server con SSR + proxy
npx ng build               # Build producción con SSR + prerender
pnpm test                  # Unit tests (Vitest)
pnpm test:e2e              # E2E tests (Playwright)
pnpm test:e2e:ui           # E2E con Playwright UI
pnpm test:mutate           # Mutation testing (Stryker)
pnpm lint                  # Linter (ESLint + Angular ESLint + Prettier como regla de formato)
pnpm lint --fix            # Auto-corrige errores de formato y reglas fixable
pnpm sync:types            # Generar interfaces desde Swagger del backend
```

> **Lint y formato:** `pnpm lint` es la única puerta de formato del proyecto. Incluye ESLint (TypeScript + templates Angular) y Prettier como regla `prettier/prettier` — no se necesita correr `prettier` por separado. Correr `pnpm lint --fix` antes de commitear para formatear automáticamente. Config: `eslint.config.js` (flat config), `.prettierrc` (printWidth 100, single quotes).


---

## Troubleshooting: Lockfile (pnpm)

Cuando `pnpm i` falla con `Broken lockfile` o `ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY`:

```bash
pnpm clean --lockfile   # Elimina lockfile y node_modules
pnpm i                  # Regenera desde cero
```

**Causa:** Lockfile desincronizado por dependabot, merge manual de `package.json`, o installs parciales.
**Prevención:** Siempre hacer `pnpm i` completo después de pull. Nunca editar `pnpm-lock.yaml` manualmente.
