import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { KanbanBoardComponent } from './kanban-board.component';
import { WorkOrdersService } from '../../../core/services/work-orders.service';
import { WebsocketService } from '../../../core/services/websocket.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslationService } from '../../../core/services/translation.service';
import { WorkOrder, WorkOrderStatus } from '../../../core/models/work-order.interfaces';
import { PaginatedResponse } from '../../../core/models/client.interfaces';

function makeOrder(id: string, status: WorkOrderStatus, requiresDelivery = false): WorkOrder {
  return {
    id,
    trackingCode: `TS-${id}`,
    status,
    priority: 'medium',
    location: 'workshop',
    client: { id: 'c-1', name: 'Client A', email: 'a@b.c', phone: '123' },
    serviceType: { id: 'st-1', name: 'Repair', requiresDelivery },
    technicians: [],
    tasks: [],
    materials: [],
    notes: [],
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  };
}

function makeDropEvent(
  previousContainerId: string,
  containerId: string,
  order: WorkOrder,
): CdkDragDrop<WorkOrder[]> {
  const sameContainer = previousContainerId === containerId;
  const previousContainer = {
    id: previousContainerId,
    data: [order],
  } as unknown as CdkDragDrop<WorkOrder[]>['previousContainer'];
  const container = sameContainer
    ? previousContainer
    : ({ id: containerId, data: [] } as unknown as CdkDragDrop<WorkOrder[]>['container']);
  return {
    previousIndex: 0,
    currentIndex: 0,
    item: { data: order } as unknown as CdkDragDrop<WorkOrder[]>['item'],
    previousContainer,
    container,
    isPointerOverContainer: true,
    distance: { x: 0, y: 0 },
    dropPoint: { x: 0, y: 0 },
    event: {} as MouseEvent,
  };
}

describe('KanbanBoardComponent', () => {
  let component: KanbanBoardComponent;
  let fixture: ComponentFixture<KanbanBoardComponent>;
  let httpMock: HttpTestingController;
  let updateSpy: ReturnType<typeof vi.fn>;
  let toastSpy: ReturnType<typeof vi.fn>;
  let navigateSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    updateSpy = vi.fn().mockReturnValue(of({}));
    toastSpy = vi.fn();
    navigateSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [KanbanBoardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: WorkOrdersService, useValue: { update: updateSpy } },
        { provide: WebsocketService, useValue: { workOrderRefreshKey: () => 0 } },
        { provide: ToastService, useValue: { show: toastSpy } },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((k: string) => k) },
        },
        { provide: Router, useValue: { navigate: navigateSpy } },
      ],
    });

    fixture = TestBed.createComponent(KanbanBoardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.match(() => true).forEach((req) => req.flush({}));
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('columns', () => {
    function flushOrders(orders: WorkOrder[]): void {
      const req = httpMock.expectOne((r) => r.url === '/api/work-orders');
      const body: PaginatedResponse<WorkOrder> = {
        data: orders,
        total: orders.length,
        page: 1,
        limit: 200,
        totalPages: 1,
      };
      req.flush(body);
    }

    it('should group orders by status', async () => {
      flushOrders([
        makeOrder('1', 'pending'),
        makeOrder('2', 'in_progress'),
        makeOrder('3', 'pending'),
      ]);
      await Promise.resolve();
      fixture.detectChanges();

      const columns = component.columns();
      const pending = columns.find((c) => c.status === 'pending')!;
      const inProgress = columns.find((c) => c.status === 'in_progress')!;
      expect(pending.orders).toHaveLength(2);
      expect(inProgress.orders).toHaveLength(1);
    });
  });

  describe('enterPredicate', () => {
    function dragOf(order: WorkOrder): CdkDragDrop<WorkOrder[]>['item'] {
      return { data: order } as unknown as CdkDragDrop<WorkOrder[]>['item'];
    }

    function dropOf(id: string): CdkDragDrop<WorkOrder[]>['container'] {
      return { id } as unknown as CdkDragDrop<WorkOrder[]>['container'];
    }

    it('should allow drop into same column', () => {
      const order = makeOrder('1', 'pending');
      expect(component.enterPredicate(dragOf(order), dropOf('kanban-pending'))).toBe(true);
    });

    it('should allow drop into a valid target column', () => {
      const order = makeOrder('1', 'pending');
      expect(component.enterPredicate(dragOf(order), dropOf('kanban-assigned'))).toBe(true);
    });

    it('should reject drop into invalid target column', () => {
      const order = makeOrder('1', 'pending');
      expect(component.enterPredicate(dragOf(order), dropOf('kanban-in_progress'))).toBe(false);
    });

    it('should allow delivered drop only when service requires delivery', () => {
      const deliveryOrder = makeOrder('1', 'completed', true);
      const nonDeliveryOrder = makeOrder('2', 'completed', false);
      expect(component.enterPredicate(dragOf(deliveryOrder), dropOf('kanban-delivered'))).toBe(
        true,
      );
      expect(component.enterPredicate(dragOf(nonDeliveryOrder), dropOf('kanban-delivered'))).toBe(
        false,
      );
    });
  });

  describe('onDrop', () => {
    it('should call update when dropping into a different valid column', () => {
      const order = makeOrder('1', 'pending');
      const event = makeDropEvent('kanban-pending', 'kanban-assigned', order);
      component.onDrop(event);
      expect(updateSpy).toHaveBeenCalledWith('1', { status: 'assigned' });
    });

    it('should not call update when dropping into invalid column', () => {
      const order = makeOrder('1', 'pending');
      const event = makeDropEvent('kanban-pending', 'kanban-in_progress', order);
      component.onDrop(event);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should not call update when dropping into the same column', () => {
      const order = makeOrder('1', 'pending');
      const event = makeDropEvent('kanban-pending', 'kanban-pending', order);
      component.onDrop(event);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should show success toast on success', () => {
      const order = makeOrder('1', 'pending');
      const event = makeDropEvent('kanban-pending', 'kanban-assigned', order);
      component.onDrop(event);
      expect(toastSpy).toHaveBeenCalledWith('workOrders.kanban.toast.statusChanged', 'success');
    });

    it('should update status optimistically without reloading', async () => {
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

      const order = makeOrder('1', 'pending');
      const event = makeDropEvent('kanban-pending', 'kanban-assigned', order);
      component.onDrop(event);

      const board = component as unknown as Record<string, unknown>;
      const orders = board['orders'] as () => WorkOrder[];
      expect(orders()[0].status).toBe('assigned');
    });

    it('should revert optimistic status when update fails', async () => {
      updateSpy.mockReturnValue(throwError(() => new Error('fail')));
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

      const order = makeOrder('1', 'pending');
      const event = makeDropEvent('kanban-pending', 'kanban-assigned', order);
      component.onDrop(event);

      const board = component as unknown as Record<string, unknown>;
      const orders = board['orders'] as () => WorkOrder[];
      expect(orders()[0].status).toBe('pending');
    });

    it('should show error toast when update fails', () => {
      updateSpy.mockReturnValue(throwError(() => new Error('fail')));
      const order = makeOrder('1', 'pending');
      const event = makeDropEvent('kanban-pending', 'kanban-assigned', order);
      component.onDrop(event);
      expect(toastSpy).toHaveBeenCalledWith('workOrders.kanban.toast.error', 'error');
    });
  });

  describe('navigation', () => {
    it('should navigate to detail on viewDetail', () => {
      component.viewDetail('w-1');
      expect(navigateSpy).toHaveBeenCalledWith(['/admin/work-orders', 'w-1']);
    });

    it('should navigate to list on goToList', () => {
      component.goToList();
      expect(navigateSpy).toHaveBeenCalledWith(['/admin/work-orders']);
    });
  });

  describe('drag feedback DOM', () => {
    it('should render each card wrapped in a cdk drag container', async () => {
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

      const el = fixture.nativeElement as HTMLElement;
      const dragWrappers = el.querySelectorAll('.cdk-drag-kanban-card');
      expect(dragWrappers.length).toBe(1);
      expect(dragWrappers[0].getAttribute('cdkdrag')).not.toBeNull();
    });
  });

  describe('progressive autoscroll', () => {
    type PrivateBoard = KanbanBoardComponent & Record<string, unknown>;

    function setBoardContainer(rect = { left: 0, right: 1000 }): void {
      const board = component as unknown as PrivateBoard;
      const container = { getBoundingClientRect: () => rect } as unknown as HTMLDivElement;
      // boardScrollEl is a read-only signal invoked as a function; replace its accessor
      Object.defineProperty(board, 'boardScrollEl', {
        configurable: true,
        get: () => () => ({ nativeElement: container }),
      });
    }

    it('should produce faster speeds as closeness increases', () => {
      const board = component as unknown as PrivateBoard;
      const speedFor = board['speedFor'] as (closeness: number) => number;

      const slow = speedFor.call(board, 0.2);
      const medium = speedFor.call(board, 0.5);
      const fast = speedFor.call(board, 1);

      expect(fast).toBeGreaterThan(medium);
      expect(medium).toBeGreaterThan(slow);
      expect(slow).toBeGreaterThan(0);
    });

    it('should set right direction when pointer is near the right edge', () => {
      setBoardContainer();
      const board = component as unknown as PrivateBoard;
      component.onDragMoved({
        pointerPosition: { x: 900, y: 0 },
      } as unknown as CdkDragMove);
      expect(board['autoscrollDirection']).toBe('right');
      expect(board['autoscrollSpeed']).toBeGreaterThan(0);
      expect(board['autoscrollRaf']).toBeGreaterThan(0);
    });

    it('should set left direction when pointer is near the left edge', () => {
      setBoardContainer({ left: 100, right: 1000 });
      const board = component as unknown as PrivateBoard;
      component.onDragMoved({ pointerPosition: { x: 150, y: 0 } } as unknown as CdkDragMove);
      expect(board['autoscrollDirection']).toBe('left');
      expect(board['autoscrollSpeed']).toBeGreaterThan(0);
    });

    it('should stop autoscroll when pointer is far from both edges', () => {
      setBoardContainer();
      const board = component as unknown as PrivateBoard;
      board['autoscrollDirection'] = 'right';
      board['autoscrollRaf'] = 1;

      component.onDragMoved({ pointerPosition: { x: 500, y: 0 } } as unknown as CdkDragMove);
      expect(board['autoscrollDirection']).toBeNull();
    });
  });
});
