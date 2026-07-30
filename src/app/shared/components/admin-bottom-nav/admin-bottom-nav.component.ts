import { Component, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { NotificationsService } from '../../../core/services/notifications.service';
import { filter } from 'rxjs';

interface AdminNavTab {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}

@Component({
  selector: 'app-admin-bottom-nav',
  imports: [MatIconModule, TranslatePipe],
  template: `
    <nav
      class="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 pb-2 lg:hidden"
      aria-label="Navegación del administrador"
    >
      <div class="flex items-center justify-around h-16 max-w-lg mx-auto">
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            (click)="navigate(tab.path)"
            class="flex flex-col items-center justify-center gap-1 w-full h-full rounded-lg transition-colors"
            [class]="
              isActive(tab.id)
                ? 'text-[var(--color-secondary)]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            "
            [attr.aria-current]="isActive(tab.id) ? 'page' : null"
          >
            <div class="relative">
              <mat-icon class="!w-6 !h-6 text-[1.5rem]">{{ tab.icon }}</mat-icon>
              @if (tab.id === 'notifications' && notificationsService.unreadCount() > 0) {
                <span
                  class="absolute -top-1 -right-1 min-w-[1.125rem] h-[1.125rem] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-800"
                >
                  {{ notificationsService.unreadCount() }}
                </span>
              }
            </div>
            <span class="text-[10px] font-medium">{{ tab.labelKey | translate }}</span>
          </button>
        }
      </div>
    </nav>
  `,
})
export class AdminBottomNavComponent {
  private readonly router = inject(Router);
  readonly notificationsService = inject(NotificationsService);

  readonly tabs: AdminNavTab[] = [
    { id: 'dashboard', path: '/admin/dashboard', icon: 'home', labelKey: 'nav.dashboard' },
    { id: 'orders', path: '/admin/work-orders', icon: 'build', labelKey: 'nav.orders' },
    { id: 'clients', path: '/admin/clients', icon: 'group', labelKey: 'nav.clients' },
    {
      id: 'notifications',
      path: '/admin/notifications',
      icon: 'notifications',
      labelKey: 'common.notifications',
    },
    { id: 'settings', path: '/admin/settings', icon: 'settings', labelKey: 'nav.settings' },
  ];

  readonly currentUrl = signal(this.router.url);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl.set(
          (event as NavigationEnd).urlAfterRedirects || (event as NavigationEnd).url,
        );
      });
  }

  isActive(tabId: string): boolean {
    const url = this.currentUrl();
    switch (tabId) {
      case 'notifications':
        return url.startsWith('/admin/notifications');
      case 'settings':
        return url.startsWith('/admin/settings');
      case 'orders':
        return url.startsWith('/admin/work-orders');
      case 'clients':
        return url.startsWith('/admin/clients');
      default:
        return url === '/admin/dashboard' || url === '/admin/';
    }
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
