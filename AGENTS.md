# AGENTS.md — Frontend Angular Tech Service

## Proyecto

Frontend Angular 22 para sistema de gestión de servicios técnicos.
**Stack:** Angular 22, Signals, httpResource, Tailwind CSS 4, Angular Material 22

## RESTRICCIÓN CRÍTICA: Signals-Only

### PROHIBIDO ABSOLUTAMENTE:

- ❌ `Observable`, `Subject`, `BehaviorSubject`, `ReplaySubject`
- ❌ `subscribe()`, `pipe()`, `map()`, `filter()`, `tap()`, `switchMap()`, `mergeMap()`
- ❌ `import { ... } from 'rxjs'` (excepto `firstValueFrom` si es estrictamente necesario)
- ❌ `@Injectable({ providedIn: 'root' })` → usar `@Service()`
- ❌ Servicios que devuelvan `Promise` para consultas
- ❌ Uso directo de `fetch()` nativo del navegador

### OBLIGATORIO USAR:

- ✅ `@Service()` para servicios (singleton automático)
- ✅ `httpResource()` para consultas GET (reactivo, auto-cancela, eager)
- ✅ `HttpClient` para mutaciones POST/PUT/DELETE (devuelve Observable)
- ✅ `signal()`, `computed()`, `effect()`, `linkedSignal()`
- ✅ Signal Forms (`form()`, `FormField`) para formularios
- ✅ `resource()` con `fetch` solo si no se necesita el stack HTTP de Angular

---

## Patrones de código

### Patrón para consultas (GET) → httpResource

`httpResource` es la API estándar de Angular 22 para fetching reactivo. Es:

- **Eager**: inicia la petición inmediatamente
- **Auto-cancela**: cancela peticiones anteriores si params cambian
- **Reactivo**: refetch automático cuando signals dependientes cambian

```typescript
import { Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-clients-list',
  template: `
    @if (clientsResource.isLoading()) {
      <spinner />
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

### Patrón para mutaciones (POST/PUT/DELETE) → HttpClient + signals

Para mutaciones se usa `HttpClient` dentro de un `@Service()`. El componente
usa `.subscribe()` actualizando signals locales.

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
      error: () => {},
      complete: () => this.loading.set(false)
    });
  }

  deleteClient(id: string): void {
    this.clientsService.delete(id).subscribe({
      next: () => this.clientsResource.reload()
    });
  }
}
```

### Patrón para formularios → Signal Forms

```typescript
import { Component, signal } from '@angular/core';
import { form, FormField, required, email } from '@angular/forms/signals';

@Component({
  imports: [FormField],
  template: `
    <form [form]="clientForm">
      <input formControlName="name" />
      <input formControlName="email" />
    </form>
  `,
})
export class ClientFormComponent {
  readonly model = signal({
    name: '',
    email: '',
  });

  readonly clientForm = form(this.model, (schemaPath) => {
    required(schemaPath.name, { message: 'Nombre requerido' });
    email(schemaPath.email, { message: 'Email inválido' });
  });
}
```

---

## Excepciones permitidas

1. **Interceptors de Angular**: La API de interceptors requiere rxjs (Observable, pipe, catchError, throwError). Esto es aceptable porque es la API de Angular, no código de aplicación.

2. **firstValueFrom**: Solo en casos excepcionales donde se necesita integrar con librerías que devuelven Observable.

---

## Convenciones del proyecto

- **Servicios**: Usar `@Service()` (no `@Injectable`)
- **Componentes**: Standalone con `@Component`
- **Routing**: Lazy loading con `loadComponent()`
- **SSR**: Híbrido (Prerender para landing, Server para portal, Client para admin/tech)
- **Styling**: Tailwind CSS 4 como primario, Angular Material para componentes accesibles
- **Viewport**: `dvh` para layouts, `svh` para above-the-fold, `rem` para espaciado
- **Fuentes**: Inter (headings + body) + JetBrains Mono (códigos)

---

## REGLA OBLIGATORIA: Verificación con `ng build`

**Después de CUALQUIER cambio en código TypeScript, templates o estilos, EJECUTAR obligatoriamente:**

```bash
npx ng build
```

**Por qué:** `ng build` captura errores y warnings que `tsc --noEmit` NO detecta:
- Errores de templates Angular (binding, interpolación, structural directives)
- Errores de `httpResource` (overload mismatches, tipos de arguments)
- Warnings de dependencias CommonJS
- Errores de prerendering/SSR
- Errores de bundling y chunks

**No es suficiente con `tsc --noEmit`** — solo verifica tipos TypeScript, no el template compilation ni el build completo de Angular.

**Flujo obligatorio:**
1. Hacer cambios
2. `npx ng build` → verificar 0 errores TypeScript/build
3. Si hay errores, corregir antes de continuar
4. Actualizar `TODO.md` si se agregó una feature, se completó una tarea pendiente o surgieron nuevos requisitos
5. El error de prerender en `/` (timeout a `/api/business-settings`) es pre-existente y esperado cuando el backend no está corriendo — ignorar ese error específico

---

## REGLA OBLIGATORIA: Crear PR para cada cambio

**Cada grupo de cambios relacionados DEBE tener su propia Pull Request:**

1. Crear un branch descriptivo: `feat/nombre-feature`, `fix/nombre-fix`, `docs/que-se-actualizo`
2. Commitear con mensajes descriptivos
3. Hacer push al branch
4. Crear PR con título claro usando `gh pr create`
5. Si el branch ya tiene una PR abierta, los nuevos commits se agregan automáticamente

**No commitear directamente a `main`** — siempre a través de PR.

**Regla: un cambio = una PR.** Si se mezclan features distintas en un mismo commit, el review se complica.

---

## Backend API

- **Base URL:** `/api/` (proxy en desarrollo → localhost:3000)
- **Auth:** JWT Bearer token en header `Authorization`
- **Swagger:** `http://localhost:3000/api/docs`
- **Respuestas exitosas:** `{ statusCode, data, timestamp }`
- **Respuestas error:** `{ statusCode, message, error, timestamp }`
- **Paginación:** `{ data, total, page, limit, totalPages }`

## Comandos útiles

```bash
ng serve                    # Dev server con SSR
ng build                    # Build con SSR + prerender
ng test                     # Unit tests (Vitest)
pnpm sync:types          # Generar interfaces desde Swagger
```

---

## Solución a problemas comunes de lockfile (pnpm)

Cuando `pnpm i` falla con errores como:
- `Broken lockfile: no entry for ...`
- `Lockfile failed supply-chain policy check`
- `ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY`

**Solución (en el proyecto afectado — frontend o backend):**

```bash
pnpm clean --lockfile   # Elimina lockfile y node_modules
pnpm i                  # Regenera desde cero
```

**Causa:** El lockfile queda desincronizado cuando dependencias se actualizan parcialmente (ej. dependabot, merge manual de package.json sin lockfile, o installs parciales).

**Prevención:** Siempre hacer `pnpm i` completo después de pull, nunca editar `pnpm-lock.yaml` manualmente.
