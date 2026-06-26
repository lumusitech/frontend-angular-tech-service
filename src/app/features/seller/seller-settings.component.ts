import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-seller-settings',
  imports: [],
  template: `
    <div class="max-w-2xl mx-auto">
      <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Perfil</h1>

      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div class="p-6 space-y-4">
          <div>
            <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nombre</label>
            <p class="text-sm text-gray-900 dark:text-gray-100 mt-1">{{ user?.name }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</label>
            <p class="text-sm text-gray-900 dark:text-gray-100 mt-1">{{ user?.email }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Teléfono</label>
            <p class="text-sm text-gray-900 dark:text-gray-100 mt-1">{{ user?.phone || '—' }}</p>
          </div>
          <div>
            <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Comisión</label>
            <p class="text-sm text-gray-900 dark:text-gray-100 mt-1">{{ user?.commission ?? 5 }}%</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SellerSettingsComponent {
  private readonly authService = inject(AuthService);
  readonly user = this.authService.user;
}
