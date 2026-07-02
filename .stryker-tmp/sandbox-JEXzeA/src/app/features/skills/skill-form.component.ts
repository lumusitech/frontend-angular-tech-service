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
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormsModule, TranslatePipe],
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

      <form #skillForm="ngForm" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'skills.name' | translate }}</mat-label>
          <input matInput [(ngModel)]="name" name="name" #nameRef="ngModel" required />
          @if (nameRef.invalid && nameRef.touched) {
            <mat-error>{{ 'validation.required' | translate }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'skills.category' | translate }}</mat-label>
          <input matInput [(ngModel)]="category" name="category" [placeholder]="'skills.categoryPlaceholder' | translate" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'skills.description' | translate }}</mat-label>
          <textarea matInput [(ngModel)]="description" name="description" rows="3"></textarea>
        </mat-form-field>
      </form>

      <div class="flex items-center justify-between mt-6">
        <mat-slide-toggle [(ngModel)]="isActive" name="isActive" [disabled]="data.mode === 'create'">
          {{ 'common.active' | translate }}
        </mat-slide-toggle>

        <div class="flex gap-2">
          <button mat-stroked-button (click)="dialogRef.close()">
            {{ 'common.cancel' | translate }}
          </button>
          <button mat-flat-button color="primary" (click)="onSubmit(skillForm)" [disabled]="loading() || skillForm.invalid">
            {{ loading() ? ('common.saving' | translate) : ('common.save' | translate) }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class SkillFormComponent {
  private readonly skillsService = inject(SkillsService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  protected readonly dialogRef = inject(MatDialogRef<SkillFormComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly name = signal(stryMutAct_9fa48("4474") ? this.data.skill?.name && '' : stryMutAct_9fa48("4473") ? false : stryMutAct_9fa48("4472") ? true : (stryCov_9fa48("4472", "4473", "4474"), (stryMutAct_9fa48("4475") ? this.data.skill.name : (stryCov_9fa48("4475"), this.data.skill?.name)) || (stryMutAct_9fa48("4476") ? "Stryker was here!" : (stryCov_9fa48("4476"), ''))));
  readonly category = signal(stryMutAct_9fa48("4479") ? this.data.skill?.category && '' : stryMutAct_9fa48("4478") ? false : stryMutAct_9fa48("4477") ? true : (stryCov_9fa48("4477", "4478", "4479"), (stryMutAct_9fa48("4480") ? this.data.skill.category : (stryCov_9fa48("4480"), this.data.skill?.category)) || (stryMutAct_9fa48("4481") ? "Stryker was here!" : (stryCov_9fa48("4481"), ''))));
  readonly description = signal(stryMutAct_9fa48("4484") ? this.data.skill?.description && '' : stryMutAct_9fa48("4483") ? false : stryMutAct_9fa48("4482") ? true : (stryCov_9fa48("4482", "4483", "4484"), (stryMutAct_9fa48("4485") ? this.data.skill.description : (stryCov_9fa48("4485"), this.data.skill?.description)) || (stryMutAct_9fa48("4486") ? "Stryker was here!" : (stryCov_9fa48("4486"), ''))));
  readonly isActive = signal(stryMutAct_9fa48("4487") ? this.data.skill?.isActive && true : (stryCov_9fa48("4487"), (stryMutAct_9fa48("4488") ? this.data.skill.isActive : (stryCov_9fa48("4488"), this.data.skill?.isActive)) ?? (stryMutAct_9fa48("4489") ? false : (stryCov_9fa48("4489"), true))));
  readonly loading = signal(stryMutAct_9fa48("4490") ? true : (stryCov_9fa48("4490"), false));
  private t(key: string): string {
    if (stryMutAct_9fa48("4491")) {
      {}
    } else {
      stryCov_9fa48("4491");
      return this.translationService.instant(key);
    }
  }
  onSubmit(form: any): void {
    if (stryMutAct_9fa48("4492")) {
      {}
    } else {
      stryCov_9fa48("4492");
      form.control.markAllAsTouched();
      if (stryMutAct_9fa48("4494") ? false : stryMutAct_9fa48("4493") ? true : (stryCov_9fa48("4493", "4494"), form.invalid)) return;
      this.loading.set(stryMutAct_9fa48("4495") ? false : (stryCov_9fa48("4495"), true));
      const dto = stryMutAct_9fa48("4496") ? {} : (stryCov_9fa48("4496"), {
        name: this.name(),
        category: stryMutAct_9fa48("4499") ? this.category() && undefined : stryMutAct_9fa48("4498") ? false : stryMutAct_9fa48("4497") ? true : (stryCov_9fa48("4497", "4498", "4499"), this.category() || undefined),
        description: stryMutAct_9fa48("4502") ? this.description() && undefined : stryMutAct_9fa48("4501") ? false : stryMutAct_9fa48("4500") ? true : (stryCov_9fa48("4500", "4501", "4502"), this.description() || undefined),
        isActive: this.isActive()
      });
      if (stryMutAct_9fa48("4505") ? this.data.mode !== 'create' : stryMutAct_9fa48("4504") ? false : stryMutAct_9fa48("4503") ? true : (stryCov_9fa48("4503", "4504", "4505"), this.data.mode === (stryMutAct_9fa48("4506") ? "" : (stryCov_9fa48("4506"), 'create')))) {
        if (stryMutAct_9fa48("4507")) {
          {}
        } else {
          stryCov_9fa48("4507");
          this.skillsService.create(dto).subscribe(stryMutAct_9fa48("4508") ? {} : (stryCov_9fa48("4508"), {
            next: () => {
              if (stryMutAct_9fa48("4509")) {
                {}
              } else {
                stryCov_9fa48("4509");
                this.toastService.show(this.t(stryMutAct_9fa48("4510") ? "" : (stryCov_9fa48("4510"), 'common.toast.created')), stryMutAct_9fa48("4511") ? "" : (stryCov_9fa48("4511"), 'success'));
                this.dialogRef.close(stryMutAct_9fa48("4512") ? false : (stryCov_9fa48("4512"), true));
              }
            },
            error: err => {
              if (stryMutAct_9fa48("4513")) {
                {}
              } else {
                stryCov_9fa48("4513");
                this.loading.set(stryMutAct_9fa48("4514") ? true : (stryCov_9fa48("4514"), false));
                console.error(stryMutAct_9fa48("4515") ? "" : (stryCov_9fa48("4515"), 'Create skill failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("4516") ? "" : (stryCov_9fa48("4516"), 'common.toast.errorCreated')), stryMutAct_9fa48("4517") ? "" : (stryCov_9fa48("4517"), 'error'));
              }
            },
            complete: stryMutAct_9fa48("4518") ? () => undefined : (stryCov_9fa48("4518"), () => this.loading.set(stryMutAct_9fa48("4519") ? true : (stryCov_9fa48("4519"), false)))
          }));
        }
      } else if (stryMutAct_9fa48("4521") ? false : stryMutAct_9fa48("4520") ? true : (stryCov_9fa48("4520", "4521"), this.data.skill)) {
        if (stryMutAct_9fa48("4522")) {
          {}
        } else {
          stryCov_9fa48("4522");
          this.skillsService.update(this.data.skill.id, dto).subscribe(stryMutAct_9fa48("4523") ? {} : (stryCov_9fa48("4523"), {
            next: () => {
              if (stryMutAct_9fa48("4524")) {
                {}
              } else {
                stryCov_9fa48("4524");
                this.toastService.show(this.t(stryMutAct_9fa48("4525") ? "" : (stryCov_9fa48("4525"), 'common.toast.updated')), stryMutAct_9fa48("4526") ? "" : (stryCov_9fa48("4526"), 'success'));
                this.dialogRef.close(stryMutAct_9fa48("4527") ? false : (stryCov_9fa48("4527"), true));
              }
            },
            error: err => {
              if (stryMutAct_9fa48("4528")) {
                {}
              } else {
                stryCov_9fa48("4528");
                this.loading.set(stryMutAct_9fa48("4529") ? true : (stryCov_9fa48("4529"), false));
                console.error(stryMutAct_9fa48("4530") ? "" : (stryCov_9fa48("4530"), 'Update skill failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("4531") ? "" : (stryCov_9fa48("4531"), 'common.toast.errorUpdated')), stryMutAct_9fa48("4532") ? "" : (stryCov_9fa48("4532"), 'error'));
              }
            },
            complete: stryMutAct_9fa48("4533") ? () => undefined : (stryCov_9fa48("4533"), () => this.loading.set(stryMutAct_9fa48("4534") ? true : (stryCov_9fa48("4534"), false)))
          }));
        }
      }
    }
  }
}