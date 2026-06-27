import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/user.interfaces';
import { Skill } from '../../core/models/skill.interfaces';
import { SkillSelectorComponent } from './skill-selector.component';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  mode: 'create' | 'edit';
  user?: User;
}

@Component({
  selector: 'app-user-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    FormsModule,
    SkillSelectorComponent,
    TranslatePipe,
  ],
  template: `
    <div class="p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <mat-icon class="text-blue-600 dark:text-blue-400">person</mat-icon>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
            {{ (data.mode === 'create' ? 'users.newUserTitle' : 'users.editUserTitle') | translate }}
          </h2>
        </div>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'users.name' | translate }}</mat-label>
            <input matInput [value]="name()" (input)="name.set(getInputValue($event))" (blur)="nameTouched.set(true)" />
            @if (nameTouched() && !isNameValid()) {
              <mat-error>{{ 'validation.required' | translate }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'users.email' | translate }}</mat-label>
            <input matInput type="email" [value]="email()" (input)="email.set(getInputValue($event))" (blur)="emailTouched.set(true)" />
            @if (emailTouched() && !isEmailValid()) {
              <mat-error>{{ isEmailFormat() ? ('validation.required' | translate) : ('validation.invalidEmail' | translate) }}</mat-error>
            }
          </mat-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'users.password' | translate }}</mat-label>
            <input matInput type="password" [value]="password()" (input)="password.set(getInputValue($event))" (blur)="passwordTouched.set(true)" [placeholder]="data.mode === 'edit' ? '••••••••' : ''" />
            @if (data.mode === 'create' && passwordTouched() && !isPasswordValid()) {
              <mat-error>{{ password().length > 0 ? ('validation.minLength' | translate:{min:6}) : ('validation.required' | translate) }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'users.phone' | translate }}</mat-label>
            <input matInput [value]="phone()" (input)="phone.set(getInputValue($event))" placeholder="+5491122334455" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'users.role' | translate }}</mat-label>
          <mat-select [value]="role()" (selectionChange)="role.set($event.value); onRoleChange()">
            <mat-option value="admin">{{ 'users.roles.admin' | translate }}</mat-option>
            <mat-option value="technician">{{ 'users.roles.technician' | translate }}</mat-option>
            <mat-option value="seller">{{ 'users.roles.seller' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>

        @if (role() === 'technician') {
          <app-skill-selector [(selectedSkills)]="selectedSkills" />

          <mat-form-field appearance="outline">
            <mat-label>{{ 'users.experience' | translate }}</mat-label>
            <textarea matInput [value]="experience()" (input)="experience.set(getInputValue($event))" rows="3" [placeholder]="'users.experiencePlaceholder' | translate"></textarea>
          </mat-form-field>

          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ 'users.trustRating' | translate }}: {{ trustRating() }}</span>
            <div class="flex gap-1">
              @for (star of [1, 2, 3, 4, 5]; track star) {
                <mat-icon
                  class="cursor-pointer text-2xl"
                  [class.text-yellow-400]="star <= Math.round(trustRating())"
                  [class.text-gray-300]="star > Math.round(trustRating())"
                  (click)="trustRating.set(star)"
                >
                  {{ star <= Math.round(trustRating()) ? 'star' : 'star_border' }}
                </mat-icon>
              }
            </div>
          </div>
        }

        @if (role() === 'seller') {
          <mat-form-field appearance="outline">
            <mat-label>{{ 'users.commission' | translate }} (%)</mat-label>
            <input matInput [value]="commission()" (input)="commission.set(getInputValue($event))" type="number" min="0" max="100" />
          </mat-form-field>
        }
      </div>

      <div class="flex items-center justify-between mt-6">
        <mat-slide-toggle [checked]="isActive()" (change)="isActive.set($event.checked)" [disabled]="data.mode === 'create'">
          {{ 'common.active' | translate }}
        </mat-slide-toggle>

        <div class="flex gap-2">
          <button mat-stroked-button (click)="dialogRef.close()">
            {{ 'common.cancel' | translate }}
          </button>
          <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="loading() || !isFormValid()">
            {{ loading() ? ('common.saving' | translate) : ('common.save' | translate) }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class UserFormComponent {
  readonly Math = Math;
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  protected readonly dialogRef = inject(MatDialogRef<UserFormComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly name = signal(this.data.user?.name || '');
  readonly email = signal(this.data.user?.email || '');
  readonly password = signal('');
  readonly phone = signal(this.data.user?.phone || '');
  readonly role = signal<'admin' | 'technician' | 'seller'>(this.data.user?.role || 'technician');
  readonly commission = signal(this.data.user?.commission ?? 5);
  readonly experience = signal(this.data.user?.experience || '');
  readonly trustRating = signal(this.data.user?.trustRating ?? 3);
  readonly isActive = signal(this.data.user?.isActive ?? true);
  readonly selectedSkills = signal<Skill[]>(
    (this.data.user?.skills ?? []) as Skill[],
  );
  readonly loading = signal(false);

  readonly nameTouched = signal(false);
  readonly emailTouched = signal(false);
  readonly passwordTouched = signal(false);

  readonly isNameValid = computed(() => this.name().trim().length > 0);
  readonly isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()));
  readonly isEmailFormat = computed(() => this.email().trim().length > 0);
  readonly isPasswordValid = computed(() => this.password().length >= 6);
  readonly isFormValid = computed(() => {
    if (!this.isNameValid() || !this.isEmailValid()) return false;
    if (this.data.mode === 'create' && !this.isPasswordValid()) return false;
    return true;
  });

  private t(key: string): string {
    return this.translationService.instant(key);
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onRoleChange(): void {
    if (this.role() !== 'technician') {
      this.selectedSkills.set([]);
    }
    if (this.role() !== 'seller') {
      this.commission.set(5);
    }
  }

  onSubmit(): void {
    this.nameTouched.set(true);
    this.emailTouched.set(true);
    this.passwordTouched.set(true);
    if (!this.isFormValid()) return;

    this.loading.set(true);

    if (this.data.mode === 'create') {
      this.usersService.create({
        name: this.name(),
        email: this.email(),
        password: this.password(),
        role: this.role(),
        phone: this.phone() || undefined,
        commission: this.role() === 'seller' ? this.commission() : undefined,
        experience: this.role() === 'technician' ? this.experience() || undefined : undefined,
        trustRating: this.role() === 'technician' ? this.trustRating() : undefined,
        skillIds: this.role() === 'technician' ? this.selectedSkills().map((s) => s.id) : undefined,
      }).subscribe({
        next: () => {
          this.toastService.show(this.t('common.toast.created'), 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.loading.set(false);
          console.error('Create user failed:', err);
          this.toastService.show(this.t('common.toast.errorCreated'), 'error');
        },
        complete: () => this.loading.set(false),
      });
    } else if (this.data.user) {
      this.usersService.update(this.data.user.id, {
        name: this.name(),
        email: this.email(),
        password: this.password() || undefined,
        role: this.role(),
        isActive: this.isActive(),
        phone: this.phone() || undefined,
        commission: this.role() === 'seller' ? this.commission() : undefined,
        experience: this.role() === 'technician' ? this.experience() || undefined : undefined,
        trustRating: this.role() === 'technician' ? this.trustRating() : undefined,
        skillIds: this.role() === 'technician' ? this.selectedSkills().map((s) => s.id) : undefined,
      }).subscribe({
        next: () => {
          this.toastService.show(this.t('common.toast.updated'), 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.loading.set(false);
          console.error('Update user failed:', err);
          this.toastService.show(this.t('common.toast.errorUpdated'), 'error');
        },
        complete: () => this.loading.set(false),
      });
    }
  }
}
