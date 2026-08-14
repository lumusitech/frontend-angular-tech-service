import { Component, input, output } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { PortalResponse } from '../../core/models/portal.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { TrackingCodeComponent } from '../../shared/components/tracking-code/tracking-code.component';
import { PortalStatusTimelineComponent } from './portal-status-timeline.component';
import { PortalTasksComponent } from './portal-tasks.component';
import { PortalNotesComponent } from './portal-notes.component';
import { PortalPaymentSummaryComponent } from './portal-payment-summary.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-portal-result',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    StatusBadgeComponent,
    TrackingCodeComponent,
    PortalStatusTimelineComponent,
    PortalTasksComponent,
    PortalNotesComponent,
    PortalPaymentSummaryComponent,
    TranslatePipe,
    DatePipe,
  ],
  template: `
    <div>
      <button
        mat-button
        (click)="searchRequested.emit()"
        class="!text-blue-600 dark:!text-blue-400 !font-medium mb-4"
      >
        <mat-icon class="!text-blue-600 dark:!text-blue-400">arrow_back</mat-icon>
        {{ 'portal.search.newSearch' | translate }}
      </button>

      @if (portalResource.isLoading() && !portalResource.hasValue()) {
        <div class="flex justify-center py-16">
          <mat-spinner diameter="40" />
        </div>
      } @else if (portalResource.error()) {
        <mat-card>
          <mat-card-content class="!p-8">
            <div class="text-center space-y-4">
              <div
                class="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto"
              >
                <mat-icon class="!w-8 !h-8 text-red-400">search_off</mat-icon>
              </div>
              <div class="space-y-1">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                  {{ 'portal.notFound.title' | translate }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ 'portal.notFound.message' | translate }}
                </p>
              </div>
              <button mat-flat-button (click)="portalResource.reload()">
                <mat-icon>refresh</mat-icon>
                {{ 'portal.notFound.retry' | translate }}
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      } @else if (portalResource.hasValue()) {
        <mat-card class="mb-4">
          <mat-card-content class="!p-5">
            <div class="flex flex-wrap items-center gap-2">
              <app-tracking-code [code]="portalResource.value().trackingCode" />
              <span class="text-gray-300 dark:text-gray-600">·</span>
              <app-status-badge [value]="portalResource.value().status" type="workOrderStatus" />
              <app-status-badge
                [value]="portalResource.value().priority"
                type="workOrderPriority"
              />
            </div>
          </mat-card-content>
        </mat-card>

        <div class="mb-4">
          <app-portal-status-timeline [status]="portalResource.value().status" />
        </div>

        <mat-card class="mb-4">
          <mat-card-content class="!p-5">
            <div class="grid grid-cols-2 gap-x-4 gap-y-5">
              <div>
                <p
                  class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5"
                >
                  {{ 'portal.info.serviceType' | translate }}
                </p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ portalResource.value().serviceType.name }}
                </p>
              </div>
              <div>
                <p
                  class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5"
                >
                  {{ 'portal.info.client' | translate }}
                </p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ portalResource.value().clientName }}
                </p>
              </div>
              <div>
                <p
                  class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5"
                >
                  {{ 'portal.info.location' | translate }}
                </p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{
                    'portal.info.location' +
                      (portalResource.value().location === 'workshop' ? 'Workshop' : 'OnSite')
                      | translate
                  }}
                </p>
              </div>
              <div>
                <p
                  class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5"
                >
                  {{ 'portal.info.created' | translate }}
                </p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ portalResource.value().createdAt | date: 'dd/MM/yyyy' }}
                </p>
              </div>
              @if (portalResource.value().scheduledDate) {
                <div>
                  <p
                    class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5"
                  >
                    {{ 'portal.info.scheduled' | translate }}
                  </p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ portalResource.value().scheduledDate | date: 'dd/MM/yyyy' }}
                  </p>
                </div>
              }
              @if (portalResource.value().completedAt) {
                <div>
                  <p
                    class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5"
                  >
                    {{ 'portal.info.completed' | translate }}
                  </p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ portalResource.value().completedAt | date: 'dd/MM/yyyy' }}
                  </p>
                </div>
              }
              @if (portalResource.value().warrantyUntil) {
                <div>
                  <p
                    class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5"
                  >
                    {{ 'portal.info.warranty' | translate }}
                  </p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ portalResource.value().warrantyUntil | date: 'dd/MM/yyyy' }}
                  </p>
                </div>
              }
              @if (portalResource.value().diagnosis) {
                <div class="col-span-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <p
                    class="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1"
                  >
                    {{ 'portal.info.diagnosis' | translate }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {{ portalResource.value().diagnosis }}
                  </p>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>

        @if (portalResource.value().tasks.length) {
          <div class="mb-4">
            <app-portal-tasks [tasks]="portalResource.value().tasks" />
          </div>
        }

        @if (portalResource.value().publicNotes.length) {
          <div class="mb-4">
            <app-portal-notes [notes]="portalResource.value().publicNotes" />
          </div>
        }

        @if (portalResource.value().paymentSummary.hasPayments) {
          <div class="mb-4">
            <app-portal-payment-summary [summary]="portalResource.value().paymentSummary" />
          </div>
        }
      }
    </div>
  `,
})
export class PortalResultComponent {
  readonly code = input.required<string>();
  readonly searchRequested = output<void>();

  readonly portalResource = httpResource<PortalResponse>(() => `/api/portal/track/${this.code()}`);
}
