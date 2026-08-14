import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface SellerNavTab {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}

@Component({
  selector: 'app-seller-bottom-nav',
  imports: [MatIconModule, TranslatePipe],
  template: `
    <nav
      class="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 pb-2"
      aria-label="Navegación del vendedor"
    >
      <div class="flex items-center justify-around h-16 max-w-md mx-auto">
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            (click)="navigate(tab.path)"
            class="flex flex-col items-center justify-center gap-1 w-full h-full rounded-lg transition-colors"
            [class]="
              isActive(tab.id)
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            "
            [attr.aria-current]="isActive(tab.id) ? 'page' : null"
          >
            <mat-icon class="!w-6 !h-6 text-[1.5rem]">{{ tab.icon }}</mat-icon>
            <span class="text-[10px] font-medium">{{ tab.labelKey | translate }}</span>
          </button>
        }
      </div>
    </nav>
  `,
})
export class SellerBottomNavComponent {
  private readonly router = inject(Router);

  readonly tabs: SellerNavTab[] = [
    { id: 'dashboard', path: '/seller', icon: 'dashboard', labelKey: 'seller.nav.dashboard' },
    { id: 'orders', path: '/seller/orders', icon: 'assignment', labelKey: 'seller.nav.orders' },
    { id: 'profile', path: '/seller/settings', icon: 'person', labelKey: 'seller.nav.profile' },
  ];

  readonly activeTab = computed(() => {
    const url = this.router.url;
    if (url.startsWith('/seller/orders')) return 'orders';
    if (url.startsWith('/seller/settings')) return 'profile';
    return 'dashboard';
  });

  isActive(tabId: string): boolean {
    return this.activeTab() === tabId;
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
