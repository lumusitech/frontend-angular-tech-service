import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { InstallPromptComponent } from './shared/components/install-prompt/install-prompt.component';
import { NotificationToastComponent } from './shared/components/notification-toast/notification-toast.component';
import { BusinessSettingsService } from './core/services/business-settings.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingSpinnerComponent, InstallPromptComponent, NotificationToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly businessSettingsService = inject(BusinessSettingsService);

  constructor() {
    effect(() => {
      const settings = this.businessSettingsService.settings();
      if (settings && typeof document !== 'undefined') {
        if (settings.primaryColor) {
          document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
          document.documentElement.style.setProperty('--mat-sys-primary', settings.primaryColor);
          document.documentElement.style.setProperty('--mat-sys-on-primary', '#ffffff');
        }
        if (settings.secondaryColor) {
          document.documentElement.style.setProperty('--color-secondary', settings.secondaryColor);
        }
      }
    });
  }
}
