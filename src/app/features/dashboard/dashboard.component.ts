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
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ 'dashboard.title' | translate }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            {{ 'dashboard.subtitle' | translate }}
          </p>
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
          @for (widgetId of layoutService.layout(); track widgetId) {
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
                    <app-kpi-cards [kpis]="summary()!.kpis" [trends]="summary()!.trends" (kpiClick)="navigateTo($event)" />
                  }
                  @case ('pendingItems') {
                    <app-pending-items-widget
                      [items]="pendingItems()"
                      (viewAll)="navigateTo('/admin/pending-items')"
                      (itemClick)="navigateTo('/admin/pending-items?highlight=' + $event)"
                    />
                  }
                  @case ('inquiries') {
                    <app-inquiries-widget
                      [items]="inquiries()"
                      (viewAll)="navigateTo('/admin/inquiries')"
                      (itemClick)="navigateTo('/admin/inquiries/' + $event)"
                    />
                  }
                  @case ('charts') {
                    <app-charts-widget
                      [summary]="summary()!"
                    />
                  }
                  @case ('quickActions') {
                    <app-quick-actions-widget (navigate)="navigateTo($event)" />
                  }
                  @case ('topClients') {
                    <app-top-clients-widget [clients]="summary()!.topClients" (clientClick)="navigateTo('/admin/clients?highlight=' + $event)" />
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

  readonly summary = signal<DashboardSummary | null>(null);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly editMode = signal(false);

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

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
