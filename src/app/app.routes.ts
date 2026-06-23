import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'track',
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
        loadComponent: () =>
          import('./features/clients/clients-list.component').then((m) => m.ClientsListComponent),
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
        loadComponent: () =>
          import('./features/reports/reports-dashboard.component').then(
            (m) => m.ReportsDashboardComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
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
          import('./features/notifications/notifications-list.component').then(
            (m) => m.NotificationsListComponent,
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
          import('./features/notifications/notifications-list.component').then(
            (m) => m.NotificationsListComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
    ],
  },
  { path: '', loadComponent: () => import('./features/landing/landing.component').then((m) => m.LandingComponent) },
  { path: '**', redirectTo: '/login' },
];
