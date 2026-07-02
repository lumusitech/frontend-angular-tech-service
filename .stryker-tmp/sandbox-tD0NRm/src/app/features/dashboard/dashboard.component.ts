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
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardLayoutService, DashboardWidgetId } from '../../core/services/dashboard-layout.service';
import { DashboardSummary, PendingItemSummary, InquirySummary, PaginatedResponse } from '../../core/models/dashboard.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { KpiCardsComponent } from './widgets/kpi-cards.component';
import { PendingItemsWidgetComponent } from './widgets/pending-items-widget.component';
import { InquiriesWidgetComponent } from './widgets/inquiries-widget.component';
import { ChartsWidgetComponent } from './widgets/charts-widget.component';
import { QuickActionsWidgetComponent } from './widgets/quick-actions-widget.component';
import { TopClientsWidgetComponent } from './widgets/top-clients-widget.component';
import { BusinessSettingsService } from '../../core/services/business-settings.service';
@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, MatButtonModule, MatProgressSpinnerModule, ErrorStateComponent, DragDropModule, TranslatePipe, KpiCardsComponent, PendingItemsWidgetComponent, InquiriesWidgetComponent, ChartsWidgetComponent, QuickActionsWidgetComponent, TopClientsWidgetComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          @if (businessSettings()?.logoUrl) {
            <img [src]="businessSettings()!.logoUrl" [alt]="businessSettings()!.businessName" class="h-10 w-10 rounded-lg object-cover" />
          }
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ businessSettings()?.businessName ?? ('dashboard.title' | translate) }}
            </h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">
              {{ 'dashboard.subtitle' | translate }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            mat-icon-button
            (click)="editMode.set(!editMode())"
            [color]="editMode() ? 'primary' : undefined"
            title="Reordenar widgets"
          >
            <mat-icon>{{ editMode() ? 'check' : 'tune' }}</mat-icon>
          </button>
          @if (editMode()) {
            <button mat-button (click)="layoutService.reset()">
              <mat-icon>restart_alt</mat-icon>
              Reset
            </button>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (loadError()) {
        <app-error-state (retry)="loadSummary()" />
      } @else if (summary()) {
        <div cdkDropList (cdkDropListDropped)="onDrop($event)" class="space-y-6">
          @for (widgetId of layoutService.layout(); track widgetId; let i = $index) {
            @if (layoutService.widgets()[widgetId]) {
              <div cdkDrag [cdkDragData]="widgetId" [cdkDragDisabled]="!editMode()">
                @if (editMode()) {
                  <div
                    cdkDragHandle
                    class="cursor-grab active:cursor-grabbing p-1 text-gray-400 dark:text-gray-500"
                  >
                    <mat-icon>drag_indicator</mat-icon>
                  </div>
                }
                @switch (widgetId) {
                  @case ('kpis') {
                    <app-kpi-cards [kpis]="summary()!.kpis" [trends]="summary()!.trends" [primaryColor]="primaryColor()" [secondaryColor]="secondaryColor()" [borderColor]="primaryColor()" (kpiClick)="navigateTo($event)" />
                  }
                  @case ('pendingItems') {
                    <app-pending-items-widget
                      [items]="pendingItems()"
                      [secondaryColor]="secondaryColor()"
                      [borderColor]="i % 2 === 0 ? primaryColor() : secondaryColor()"
                      (viewAll)="navigateTo('/admin/pending-items')"
                      (itemClick)="navigateTo('/admin/pending-items', { highlight: $event.id, search: $event.title })"
                    />
                  }
                  @case ('inquiries') {
                    <app-inquiries-widget
                      [items]="inquiries()"
                      [primaryColor]="primaryColor()"
                      [borderColor]="i % 2 === 0 ? primaryColor() : secondaryColor()"
                      (viewAll)="navigateTo('/admin/inquiries')"
                      (itemClick)="navigateTo('/admin/inquiries/' + $event)"
                    />
                  }
                  @case ('charts') {
                    <app-charts-widget
                      [summary]="summary()!"
                      [primaryColor]="primaryColor()"
                      [secondaryColor]="secondaryColor()"
                      [borderColor]="secondaryColor()"
                    />
                  }
                  @case ('quickActions') {
                    <app-quick-actions-widget [secondaryColor]="secondaryColor()" [borderColor]="i % 2 === 0 ? primaryColor() : secondaryColor()" (navigate)="navigateTo($event)" />
                  }
                  @case ('topClients') {
                    <app-top-clients-widget [clients]="summary()!.topClients" [primaryColor]="primaryColor()" [secondaryColor]="secondaryColor()" [borderColor]="i % 2 === 0 ? primaryColor() : secondaryColor()" (clientClick)="navigateTo('/admin/reports/clients/' + $event.id)" />
                  }
                }
              </div>
            }
          }
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);
  readonly layoutService = inject(DashboardLayoutService);
  private readonly businessSettingsService = inject(BusinessSettingsService);
  readonly summary = signal<DashboardSummary | null>(null);
  readonly loading = signal(stryMutAct_9fa48("2037") ? false : (stryCov_9fa48("2037"), true));
  readonly loadError = signal(stryMutAct_9fa48("2038") ? true : (stryCov_9fa48("2038"), false));
  readonly editMode = signal(stryMutAct_9fa48("2039") ? true : (stryCov_9fa48("2039"), false));
  readonly businessSettings = computed(stryMutAct_9fa48("2040") ? () => undefined : (stryCov_9fa48("2040"), () => this.businessSettingsService.settings()));
  readonly primaryColor = computed(stryMutAct_9fa48("2041") ? () => undefined : (stryCov_9fa48("2041"), () => stryMutAct_9fa48("2042") ? this.businessSettings()?.primaryColor && '#1E40AF' : (stryCov_9fa48("2042"), (stryMutAct_9fa48("2043") ? this.businessSettings().primaryColor : (stryCov_9fa48("2043"), this.businessSettings()?.primaryColor)) ?? (stryMutAct_9fa48("2044") ? "" : (stryCov_9fa48("2044"), '#1E40AF')))));
  readonly secondaryColor = computed(stryMutAct_9fa48("2045") ? () => undefined : (stryCov_9fa48("2045"), () => stryMutAct_9fa48("2046") ? this.businessSettings()?.secondaryColor && '#059669' : (stryCov_9fa48("2046"), (stryMutAct_9fa48("2047") ? this.businessSettings().secondaryColor : (stryCov_9fa48("2047"), this.businessSettings()?.secondaryColor)) ?? (stryMutAct_9fa48("2048") ? "" : (stryCov_9fa48("2048"), '#059669')))));
  private readonly pendingItemsResource = httpResource<PaginatedResponse<PendingItemSummary>>(stryMutAct_9fa48("2049") ? () => undefined : (stryCov_9fa48("2049"), () => stryMutAct_9fa48("2050") ? {} : (stryCov_9fa48("2050"), {
    url: stryMutAct_9fa48("2051") ? "" : (stryCov_9fa48("2051"), '/api/pending-items'),
    params: stryMutAct_9fa48("2052") ? {} : (stryCov_9fa48("2052"), {
      status: stryMutAct_9fa48("2053") ? "" : (stryCov_9fa48("2053"), 'pending'),
      limit: stryMutAct_9fa48("2054") ? "" : (stryCov_9fa48("2054"), '5'),
      sortBy: stryMutAct_9fa48("2055") ? "" : (stryCov_9fa48("2055"), 'dueDate'),
      order: stryMutAct_9fa48("2056") ? "" : (stryCov_9fa48("2056"), 'ASC')
    })
  })));
  private readonly inquiriesResource = httpResource<PaginatedResponse<InquirySummary>>(stryMutAct_9fa48("2057") ? () => undefined : (stryCov_9fa48("2057"), () => stryMutAct_9fa48("2058") ? {} : (stryCov_9fa48("2058"), {
    url: stryMutAct_9fa48("2059") ? "" : (stryCov_9fa48("2059"), '/api/inquiries'),
    params: stryMutAct_9fa48("2060") ? {} : (stryCov_9fa48("2060"), {
      status: stryMutAct_9fa48("2061") ? "" : (stryCov_9fa48("2061"), 'new'),
      limit: stryMutAct_9fa48("2062") ? "" : (stryCov_9fa48("2062"), '5'),
      sortBy: stryMutAct_9fa48("2063") ? "" : (stryCov_9fa48("2063"), 'createdAt'),
      order: stryMutAct_9fa48("2064") ? "" : (stryCov_9fa48("2064"), 'DESC')
    })
  })));
  readonly pendingItems = computed(stryMutAct_9fa48("2065") ? () => undefined : (stryCov_9fa48("2065"), () => this.pendingItemsResource.hasValue() ? this.pendingItemsResource.value().data : stryMutAct_9fa48("2066") ? ["Stryker was here"] : (stryCov_9fa48("2066"), [])));
  readonly inquiries = computed(stryMutAct_9fa48("2067") ? () => undefined : (stryCov_9fa48("2067"), () => this.inquiriesResource.hasValue() ? this.inquiriesResource.value().data : stryMutAct_9fa48("2068") ? ["Stryker was here"] : (stryCov_9fa48("2068"), [])));
  ngOnInit(): void {
    if (stryMutAct_9fa48("2069")) {
      {}
    } else {
      stryCov_9fa48("2069");
      this.loadSummary();
    }
  }
  loadSummary(): void {
    if (stryMutAct_9fa48("2070")) {
      {}
    } else {
      stryCov_9fa48("2070");
      this.loading.set(stryMutAct_9fa48("2071") ? false : (stryCov_9fa48("2071"), true));
      this.loadError.set(stryMutAct_9fa48("2072") ? true : (stryCov_9fa48("2072"), false));
      this.dashboardService.getSummary().subscribe(stryMutAct_9fa48("2073") ? {} : (stryCov_9fa48("2073"), {
        next: data => {
          if (stryMutAct_9fa48("2074")) {
            {}
          } else {
            stryCov_9fa48("2074");
            this.summary.set(data);
            this.loading.set(stryMutAct_9fa48("2075") ? true : (stryCov_9fa48("2075"), false));
          }
        },
        error: () => {
          if (stryMutAct_9fa48("2076")) {
            {}
          } else {
            stryCov_9fa48("2076");
            this.loading.set(stryMutAct_9fa48("2077") ? true : (stryCov_9fa48("2077"), false));
            this.loadError.set(stryMutAct_9fa48("2078") ? false : (stryCov_9fa48("2078"), true));
          }
        }
      }));
    }
  }
  onDrop(event: CdkDragDrop<DashboardWidgetId[]>): void {
    if (stryMutAct_9fa48("2079")) {
      {}
    } else {
      stryCov_9fa48("2079");
      this.layoutService.reorder(event.previousIndex, event.currentIndex);
    }
  }
  navigateTo(route: string, queryParams?: Record<string, string>): void {
    if (stryMutAct_9fa48("2080")) {
      {}
    } else {
      stryCov_9fa48("2080");
      if (stryMutAct_9fa48("2082") ? false : stryMutAct_9fa48("2081") ? true : (stryCov_9fa48("2081", "2082"), queryParams)) {
        if (stryMutAct_9fa48("2083")) {
          {}
        } else {
          stryCov_9fa48("2083");
          this.router.navigate(stryMutAct_9fa48("2084") ? [] : (stryCov_9fa48("2084"), [route]), stryMutAct_9fa48("2085") ? {} : (stryCov_9fa48("2085"), {
            queryParams
          }));
        }
      } else {
        if (stryMutAct_9fa48("2086")) {
          {}
        } else {
          stryCov_9fa48("2086");
          this.router.navigate(stryMutAct_9fa48("2087") ? [] : (stryCov_9fa48("2087"), [route]));
        }
      }
    }
  }
}