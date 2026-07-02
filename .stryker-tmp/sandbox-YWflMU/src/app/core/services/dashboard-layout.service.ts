// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Service, inject, signal } from '@angular/core';
import { UserPreferencesService } from './user-preferences.service';
export type DashboardWidgetId = 'kpis' | 'pendingItems' | 'inquiries' | 'charts' | 'quickActions' | 'topClients';
export interface DashboardLayoutConfig {
  layout: DashboardWidgetId[];
  widgets: Record<DashboardWidgetId, boolean>;
}
const DEFAULT_LAYOUT: DashboardWidgetId[] = stryMutAct_9fa48("511") ? [] : (stryCov_9fa48("511"), [stryMutAct_9fa48("512") ? "" : (stryCov_9fa48("512"), 'kpis'), stryMutAct_9fa48("513") ? "" : (stryCov_9fa48("513"), 'charts'), stryMutAct_9fa48("514") ? "" : (stryCov_9fa48("514"), 'pendingItems'), stryMutAct_9fa48("515") ? "" : (stryCov_9fa48("515"), 'inquiries'), stryMutAct_9fa48("516") ? "" : (stryCov_9fa48("516"), 'quickActions'), stryMutAct_9fa48("517") ? "" : (stryCov_9fa48("517"), 'topClients')]);
const DEFAULT_WIDGETS: Record<DashboardWidgetId, boolean> = stryMutAct_9fa48("518") ? {} : (stryCov_9fa48("518"), {
  kpis: stryMutAct_9fa48("519") ? false : (stryCov_9fa48("519"), true),
  pendingItems: stryMutAct_9fa48("520") ? false : (stryCov_9fa48("520"), true),
  inquiries: stryMutAct_9fa48("521") ? false : (stryCov_9fa48("521"), true),
  charts: stryMutAct_9fa48("522") ? false : (stryCov_9fa48("522"), true),
  quickActions: stryMutAct_9fa48("523") ? false : (stryCov_9fa48("523"), true),
  topClients: stryMutAct_9fa48("524") ? false : (stryCov_9fa48("524"), true)
});
const DEFAULT_CONFIG: DashboardLayoutConfig = stryMutAct_9fa48("525") ? {} : (stryCov_9fa48("525"), {
  layout: DEFAULT_LAYOUT,
  widgets: DEFAULT_WIDGETS
});
@Service()
export class DashboardLayoutService {
  private readonly prefsService = inject(UserPreferencesService);
  readonly layout = signal<DashboardWidgetId[]>(DEFAULT_LAYOUT);
  readonly widgets = signal<Record<DashboardWidgetId, boolean>>(DEFAULT_WIDGETS);
  private updateTimeout: ReturnType<typeof setTimeout> | null = null;
  init(config?: Partial<DashboardLayoutConfig>): void {
    if (stryMutAct_9fa48("526")) {
      {}
    } else {
      stryCov_9fa48("526");
      if (stryMutAct_9fa48("529") ? config.layout : stryMutAct_9fa48("528") ? false : stryMutAct_9fa48("527") ? true : (stryCov_9fa48("527", "528", "529"), config?.layout)) {
        if (stryMutAct_9fa48("530")) {
          {}
        } else {
          stryCov_9fa48("530");
          this.layout.set(config.layout as DashboardWidgetId[]);
        }
      }
      if (stryMutAct_9fa48("533") ? config.widgets : stryMutAct_9fa48("532") ? false : stryMutAct_9fa48("531") ? true : (stryCov_9fa48("531", "532", "533"), config?.widgets)) {
        if (stryMutAct_9fa48("534")) {
          {}
        } else {
          stryCov_9fa48("534");
          this.widgets.set(config.widgets as Record<DashboardWidgetId, boolean>);
        }
      }
    }
  }
  reorder(fromIndex: number, toIndex: number): void {
    if (stryMutAct_9fa48("535")) {
      {}
    } else {
      stryCov_9fa48("535");
      const current = stryMutAct_9fa48("536") ? [] : (stryCov_9fa48("536"), [...this.layout()]);
      const [moved] = current.splice(fromIndex, 1);
      current.splice(toIndex, 0, moved);
      this.layout.set(current);
      this.persist();
    }
  }
  toggleWidget(id: DashboardWidgetId): void {
    if (stryMutAct_9fa48("537")) {
      {}
    } else {
      stryCov_9fa48("537");
      const current = stryMutAct_9fa48("538") ? {} : (stryCov_9fa48("538"), {
        ...this.widgets()
      });
      current[id] = stryMutAct_9fa48("539") ? current[id] : (stryCov_9fa48("539"), !current[id]);
      this.widgets.set(current);
      this.persist();
    }
  }
  reset(): void {
    if (stryMutAct_9fa48("540")) {
      {}
    } else {
      stryCov_9fa48("540");
      this.layout.set(DEFAULT_LAYOUT);
      this.widgets.set(DEFAULT_WIDGETS);
      this.persist();
    }
  }
  private persist(): void {
    if (stryMutAct_9fa48("541")) {
      {}
    } else {
      stryCov_9fa48("541");
      if (stryMutAct_9fa48("543") ? false : stryMutAct_9fa48("542") ? true : (stryCov_9fa48("542", "543"), this.updateTimeout)) {
        if (stryMutAct_9fa48("544")) {
          {}
        } else {
          stryCov_9fa48("544");
          clearTimeout(this.updateTimeout);
        }
      }
      this.updateTimeout = setTimeout(() => {
        if (stryMutAct_9fa48("545")) {
          {}
        } else {
          stryCov_9fa48("545");
          this.prefsService.update(stryMutAct_9fa48("546") ? {} : (stryCov_9fa48("546"), {
            preferences: stryMutAct_9fa48("547") ? {} : (stryCov_9fa48("547"), {
              dashboardLayout: this.layout(),
              dashboardWidgets: this.widgets()
            })
          })).subscribe(stryMutAct_9fa48("548") ? {} : (stryCov_9fa48("548"), {
            error: () => {}
          }));
        }
      }, 500);
    }
  }
}