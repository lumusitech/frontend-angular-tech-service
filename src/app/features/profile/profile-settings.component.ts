import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { form, FormField, required, email } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProfileService } from '../../core/services/profile.service';
import { User } from '../../core/models/user.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { ToastService } from '../../core/services/toast.service';

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
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, FormField, TranslatePipe, DatePipe, TitleCasePipe],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ 'profile.title' | translate }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          {{ 'profile.subtitle' | translate }}
        </p>
      </div>

      <!-- Profile Info -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <mat-icon class="text-blue-600 dark:text-blue-400">person</mat-icon>
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

        @if (profileResource.isLoading()) {
          <div class="flex justify-center py-8">
            <mat-icon class="animate-spin text-gray-400">sync</mat-icon>
          </div>
        } @else if (profileResource.value(); as profile) {
          <div class="ml-0 sm:ml-13 space-y-4">
            <div class="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div class="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                <span class="text-white text-xl font-bold">{{ profile.name.charAt(0) }}</span>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ profile.role | titlecase }}</p>
                @if (profile.createdAt) {
                  <p class="text-xs text-gray-400 dark:text-gray-500">
                    {{ 'profile.memberSince' | translate }} {{ profile.createdAt | date:'mediumDate' }}
                  </p>
                }
              </div>
            </div>

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
export class ProfileSettingsComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly toastService = inject(ToastService);

  readonly profileResource = httpResource<User>(() => '/api/auth/profile');

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

  ngOnInit(): void {
    const profile = this.profileResource.value();
    if (profile) {
      this.profileModel.set({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
    }
  }

  saveProfile(): void {
    this.savingProfile.set(true);
    const m = this.profileModel();
    this.profileService.updateProfile({
      name: m.name,
      email: m.email,
      phone: m.phone || undefined,
    }).subscribe({
      next: (updated) => {
        this.savingProfile.set(false);
        this.profileModel.set({
          name: updated.name || '',
          email: updated.email || '',
          phone: updated.phone || '',
        });
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
}
