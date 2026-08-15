import { Component, inject, Injectable } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

interface CrudToastData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const TYPE_ICONS: Record<string, string> = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

@Component({
  selector: 'app-crud-toast-content',
  imports: [MatIconModule],
  template: `
    <div class="flex items-center gap-2 min-w-[250px] max-w-[400px]">
      <mat-icon
        [class]="
          data.type === 'success'
            ? '!text-green-500'
            : data.type === 'error'
              ? '!text-red-500'
              : data.type === 'warning'
                ? '!text-amber-500'
                : '!text-blue-500'
        "
      >
        {{ icon }}
      </mat-icon>
      <span class="text-sm font-medium">{{ data.message }}</span>
    </div>
  `,
  host: { class: 'block' },
})
export class CrudToastContentComponent {
  readonly data: CrudToastData = inject(MAT_SNACK_BAR_DATA);
  readonly icon = TYPE_ICONS[this.data.type] || 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private snackBar = inject(MatSnackBar);

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success'): void {
    this.snackBar.openFromComponent(CrudToastContentComponent, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`toast-${type}`],
      data: { message, type } satisfies CrudToastData,
    });
  }
}
