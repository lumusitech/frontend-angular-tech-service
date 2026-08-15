import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KanbanCardComponent } from './kanban-card.component';
import { WorkOrder, WorkOrderStatus } from '../../../core/models/work-order.interfaces';

function makeOrder(id: string, status: WorkOrderStatus): WorkOrder {
  return {
    id,
    trackingCode: `TS-${id}`,
    status,
    priority: 'high',
    location: 'workshop',
    client: { id: 'c-1', name: 'Client A', email: 'a@b.c', phone: '123' },
    serviceType: { id: 'st-1', name: 'Repair' },
    technicians: [{ id: 't-1', name: 'Tech One' }],
    tasks: [],
    materials: [],
    notes: [],
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  };
}

describe('KanbanCardComponent', () => {
  let component: KanbanCardComponent;
  let fixture: ComponentFixture<KanbanCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('order', makeOrder('1', 'in_progress'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the tracking code', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('TS-1');
  });

  it('should render client name and service type', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Client A');
    expect(el.textContent).toContain('Repair');
  });

  it('should render technician initials', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('T');
  });

  it('should emit order id when clicked', () => {
    const spy = vi.fn();
    component.cardClick.subscribe(spy);
    const el = fixture.nativeElement as HTMLElement;
    const card = el.querySelector('div')!;
    card.dispatchEvent(new Event('click'));
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should emit order id when Enter is pressed', () => {
    const spy = vi.fn();
    component.cardClick.subscribe(spy);
    const el = fixture.nativeElement as HTMLElement;
    const card = el.querySelector('div')!;
    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(spy).toHaveBeenCalledWith('1');
  });
});
