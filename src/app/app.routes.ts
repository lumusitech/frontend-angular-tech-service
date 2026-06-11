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
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
