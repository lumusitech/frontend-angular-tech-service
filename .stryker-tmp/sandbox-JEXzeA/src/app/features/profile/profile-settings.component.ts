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
import { Component, inject, signal, computed, effect } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { form, FormField, required, email } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { ToastService } from '../../core/services/toast.service';
const AVATAR_EMOJIS = stryMutAct_9fa48("3663") ? [] : (stryCov_9fa48("3663"), [stryMutAct_9fa48("3664") ? "" : (stryCov_9fa48("3664"), '👨‍🔧'), stryMutAct_9fa48("3665") ? "" : (stryCov_9fa48("3665"), '👩‍🔧'), stryMutAct_9fa48("3666") ? "" : (stryCov_9fa48("3666"), '🧑‍💻'), stryMutAct_9fa48("3667") ? "" : (stryCov_9fa48("3667"), '👨‍💻'), stryMutAct_9fa48("3668") ? "" : (stryCov_9fa48("3668"), '👩‍💻'), stryMutAct_9fa48("3669") ? "" : (stryCov_9fa48("3669"), '🧑‍🏭'), stryMutAct_9fa48("3670") ? "" : (stryCov_9fa48("3670"), '👨‍🏭'), stryMutAct_9fa48("3671") ? "" : (stryCov_9fa48("3671"), '👩‍🏭'), stryMutAct_9fa48("3672") ? "" : (stryCov_9fa48("3672"), '⚙️'), stryMutAct_9fa48("3673") ? "" : (stryCov_9fa48("3673"), '🔧'), stryMutAct_9fa48("3674") ? "" : (stryCov_9fa48("3674"), '🛠️'), stryMutAct_9fa48("3675") ? "" : (stryCov_9fa48("3675"), '💡'), stryMutAct_9fa48("3676") ? "" : (stryCov_9fa48("3676"), '🔌'), stryMutAct_9fa48("3677") ? "" : (stryCov_9fa48("3677"), '📋'), stryMutAct_9fa48("3678") ? "" : (stryCov_9fa48("3678"), '🏆'), stryMutAct_9fa48("3679") ? "" : (stryCov_9fa48("3679"), '👷'), stryMutAct_9fa48("3680") ? "" : (stryCov_9fa48("3680"), '🧑‍🔬'), stryMutAct_9fa48("3681") ? "" : (stryCov_9fa48("3681"), '🎯')]);
interface ProfileForm {
  name: string;
  email: string;
  phone: string;
}
interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
@Component({
  selector: 'app-profile-settings',
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatDialogModule, FormField, TranslatePipe, DatePipe, TitleCasePipe],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Profile Header -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        @if (profileResource.isLoading()) {
          <div class="flex justify-center py-12">
            <mat-icon class="animate-spin text-gray-400">sync</mat-icon>
          </div>
        } @else if (profileResource.value(); as profile) {
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div class="flex items-center gap-5">
              <button
                (click)="showEmojiPicker.set(!showEmojiPicker())"
                class="relative group cursor-pointer shrink-0"
                title="Cambiar avatar"
              >
                <div class="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl border-2 border-white/30 group-hover:border-white/60 transition-colors">
                  {{ avatarDisplay() }}
                </div>
                <div class="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <mat-icon class="!text-white opacity-0 group-hover:opacity-100 transition-opacity">photo_camera</mat-icon>
                </div>
              </button>
              <div class="text-white">
                <h1 class="text-2xl font-bold">{{ profile.name }}</h1>
                <p class="text-blue-100 text-sm">{{ profile.email }}</p>
                <div class="flex items-center gap-3 mt-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                    {{ profile.role | titlecase }}
                  </span>
                  @if (profile.createdAt) {
                    <span class="text-blue-200 text-xs">
                      {{ 'profile.memberSince' | translate }} {{ profile.createdAt | date:'mediumDate' }}
                    </span>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Emoji Picker -->
          @if (showEmojiPicker()) {
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Elegí tu avatar</p>
              <div class="flex flex-wrap gap-2">
                @for (emoji of emojis; track emoji) {
                  <button
                    (click)="selectEmoji(emoji)"
                    class="w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all"
                    [class]="avatar() === emoji ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500 scale-110' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'"
                  >
                    {{ emoji }}
                  </button>
                }
              </div>
              <div class="mt-3 flex items-center gap-3">
                <label class="text-xs font-medium text-gray-500 dark:text-gray-400">O subí una foto:</label>
                <input
                  type="file"
                  accept="image/*"
                  (change)="onFileSelected($event)"
                  class="text-xs text-gray-500 dark:text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
                />
              </div>
            </div>
          }

          <!-- Edit Form -->
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <mat-icon class="text-blue-600 dark:text-blue-400">edit</mat-icon>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ 'profile.personalInfo' | translate }}
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ 'profile.personalInfoSubtitle' | translate }}
                </p>
              </div>
            </div>

            <div class="ml-0 sm:ml-13 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>{{ 'profile.name' | translate }}</mat-label>
                  <input
                    matInput
                    [placeholder]="'profile.namePlaceholder' | translate"
                    [formField]="profileForm.name"
                  />
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>{{ 'profile.email' | translate }}</mat-label>
                  <input
                    matInput
                    type="email"
                    [placeholder]="'profile.emailPlaceholder' | translate"
                    [formField]="profileForm.email"
                  />
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>{{ 'profile.phone' | translate }}</mat-label>
                <input
                  matInput
                  [placeholder]="'profile.phonePlaceholder' | translate"
                  [formField]="profileForm.phone"
                />
              </mat-form-field>

              <div class="flex justify-end">
                <button mat-flat-button color="primary" [disabled]="savingProfile()" (click)="saveProfile()">
                  @if (savingProfile()) {
                    {{ 'common.saving' | translate }}
                  } @else {
                    {{ 'common.save' | translate }}
                  }
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Change Password -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
            <mat-icon class="text-amber-600 dark:text-amber-400">lock</mat-icon>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ 'profile.changePassword' | translate }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'profile.changePasswordSubtitle' | translate }}
            </p>
          </div>
        </div>

        <div class="ml-0 sm:ml-13 space-y-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'profile.currentPassword' | translate }}</mat-label>
            <input
              matInput
              type="password"
              [placeholder]="'profile.currentPasswordPlaceholder' | translate"
              [formField]="passwordForm.currentPassword"
            />
          </mat-form-field>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ 'profile.newPassword' | translate }}</mat-label>
              <input
                matInput
                type="password"
                [placeholder]="'profile.newPasswordPlaceholder' | translate"
                [formField]="passwordForm.newPassword"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ 'profile.confirmPassword' | translate }}</mat-label>
              <input
                matInput
                type="password"
                [placeholder]="'profile.confirmPasswordPlaceholder' | translate"
                [formField]="passwordForm.confirmPassword"
              />
            </mat-form-field>
          </div>

          <div class="flex justify-end">
            <button
              mat-stroked-button
              color="warn"
              [disabled]="savingPassword() || !passwordForm.currentPassword() || !passwordForm.newPassword()"
              (click)="changePassword()"
            >
              @if (savingPassword()) {
                {{ 'common.saving' | translate }}
              } @else {
                {{ 'profile.updatePassword' | translate }}
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileSettingsComponent {
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  readonly profileResource = httpResource<User>(stryMutAct_9fa48("3682") ? () => undefined : (stryCov_9fa48("3682"), () => stryMutAct_9fa48("3683") ? "" : (stryCov_9fa48("3683"), '/api/auth/profile')));
  readonly emojis = AVATAR_EMOJIS;
  readonly avatar = signal(stryMutAct_9fa48("3684") ? "Stryker was here!" : (stryCov_9fa48("3684"), ''));
  readonly showEmojiPicker = signal(stryMutAct_9fa48("3685") ? true : (stryCov_9fa48("3685"), false));
  readonly avatarDisplay = computed(() => {
    if (stryMutAct_9fa48("3686")) {
      {}
    } else {
      stryCov_9fa48("3686");
      const a = this.avatar();
      if (stryMutAct_9fa48("3689") ? false : stryMutAct_9fa48("3688") ? true : stryMutAct_9fa48("3687") ? a : (stryCov_9fa48("3687", "3688", "3689"), !a)) {
        if (stryMutAct_9fa48("3690")) {
          {}
        } else {
          stryCov_9fa48("3690");
          const name = stryMutAct_9fa48("3691") ? this.profileResource.value().name : (stryCov_9fa48("3691"), this.profileResource.value()?.name);
          return name ? stryMutAct_9fa48("3693") ? name.toUpperCase() : stryMutAct_9fa48("3692") ? name.charAt(0).toLowerCase() : (stryCov_9fa48("3692", "3693"), name.charAt(0).toUpperCase()) : stryMutAct_9fa48("3694") ? "" : (stryCov_9fa48("3694"), '?');
        }
      }
      return a;
    }
  });
  readonly profileModel = signal<ProfileForm>(stryMutAct_9fa48("3695") ? {} : (stryCov_9fa48("3695"), {
    name: stryMutAct_9fa48("3696") ? "Stryker was here!" : (stryCov_9fa48("3696"), ''),
    email: stryMutAct_9fa48("3697") ? "Stryker was here!" : (stryCov_9fa48("3697"), ''),
    phone: stryMutAct_9fa48("3698") ? "Stryker was here!" : (stryCov_9fa48("3698"), '')
  }));
  readonly profileForm = form(this.profileModel, p => {
    if (stryMutAct_9fa48("3699")) {
      {}
    } else {
      stryCov_9fa48("3699");
      required(p.name, stryMutAct_9fa48("3700") ? {} : (stryCov_9fa48("3700"), {
        message: stryMutAct_9fa48("3701") ? "" : (stryCov_9fa48("3701"), 'Nombre requerido')
      }));
      required(p.email, stryMutAct_9fa48("3702") ? {} : (stryCov_9fa48("3702"), {
        message: stryMutAct_9fa48("3703") ? "" : (stryCov_9fa48("3703"), 'Email requerido')
      }));
      email(p.email, stryMutAct_9fa48("3704") ? {} : (stryCov_9fa48("3704"), {
        message: stryMutAct_9fa48("3705") ? "" : (stryCov_9fa48("3705"), 'Email inválido')
      }));
    }
  });
  readonly passwordModel = signal<PasswordForm>(stryMutAct_9fa48("3706") ? {} : (stryCov_9fa48("3706"), {
    currentPassword: stryMutAct_9fa48("3707") ? "Stryker was here!" : (stryCov_9fa48("3707"), ''),
    newPassword: stryMutAct_9fa48("3708") ? "Stryker was here!" : (stryCov_9fa48("3708"), ''),
    confirmPassword: stryMutAct_9fa48("3709") ? "Stryker was here!" : (stryCov_9fa48("3709"), '')
  }));
  readonly passwordForm = form(this.passwordModel);
  readonly savingProfile = signal(stryMutAct_9fa48("3710") ? true : (stryCov_9fa48("3710"), false));
  readonly savingPassword = signal(stryMutAct_9fa48("3711") ? true : (stryCov_9fa48("3711"), false));
  private readonly _syncProfile = effect(() => {
    if (stryMutAct_9fa48("3712")) {
      {}
    } else {
      stryCov_9fa48("3712");
      const profile = this.profileResource.value();
      if (stryMutAct_9fa48("3714") ? false : stryMutAct_9fa48("3713") ? true : (stryCov_9fa48("3713", "3714"), profile)) {
        if (stryMutAct_9fa48("3715")) {
          {}
        } else {
          stryCov_9fa48("3715");
          this.avatar.set(stryMutAct_9fa48("3718") ? profile.avatar && '' : stryMutAct_9fa48("3717") ? false : stryMutAct_9fa48("3716") ? true : (stryCov_9fa48("3716", "3717", "3718"), profile.avatar || (stryMutAct_9fa48("3719") ? "Stryker was here!" : (stryCov_9fa48("3719"), ''))));
          this.profileModel.set(stryMutAct_9fa48("3720") ? {} : (stryCov_9fa48("3720"), {
            name: stryMutAct_9fa48("3723") ? profile.name && '' : stryMutAct_9fa48("3722") ? false : stryMutAct_9fa48("3721") ? true : (stryCov_9fa48("3721", "3722", "3723"), profile.name || (stryMutAct_9fa48("3724") ? "Stryker was here!" : (stryCov_9fa48("3724"), ''))),
            email: stryMutAct_9fa48("3727") ? profile.email && '' : stryMutAct_9fa48("3726") ? false : stryMutAct_9fa48("3725") ? true : (stryCov_9fa48("3725", "3726", "3727"), profile.email || (stryMutAct_9fa48("3728") ? "Stryker was here!" : (stryCov_9fa48("3728"), ''))),
            phone: stryMutAct_9fa48("3731") ? profile.phone && '' : stryMutAct_9fa48("3730") ? false : stryMutAct_9fa48("3729") ? true : (stryCov_9fa48("3729", "3730", "3731"), profile.phone || (stryMutAct_9fa48("3732") ? "Stryker was here!" : (stryCov_9fa48("3732"), '')))
          }));
        }
      }
    }
  });
  selectEmoji(emoji: string): void {
    if (stryMutAct_9fa48("3733")) {
      {}
    } else {
      stryCov_9fa48("3733");
      this.avatar.set(emoji);
      this.showEmojiPicker.set(stryMutAct_9fa48("3734") ? true : (stryCov_9fa48("3734"), false));
      this.saveAvatarToApi(emoji);
    }
  }
  onFileSelected(event: Event): void {
    if (stryMutAct_9fa48("3735")) {
      {}
    } else {
      stryCov_9fa48("3735");
      const input = event.target as HTMLInputElement;
      const file = stryMutAct_9fa48("3736") ? input.files[0] : (stryCov_9fa48("3736"), input.files?.[0]);
      if (stryMutAct_9fa48("3739") ? false : stryMutAct_9fa48("3738") ? true : stryMutAct_9fa48("3737") ? file : (stryCov_9fa48("3737", "3738", "3739"), !file)) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (stryMutAct_9fa48("3740")) {
          {}
        } else {
          stryCov_9fa48("3740");
          const dataUrl = reader.result as string;
          this.avatar.set(dataUrl);
          this.showEmojiPicker.set(stryMutAct_9fa48("3741") ? true : (stryCov_9fa48("3741"), false));
          this.saveAvatarToApi(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  }
  saveProfile(): void {
    if (stryMutAct_9fa48("3742")) {
      {}
    } else {
      stryCov_9fa48("3742");
      this.savingProfile.set(stryMutAct_9fa48("3743") ? false : (stryCov_9fa48("3743"), true));
      const m = this.profileModel();
      this.profileService.updateProfile(stryMutAct_9fa48("3744") ? {} : (stryCov_9fa48("3744"), {
        name: m.name,
        email: m.email,
        phone: stryMutAct_9fa48("3747") ? m.phone && undefined : stryMutAct_9fa48("3746") ? false : stryMutAct_9fa48("3745") ? true : (stryCov_9fa48("3745", "3746", "3747"), m.phone || undefined),
        avatar: stryMutAct_9fa48("3750") ? this.avatar() && undefined : stryMutAct_9fa48("3749") ? false : stryMutAct_9fa48("3748") ? true : (stryCov_9fa48("3748", "3749", "3750"), this.avatar() || undefined)
      })).subscribe(stryMutAct_9fa48("3751") ? {} : (stryCov_9fa48("3751"), {
        next: updated => {
          if (stryMutAct_9fa48("3752")) {
            {}
          } else {
            stryCov_9fa48("3752");
            this.savingProfile.set(stryMutAct_9fa48("3753") ? true : (stryCov_9fa48("3753"), false));
            this.profileModel.set(stryMutAct_9fa48("3754") ? {} : (stryCov_9fa48("3754"), {
              name: stryMutAct_9fa48("3757") ? updated.name && '' : stryMutAct_9fa48("3756") ? false : stryMutAct_9fa48("3755") ? true : (stryCov_9fa48("3755", "3756", "3757"), updated.name || (stryMutAct_9fa48("3758") ? "Stryker was here!" : (stryCov_9fa48("3758"), ''))),
              email: stryMutAct_9fa48("3761") ? updated.email && '' : stryMutAct_9fa48("3760") ? false : stryMutAct_9fa48("3759") ? true : (stryCov_9fa48("3759", "3760", "3761"), updated.email || (stryMutAct_9fa48("3762") ? "Stryker was here!" : (stryCov_9fa48("3762"), ''))),
              phone: stryMutAct_9fa48("3765") ? updated.phone && '' : stryMutAct_9fa48("3764") ? false : stryMutAct_9fa48("3763") ? true : (stryCov_9fa48("3763", "3764", "3765"), updated.phone || (stryMutAct_9fa48("3766") ? "Stryker was here!" : (stryCov_9fa48("3766"), '')))
            }));
            this.avatar.set(stryMutAct_9fa48("3769") ? updated.avatar && '' : stryMutAct_9fa48("3768") ? false : stryMutAct_9fa48("3767") ? true : (stryCov_9fa48("3767", "3768", "3769"), updated.avatar || (stryMutAct_9fa48("3770") ? "Stryker was here!" : (stryCov_9fa48("3770"), ''))));
            this.toastService.show(stryMutAct_9fa48("3771") ? "" : (stryCov_9fa48("3771"), 'Perfil actualizado'), stryMutAct_9fa48("3772") ? "" : (stryCov_9fa48("3772"), 'success'));
          }
        },
        error: err => {
          if (stryMutAct_9fa48("3773")) {
            {}
          } else {
            stryCov_9fa48("3773");
            this.savingProfile.set(stryMutAct_9fa48("3774") ? true : (stryCov_9fa48("3774"), false));
            const msg = Array.isArray(stryMutAct_9fa48("3775") ? err.error.message : (stryCov_9fa48("3775"), err.error?.message)) ? err.error.message.join(stryMutAct_9fa48("3776") ? "" : (stryCov_9fa48("3776"), ', ')) : stryMutAct_9fa48("3779") ? err.error?.message && 'Error al guardar' : stryMutAct_9fa48("3778") ? false : stryMutAct_9fa48("3777") ? true : (stryCov_9fa48("3777", "3778", "3779"), (stryMutAct_9fa48("3780") ? err.error.message : (stryCov_9fa48("3780"), err.error?.message)) || (stryMutAct_9fa48("3781") ? "" : (stryCov_9fa48("3781"), 'Error al guardar')));
            this.toastService.show(msg, stryMutAct_9fa48("3782") ? "" : (stryCov_9fa48("3782"), 'error'));
          }
        }
      }));
    }
  }
  changePassword(): void {
    if (stryMutAct_9fa48("3783")) {
      {}
    } else {
      stryCov_9fa48("3783");
      const m = this.passwordModel();
      if (stryMutAct_9fa48("3786") ? m.newPassword === m.confirmPassword : stryMutAct_9fa48("3785") ? false : stryMutAct_9fa48("3784") ? true : (stryCov_9fa48("3784", "3785", "3786"), m.newPassword !== m.confirmPassword)) {
        if (stryMutAct_9fa48("3787")) {
          {}
        } else {
          stryCov_9fa48("3787");
          this.toastService.show(stryMutAct_9fa48("3788") ? "" : (stryCov_9fa48("3788"), 'Las contraseñas no coinciden'), stryMutAct_9fa48("3789") ? "" : (stryCov_9fa48("3789"), 'error'));
          return;
        }
      }
      this.savingPassword.set(stryMutAct_9fa48("3790") ? false : (stryCov_9fa48("3790"), true));
      this.profileService.changePassword(stryMutAct_9fa48("3791") ? {} : (stryCov_9fa48("3791"), {
        currentPassword: m.currentPassword,
        newPassword: m.newPassword
      })).subscribe(stryMutAct_9fa48("3792") ? {} : (stryCov_9fa48("3792"), {
        next: () => {
          if (stryMutAct_9fa48("3793")) {
            {}
          } else {
            stryCov_9fa48("3793");
            this.savingPassword.set(stryMutAct_9fa48("3794") ? true : (stryCov_9fa48("3794"), false));
            this.passwordModel.set(stryMutAct_9fa48("3795") ? {} : (stryCov_9fa48("3795"), {
              currentPassword: stryMutAct_9fa48("3796") ? "Stryker was here!" : (stryCov_9fa48("3796"), ''),
              newPassword: stryMutAct_9fa48("3797") ? "Stryker was here!" : (stryCov_9fa48("3797"), ''),
              confirmPassword: stryMutAct_9fa48("3798") ? "Stryker was here!" : (stryCov_9fa48("3798"), '')
            }));
            this.toastService.show(stryMutAct_9fa48("3799") ? "" : (stryCov_9fa48("3799"), 'Contraseña actualizada'), stryMutAct_9fa48("3800") ? "" : (stryCov_9fa48("3800"), 'success'));
          }
        },
        error: err => {
          if (stryMutAct_9fa48("3801")) {
            {}
          } else {
            stryCov_9fa48("3801");
            this.savingPassword.set(stryMutAct_9fa48("3802") ? true : (stryCov_9fa48("3802"), false));
            const msg = Array.isArray(stryMutAct_9fa48("3803") ? err.error.message : (stryCov_9fa48("3803"), err.error?.message)) ? err.error.message.join(stryMutAct_9fa48("3804") ? "" : (stryCov_9fa48("3804"), ', ')) : stryMutAct_9fa48("3807") ? err.error?.message && 'Error al cambiar contraseña' : stryMutAct_9fa48("3806") ? false : stryMutAct_9fa48("3805") ? true : (stryCov_9fa48("3805", "3806", "3807"), (stryMutAct_9fa48("3808") ? err.error.message : (stryCov_9fa48("3808"), err.error?.message)) || (stryMutAct_9fa48("3809") ? "" : (stryCov_9fa48("3809"), 'Error al cambiar contraseña')));
            this.toastService.show(msg, stryMutAct_9fa48("3810") ? "" : (stryCov_9fa48("3810"), 'error'));
          }
        }
      }));
    }
  }
  private saveAvatarToApi(value: string): void {
    if (stryMutAct_9fa48("3811")) {
      {}
    } else {
      stryCov_9fa48("3811");
      this.profileService.updateProfile(stryMutAct_9fa48("3812") ? {} : (stryCov_9fa48("3812"), {
        avatar: value
      })).subscribe(stryMutAct_9fa48("3813") ? {} : (stryCov_9fa48("3813"), {
        next: stryMutAct_9fa48("3814") ? () => undefined : (stryCov_9fa48("3814"), () => this.authService.updateAvatar(value)),
        error: stryMutAct_9fa48("3815") ? () => undefined : (stryCov_9fa48("3815"), () => this.toastService.show(stryMutAct_9fa48("3816") ? "" : (stryCov_9fa48("3816"), 'Error al guardar avatar'), stryMutAct_9fa48("3817") ? "" : (stryCov_9fa48("3817"), 'error')))
      }));
    }
  }
}