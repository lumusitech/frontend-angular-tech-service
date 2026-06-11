import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="min-h-svh flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500 mt-2">Bienvenido al sistema de gestión de servicios técnicos</p>
      </div>
    </div>
  `,
})
export class DashboardComponent {}
