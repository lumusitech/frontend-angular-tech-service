import { Component, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { OfflineService } from '../../../core/services/offline.service';
import { SyncStatusPanelComponent } from '../sync-status-panel/sync-status-panel.component';

/**
 * Badge de estado offline en headers (admin + tech). Muestra un contador de
 * pendientes/bloqueados y abre el panel de sincronización al hacer clic.
 */
@Component({
  selector: 'app-offline-status-button',
  imports: [MatIconModule, TranslatePipe],
  template: `
    @if (visible()) {
      <button
        (click)="openPanel()"
        class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        [title]="
          offline()
            ? ('offline.offline' | translate)
            : ('offline.pending' | translate: { count: total() })
        "
      >
        <mat-icon [class]="offline() ? '!text-amber-500' : '!text-sky-500'">cloud_queue</mat-icon>
        @if (total() > 0) {
          <span
            class="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center font-bold"
          >
            {{ total() > 99 ? '99+' : total() }}
          </span>
        }
      </button>
    }
  `,
})
export class OfflineStatusButtonComponent {
  readonly offlineService = inject(OfflineService);
  private readonly dialog = inject(MatDialog);

  readonly total = computed(
    () => this.offlineService.pendingCount() + this.offlineService.blockedCount(),
  );
  readonly offline = computed(() => !this.offlineService.online());

  readonly visible = computed(
    () => this.offline() || this.total() > 0 || this.offlineService.isSyncing(),
  );

  openPanel(): void {
    this.dialog.open(SyncStatusPanelComponent, { width: '480px', maxWidth: '95vw' });
  }
}
