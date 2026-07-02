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
import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom, provideAppInitializer, inject, isDevMode, LOCALE_ID } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatNativeDateModule } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeEsAR from '@angular/common/locales/es-AR';
import { routes } from './app.routes';
import { apiResponseInterceptor } from './core/interceptors/api-response.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { provideServiceWorker } from '@angular/service-worker';
import { TranslationService } from './core/services/translation.service';
import { ThemeService } from './core/services/theme.service';
registerLocaleData(localeEsAR);
export const appConfig: ApplicationConfig = stryMutAct_9fa48("2") ? {} : (stryCov_9fa48("2"), {
  providers: stryMutAct_9fa48("3") ? [] : (stryCov_9fa48("3"), [provideBrowserGlobalErrorListeners(), provideRouter(routes, withPreloading(PreloadAllModules)), provideClientHydration(), provideHttpClient(withInterceptors(stryMutAct_9fa48("4") ? [] : (stryCov_9fa48("4"), [apiResponseInterceptor, authInterceptor, loadingInterceptor]))), provideCharts(withDefaultRegisterables()), importProvidersFrom(MatNativeDateModule), stryMutAct_9fa48("5") ? {} : (stryCov_9fa48("5"), {
    provide: LOCALE_ID,
    useValue: stryMutAct_9fa48("6") ? "" : (stryCov_9fa48("6"), 'es-AR')
  }), provideAppInitializer(() => {
    if (stryMutAct_9fa48("7")) {
      {}
    } else {
      stryCov_9fa48("7");
      const themeService = inject(ThemeService);
      themeService.init();
      const ts = inject(TranslationService);
      return ts.init();
    }
  }), provideServiceWorker(stryMutAct_9fa48("8") ? "" : (stryCov_9fa48("8"), 'ngsw-worker.js'), stryMutAct_9fa48("9") ? {} : (stryCov_9fa48("9"), {
    enabled: stryMutAct_9fa48("10") ? isDevMode() : (stryCov_9fa48("10"), !isDevMode()),
    registrationStrategy: stryMutAct_9fa48("11") ? "" : (stryCov_9fa48("11"), 'registerWhenStable:30000')
  }))])
});