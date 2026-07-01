import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-login',
  imports: [TranslatePipe],
  template: `
    <div class="min-h-svh flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div class="w-full max-w-md">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ 'auth.appTitle' | translate }}
            </h1>
            <p class="text-gray-500 dark:text-gray-400 mt-2">
              {{ 'auth.loginSubtitle' | translate }}
            </p>
          </div>

          <form (submit)="onSubmit($event)" class="space-y-5">
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {{ 'auth.email' | translate }}
              </label>
              <input
                id="email"
                type="email"
                [value]="email()"
                (input)="email.set(getInputValue($event))"
                [placeholder]="'auth.emailPlaceholder' | translate"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {{ 'auth.password' | translate }}
              </label>
              <input
                id="password"
                type="password"
                [value]="password()"
                (input)="password.set(getInputValue($event))"
                [placeholder]="'auth.passwordPlaceholder' | translate"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            @if (error()) {
              <div
                class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
              >
                {{ error() }}
              </div>
            }

            <button
              type="submit"
              [disabled]="loading()"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              @if (loading()) {
                <span class="inline-flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {{ 'auth.loggingIn' | translate }}
                </span>
              } @else {
                {{ 'auth.login' | translate }}
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly error = signal('');
  readonly loading = signal(false);

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.error.set('');
    this.loading.set(true);

    this.authService
      .login({
        email: this.email(),
        password: this.password(),
      })
      .subscribe({
        next: () => {
          const role = this.authService.user()?.role;
          if (role === 'technician') {
            this.router.navigate(['/tech']);
          } else if (role === 'seller') {
            this.router.navigate(['/seller']);
          } else {
            this.router.navigate(['/admin/dashboard']);
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Credenciales inválidas. Intenta nuevamente.');
        },
      });
  }
}
