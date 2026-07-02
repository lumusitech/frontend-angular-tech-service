// @ts-nocheck
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardLayoutService } from '../../core/services/dashboard-layout.service';
import { BusinessSettingsService } from '../../core/services/business-settings.service';
import { TranslationService } from '../../core/services/translation.service';
import { of, throwError } from 'rxjs';

registerLocaleData(localeEsAr, 'es-AR');

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let navigateSpy: ReturnType<typeof vi.fn>;
  let getSummarySpy: ReturnType<typeof vi.fn>;

  const mockSummary = {
    kpis: {
      activeOrders: 5,
      activeOrdersChange: 2,
      completedToday: 3,
      completedTodayChange: 1,
      monthlyIncome: 50000,
      monthlyIncomeChange: 10,
      netProfit: 20000,
      netProfitChange: 5,
      averageTicket: 5000,
      averageTicketChange: 3,
    },
    monthlyTrend: { labels: ['Jan', 'Feb'], income: [30000, 40000], expenses: [20000, 25000] },
    workOrdersByStatus: [{ status: 'pending', count: 3 }, { status: 'completed', count: 10 }],
    topServices: [{ name: 'Installation', count: 8, revenue: 40000 }],
    paymentMethodDistribution: [{ method: 'cash', count: 5, total: 25000 }],
    topClients: [{ id: 'c-1', name: 'Client A', totalOrders: 5, totalPaid: 25000 }],
    technicianPerformance: [{ id: 't-1', name: 'Tech A', completed: 8, avgTime: 2.5, revenue: 40000 }],
    workOrdersByPriority: [{ priority: 'high', count: 3 }],
    trends: { incomeTrend: 10, expenseTrend: -5, profitTrend: 15, ordersTrend: 8 },
  };

  beforeEach(() => {
    navigateSpy = vi.fn();
    getSummarySpy = vi.fn().mockReturnValue(of(mockSummary));

    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: DashboardService, useValue: { getSummary: getSummarySpy } },
        { provide: Router, useValue: { navigate: navigateSpy } },
        {
          provide: DashboardLayoutService,
          useValue: {
            layout: signal(['kpis', 'charts', 'quickActions', 'pendingItems', 'inquiries', 'topClients']),
            widgets: signal({
              kpis: true, charts: true, quickActions: true, pendingItems: true, inquiries: true, topClients: true,
            }),
            reorder: vi.fn(),
            reset: vi.fn(),
          },
        },
        {
          provide: BusinessSettingsService,
          useValue: {
            settings: signal({
              id: '1', businessName: 'Tech Service', logoUrl: 'https://example.com/logo.png',
              primaryColor: '#1E40AF', secondaryColor: '#059669',
              address: '123 Main St', phone: '1234567890', email: 'info@test.com',
            }),
          },
        },
        {
          provide: TranslationService,
          useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
        },
      ],
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadSummary on init', () => {
      fixture.detectChanges();
      expect(getSummarySpy).toHaveBeenCalled();
    });

    it('should set summary after successful load', () => {
      fixture.detectChanges();
      expect(component.summary()).toEqual(mockSummary);
      expect(component.loading()).toBe(false);
    });

    it('should set loadError on failure', () => {
      getSummarySpy.mockReturnValue(throwError(() => new Error('fail')));
      fixture.detectChanges();
      expect(component.loadError()).toBe(true);
      expect(component.loading()).toBe(false);
    });
  });

  describe('business settings', () => {
    it('should display business name from settings', () => {
      fixture.detectChanges();
      expect(component.businessSettings()?.businessName).toBe('Tech Service');
    });

    it('should use primary color from settings', () => {
      fixture.detectChanges();
      expect(component.primaryColor()).toBe('#1E40AF');
    });

    it('should use secondary color from settings', () => {
      fixture.detectChanges();
      expect(component.secondaryColor()).toBe('#059669');
    });

    it('should default colors when settings are null', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [DashboardComponent],
        providers: [
          { provide: DashboardService, useValue: { getSummary: getSummarySpy.mockReturnValue(of(mockSummary)) } },
          { provide: Router, useValue: { navigate: navigateSpy } },
          {
            provide: DashboardLayoutService,
            useValue: {
              layout: signal(['kpis']), widgets: signal({ kpis: true }),
              reorder: vi.fn(), reset: vi.fn(),
            },
          },
          { provide: BusinessSettingsService, useValue: { settings: signal(null) } },
          { provide: TranslationService, useValue: { instant: vi.fn().mockImplementation((key: string) => key) } },
        ],
      });
      const freshFixture = TestBed.createComponent(DashboardComponent);
      expect(freshFixture.componentInstance.primaryColor()).toBe('#1E40AF');
      expect(freshFixture.componentInstance.secondaryColor()).toBe('#059669');
    });
  });

  describe('navigateTo()', () => {
    it('should navigate to route without query params', () => {
      component.navigateTo('/admin/clients');
      expect(navigateSpy).toHaveBeenCalledWith(['/admin/clients']);
    });

    it('should navigate to route with query params', () => {
      component.navigateTo('/admin/clients', { highlight: 'c-1', search: 'test' });
      expect(navigateSpy).toHaveBeenCalledWith(['/admin/clients'], {
        queryParams: { highlight: 'c-1', search: 'test' },
      });
    });
  });

  describe('editMode', () => {
    it('should toggle edit mode', () => {
      expect(component.editMode()).toBe(false);
      component.editMode.set(true);
      expect(component.editMode()).toBe(true);
    });
  });

  describe('computed signals', () => {
    it('pendingItems should return empty array when no data', () => {
      expect(component.pendingItems()).toEqual([]);
    });

    it('inquiries should return empty array when no data', () => {
      expect(component.inquiries()).toEqual([]);
    });
  });

  describe('template', () => {
    it('should render title', () => {
      fixture.detectChanges();
      const title = fixture.nativeElement.querySelector('h1');
      expect(title?.textContent).toContain('Tech Service');
    });

    it('should render subtitle', () => {
      fixture.detectChanges();
      const subtitle = fixture.nativeElement.querySelector('p');
      expect(subtitle?.textContent).toContain('dashboard.subtitle');
    });

    it('should render logo when available', () => {
      fixture.detectChanges();
      const img = fixture.nativeElement.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('https://example.com/logo.png');
    });
  });

  describe('color propagation', () => {
    it('should pass primaryColor and secondaryColor from settings', () => {
      fixture.detectChanges();
      expect(component.primaryColor()).toBe('#1E40AF');
      expect(component.secondaryColor()).toBe('#059669');
    });

    it('should update colors when business settings change', () => {
      const settingsSignal = signal({
        id: '1', businessName: 'Test', logoUrl: '',
        primaryColor: '#FF0000', secondaryColor: '#00FF00',
        address: '', phone: '', email: '',
      });

      getSummarySpy = vi.fn().mockReturnValue(of(mockSummary));
      navigateSpy = vi.fn();

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [DashboardComponent],
        providers: [
          { provide: DashboardService, useValue: { getSummary: getSummarySpy } },
          { provide: Router, useValue: { navigate: navigateSpy } },
          {
            provide: DashboardLayoutService,
            useValue: {
              layout: signal(['kpis']),
              widgets: signal({ kpis: true }),
              reorder: vi.fn(),
              reset: vi.fn(),
            },
          },
          { provide: BusinessSettingsService, useValue: { settings: settingsSignal } },
          {
            provide: TranslationService,
            useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
          },
        ],
      });

      const freshFixture = TestBed.createComponent(DashboardComponent);
      const freshComponent = freshFixture.componentInstance;

      expect(freshComponent.primaryColor()).toBe('#FF0000');
      expect(freshComponent.secondaryColor()).toBe('#00FF00');

      settingsSignal.set({
        id: '1', businessName: 'Test', logoUrl: '',
        primaryColor: '#0000FF', secondaryColor: '#FFFF00',
        address: '', phone: '', email: '',
      });

      expect(freshComponent.primaryColor()).toBe('#0000FF');
      expect(freshComponent.secondaryColor()).toBe('#FFFF00');
    });
  });
});
