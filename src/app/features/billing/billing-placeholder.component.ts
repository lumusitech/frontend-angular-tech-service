import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-billing-placeholder',
  imports: [MatIconModule],
  template: `
    <div class="space-y-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Facturación</h1>
        <p class="text-gray-500 mt-1">Gestión de facturas electrónicas</p>
      </div>
      <div class="flex flex-col items-center justify-center py-16 px-4">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <mat-icon class="text-blue-600 text-3xl">receipt_long</mat-icon>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-1">Próximamente</h3>
        <p class="text-sm text-gray-500 text-center max-w-sm">
          La gestión de facturas electrónicas ARCA/AFIP estará disponible pronto.
        </p>
      </div>
    </div>
  `,
})
export class BillingPlaceholderComponent {}
