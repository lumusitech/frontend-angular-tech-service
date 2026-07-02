// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
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
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] outline-none transition-colors"
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
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] outline-none transition-colors"
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
              class="w-full text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-offset-2"
              [style.background-color]="'var(--color-secondary)'"
              [style.--tw-ring-color]="'var(--color-secondary)'"
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
  `
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly email = signal(stryMutAct_9fa48("1458") ? "Stryker was here!" : (stryCov_9fa48("1458"), ''));
  readonly password = signal(stryMutAct_9fa48("1459") ? "Stryker was here!" : (stryCov_9fa48("1459"), ''));
  readonly error = signal(stryMutAct_9fa48("1460") ? "Stryker was here!" : (stryCov_9fa48("1460"), ''));
  readonly loading = signal(stryMutAct_9fa48("1461") ? true : (stryCov_9fa48("1461"), false));
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("1462")) {
      {}
    } else {
      stryCov_9fa48("1462");
      return (event.target as HTMLInputElement).value;
    }
  }
  onSubmit(event: Event): void {
    if (stryMutAct_9fa48("1463")) {
      {}
    } else {
      stryCov_9fa48("1463");
      event.preventDefault();
      this.error.set(stryMutAct_9fa48("1464") ? "Stryker was here!" : (stryCov_9fa48("1464"), ''));
      this.loading.set(stryMutAct_9fa48("1465") ? false : (stryCov_9fa48("1465"), true));
      this.authService.login(stryMutAct_9fa48("1466") ? {} : (stryCov_9fa48("1466"), {
        email: this.email(),
        password: this.password()
      })).subscribe(stryMutAct_9fa48("1467") ? {} : (stryCov_9fa48("1467"), {
        next: () => {
          if (stryMutAct_9fa48("1468")) {
            {}
          } else {
            stryCov_9fa48("1468");
            const role = stryMutAct_9fa48("1469") ? this.authService.user().role : (stryCov_9fa48("1469"), this.authService.user()?.role);
            if (stryMutAct_9fa48("1472") ? role !== 'technician' : stryMutAct_9fa48("1471") ? false : stryMutAct_9fa48("1470") ? true : (stryCov_9fa48("1470", "1471", "1472"), role === (stryMutAct_9fa48("1473") ? "" : (stryCov_9fa48("1473"), 'technician')))) {
              if (stryMutAct_9fa48("1474")) {
                {}
              } else {
                stryCov_9fa48("1474");
                this.router.navigate(stryMutAct_9fa48("1475") ? [] : (stryCov_9fa48("1475"), [stryMutAct_9fa48("1476") ? "" : (stryCov_9fa48("1476"), '/tech')]));
              }
            } else if (stryMutAct_9fa48("1479") ? role !== 'seller' : stryMutAct_9fa48("1478") ? false : stryMutAct_9fa48("1477") ? true : (stryCov_9fa48("1477", "1478", "1479"), role === (stryMutAct_9fa48("1480") ? "" : (stryCov_9fa48("1480"), 'seller')))) {
              if (stryMutAct_9fa48("1481")) {
                {}
              } else {
                stryCov_9fa48("1481");
                this.router.navigate(stryMutAct_9fa48("1482") ? [] : (stryCov_9fa48("1482"), [stryMutAct_9fa48("1483") ? "" : (stryCov_9fa48("1483"), '/seller')]));
              }
            } else {
              if (stryMutAct_9fa48("1484")) {
                {}
              } else {
                stryCov_9fa48("1484");
                this.router.navigate(stryMutAct_9fa48("1485") ? [] : (stryCov_9fa48("1485"), [stryMutAct_9fa48("1486") ? "" : (stryCov_9fa48("1486"), '/admin/dashboard')]));
              }
            }
          }
        },
        error: err => {
          if (stryMutAct_9fa48("1487")) {
            {}
          } else {
            stryCov_9fa48("1487");
            this.loading.set(stryMutAct_9fa48("1488") ? true : (stryCov_9fa48("1488"), false));
            this.error.set(stryMutAct_9fa48("1491") ? err.error?.message && 'Credenciales inválidas. Intenta nuevamente.' : stryMutAct_9fa48("1490") ? false : stryMutAct_9fa48("1489") ? true : (stryCov_9fa48("1489", "1490", "1491"), (stryMutAct_9fa48("1492") ? err.error.message : (stryCov_9fa48("1492"), err.error?.message)) || (stryMutAct_9fa48("1493") ? "" : (stryCov_9fa48("1493"), 'Credenciales inválidas. Intenta nuevamente.'))));
          }
        }
      }));
    }
  }
}