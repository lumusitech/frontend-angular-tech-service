import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tracking-code',
  template: ` <span class="font-mono text-sm font-medium text-blue-600">{{ code() }}</span> `,
})
export class TrackingCodeComponent {
  code = input.required<string>();
}
