import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
  provideAppInitializer,
  inject,
  isDevMode,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeEsAR from '@angular/common/locales/es-AR';
import { routes } from './app.routes';
import { apiResponseInterceptor } from './core/interceptors/api-response.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { offlineInterceptor } from './core/interceptors/offline.interceptor';
import { provideServiceWorker } from '@angular/service-worker';
import { TranslationService } from './core/services/translation.service';
import { ThemeService } from './core/services/theme.service';
import { OfflineService } from './core/services/offline.service';
import { LocalDateAdapter } from './core/utils/local-date.adapter';

registerLocaleData(localeEsAR);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([
        offlineInterceptor,
        apiResponseInterceptor,
        authInterceptor,
        loadingInterceptor,
      ]),
    ),
    provideCharts(withDefaultRegisterables()),
    importProvidersFrom(MatNativeDateModule),
    { provide: DateAdapter, useClass: LocalDateAdapter },
    { provide: LOCALE_ID, useValue: 'es-AR' },
    provideAppInitializer(() => {
      const themeService = inject(ThemeService);
      themeService.init();
      const ts = inject(TranslationService);
      const offlineService = inject(OfflineService);
      offlineService.init();
      return ts.init();
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
