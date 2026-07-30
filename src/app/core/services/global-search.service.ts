import { Service, inject, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClientsService } from './clients.service';
import { WorkOrdersService } from './work-orders.service';
import { SuppliersService } from './suppliers.service';
import { ServiceTypesService } from './service-types.service';
import { SkillsService } from './skills.service';
import { InquiriesService } from './inquiries.service';
import { ExpensesService } from './expenses.service';
import { PendingItemsService } from './pending-items.service';
import { NotificationsService } from './notifications.service';
import { Client } from '../models/client.interfaces';
import { WorkOrder } from '../models/work-order.interfaces';
import { Supplier } from '../models/supplier.interfaces';
import { ServiceType } from '../models/service-type.interfaces';
import { Skill } from '../models/skill.interfaces';
import { Inquiry } from '../models/inquiry.interfaces';
import { Expense } from '../models/expense.interfaces';
import { PendingItem } from '../models/pending-item.interfaces';
import { AppNotification } from '../models/notification.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';

export interface SearchResult {
  type: 'client' | 'work-order' | 'supplier' | 'service-type' | 'skill' | 'inquiry' | 'expense' | 'pending-item' | 'notification';
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
  private readonly serviceTypesService = inject(ServiceTypesService);
  private readonly skillsService = inject(SkillsService);
  private readonly inquiriesService = inject(InquiriesService);
  private readonly expensesService = inject(ExpensesService);
  private readonly pendingItemsService = inject(PendingItemsService);
  private readonly notificationsService = inject(NotificationsService);

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
      clients: this.clientsService.getAll({ search: query, limit: 3 }).pipe(
        catchError(() => of({ data: [], total: 0, page: 1, limit: 3, totalPages: 0 })),
      ),
      workOrders: this.workOrdersService.getAll({ search: query, limit: 3 }).pipe(
        catchError(() => of({ data: [], total: 0, page: 1, limit: 3, totalPages: 0 })),
      ),
      suppliers: this.suppliersService.getAll({ search: query, limit: 3 }).pipe(
        catchError(() => of({ data: [], total: 0, page: 1, limit: 3, totalPages: 0 })),
      ),
      serviceTypes: this.serviceTypesService.getAll({ search: query, limit: 3 }).pipe(
        catchError(() => of({ data: [], total: 0, page: 1, limit: 3, totalPages: 0 })),
      ),
      skills: this.skillsService.getAll({ search: query, limit: 3 }).pipe(
        catchError(() => of({ data: [], total: 0, page: 1, limit: 3, totalPages: 0 })),
      ),
      inquiries: this.inquiriesService.getAll({ search: query, limit: 3 }).pipe(
        catchError(() => of({ data: [], total: 0, page: 1, limit: 3, totalPages: 0 })),
      ),
      expenses: this.expensesService.getAll({ search: query, limit: 3 }).pipe(
        catchError(() => of({ data: [], total: 0, page: 1, limit: 3, totalPages: 0 })),
      ),
      pendingItems: this.pendingItemsService.getAll({ search: query, limit: 3 }).pipe(
        catchError(() => of({ data: [], total: 0, page: 1, limit: 3, totalPages: 0 })),
      ),
      notifications: this.notificationsService.getAll({ search: query, limit: 3 }).pipe(
        catchError(() => of({ data: [], total: 0, page: 1, limit: 3, totalPages: 0 })),
      ),
    }).subscribe(({ clients, workOrders, suppliers, serviceTypes, skills, inquiries, expenses, pendingItems, notifications }) => {
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
        ...serviceTypes.data.map((st: ServiceType) => ({
          type: 'service-type' as const,
          id: st.id,
          title: st.name,
          subtitle: st.description || '',
          icon: 'build',
          route: `/admin/service-types`,
        })),
        ...skills.data.map((sk: Skill) => ({
          type: 'skill' as const,
          id: sk.id,
          title: sk.name,
          subtitle: sk.description || sk.category || '',
          icon: 'handyman',
          route: `/admin/skills`,
        })),
        ...inquiries.data.map((inq: Inquiry) => ({
          type: 'inquiry' as const,
          id: inq.id,
          title: inq.clientName,
          subtitle: inq.clientEmail || inq.clientPhone || '',
          icon: 'question_answer',
          route: `/admin/inquiries/${inq.id}`,
        })),
        ...expenses.data.map((exp: Expense) => ({
          type: 'expense' as const,
          id: exp.id,
          title: exp.description,
          subtitle: `$${Number(exp.amount).toFixed(2)}`,
          icon: 'receipt_long',
          route: `/admin/expenses`,
        })),
        ...pendingItems.data.map((pi: PendingItem) => ({
          type: 'pending-item' as const,
          id: pi.id,
          title: pi.title,
          subtitle: pi.description || '',
          icon: 'pending_actions',
          route: `/admin/pending-items`,
        })),
        ...notifications.data.map((n: AppNotification) => ({
          type: 'notification' as const,
          id: n.id,
          title: n.title,
          subtitle: n.message,
          icon: 'notifications',
          route: `/admin/notifications`,
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
