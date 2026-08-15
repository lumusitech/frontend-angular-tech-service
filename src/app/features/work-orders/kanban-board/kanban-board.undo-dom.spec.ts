import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { KanbanBoardComponent } from './kanban-board.component';
import { WorkOrdersService } from '../../../core/services/work-orders.service';
import { WebsocketService } from '../../../core/services/websocket.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { WorkOrder, WorkOrderStatus } from '../../../core/models/work-order.interfaces';
import { PaginatedResponse } from '../../../core/models/client.interfaces';

function makeOrder(id: string, status: WorkOrderStatus): WorkOrder {
  return {
    id,
    trackingCode: `TS-${id}`,
    status,
    priority: 'medium',
    location: 'workshop',
    client: { id: 'c-1', name: 'Client A', email: 'a@b.c', phone: '123' },
    serviceType: { id: 'st-1', name: 'Repair', requiresDelivery: false },
    technicians: [],
    tasks: [],
    materials: [],
    notes: [],
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  };
}

describe('KanbanBoardComponent undo snackbar DOM', () => {
  let fixture: ComponentFixture<KanbanBoardComponent>;
  let httpMock: HttpTestingController;
  let updateSpy: ReturnType<typeof vi.fn>;

  const VIEWPORTS: { name: string; width: number; height: number }[] = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  beforeEach(() => {
    updateSpy = vi.fn().mockReturnValue(of({}));

    TestBed.configureTestingModule({
      imports: [KanbanBoardComponent, MatSnackBarModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: WorkOrdersService, useValue: { update: updateSpy } },
        {
          provide: WebsocketService,
          useValue: { workOrderRefreshKey: () => 0, suppressToastFor: vi.fn() },
        },
        { provide: ToastService, useValue: { show: vi.fn() } },
        { provide: TranslationService, useValue: { instant: (k: string) => k } },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    });

    fixture = TestBed.createComponent(KanbanBoardComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.match(() => true).forEach((req) => req.flush({}));
    httpMock.verify();
    document.body.querySelectorAll('mat-snack-bar-container').forEach((n) => n.remove());
  });

  async function moveCardAcrossColumns(): Promise<void> {
    httpMock
      .match((r) => r.url === '/api/work-orders')
      .forEach((req) =>
        req.flush({
          data: [makeOrder('1', 'pending')],
          total: 1,
          page: 1,
          limit: 200,
          totalPages: 1,
        } satisfies PaginatedResponse<WorkOrder>),
      );
    await Promise.resolve();
    fixture.detectChanges();

    fixture.componentInstance.onDrop({
      previousContainer: { id: 'kanban-pending', data: [makeOrder('1', 'pending')] },
      container: { id: 'kanban-assigned', data: [] },
      previousIndex: 0,
      currentIndex: 0,
      item: { data: makeOrder('1', 'pending') },
      dropPoint: { x: 0, y: 0 },
      event: {} as MouseEvent,
    } as never);

    await Promise.resolve();
    await Promise.resolve();
    fixture.detectChanges();
  }

  for (const viewport of VIEWPORTS) {
    it(`renders the Deshacer button inside the snackbar (${viewport.name} ${viewport.width}px)`, async () => {
      window.innerWidth = viewport.width;
      window.innerHeight = viewport.height;
      window.dispatchEvent(new Event('resize'));

      await moveCardAcrossColumns();

      const actionButton = document.body.querySelector(
        '.mat-mdc-snack-bar-actions button',
      ) as HTMLElement | null;
      expect(actionButton).not.toBeNull();
      expect(actionButton?.textContent?.trim()).toContain('workOrders.kanban.undo');
    });
  }

  it('clicking Deshacer reverts the card to its previous column', async () => {
    await moveCardAcrossColumns();

    const actionButton = document.body.querySelector(
      '.mat-mdc-snack-bar-actions button',
    ) as HTMLElement | null;
    expect(actionButton).not.toBeNull();
    actionButton?.click();
    await Promise.resolve();

    expect(updateSpy).toHaveBeenLastCalledWith('1', { status: 'pending' });
    const board = fixture.componentInstance as unknown as Record<string, unknown>;
    const orders = board['orders'] as () => WorkOrder[];
    expect(orders()[0].status).toBe('pending');
  });
});
