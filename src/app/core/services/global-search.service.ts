import { Service, inject, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClientsService } from './clients.service';
import { WorkOrdersService } from './work-orders.service';
import { SuppliersService } from './suppliers.service';
import { Client } from '../models/client.interfaces';
import { WorkOrder } from '../models/work-order.interfaces';
import { Supplier } from '../models/supplier.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';

export interface SearchResult {
  type: 'client' | 'work-order' | 'supplier';
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  route: string;
}

@Service()
export class GlobalSearchService {
  private readonly clientsService = inject(ClientsService);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly suppliersService = inject(SuppliersService);

  readonly results = signal<SearchResult[]>([]);
  readonly loading = signal(false);

  search(query: string): void {
    if (!query || query.trim().length < 2) {
      this.results.set([]);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    forkJoin({
      clients: this.clientsService.getAll({ search: query, limit: 5 }).pipe(
        catchError(() => of({ data: [], total: 0, page: 1, limit: 5, totalPages: 0 })),
      ),
      workOrders: this.workOrdersService.getAll({ search: query, limit: 5 }).pipe(
        catchError(() => of({ data: [], total: 0, page: 1, limit: 5, totalPages: 0 })),
      ),
      suppliers: this.suppliersService.getAll({ search: query, limit: 5 }).pipe(
        catchError(() => of({ data: [], total: 0, page: 1, limit: 5, totalPages: 0 })),
      ),
    }).subscribe(({ clients, workOrders, suppliers }) => {
      const results: SearchResult[] = [
        ...clients.data.map((c: Client) => ({
          type: 'client' as const,
          id: c.id,
          title: c.name,
          subtitle: c.email || c.phone,
          icon: 'person',
          route: `/admin/clients/${c.id}`,
        })),
        ...workOrders.data.map((wo: WorkOrder) => ({
          type: 'work-order' as const,
          id: wo.id,
          title: wo.trackingCode,
          subtitle: wo.client?.name
            ? `${wo.client.name}${wo.serviceType?.name ? ' - ' + wo.serviceType.name : ''}`
            : '',
          icon: 'assignment',
          route: `/admin/work-orders/${wo.id}`,
        })),
        ...suppliers.data.map((s: Supplier) => ({
          type: 'supplier' as const,
          id: s.id,
          title: s.name,
          subtitle: s.contact || s.email || '',
          icon: 'local_shipping',
          route: `/admin/suppliers`,
        })),
      ];

      this.results.set(results);
      this.loading.set(false);
    });
  }

  clear(): void {
    this.results.set([]);
    this.loading.set(false);
  }
}
