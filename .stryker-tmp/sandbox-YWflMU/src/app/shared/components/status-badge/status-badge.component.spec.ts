// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let component: StatusBadgeComponent;
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('workOrderStatus', () => {
    it('should render pending status badge', () => {
      fixture.componentRef.setInput('value', 'pending');
      fixture.componentRef.setInput('type', 'workOrderStatus');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge).toBeTruthy();
      expect(badge.textContent.trim()).toBeTruthy();
      expect(badge.className).toContain('bg-yellow-500/15');
    });

    it('should render completed status badge', () => {
      fixture.componentRef.setInput('value', 'completed');
      fixture.componentRef.setInput('type', 'workOrderStatus');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-green-500/15');
    });

    it('should render cancelled status badge', () => {
      fixture.componentRef.setInput('value', 'cancelled');
      fixture.componentRef.setInput('type', 'workOrderStatus');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-red-500/15');
    });

    it('should render in_progress status badge', () => {
      fixture.componentRef.setInput('value', 'in_progress');
      fixture.componentRef.setInput('type', 'workOrderStatus');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-indigo-500/15');
    });

    it('should render assigned status badge', () => {
      fixture.componentRef.setInput('value', 'assigned');
      fixture.componentRef.setInput('type', 'workOrderStatus');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-blue-500/15');
    });
  });

  describe('workOrderPriority', () => {
    it('should render urgent priority badge', () => {
      fixture.componentRef.setInput('value', 'urgent');
      fixture.componentRef.setInput('type', 'workOrderPriority');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-red-500/15');
    });

    it('should render high priority badge', () => {
      fixture.componentRef.setInput('value', 'high');
      fixture.componentRef.setInput('type', 'workOrderPriority');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-orange-500/15');
    });

    it('should render low priority badge', () => {
      fixture.componentRef.setInput('value', 'low');
      fixture.componentRef.setInput('type', 'workOrderPriority');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-gray-500/15');
    });
  });

  describe('paymentStatus', () => {
    it('should render approved payment badge', () => {
      fixture.componentRef.setInput('value', 'approved');
      fixture.componentRef.setInput('type', 'paymentStatus');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-green-500/15');
    });

    it('should render pending payment badge', () => {
      fixture.componentRef.setInput('value', 'pending');
      fixture.componentRef.setInput('type', 'paymentStatus');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-yellow-500/15');
    });

    it('should render rejected payment badge', () => {
      fixture.componentRef.setInput('value', 'rejected');
      fixture.componentRef.setInput('type', 'paymentStatus');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-red-500/15');
    });
  });

  describe('invoiceStatus', () => {
    it('should render draft invoice badge', () => {
      fixture.componentRef.setInput('value', 'draft');
      fixture.componentRef.setInput('type', 'invoiceStatus');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-yellow-500/15');
    });

    it('should render issued invoice badge', () => {
      fixture.componentRef.setInput('value', 'issued');
      fixture.componentRef.setInput('type', 'invoiceStatus');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-green-500/15');
    });
  });

  describe('invoiceType', () => {
    it('should render type A badge', () => {
      fixture.componentRef.setInput('value', 'A');
      fixture.componentRef.setInput('type', 'invoiceType');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-blue-500/15');
    });

    it('should render type B badge', () => {
      fixture.componentRef.setInput('value', 'B');
      fixture.componentRef.setInput('type', 'invoiceType');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-green-500/15');
    });

    it('should render type C badge', () => {
      fixture.componentRef.setInput('value', 'C');
      fixture.componentRef.setInput('type', 'invoiceType');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-orange-500/15');
    });
  });

  describe('activeInactive', () => {
    it('should render active badge with green', () => {
      fixture.componentRef.setInput('value', 'true');
      fixture.componentRef.setInput('type', 'activeInactive');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-green-500/15');
    });

    it('should render inactive badge with gray', () => {
      fixture.componentRef.setInput('value', 'false');
      fixture.componentRef.setInput('type', 'activeInactive');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-gray-500/15');
    });
  });

  describe('badge styling', () => {
    it('should have rounded-full class', () => {
      fixture.componentRef.setInput('value', 'pending');
      fixture.componentRef.setInput('type', 'workOrderStatus');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('rounded-full');
    });

    it('should have text-xs class', () => {
      fixture.componentRef.setInput('value', 'pending');
      fixture.componentRef.setInput('type', 'workOrderStatus');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('text-xs');
    });

    it('should have font-medium class', () => {
      fixture.componentRef.setInput('value', 'pending');
      fixture.componentRef.setInput('type', 'workOrderStatus');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('font-medium');
    });
  });

  describe('unknown status', () => {
    it('should render default gray for unknown status', () => {
      fixture.componentRef.setInput('value', 'unknown_status');
      fixture.componentRef.setInput('type', 'workOrderStatus');
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('span');
      expect(badge.className).toContain('bg-gray-500/15');
    });
  });
});
