import { Component, input, computed } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-urgency-indicator',
  imports: [TranslatePipe],
  template: `
    <div class="flex items-center gap-1.5">
      <span class="inline-block w-2.5 h-2.5 rounded-full" [class]="dotColor()"></span>
      <span class="text-xs font-medium" [class]="textColor()">
        {{ label() | translate }}
      </span>
    </div>
  `,
})
export class UrgencyIndicatorComponent {
  scheduledDate = input<string | null>(null);

  private readonly daysRemaining = computed(() => {
    const date = this.scheduledDate();
    if (!date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scheduled = new Date(date);
    scheduled.setHours(0, 0, 0, 0);
    return Math.ceil((scheduled.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  });

  readonly dotColor = computed(() => {
    const days = this.daysRemaining();
    if (days === null) return 'bg-gray-400';
    if (days <= 0) return 'bg-red-500';
    if (days <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  });

  readonly textColor = computed(() => {
    const days = this.daysRemaining();
    if (days === null) return 'text-gray-500 dark:text-gray-400';
    if (days <= 0) return 'text-red-600 dark:text-red-400';
    if (days <= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  });

  readonly label = computed(() => {
    const days = this.daysRemaining();
    if (days === null) return 'technician.noDate';
    if (days < 0) return `technician.overdue`;
    if (days === 0) return 'technician.dueToday';
    return `${days} ${'technician.daysRemaining'}`;
  });
}
