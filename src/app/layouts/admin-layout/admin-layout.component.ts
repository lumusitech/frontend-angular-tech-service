import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="h-dvh flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      <!-- Desktop sidebar -->
      <div class="hidden lg:block">
        <app-sidebar
          [collapsed]="sidebarCollapsed()"
          (toggleCollapse)="sidebarCollapsed.set(!sidebarCollapsed())"
        />
      </div>

      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <app-header (toggleSidebar)="mobileSidebarOpen.set(!mobileSidebarOpen())" />

        <main class="flex-1 overflow-y-auto p-4 lg:p-6">
          <router-outlet />
        </main>
      </div>

      @if (mobileSidebarOpen()) {
        <div
          class="fixed inset-0 bg-black/50 z-40 lg:hidden"
          (click)="mobileSidebarOpen.set(false)"
        ></div>
        <div class="fixed inset-y-0 left-0 z-50 lg:hidden">
          <app-sidebar [collapsed]="false" (toggleCollapse)="mobileSidebarOpen.set(false)" />
        </div>
      }
    </div>
  `,
})
export class AdminLayoutComponent {
  sidebarCollapsed = signal(false);
  mobileSidebarOpen = signal(false);
}
