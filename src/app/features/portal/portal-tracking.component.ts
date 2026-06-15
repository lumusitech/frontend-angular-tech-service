import { Component } from '@angular/core';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-portal-tracking',
  imports: [TranslatePipe],
  template: `
    <div class="min-h-svh flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {{ 'portal.tracking.title' | translate }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          {{ 'portal.tracking.subtitle' | translate }}
        </p>
      </div>
    </div>
  `,
})
export class PortalTrackingComponent {}
