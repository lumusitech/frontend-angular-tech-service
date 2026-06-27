import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { SkillsService } from '../../core/services/skills.service';
import { Skill } from '../../core/models/skill.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  mode: 'create' | 'edit';
  skill?: Skill;
}

@Component({
  selector: 'app-skill-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    FormsModule,
    TranslatePipe,
  ],
  template: `
    <div class="p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <mat-icon class="text-purple-600 dark:text-purple-400">build</mat-icon>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
            {{ (data.mode === 'create' ? 'skills.newSkillTitle' : 'skills.editSkillTitle') | translate }}
          </h2>
        </div>
      </div>

      <div class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'skills.name' | translate }}</mat-label>
          <input matInput [value]="name()" (input)="name.set(getInputValue($event))" (blur)="nameTouched.set(true)" />
          @if (nameTouched() && !isNameValid()) {
            <mat-error>{{ 'validation.required' | translate }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'skills.category' | translate }}</mat-label>
          <input matInput [value]="category()" (input)="category.set(getInputValue($event))" [placeholder]="'skills.categoryPlaceholder' | translate" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'skills.description' | translate }}</mat-label>
          <textarea matInput [value]="description()" (input)="description.set(getInputValue($event))" rows="3"></textarea>
        </mat-form-field>
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
export class SkillFormComponent {
  private readonly skillsService = inject(SkillsService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  protected readonly dialogRef = inject(MatDialogRef<SkillFormComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly name = signal(this.data.skill?.name || '');
  readonly category = signal(this.data.skill?.category || '');
  readonly description = signal(this.data.skill?.description || '');
  readonly isActive = signal(this.data.skill?.isActive ?? true);
  readonly loading = signal(false);

  readonly nameTouched = signal(false);
  readonly isNameValid = computed(() => this.name().trim().length > 0);
  readonly isFormValid = computed(() => this.isNameValid());

  private t(key: string): string {
    return this.translationService.instant(key);
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(): void {
    this.nameTouched.set(true);
    if (!this.isFormValid()) return;

    this.loading.set(true);
    const dto = {
      name: this.name(),
      category: this.category() || undefined,
      description: this.description() || undefined,
      isActive: this.isActive(),
    };

    if (this.data.mode === 'create') {
      this.skillsService.create(dto).subscribe({
        next: () => {
          this.toastService.show(this.t('common.toast.created'), 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.loading.set(false);
          console.error('Create skill failed:', err);
          this.toastService.show(this.t('common.toast.errorCreated'), 'error');
        },
        complete: () => this.loading.set(false),
      });
    } else if (this.data.skill) {
      this.skillsService.update(this.data.skill.id, dto).subscribe({
        next: () => {
          this.toastService.show(this.t('common.toast.updated'), 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.loading.set(false);
          console.error('Update skill failed:', err);
          this.toastService.show(this.t('common.toast.errorUpdated'), 'error');
        },
        complete: () => this.loading.set(false),
      });
    }
  }
}
