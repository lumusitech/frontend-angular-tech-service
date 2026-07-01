import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BusinessSettingsService } from '../../core/services/business-settings.service';

@Component({
  selector: 'app-portal-layout',
  imports: [RouterOutlet],
  template: `
    <div class="min-h-svh flex flex-col bg-gray-50 dark:bg-gray-900">
      <header
        class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 h-14 flex items-center shrink-0"
      >
        <div class="flex items-center gap-3">
          @if (settings()?.logoUrl) {
            <img
              [src]="settings()!.logoUrl"
              [alt]="settings()!.businessName"
              class="h-8 w-8 rounded-lg object-cover"
            />
          }
          <span class="text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ settings()?.businessName ?? 'Tech Service' }}
          </span>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>
    </div>
  `,
})
export class PortalLayoutComponent {
  private readonly businessSettingsService = inject(BusinessSettingsService);

  readonly settings = this.businessSettingsService.settings;
}
