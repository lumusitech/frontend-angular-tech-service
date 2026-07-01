import { Routes } from '@angular/router';
import { authGuard, sellerGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'track',
    loadComponent: () =>
      import('./layouts/portal-layout/portal-layout.component').then(
        (m) => m.PortalLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/portal/portal-tracking.component').then(
            (m) => m.PortalTrackingComponent,
          ),
      },
      {
        path: ':code',
        loadComponent: () =>
          import('./features/portal/portal-tracking.component').then(
            (m) => m.PortalTrackingComponent,
          ),
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'clients',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/clients/clients-list.component').then(
                (m) => m.ClientsListComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/clients/client-detail.component').then(
                (m) => m.ClientDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./features/suppliers/suppliers-list.component').then(
            (m) => m.SuppliersListComponent,
          ),
      },
      {
        path: 'service-types',
        loadComponent: () =>
          import('./features/service-types/service-types-list.component').then(
            (m) => m.ServiceTypesListComponent,
          ),
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./features/skills/skills-list.component').then(
            (m) => m.SkillsListComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users-list.component').then(
            (m) => m.UsersListComponent,
          ),
      },
      {
        path: 'work-orders',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/work-orders/work-orders-list.component').then(
                (m) => m.WorkOrdersListComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/work-orders/work-order-detail.component').then(
                (m) => m.WorkOrderDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/payments/payments-list.component').then(
            (m) => m.PaymentsListComponent,
          ),
      },
      {
        path: 'expenses',
        loadComponent: () =>
          import('./features/expenses/expenses-list.component').then(
            (m) => m.ExpensesListComponent,
          ),
      },
      {
        path: 'billing',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/billing/invoices-list.component').then(
                (m) => m.InvoicesListComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/billing/invoice-detail.component').then(
                (m) => m.InvoiceDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'reports',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/reports/reports-dashboard.component').then(
                (m) => m.ReportsDashboardComponent,
              ),
          },
          {
            path: 'technicians/:id',
            loadComponent: () =>
              import('./features/reports/technician-detail.component').then(
                (m) => m.TechnicianDetailComponent,
              ),
          },
          {
            path: 'clients/:id',
            loadComponent: () =>
              import('./features/reports/client-report.component').then(
                (m) => m.ClientReportComponent,
              ),
          },
        ],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile-settings.component').then(
            (m) => m.ProfileSettingsComponent,
          ),
      },
      {
        path: 'pending-items',
        loadComponent: () =>
          import('./features/pending-items/pending-items-list.component').then(
            (m) => m.PendingItemsListComponent,
          ),
      },
      {
        path: 'inquiries',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/inquiries/inquiries-list.component').then(
                (m) => m.InquiriesListComponent,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/inquiries/inquiry-detail.component').then(
                (m) => m.InquiryDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/notifications-page.component').then(
            (m) => m.NotificationsPageComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'tech',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/tech-layout/tech-layout.component').then(
        (m) => m.TechLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/technician/tech-work-orders.component').then(
            (m) => m.TechWorkOrdersComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/technician/tech-work-order-detail.component').then(
            (m) => m.TechWorkOrderDetailComponent,
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/notifications-page.component').then(
            (m) => m.NotificationsPageComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/technician/tech-profile.component').then(
            (m) => m.TechProfileComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
    ],
  },
  {
    path: 'seller',
    canActivate: [sellerGuard],
    loadComponent: () =>
      import('./layouts/seller-layout/seller-layout.component').then(
        (m) => m.SellerLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/seller/seller-dashboard.component').then(
            (m) => m.SellerDashboardComponent,
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/seller/seller-work-orders.component').then(
            (m) => m.SellerWorkOrdersComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/seller/seller-settings.component').then(
            (m) => m.SellerSettingsComponent,
          ),
      },
    ],
  },
  { path: '', loadComponent: () => import('./features/landing/landing.component').then((m) => m.LandingComponent) },
  { path: '**', redirectTo: '/login' },
];
