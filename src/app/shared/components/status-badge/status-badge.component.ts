import { Component, input } from '@angular/core';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { StatusClassPipe } from '../../pipes/status-class.pipe';

@Component({
  selector: 'app-status-badge',
  imports: [StatusLabelPipe, StatusClassPipe],
  template: `
    <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      [class]="value() | statusClass: type()"
    >
      {{ value() | statusLabel: type() }}
    </span>
  `,
})
export class StatusBadgeComponent {
  value = input.required<string | boolean>();
  type = input.required<
    | 'workOrderStatus'
    | 'workOrderPriority'
    | 'paymentStatus'
    | 'paymentMethod'
    | 'expenseCategory'
    | 'noteType'
    | 'activeInactive'
    | 'invoiceStatus'
    | 'invoiceType'
  >();
}
