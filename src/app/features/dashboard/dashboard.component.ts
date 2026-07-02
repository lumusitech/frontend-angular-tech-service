import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DashboardService } from '../../core/services/dashboard.service';
import {
  DashboardLayoutService,
  DashboardWidgetId,
} from '../../core/services/dashboard-layout.service';
import {
  DashboardSummary,
  PendingItemSummary,
  InquirySummary,
  PaginatedResponse,
} from '../../core/models/dashboard.interfaces';
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
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ErrorStateComponent,
    DragDropModule,
    TranslatePipe,
    KpiCardsComponent,
    PendingItemsWidgetComponent,
    InquiriesWidgetComponent,
    ChartsWidgetComponent,
    QuickActionsWidgetComponent,
    TopClientsWidgetComponent,
  ],
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
  `,
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);
  readonly layoutService = inject(DashboardLayoutService);
  private readonly businessSettingsService = inject(BusinessSettingsService);

  readonly summary = signal<DashboardSummary | null>(null);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly editMode = signal(false);

  readonly businessSettings = computed(() => this.businessSettingsService.settings());
  readonly primaryColor = computed(() => this.businessSettings()?.primaryColor ?? '#1E40AF');
  readonly secondaryColor = computed(() => this.businessSettings()?.secondaryColor ?? '#059669');

  private readonly pendingItemsResource = httpResource<PaginatedResponse<PendingItemSummary>>(() => ({
    url: '/api/pending-items',
    params: { status: 'pending', limit: '5', sortBy: 'dueDate', order: 'ASC' },
  }));

  private readonly inquiriesResource = httpResource<PaginatedResponse<InquirySummary>>(() => ({
    url: '/api/inquiries',
    params: { status: 'new', limit: '5', sortBy: 'createdAt', order: 'DESC' },
  }));

  readonly pendingItems = computed(() =>
    this.pendingItemsResource.hasValue() ? this.pendingItemsResource.value().data : [],
  );
  readonly inquiries = computed(() =>
    this.inquiriesResource.hasValue() ? this.inquiriesResource.value().data : [],
  );

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  onDrop(event: CdkDragDrop<DashboardWidgetId[]>): void {
    this.layoutService.reorder(event.previousIndex, event.currentIndex);
  }

  navigateTo(route: string, queryParams?: Record<string, string>): void {
    if (queryParams) {
      this.router.navigate([route], { queryParams });
    } else {
      this.router.navigate([route]);
    }
  }
}
