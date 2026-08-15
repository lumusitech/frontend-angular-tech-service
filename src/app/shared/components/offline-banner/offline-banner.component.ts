import { Component, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { OfflineService } from '../../../core/services/offline.service';
import { SyncStatusPanelComponent } from '../sync-status-panel/sync-status-panel.component';

type BannerState = 'offline' | 'syncing' | 'blocked' | 'pending' | 'hidden';

@Component({
  selector: 'app-offline-banner',
  imports: [MatIconModule, MatProgressSpinnerModule, TranslatePipe],
  template: `
    @switch (state()) {
      @case ('offline') {
        <button
          type="button"
          (click)="openPanel()"
          class="w-full flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-sm"
        >
          <mat-icon class="!text-lg">cloud_off</mat-icon>
          <span class="flex-1 text-left font-medium">{{
            'offline.offlineMessage' | translate
          }}</span>
        </button>
      }
      @case ('syncing') {
        <div
          class="w-full flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-sm"
        >
          <mat-progress-spinner diameter="18" mode="indeterminate" />
          <span class="font-medium">
            {{ 'offline.syncing' | translate: { count: offlineService.pendingCount() } }}
          </span>
        </div>
      }
      @case ('blocked') {
        <button
          type="button"
          (click)="openPanel()"
          class="w-full flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 text-sm"
        >
          <mat-icon class="!text-lg">warning</mat-icon>
          <span class="flex-1 text-left font-medium">
            {{ 'offline.blocked' | translate: { count: offlineService.blockedCount() } }}
          </span>
        </button>
      }
      @case ('pending') {
        <button
          type="button"
          (click)="openPanel()"
          class="w-full flex items-center gap-2 px-4 py-2 bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-200 text-sm"
        >
          <mat-icon class="!text-lg">cloud_queue</mat-icon>
          <span class="flex-1 text-left font-medium">
            {{ 'offline.pending' | translate: { count: offlineService.pendingCount() } }}
          </span>
        </button>
      }
    }
  `,
  host: { class: 'block shrink-0' },
})
export class OfflineBannerComponent {
  readonly offlineService = inject(OfflineService);
  private readonly dialog = inject(MatDialog);

  readonly state = computed<BannerState>(() => {
    if (!this.offlineService.online()) return 'offline';
    if (this.offlineService.isSyncing()) return 'syncing';
    if (this.offlineService.blockedCount() > 0) return 'blocked';
    if (this.offlineService.pendingCount() > 0) return 'pending';
    return 'hidden';
  });

  openPanel(): void {
    this.dialog.open(SyncStatusPanelComponent, { width: '480px', maxWidth: '95vw' });
  }
}
