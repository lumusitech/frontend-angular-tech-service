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
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { UpperCasePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { email, form, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { BusinessSettingsService } from '../../core/services/business-settings.service';
import { DashboardLayoutService, DashboardWidgetId } from '../../core/services/dashboard-layout.service';
import { ThemeService } from '../../core/services/theme.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}
interface BusinessForm {
  businessName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  address: string;
  phone: string;
  email: string;
}
@Component({
  selector: 'app-settings',
  imports: [DragDropModule, MatIconModule, MatButtonModule, MatButtonToggleModule, MatMenuModule, MatCheckboxModule, MatInputModule, MatFormFieldModule, TranslatePipe, UpperCasePipe, FormField],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ 'settings.title' | translate }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          {{ 'settings.subtitle' | translate }}
        </p>
      </div>

      <!-- Business -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center"
          >
            <mat-icon class="text-amber-600 dark:text-amber-400">business</mat-icon>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ 'settings.business' | translate }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'settings.businessSubtitle' | translate }}
            </p>
          </div>
        </div>

        <div class="ml-0 sm:ml-13 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ 'settings.businessName' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'settings.businessNamePlaceholder' | translate"
                [formField]="businessForm.businessName"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ 'settings.logoUrl' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'settings.logoUrlPlaceholder' | translate"
                [formField]="businessForm.logoUrl"
              />
            </mat-form-field>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {{ 'settings.primaryColor' | translate }}
              </label>
              <div class="flex items-center gap-2">
                <input
                  type="color"
                  [formField]="businessForm.primaryColor"
                  class="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  [formField]="businessForm.primaryColor"
                  class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {{ 'settings.secondaryColor' | translate }}
              </label>
              <div class="flex items-center gap-2">
                <input
                  type="color"
                  [formField]="businessForm.secondaryColor"
                  class="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  [formField]="businessForm.secondaryColor"
                  class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ 'settings.businessAddress' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'settings.businessAddressPlaceholder' | translate"
                [formField]="businessForm.address"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ 'settings.businessPhone' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'settings.businessPhonePlaceholder' | translate"
                [formField]="businessForm.phone"
              />
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'settings.businessEmail' | translate }}</mat-label>
            <input
              matInput
              type="email"
              [placeholder]="'settings.businessEmailPlaceholder' | translate"
              [formField]="businessForm.email"
            />
          </mat-form-field>

          <div class="flex justify-end">
            <button mat-flat-button color="primary" [disabled]="saving()" (click)="saveBusiness()">
              @if (saving()) {
                {{ 'common.saving' | translate }}
              } @else {
                {{ 'common.save' | translate }}
              }
            </button>
          </div>
        </div>
      </div>

      <!-- Appearance -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"
          >
            <mat-icon class="text-purple-600 dark:text-purple-400">palette</mat-icon>
          </div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ 'settings.appearance' | translate }}
          </h2>
        </div>

        <div class="ml-13">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {{ 'settings.theme' | translate }}
          </p>
          <mat-button-toggle-group [value]="themeMode()" (change)="onThemeChange($event.value)">
            <mat-button-toggle value="system">
              <span class="flex items-center gap-2">
                <mat-icon class="w-5! h-5! text-gray-500">brightness_auto</mat-icon>
                {{ 'settings.system' | translate }}
              </span>
            </mat-button-toggle>
            <mat-button-toggle value="light">
              <span class="flex items-center gap-2">
                <mat-icon class="w-5! h-5! text-amber-500">light_mode</mat-icon>
                {{ 'settings.light' | translate }}
              </span>
            </mat-button-toggle>
            <mat-button-toggle value="dark">
              <span class="flex items-center gap-2">
                <mat-icon class="w-5! h-5! text-indigo-400">dark_mode</mat-icon>
                {{ 'settings.dark' | translate }}
              </span>
            </mat-button-toggle>
          </mat-button-toggle-group>
        </div>
      </div>

      <!-- Language -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
          >
            <mat-icon class="text-blue-600 dark:text-blue-400">translate</mat-icon>
          </div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ 'settings.language' | translate }}
          </h2>
        </div>

        <div class="ml-13">
          <button mat-stroked-button [matMenuTriggerFor]="langMenu">
            {{ currentFlag() }} {{ translationService.locale() | uppercase }}
            <mat-icon>arrow_drop_down</mat-icon>
          </button>

          <mat-menu #langMenu="matMenu">
            @for (lang of availableLanguages; track lang.code) {
              <button mat-menu-item (click)="onLanguageChange(lang.code)">
                <span>{{ lang.flag }} {{ lang.label }}</span>
              </button>
            }
          </mat-menu>
        </div>
      </div>

      <!-- Dashboard Widgets -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center"
          >
            <mat-icon class="text-emerald-600 dark:text-emerald-400">dashboard</mat-icon>
          </div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ 'settings.dashboard' | translate }}
          </h2>
        </div>

        <div class="ml-13">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {{ 'settings.dashboardOrder' | translate }}
          </p>
          <div cdkDropList (cdkDropListDropped)="onDrop($event)" class="space-y-2">
            @for (widgetId of layoutService.layout(); track widgetId) {
              <div
                cdkDrag
                class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div
                  cdkDragHandle
                  class="cursor-grab active:cursor-grabbing text-gray-400 dark:text-gray-500"
                >
                  <mat-icon>drag_indicator</mat-icon>
                </div>
                <mat-checkbox
                  [checked]="layoutService.widgets()[widgetId]"
                  (change)="layoutService.toggleWidget(widgetId)"
                >
                  {{ 'settings.widget' + widgetId | translate }}
                </mat-checkbox>
              </div>
            }
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button mat-stroked-button (click)="layoutService.reset()">
              <mat-icon>restart_alt</mat-icon>
              {{ 'settings.resetLayout' | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  readonly themeService = inject(ThemeService);
  readonly translationService = inject(TranslationService);
  readonly layoutService = inject(DashboardLayoutService);
  readonly businessSettingsService = inject(BusinessSettingsService);
  readonly themeMode = computed(() => {
    if (stryMutAct_9fa48("4340")) {
      {}
    } else {
      stryCov_9fa48("4340");
      const stored = (stryMutAct_9fa48("4343") ? typeof window === 'undefined' : stryMutAct_9fa48("4342") ? false : stryMutAct_9fa48("4341") ? true : (stryCov_9fa48("4341", "4342", "4343"), typeof window !== (stryMutAct_9fa48("4344") ? "" : (stryCov_9fa48("4344"), 'undefined')))) ? localStorage.getItem(stryMutAct_9fa48("4345") ? "" : (stryCov_9fa48("4345"), 'theme_preference')) : null;
      return stored ? stored : stryMutAct_9fa48("4346") ? "" : (stryCov_9fa48("4346"), 'system');
    }
  });
  readonly saving = signal(stryMutAct_9fa48("4347") ? true : (stryCov_9fa48("4347"), false));
  readonly businessModel = signal<BusinessForm>(stryMutAct_9fa48("4348") ? {} : (stryCov_9fa48("4348"), {
    businessName: stryMutAct_9fa48("4349") ? "Stryker was here!" : (stryCov_9fa48("4349"), ''),
    logoUrl: stryMutAct_9fa48("4350") ? "Stryker was here!" : (stryCov_9fa48("4350"), ''),
    primaryColor: stryMutAct_9fa48("4351") ? "" : (stryCov_9fa48("4351"), '#1E40AF'),
    secondaryColor: stryMutAct_9fa48("4352") ? "" : (stryCov_9fa48("4352"), '#059669'),
    address: stryMutAct_9fa48("4353") ? "Stryker was here!" : (stryCov_9fa48("4353"), ''),
    phone: stryMutAct_9fa48("4354") ? "Stryker was here!" : (stryCov_9fa48("4354"), ''),
    email: stryMutAct_9fa48("4355") ? "Stryker was here!" : (stryCov_9fa48("4355"), '')
  }));
  readonly businessForm = form(this.businessModel, p => {
    if (stryMutAct_9fa48("4356")) {
      {}
    } else {
      stryCov_9fa48("4356");
      email(p.email, stryMutAct_9fa48("4357") ? {} : (stryCov_9fa48("4357"), {
        message: stryMutAct_9fa48("4358") ? "" : (stryCov_9fa48("4358"), 'Email inválido')
      }));
    }
  });
  ngOnInit(): void {
    if (stryMutAct_9fa48("4359")) {
      {}
    } else {
      stryCov_9fa48("4359");
      const data = this.businessSettingsService.settings();
      if (stryMutAct_9fa48("4361") ? false : stryMutAct_9fa48("4360") ? true : (stryCov_9fa48("4360", "4361"), data)) {
        if (stryMutAct_9fa48("4362")) {
          {}
        } else {
          stryCov_9fa48("4362");
          this.businessModel.set(stryMutAct_9fa48("4363") ? {} : (stryCov_9fa48("4363"), {
            businessName: stryMutAct_9fa48("4366") ? data.businessName && '' : stryMutAct_9fa48("4365") ? false : stryMutAct_9fa48("4364") ? true : (stryCov_9fa48("4364", "4365", "4366"), data.businessName || (stryMutAct_9fa48("4367") ? "Stryker was here!" : (stryCov_9fa48("4367"), ''))),
            logoUrl: stryMutAct_9fa48("4370") ? data.logoUrl && '' : stryMutAct_9fa48("4369") ? false : stryMutAct_9fa48("4368") ? true : (stryCov_9fa48("4368", "4369", "4370"), data.logoUrl || (stryMutAct_9fa48("4371") ? "Stryker was here!" : (stryCov_9fa48("4371"), ''))),
            primaryColor: stryMutAct_9fa48("4374") ? data.primaryColor && '#1E40AF' : stryMutAct_9fa48("4373") ? false : stryMutAct_9fa48("4372") ? true : (stryCov_9fa48("4372", "4373", "4374"), data.primaryColor || (stryMutAct_9fa48("4375") ? "" : (stryCov_9fa48("4375"), '#1E40AF'))),
            secondaryColor: stryMutAct_9fa48("4378") ? data.secondaryColor && '#059669' : stryMutAct_9fa48("4377") ? false : stryMutAct_9fa48("4376") ? true : (stryCov_9fa48("4376", "4377", "4378"), data.secondaryColor || (stryMutAct_9fa48("4379") ? "" : (stryCov_9fa48("4379"), '#059669'))),
            address: stryMutAct_9fa48("4382") ? data.address && '' : stryMutAct_9fa48("4381") ? false : stryMutAct_9fa48("4380") ? true : (stryCov_9fa48("4380", "4381", "4382"), data.address || (stryMutAct_9fa48("4383") ? "Stryker was here!" : (stryCov_9fa48("4383"), ''))),
            phone: stryMutAct_9fa48("4386") ? data.phone && '' : stryMutAct_9fa48("4385") ? false : stryMutAct_9fa48("4384") ? true : (stryCov_9fa48("4384", "4385", "4386"), data.phone || (stryMutAct_9fa48("4387") ? "Stryker was here!" : (stryCov_9fa48("4387"), ''))),
            email: stryMutAct_9fa48("4390") ? data.email && '' : stryMutAct_9fa48("4389") ? false : stryMutAct_9fa48("4388") ? true : (stryCov_9fa48("4388", "4389", "4390"), data.email || (stryMutAct_9fa48("4391") ? "Stryker was here!" : (stryCov_9fa48("4391"), '')))
          }));
          this.applyColors();
        }
      }
    }
  }
  availableLanguages: LanguageOption[] = stryMutAct_9fa48("4392") ? [] : (stryCov_9fa48("4392"), [stryMutAct_9fa48("4393") ? {} : (stryCov_9fa48("4393"), {
    code: stryMutAct_9fa48("4394") ? "" : (stryCov_9fa48("4394"), 'es'),
    label: stryMutAct_9fa48("4395") ? "" : (stryCov_9fa48("4395"), 'Español'),
    flag: stryMutAct_9fa48("4396") ? "" : (stryCov_9fa48("4396"), '🇦🇷')
  }), stryMutAct_9fa48("4397") ? {} : (stryCov_9fa48("4397"), {
    code: stryMutAct_9fa48("4398") ? "" : (stryCov_9fa48("4398"), 'en'),
    label: stryMutAct_9fa48("4399") ? "" : (stryCov_9fa48("4399"), 'English'),
    flag: stryMutAct_9fa48("4400") ? "" : (stryCov_9fa48("4400"), '🇺🇸')
  })]);
  currentFlag = computed(() => {
    if (stryMutAct_9fa48("4401")) {
      {}
    } else {
      stryCov_9fa48("4401");
      const lang = this.availableLanguages.find(stryMutAct_9fa48("4402") ? () => undefined : (stryCov_9fa48("4402"), l => stryMutAct_9fa48("4405") ? l.code !== this.translationService.locale() : stryMutAct_9fa48("4404") ? false : stryMutAct_9fa48("4403") ? true : (stryCov_9fa48("4403", "4404", "4405"), l.code === this.translationService.locale())));
      return stryMutAct_9fa48("4408") ? lang?.flag && '🌐' : stryMutAct_9fa48("4407") ? false : stryMutAct_9fa48("4406") ? true : (stryCov_9fa48("4406", "4407", "4408"), (stryMutAct_9fa48("4409") ? lang.flag : (stryCov_9fa48("4409"), lang?.flag)) || (stryMutAct_9fa48("4410") ? "" : (stryCov_9fa48("4410"), '🌐')));
    }
  });
  onThemeChange(mode: string): void {
    if (stryMutAct_9fa48("4411")) {
      {}
    } else {
      stryCov_9fa48("4411");
      if (stryMutAct_9fa48("4414") ? mode !== 'system' : stryMutAct_9fa48("4413") ? false : stryMutAct_9fa48("4412") ? true : (stryCov_9fa48("4412", "4413", "4414"), mode === (stryMutAct_9fa48("4415") ? "" : (stryCov_9fa48("4415"), 'system')))) {
        if (stryMutAct_9fa48("4416")) {
          {}
        } else {
          stryCov_9fa48("4416");
          this.themeService.resetToSystem();
        }
      } else {
        if (stryMutAct_9fa48("4417")) {
          {}
        } else {
          stryCov_9fa48("4417");
          this.themeService.setTheme(mode as 'light' | 'dark');
        }
      }
    }
  }
  onLanguageChange(locale: string): void {
    if (stryMutAct_9fa48("4418")) {
      {}
    } else {
      stryCov_9fa48("4418");
      this.translationService.setLocale(locale);
    }
  }
  onDrop(event: CdkDragDrop<DashboardWidgetId[]>): void {
    if (stryMutAct_9fa48("4419")) {
      {}
    } else {
      stryCov_9fa48("4419");
      this.layoutService.reorder(event.previousIndex, event.currentIndex);
    }
  }
  saveBusiness(): void {
    if (stryMutAct_9fa48("4420")) {
      {}
    } else {
      stryCov_9fa48("4420");
      this.saving.set(stryMutAct_9fa48("4421") ? false : (stryCov_9fa48("4421"), true));
      const m = this.businessModel();
      this.businessSettingsService.update(stryMutAct_9fa48("4422") ? {} : (stryCov_9fa48("4422"), {
        businessName: m.businessName,
        logoUrl: m.logoUrl,
        primaryColor: m.primaryColor,
        secondaryColor: m.secondaryColor,
        address: m.address,
        phone: m.phone,
        email: m.email
      })).subscribe(stryMutAct_9fa48("4423") ? {} : (stryCov_9fa48("4423"), {
        next: data => {
          if (stryMutAct_9fa48("4424")) {
            {}
          } else {
            stryCov_9fa48("4424");
            this.saving.set(stryMutAct_9fa48("4425") ? true : (stryCov_9fa48("4425"), false));
            this.businessModel.set(stryMutAct_9fa48("4426") ? {} : (stryCov_9fa48("4426"), {
              businessName: stryMutAct_9fa48("4429") ? data.businessName && '' : stryMutAct_9fa48("4428") ? false : stryMutAct_9fa48("4427") ? true : (stryCov_9fa48("4427", "4428", "4429"), data.businessName || (stryMutAct_9fa48("4430") ? "Stryker was here!" : (stryCov_9fa48("4430"), ''))),
              logoUrl: stryMutAct_9fa48("4433") ? data.logoUrl && '' : stryMutAct_9fa48("4432") ? false : stryMutAct_9fa48("4431") ? true : (stryCov_9fa48("4431", "4432", "4433"), data.logoUrl || (stryMutAct_9fa48("4434") ? "Stryker was here!" : (stryCov_9fa48("4434"), ''))),
              primaryColor: stryMutAct_9fa48("4437") ? data.primaryColor && '#1E40AF' : stryMutAct_9fa48("4436") ? false : stryMutAct_9fa48("4435") ? true : (stryCov_9fa48("4435", "4436", "4437"), data.primaryColor || (stryMutAct_9fa48("4438") ? "" : (stryCov_9fa48("4438"), '#1E40AF'))),
              secondaryColor: stryMutAct_9fa48("4441") ? data.secondaryColor && '#059669' : stryMutAct_9fa48("4440") ? false : stryMutAct_9fa48("4439") ? true : (stryCov_9fa48("4439", "4440", "4441"), data.secondaryColor || (stryMutAct_9fa48("4442") ? "" : (stryCov_9fa48("4442"), '#059669'))),
              address: stryMutAct_9fa48("4445") ? data.address && '' : stryMutAct_9fa48("4444") ? false : stryMutAct_9fa48("4443") ? true : (stryCov_9fa48("4443", "4444", "4445"), data.address || (stryMutAct_9fa48("4446") ? "Stryker was here!" : (stryCov_9fa48("4446"), ''))),
              phone: stryMutAct_9fa48("4449") ? data.phone && '' : stryMutAct_9fa48("4448") ? false : stryMutAct_9fa48("4447") ? true : (stryCov_9fa48("4447", "4448", "4449"), data.phone || (stryMutAct_9fa48("4450") ? "Stryker was here!" : (stryCov_9fa48("4450"), ''))),
              email: stryMutAct_9fa48("4453") ? data.email && '' : stryMutAct_9fa48("4452") ? false : stryMutAct_9fa48("4451") ? true : (stryCov_9fa48("4451", "4452", "4453"), data.email || (stryMutAct_9fa48("4454") ? "Stryker was here!" : (stryCov_9fa48("4454"), '')))
            }));
            this.applyColors();
          }
        },
        error: err => {
          if (stryMutAct_9fa48("4455")) {
            {}
          } else {
            stryCov_9fa48("4455");
            this.saving.set(stryMutAct_9fa48("4456") ? true : (stryCov_9fa48("4456"), false));
            console.error(stryMutAct_9fa48("4457") ? "" : (stryCov_9fa48("4457"), 'Error guardando business settings:'), err);
          }
        }
      }));
    }
  }
  private applyColors(): void {
    if (stryMutAct_9fa48("4458")) {
      {}
    } else {
      stryCov_9fa48("4458");
      if (stryMutAct_9fa48("4461") ? typeof document === 'undefined' : stryMutAct_9fa48("4460") ? false : stryMutAct_9fa48("4459") ? true : (stryCov_9fa48("4459", "4460", "4461"), typeof document !== (stryMutAct_9fa48("4462") ? "" : (stryCov_9fa48("4462"), 'undefined')))) {
        if (stryMutAct_9fa48("4463")) {
          {}
        } else {
          stryCov_9fa48("4463");
          const m = this.businessModel();
          if (stryMutAct_9fa48("4465") ? false : stryMutAct_9fa48("4464") ? true : (stryCov_9fa48("4464", "4465"), m.primaryColor)) {
            if (stryMutAct_9fa48("4466")) {
              {}
            } else {
              stryCov_9fa48("4466");
              document.documentElement.style.setProperty(stryMutAct_9fa48("4467") ? "" : (stryCov_9fa48("4467"), '--color-primary'), m.primaryColor);
            }
          }
          if (stryMutAct_9fa48("4469") ? false : stryMutAct_9fa48("4468") ? true : (stryCov_9fa48("4468", "4469"), m.secondaryColor)) {
            if (stryMutAct_9fa48("4470")) {
              {}
            } else {
              stryCov_9fa48("4470");
              document.documentElement.style.setProperty(stryMutAct_9fa48("4471") ? "" : (stryCov_9fa48("4471"), '--color-secondary'), m.secondaryColor);
            }
          }
        }
      }
    }
  }
}