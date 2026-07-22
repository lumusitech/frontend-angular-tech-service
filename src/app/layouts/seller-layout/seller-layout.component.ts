import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { WebsocketService } from '../../core/services/websocket.service';
import { SellerBottomNavComponent } from '../../shared/components/seller-bottom-nav/seller-bottom-nav.component';

@Component({
  selector: 'app-seller-layout',
  imports: [RouterOutlet, SellerBottomNavComponent],
  template: `
    <div class="h-dvh flex flex-col bg-gray-50 dark:bg-gray-900">
      <header
        class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 h-14 flex items-center justify-between shrink-0"
      >
        <div class="flex items-center gap-3">
          <span class="text-lg font-bold text-gray-900 dark:text-gray-100">Tech Service</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">
              {{ authService.user()?.name?.charAt(0) || 'V' }}
            </span>
          </div>
          <div class="hidden sm:block">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ authService.user()?.name || 'Vendedor' }}
            </p>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-4 pb-20">
        <router-outlet />
      </main>

      <app-seller-bottom-nav />
    </div>
  `,
})
export class SellerLayoutComponent {
  readonly authService = inject(AuthService);
  private readonly websocketService = inject(WebsocketService);

  constructor() {
    afterNextRender(() => {
      if (this.authService.isAuthenticated()) {
        this.websocketService.connect();
      }
    });
  }
}
