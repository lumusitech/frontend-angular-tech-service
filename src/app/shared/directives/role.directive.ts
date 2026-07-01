import { Directive, inject, input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({ selector: '[role]' })
export class RoleDirective {
  private readonly authService = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private rendered = false;

  readonly appRole = input.required<string>({ alias: 'role' });

  constructor() {
    effect(() => {
      const allowed = this.appRole()
        .split(',')
        .map((r) => r.trim());
      const userRole = this.authService.user()?.role ?? '';
      const hasAccess = allowed.includes(userRole);

      if (hasAccess && !this.rendered) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.rendered = true;
      } else if (!hasAccess && this.rendered) {
        this.viewContainer.clear();
        this.rendered = false;
      }
    });
  }
}
