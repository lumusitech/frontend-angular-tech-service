# Rules for Frontend Angular Tech Service

## CRITICAL: Signals-Only Architecture

This project uses Angular 22 with Signals. DO NOT use rxjs patterns.

### FORBIDDEN:

- Observable, Subject, BehaviorSubject, ReplaySubject
- subscribe(), pipe(), map(), filter(), tap(), switchMap()
- import { ... } from 'rxjs' (except firstValueFrom if absolutely necessary)
- @Injectable({ providedIn: 'root' }) → use @Service() instead
- Services returning Promise for data fetching
- Direct use of browser's fetch() API

### REQUIRED:

- @Service() for services (automatic singleton)
- httpResource() for GET queries (reactive, auto-cancel, eager)
- HttpClient for mutations POST/PUT/DELETE (returns Observable)
- signal(), computed(), effect(), linkedSignal()
- Signal Forms (form(), FormField) for forms
- resource() with fetch only if Angular HTTP stack is not needed

### Code Patterns:

#### GET queries → httpResource

```typescript
readonly clientsResource = httpResource<PaginatedResponse<Client>>(
  () => `/api/clients?page=${this.page()}`
);
```

#### POST/PUT/DELETE mutations → HttpClient + signals

```typescript
// Service
@Service()
export class ClientsService {
  private http = inject(HttpClient);
  create(dto: CreateClientDto) {
    return this.http.post<Client>('/api/clients', dto);
  }
}

// Component
createClient(dto: CreateClientDto): void {
  this.loading.set(true);
  this.clientsService.create(dto).subscribe({
    next: () => this.clientsResource.reload(),
    complete: () => this.loading.set(false)
  });
}
```

### Exceptions:

- Angular interceptors (API requires rxjs)
- firstValueFrom only for integrating with Observable-returning libraries
