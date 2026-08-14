import { Service, inject, signal } from '@angular/core';
import { UserPreferencesService } from './user-preferences.service';

export type DashboardWidgetId =
  'kpis' | 'pendingItems' | 'inquiries' | 'charts' | 'quickActions' | 'topClients';

export interface DashboardLayoutConfig {
  layout: DashboardWidgetId[];
  widgets: Record<DashboardWidgetId, boolean>;
}

const DEFAULT_LAYOUT: DashboardWidgetId[] = [
  'kpis',
  'charts',
  'pendingItems',
  'inquiries',
  'quickActions',
  'topClients',
];

const DEFAULT_WIDGETS: Record<DashboardWidgetId, boolean> = {
  kpis: true,
  pendingItems: true,
  inquiries: true,
  charts: true,
  quickActions: true,
  topClients: true,
};

@Service()
export class DashboardLayoutService {
  private readonly prefsService = inject(UserPreferencesService);

  readonly layout = signal<DashboardWidgetId[]>(DEFAULT_LAYOUT);
  readonly widgets = signal<Record<DashboardWidgetId, boolean>>(DEFAULT_WIDGETS);

  private updateTimeout: ReturnType<typeof setTimeout> | null = null;

  init(config?: Partial<DashboardLayoutConfig>): void {
    if (config?.layout) {
      this.layout.set(config.layout as DashboardWidgetId[]);
    }
    if (config?.widgets) {
      this.widgets.set(config.widgets as Record<DashboardWidgetId, boolean>);
    }
  }

  reorder(fromIndex: number, toIndex: number): void {
    const current = [...this.layout()];
    const [moved] = current.splice(fromIndex, 1);
    current.splice(toIndex, 0, moved);
    this.layout.set(current);
    this.persist();
  }

  toggleWidget(id: DashboardWidgetId): void {
    const current = { ...this.widgets() };
    current[id] = !current[id];
    this.widgets.set(current);
    this.persist();
  }

  reset(): void {
    this.layout.set(DEFAULT_LAYOUT);
    this.widgets.set(DEFAULT_WIDGETS);
    this.persist();
  }

  private persist(): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = setTimeout(() => {
      this.prefsService
        .update({
          preferences: {
            dashboardLayout: this.layout(),
            dashboardWidgets: this.widgets(),
          },
        })
        .subscribe();
    }, 500);
  }
}
