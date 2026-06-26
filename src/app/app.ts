import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { InstallPromptComponent } from './shared/components/install-prompt/install-prompt.component';
import { NotificationToastComponent } from './shared/components/notification-toast/notification-toast.component';
import { ThemeService } from './core/services/theme.service';
import { BusinessSettingsService } from './core/services/business-settings.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingSpinnerComponent, InstallPromptComponent, NotificationToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly businessSettingsService = inject(BusinessSettingsService);

  ngOnInit(): void {
    this.themeService.init();
    this.applyBusinessColors();
  }

  private applyBusinessColors(): void {
    const settings = this.businessSettingsService.settings();
    if (settings) {
      if (typeof document !== 'undefined') {
        if (settings.primaryColor) {
          document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
        }
        if (settings.secondaryColor) {
          document.documentElement.style.setProperty('--color-secondary', settings.secondaryColor);
        }
      }
    }
  }
}
