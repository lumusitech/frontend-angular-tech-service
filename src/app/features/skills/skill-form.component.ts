import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { form, FormField, required } from '@angular/forms/signals';
import { SkillsService } from '../../core/services/skills.service';
import { Skill } from '../../core/models/skill.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  mode: 'create' | 'edit';
  skill?: Skill;
}

interface SkillFormModel {
  name: string;
  category: string;
  description: string;
  isActive: boolean;
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
    FormField,
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
          <input matInput [formField]="skillForm.name" />
          @if (skillForm.name().invalid() && skillForm.name().touched()) {
            <mat-error>{{ 'validation.required' | translate }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'skills.category' | translate }}</mat-label>
          <input matInput [formField]="skillForm.category" [placeholder]="'skills.categoryPlaceholder' | translate" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'skills.description' | translate }}</mat-label>
          <textarea matInput [formField]="skillForm.description" rows="3"></textarea>
        </mat-form-field>
      </div>

      <div class="flex items-center justify-between mt-6">
        <mat-slide-toggle [formField]="skillForm.isActive" [disabled]="data.mode === 'create'">
          {{ 'common.active' | translate }}
        </mat-slide-toggle>

        <div class="flex gap-2">
          <button mat-stroked-button (click)="dialogRef.close()">
            {{ 'common.cancel' | translate }}
          </button>
          <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="loading() || skillForm().invalid()">
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

  readonly model = signal<SkillFormModel>({
    name: this.data.skill?.name || '',
    category: this.data.skill?.category || '',
    description: this.data.skill?.description || '',
    isActive: this.data.skill?.isActive ?? true,
  });
  readonly skillForm = form(this.model, (p) => {
    required(p.name, { message: 'validation.required' });
  });
  readonly loading = signal(false);

  private t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(): void {
    if (this.skillForm().invalid()) return;

    this.loading.set(true);
    const m = this.model();
    const dto = {
      name: m.name,
      category: m.category || undefined,
      description: m.description || undefined,
      isActive: m.isActive,
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
