import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-state',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <mat-icon class="text-red-500 text-3xl">error_outline</mat-icon>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">{{ title() }}</h3>
      <p class="text-sm text-gray-500 text-center max-w-sm mb-6">{{ message() }}</p>
      <button mat-stroked-button color="primary" (click)="retry.emit()">
        <mat-icon>refresh</mat-icon>
        Reintentar
      </button>
    </div>
  `,
})
export class ErrorStateComponent {
  title = input<string>('Error al cargar');
  message = input<string>(
    'No se pudieron obtener los datos. Verificá tu conexión e intentá de nuevo.',
  );
  retry = output<void>();
}
