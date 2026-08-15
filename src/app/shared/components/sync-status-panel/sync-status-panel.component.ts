import { Component, inject, signal, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { RelativeDatePipe } from '../../pipes/relative-date.pipe';
import { OfflineService } from '../../../core/services/offline.service';
import type { QueuedRequest } from '../../../core/services/offline-queue-store.service';

@Component({
  selector: 'app-sync-status-panel',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    RelativeDatePipe,
  ],
  template: `
    <h2 mat-dialog-title class="!mb-0">
      <div class="flex items-center gap-2">
        <mat-icon>sync</mat-icon>
        {{ 'offline.title' | translate }}
      </div>
    </h2>

    <mat-dialog-content class="!py-4 space-y-4">
      @if (offlineService.isSyncing()) {
        <div class="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40">
          <mat-spinner diameter="20" />
          <span class="text-sm text-blue-700 dark:text-blue-300">
            {{ 'offline.syncing' | translate: { count: offlineService.pendingCount() } }}
          </span>
        </div>
      }

      @if (!offlineService.online()) {
        <div class="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40">
          <p class="text-sm font-medium text-amber-700 dark:text-amber-300">
            {{ 'offline.offline' | translate }}
          </p>
          <p class="text-xs text-amber-600 dark:text-amber-400 mt-1">
            {{ 'offline.offlineMessage' | translate }}
          </p>
        </div>
      }

      <!-- Pendientes -->
      <section>
        <h3
          class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2"
        >
          {{ 'offline.pendingSection' | translate }} ({{ pending().length }})
        </h3>
        @if (pending().length === 0) {
          <p class="text-sm text-gray-400 dark:text-gray-500">
            {{ 'offline.empty' | translate }}
          </p>
        } @else {
          <div class="space-y-2">
            @for (item of pending(); track item.id) {
              <div class="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/40">
                <mat-icon class="!text-gray-400">schedule</mat-icon>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {{ item.method }} {{ shortUrl(item.url) }}
                  </p>
                  <p class="text-xs text-gray-400 dark:text-gray-500">
                    {{ item.createdAt | relativeDate }}
                  </p>
                </div>
              </div>
            }
          </div>
        }
      </section>

      <!-- Bloqueados -->
      <section>
        <div class="flex items-center justify-between mb-2">
          <h3
            class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
          >
            {{ 'offline.blockedSection' | translate }} ({{ blocked().length }})
          </h3>
          @if (blocked().length > 0) {
            <button mat-button color="primary" (click)="retryAll()" class="!min-h-8 !text-xs">
              <mat-icon class="!text-sm">replay</mat-icon>
              {{ 'offline.retryAll' | translate }}
            </button>
          }
        </div>

        @if (blocked().length === 0) {
          <p class="text-sm text-gray-400 dark:text-gray-500">
            {{ 'offline.empty' | translate }}
          </p>
        } @else {
          <div class="space-y-2">
            @for (item of blocked(); track item.id) {
              <div
                class="flex items-start gap-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50"
              >
                <mat-icon class="!text-red-400">warning</mat-icon>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-red-700 dark:text-red-300 truncate">
                    {{ item.method }} {{ shortUrl(item.url) }}
                  </p>
                  <p class="text-xs text-red-500 dark:text-red-400 mt-0.5">
                    {{ item.lastError || ('offline.syncRejected' | translate: { status: '' }) }}
                  </p>
                </div>
                <button
                  mat-icon-button
                  (click)="retry(item.id)"
                  [title]="'offline.retry' | translate"
                  class="!w-8 !h-8"
                >
                  <mat-icon class="!text-base">replay</mat-icon>
                </button>
              </div>
            }
          </div>
        }
      </section>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-flat-button color="primary" mat-dialog-close>
        {{ 'common.close' | translate }}
      </button>
    </mat-dialog-actions>
  `,
})
export class SyncStatusPanelComponent implements OnInit {
  readonly offlineService = inject(OfflineService);
  private readonly dialogRef = inject(MatDialogRef<SyncStatusPanelComponent>);

  readonly pending = signal<QueuedRequest[]>([]);
  readonly blocked = signal<QueuedRequest[]>([]);

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async retry(id: string): Promise<void> {
    await this.offlineService.retryBlocked(id);
    await this.load();
    if (this.pending().length === 0 && this.blocked().length === 0) {
      this.dialogRef.close();
    }
  }

  async retryAll(): Promise<void> {
    await this.offlineService.retryAllBlocked();
    await this.load();
    if (this.pending().length === 0 && this.blocked().length === 0) {
      this.dialogRef.close();
    }
  }

  shortUrl(url: string): string {
    return url.length > 60 ? url.slice(0, 60) + '…' : url;
  }

  private async load(): Promise<void> {
    this.pending.set(await this.offlineService.pendingItems());
    this.blocked.set(await this.offlineService.blockedItems());
  }
}
