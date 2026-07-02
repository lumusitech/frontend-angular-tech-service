// @ts-nocheck
import { Component, input } from '@angular/core';
@Component({
  selector: 'app-tracking-code',
  template: ` <span class="font-mono text-sm font-medium text-blue-500 dark:text-blue-400">{{ code() }}</span> `
})
export class TrackingCodeComponent {
  code = input.required<string>();
}