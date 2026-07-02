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
import { of } from 'rxjs';

registerLocaleData(localeEsAr, 'es-AR');

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let navigateSpy: ReturnType<typeof vi.fn>;
  let getSummarySpy: ReturnType<typeof vi.fn>;

  const mockSummary = {
    kpis: {
      activeOrders: 5, activeOrdersChange: 2, completedToday: 3, completedTodayChange: 1,
      monthlyIncome: 50000, monthlyIncomeChange: 10, netProfit: 20000, netProfitChange: 5,
      averageTicket: 5000, averageTicketChange: 3,
    },
    monthlyTrend: { labels: ['Jan', 'Feb'], income: [30000, 40000], expenses: [20000, 25000], profit: [10000, 15000] },
    workOrdersByStatus: [{ status: 'pending', count: 3, label: 'Pendiente' }, { status: 'completed', count: 10, label: 'Completada' }],
    topServices: [{ name: 'Installation', count: 8, revenue: 40000 }],
    paymentMethodDistribution: [{ method: 'cash', count: 5, total: 25000 }],
    topClients: [{ id: 'c-1', name: 'Client A', totalOrders: 5, totalPaid: 25000 }],
    technicianPerformance: [{ id: 't-1', name: 'Tech A', completed: 8, avgTime: 2.5, revenue: 40000 }],
    workOrdersByPriority: [{ priority: 'high', count: 3 }],
    trends: { incomeTrend: 10, expenseTrend: -5, profitTrend: 15, ordersTrend: 8 },
  };

  describe('color propagation', () => {
    it('should pass primaryColor to kpi-cards component', () => {
      const customPrimary = '#FF0000';
      const customSecondary = '#00FF00';

      getSummarySpy = vi.fn().mockReturnValue(of(mockSummary));
      navigateSpy = vi.fn();

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
          {
            provide: BusinessSettingsService,
            useValue: {
              settings: signal({
                id: '1', businessName: 'Test', logoUrl: '',
                primaryColor: customPrimary, secondaryColor: customSecondary,
                address: '', phone: '', email: '',
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
      fixture.detectChanges();

      expect(component.primaryColor()).toBe(customPrimary);
      expect(component.secondaryColor()).toBe(customSecondary);
    });

    it('should apply primaryColor as inline style on KPI cards border', () => {
      const customPrimary = '#FF5500';

      getSummarySpy = vi.fn().mockReturnValue(of(mockSummary));
      navigateSpy = vi.fn();

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
          {
            provide: BusinessSettingsService,
            useValue: {
              settings: signal({
                id: '1', businessName: 'Test', logoUrl: '',
                primaryColor: customPrimary, secondaryColor: '#00FF00',
                address: '', phone: '', email: '',
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
      fixture.detectChanges();

      const kpiCards = fixture.nativeElement.querySelector('app-kpi-cards');
      expect(kpiCards).toBeTruthy();

      const allDivs = kpiCards.querySelectorAll('div') as NodeListOf<HTMLElement>;
      const borderDiv = Array.from(allDivs).find(
        (div) => div.style.borderLeftColor,
      );
      expect(borderDiv).toBeTruthy();
      expect(borderDiv!.style.borderLeftColor).toBe('rgb(255, 85, 0)');
    });

    it('should apply alternating borderColor to quick-actions based on index', () => {
      const customPrimary = '#FF5500';

      getSummarySpy = vi.fn().mockReturnValue(of(mockSummary));
      navigateSpy = vi.fn();

      TestBed.configureTestingModule({
        imports: [DashboardComponent],
        providers: [
          { provide: DashboardService, useValue: { getSummary: getSummarySpy } },
          { provide: Router, useValue: { navigate: navigateSpy } },
          {
            provide: DashboardLayoutService,
            useValue: {
              layout: signal(['quickActions']),
              widgets: signal({ quickActions: true }),
              reorder: vi.fn(),
              reset: vi.fn(),
            },
          },
          {
            provide: BusinessSettingsService,
            useValue: {
              settings: signal({
                id: '1', businessName: 'Test', logoUrl: '',
                primaryColor: customPrimary, secondaryColor: '#00CC88',
                address: '', phone: '', email: '',
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
      fixture.detectChanges();

      const quickActions = fixture.nativeElement.querySelector('app-quick-actions-widget');
      expect(quickActions).toBeTruthy();

      const allDivs = quickActions.querySelectorAll('div') as NodeListOf<HTMLElement>;
      const borderDiv = Array.from(allDivs).find(
        (div) => div.style.borderLeftColor,
      );
      expect(borderDiv).toBeTruthy();
      // quickActions at index 0 gets primaryColor (i % 2 === 0)
      expect(borderDiv!.style.borderLeftColor).toBe('rgb(255, 85, 0)');
    });

    it('should update colors when business settings change', () => {
      const settingsSignal = signal({
        id: '1', businessName: 'Test', logoUrl: '',
        primaryColor: '#FF0000', secondaryColor: '#00FF00',
        address: '', phone: '', email: '',
      });

      getSummarySpy = vi.fn().mockReturnValue(of(mockSummary));
      navigateSpy = vi.fn();

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
          {
            provide: BusinessSettingsService,
            useValue: { settings: settingsSignal },
          },
          {
            provide: TranslationService,
            useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
          },
        ],
      });

      fixture = TestBed.createComponent(DashboardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.primaryColor()).toBe('#FF0000');

      settingsSignal.set({
        id: '1', businessName: 'Test', logoUrl: '',
        primaryColor: '#0000FF', secondaryColor: '#FFFF00',
        address: '', phone: '', email: '',
      });

      expect(component.primaryColor()).toBe('#0000FF');
      expect(component.secondaryColor()).toBe('#FFFF00');
    });

    it('should default to brand colors when settings are null', () => {
      getSummarySpy = vi.fn().mockReturnValue(of(mockSummary));
      navigateSpy = vi.fn();

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
          { provide: BusinessSettingsService, useValue: { settings: signal(null) } },
          {
            provide: TranslationService,
            useValue: { instant: vi.fn().mockImplementation((key: string) => key) },
          },
        ],
      });

      fixture = TestBed.createComponent(DashboardComponent);
      component = fixture.componentInstance;

      expect(component.primaryColor()).toBe('#1E40AF');
      expect(component.secondaryColor()).toBe('#059669');
    });
  });

});
