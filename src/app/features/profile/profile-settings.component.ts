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

const AVATAR_EMOJIS = ['👨‍🔧', '👩‍🔧', '🧑‍💻', '👨‍💻', '👩‍💻', '🧑‍🏭', '👨‍🏭', '👩‍🏭', '⚙️', '🔧', '🛠️', '💡', '🔌', '📋', '🏆', '👷', '🧑‍🔬', '🎯'];

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
  `,
})
export class ProfileSettingsComponent {
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  readonly profileResource = httpResource<User>(() => '/api/auth/profile');

  readonly emojis = AVATAR_EMOJIS;
  readonly avatar = signal('');
  readonly showEmojiPicker = signal(false);

  readonly avatarDisplay = computed(() => {
    const a = this.avatar();
    if (!a) {
      const name = this.profileResource.value()?.name;
      return name ? name.charAt(0).toUpperCase() : '?';
    }
    return a;
  });

  readonly profileModel = signal<ProfileForm>({
    name: '',
    email: '',
    phone: '',
  });

  readonly profileForm = form(this.profileModel, (p) => {
    required(p.name, { message: 'Nombre requerido' });
    required(p.email, { message: 'Email requerido' });
    email(p.email, { message: 'Email inválido' });
  });

  readonly passwordModel = signal<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  readonly passwordForm = form(this.passwordModel);

  readonly savingProfile = signal(false);
  readonly savingPassword = signal(false);

  private readonly _syncProfile = effect(() => {
    const profile = this.profileResource.value();
    if (profile) {
      this.avatar.set(profile.avatar || '');
      this.profileModel.set({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
    }
  });

  selectEmoji(emoji: string): void {
    this.avatar.set(emoji);
    this.showEmojiPicker.set(false);
    this.saveAvatarToApi(emoji);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.avatar.set(dataUrl);
      this.showEmojiPicker.set(false);
      this.saveAvatarToApi(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  saveProfile(): void {
    this.savingProfile.set(true);
    const m = this.profileModel();
    this.profileService.updateProfile({
      name: m.name,
      email: m.email,
      phone: m.phone || undefined,
      avatar: this.avatar() || undefined,
    }).subscribe({
      next: (updated) => {
        this.savingProfile.set(false);
        this.profileModel.set({
          name: updated.name || '',
          email: updated.email || '',
          phone: updated.phone || '',
        });
        this.avatar.set(updated.avatar || '');
        this.toastService.show('Perfil actualizado', 'success');
      },
      error: (err) => {
        this.savingProfile.set(false);
        const msg = Array.isArray(err.error?.message) ? err.error.message.join(', ') : err.error?.message || 'Error al guardar';
        this.toastService.show(msg, 'error');
      },
    });
  }

  changePassword(): void {
    const m = this.passwordModel();
    if (m.newPassword !== m.confirmPassword) {
      this.toastService.show('Las contraseñas no coinciden', 'error');
      return;
    }

    this.savingPassword.set(true);
    this.profileService.changePassword({
      currentPassword: m.currentPassword,
      newPassword: m.newPassword,
    }).subscribe({
      next: () => {
        this.savingPassword.set(false);
        this.passwordModel.set({ currentPassword: '', newPassword: '', confirmPassword: '' });
        this.toastService.show('Contraseña actualizada', 'success');
      },
      error: (err) => {
        this.savingPassword.set(false);
        const msg = Array.isArray(err.error?.message) ? err.error.message.join(', ') : err.error?.message || 'Error al cambiar contraseña';
        this.toastService.show(msg, 'error');
      },
    });
  }

  private saveAvatarToApi(value: string): void {
    this.profileService.updateProfile({ avatar: value }).subscribe({
      next: () => this.authService.updateAvatar(value),
      error: () => this.toastService.show('Error al guardar avatar', 'error'),
    });
  }
}
