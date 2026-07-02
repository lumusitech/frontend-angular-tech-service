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
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatSliderModule, FormsModule, SkillSelectorComponent, TranslatePipe],
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

      <form #userForm="ngForm" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'users.name' | translate }}</mat-label>
            <input matInput [(ngModel)]="name" name="name" #nameRef="ngModel" required />
            @if (nameRef.invalid && nameRef.touched) {
              <mat-error>{{ 'validation.required' | translate }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'users.email' | translate }}</mat-label>
            <input matInput [(ngModel)]="email" name="email" #emailRef="ngModel" type="email" required email />
            @if (emailRef.invalid && emailRef.touched) {
              <mat-error>{{ emailRef.hasError('required') ? ('validation.required' | translate) : ('validation.invalidEmail' | translate) }}</mat-error>
            }
          </mat-form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'users.password' | translate }}</mat-label>
            <input matInput [(ngModel)]="password" name="password" #passwordRef="ngModel" type="password" [required]="data.mode === 'create'" minlength="6" [placeholder]="data.mode === 'edit' ? '••••••••' : ''" />
            @if (passwordRef.invalid && passwordRef.touched) {
              <mat-error>{{ passwordRef.hasError('required') ? ('validation.required' | translate) : ('validation.minLength' | translate:{min:'6'}) }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'users.phone' | translate }}</mat-label>
            <input matInput [(ngModel)]="phone" name="phone" placeholder="+5491122334455" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'users.role' | translate }}</mat-label>
          <mat-select [(ngModel)]="role" name="role" (selectionChange)="onRoleChange()">
            <mat-option value="admin">{{ 'users.roles.admin' | translate }}</mat-option>
            <mat-option value="technician">{{ 'users.roles.technician' | translate }}</mat-option>
            <mat-option value="seller">{{ 'users.roles.seller' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>

        @if (role() === 'technician') {
          <app-skill-selector [(selectedSkills)]="selectedSkills" />

          <mat-form-field appearance="outline">
            <mat-label>{{ 'users.experience' | translate }}</mat-label>
            <textarea matInput [(ngModel)]="experience" name="experience" rows="3" [placeholder]="'users.experiencePlaceholder' | translate"></textarea>
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
            <input matInput [(ngModel)]="commission" name="commission" type="number" min="0" max="100" />
          </mat-form-field>
        }
      </form>

      <div class="flex items-center justify-between mt-6">
        <mat-slide-toggle [(ngModel)]="isActive" name="isActive" [disabled]="data.mode === 'create'">
          {{ 'common.active' | translate }}
        </mat-slide-toggle>

        <div class="flex gap-2">
          <button mat-stroked-button (click)="dialogRef.close()">
            {{ 'common.cancel' | translate }}
          </button>
          <button mat-flat-button color="primary" (click)="onSubmit(userForm)" [disabled]="loading() || userForm.invalid">
            {{ loading() ? ('common.saving' | translate) : ('common.save' | translate) }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class UserFormComponent {
  readonly Math = Math;
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  protected readonly dialogRef = inject(MatDialogRef<UserFormComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly name = signal(stryMutAct_9fa48("5062") ? this.data.user?.name && '' : stryMutAct_9fa48("5061") ? false : stryMutAct_9fa48("5060") ? true : (stryCov_9fa48("5060", "5061", "5062"), (stryMutAct_9fa48("5063") ? this.data.user.name : (stryCov_9fa48("5063"), this.data.user?.name)) || (stryMutAct_9fa48("5064") ? "Stryker was here!" : (stryCov_9fa48("5064"), ''))));
  readonly email = signal(stryMutAct_9fa48("5067") ? this.data.user?.email && '' : stryMutAct_9fa48("5066") ? false : stryMutAct_9fa48("5065") ? true : (stryCov_9fa48("5065", "5066", "5067"), (stryMutAct_9fa48("5068") ? this.data.user.email : (stryCov_9fa48("5068"), this.data.user?.email)) || (stryMutAct_9fa48("5069") ? "Stryker was here!" : (stryCov_9fa48("5069"), ''))));
  readonly password = signal(stryMutAct_9fa48("5070") ? "Stryker was here!" : (stryCov_9fa48("5070"), ''));
  readonly phone = signal(stryMutAct_9fa48("5073") ? this.data.user?.phone && '' : stryMutAct_9fa48("5072") ? false : stryMutAct_9fa48("5071") ? true : (stryCov_9fa48("5071", "5072", "5073"), (stryMutAct_9fa48("5074") ? this.data.user.phone : (stryCov_9fa48("5074"), this.data.user?.phone)) || (stryMutAct_9fa48("5075") ? "Stryker was here!" : (stryCov_9fa48("5075"), ''))));
  readonly role = signal<'admin' | 'technician' | 'seller'>(stryMutAct_9fa48("5078") ? this.data.user?.role && 'technician' : stryMutAct_9fa48("5077") ? false : stryMutAct_9fa48("5076") ? true : (stryCov_9fa48("5076", "5077", "5078"), (stryMutAct_9fa48("5079") ? this.data.user.role : (stryCov_9fa48("5079"), this.data.user?.role)) || (stryMutAct_9fa48("5080") ? "" : (stryCov_9fa48("5080"), 'technician'))));
  readonly commission = signal(stryMutAct_9fa48("5081") ? this.data.user?.commission && 5 : (stryCov_9fa48("5081"), (stryMutAct_9fa48("5082") ? this.data.user.commission : (stryCov_9fa48("5082"), this.data.user?.commission)) ?? 5));
  readonly experience = signal(stryMutAct_9fa48("5085") ? this.data.user?.experience && '' : stryMutAct_9fa48("5084") ? false : stryMutAct_9fa48("5083") ? true : (stryCov_9fa48("5083", "5084", "5085"), (stryMutAct_9fa48("5086") ? this.data.user.experience : (stryCov_9fa48("5086"), this.data.user?.experience)) || (stryMutAct_9fa48("5087") ? "Stryker was here!" : (stryCov_9fa48("5087"), ''))));
  readonly trustRating = signal(stryMutAct_9fa48("5088") ? this.data.user?.trustRating && 3 : (stryCov_9fa48("5088"), (stryMutAct_9fa48("5089") ? this.data.user.trustRating : (stryCov_9fa48("5089"), this.data.user?.trustRating)) ?? 3));
  readonly isActive = signal(stryMutAct_9fa48("5090") ? this.data.user?.isActive && true : (stryCov_9fa48("5090"), (stryMutAct_9fa48("5091") ? this.data.user.isActive : (stryCov_9fa48("5091"), this.data.user?.isActive)) ?? (stryMutAct_9fa48("5092") ? false : (stryCov_9fa48("5092"), true))));
  readonly selectedSkills = signal<Skill[]>((this.data.user?.skills ?? []) as Skill[]);
  readonly loading = signal(stryMutAct_9fa48("5093") ? true : (stryCov_9fa48("5093"), false));
  private t(key: string): string {
    if (stryMutAct_9fa48("5094")) {
      {}
    } else {
      stryCov_9fa48("5094");
      return this.translationService.instant(key);
    }
  }
  onRoleChange(): void {
    if (stryMutAct_9fa48("5095")) {
      {}
    } else {
      stryCov_9fa48("5095");
      if (stryMutAct_9fa48("5098") ? this.role() === 'technician' : stryMutAct_9fa48("5097") ? false : stryMutAct_9fa48("5096") ? true : (stryCov_9fa48("5096", "5097", "5098"), this.role() !== (stryMutAct_9fa48("5099") ? "" : (stryCov_9fa48("5099"), 'technician')))) {
        if (stryMutAct_9fa48("5100")) {
          {}
        } else {
          stryCov_9fa48("5100");
          this.selectedSkills.set(stryMutAct_9fa48("5101") ? ["Stryker was here"] : (stryCov_9fa48("5101"), []));
        }
      }
      if (stryMutAct_9fa48("5104") ? this.role() === 'seller' : stryMutAct_9fa48("5103") ? false : stryMutAct_9fa48("5102") ? true : (stryCov_9fa48("5102", "5103", "5104"), this.role() !== (stryMutAct_9fa48("5105") ? "" : (stryCov_9fa48("5105"), 'seller')))) {
        if (stryMutAct_9fa48("5106")) {
          {}
        } else {
          stryCov_9fa48("5106");
          this.commission.set(5);
        }
      }
    }
  }
  onSubmit(form: any): void {
    if (stryMutAct_9fa48("5107")) {
      {}
    } else {
      stryCov_9fa48("5107");
      form.control.markAllAsTouched();
      if (stryMutAct_9fa48("5109") ? false : stryMutAct_9fa48("5108") ? true : (stryCov_9fa48("5108", "5109"), form.invalid)) return;
      this.loading.set(stryMutAct_9fa48("5110") ? false : (stryCov_9fa48("5110"), true));
      if (stryMutAct_9fa48("5113") ? this.data.mode !== 'create' : stryMutAct_9fa48("5112") ? false : stryMutAct_9fa48("5111") ? true : (stryCov_9fa48("5111", "5112", "5113"), this.data.mode === (stryMutAct_9fa48("5114") ? "" : (stryCov_9fa48("5114"), 'create')))) {
        if (stryMutAct_9fa48("5115")) {
          {}
        } else {
          stryCov_9fa48("5115");
          this.usersService.create(stryMutAct_9fa48("5116") ? {} : (stryCov_9fa48("5116"), {
            name: this.name(),
            email: this.email(),
            password: this.password(),
            role: this.role(),
            phone: stryMutAct_9fa48("5119") ? this.phone() && undefined : stryMutAct_9fa48("5118") ? false : stryMutAct_9fa48("5117") ? true : (stryCov_9fa48("5117", "5118", "5119"), this.phone() || undefined),
            commission: (stryMutAct_9fa48("5122") ? this.role() !== 'seller' : stryMutAct_9fa48("5121") ? false : stryMutAct_9fa48("5120") ? true : (stryCov_9fa48("5120", "5121", "5122"), this.role() === (stryMutAct_9fa48("5123") ? "" : (stryCov_9fa48("5123"), 'seller')))) ? this.commission() : undefined,
            experience: (stryMutAct_9fa48("5126") ? this.role() !== 'technician' : stryMutAct_9fa48("5125") ? false : stryMutAct_9fa48("5124") ? true : (stryCov_9fa48("5124", "5125", "5126"), this.role() === (stryMutAct_9fa48("5127") ? "" : (stryCov_9fa48("5127"), 'technician')))) ? stryMutAct_9fa48("5130") ? this.experience() && undefined : stryMutAct_9fa48("5129") ? false : stryMutAct_9fa48("5128") ? true : (stryCov_9fa48("5128", "5129", "5130"), this.experience() || undefined) : undefined,
            trustRating: (stryMutAct_9fa48("5133") ? this.role() !== 'technician' : stryMutAct_9fa48("5132") ? false : stryMutAct_9fa48("5131") ? true : (stryCov_9fa48("5131", "5132", "5133"), this.role() === (stryMutAct_9fa48("5134") ? "" : (stryCov_9fa48("5134"), 'technician')))) ? this.trustRating() : undefined,
            skillIds: (stryMutAct_9fa48("5137") ? this.role() !== 'technician' : stryMutAct_9fa48("5136") ? false : stryMutAct_9fa48("5135") ? true : (stryCov_9fa48("5135", "5136", "5137"), this.role() === (stryMutAct_9fa48("5138") ? "" : (stryCov_9fa48("5138"), 'technician')))) ? this.selectedSkills().map(stryMutAct_9fa48("5139") ? () => undefined : (stryCov_9fa48("5139"), s => s.id)) : undefined
          })).subscribe(stryMutAct_9fa48("5140") ? {} : (stryCov_9fa48("5140"), {
            next: () => {
              if (stryMutAct_9fa48("5141")) {
                {}
              } else {
                stryCov_9fa48("5141");
                this.toastService.show(this.t(stryMutAct_9fa48("5142") ? "" : (stryCov_9fa48("5142"), 'common.toast.created')), stryMutAct_9fa48("5143") ? "" : (stryCov_9fa48("5143"), 'success'));
                this.dialogRef.close(stryMutAct_9fa48("5144") ? false : (stryCov_9fa48("5144"), true));
              }
            },
            error: err => {
              if (stryMutAct_9fa48("5145")) {
                {}
              } else {
                stryCov_9fa48("5145");
                this.loading.set(stryMutAct_9fa48("5146") ? true : (stryCov_9fa48("5146"), false));
                console.error(stryMutAct_9fa48("5147") ? "" : (stryCov_9fa48("5147"), 'Create user failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("5148") ? "" : (stryCov_9fa48("5148"), 'common.toast.errorCreated')), stryMutAct_9fa48("5149") ? "" : (stryCov_9fa48("5149"), 'error'));
              }
            },
            complete: stryMutAct_9fa48("5150") ? () => undefined : (stryCov_9fa48("5150"), () => this.loading.set(stryMutAct_9fa48("5151") ? true : (stryCov_9fa48("5151"), false)))
          }));
        }
      } else if (stryMutAct_9fa48("5153") ? false : stryMutAct_9fa48("5152") ? true : (stryCov_9fa48("5152", "5153"), this.data.user)) {
        if (stryMutAct_9fa48("5154")) {
          {}
        } else {
          stryCov_9fa48("5154");
          this.usersService.update(this.data.user.id, stryMutAct_9fa48("5155") ? {} : (stryCov_9fa48("5155"), {
            name: this.name(),
            email: this.email(),
            password: stryMutAct_9fa48("5158") ? this.password() && undefined : stryMutAct_9fa48("5157") ? false : stryMutAct_9fa48("5156") ? true : (stryCov_9fa48("5156", "5157", "5158"), this.password() || undefined),
            role: this.role(),
            isActive: this.isActive(),
            phone: stryMutAct_9fa48("5161") ? this.phone() && undefined : stryMutAct_9fa48("5160") ? false : stryMutAct_9fa48("5159") ? true : (stryCov_9fa48("5159", "5160", "5161"), this.phone() || undefined),
            commission: (stryMutAct_9fa48("5164") ? this.role() !== 'seller' : stryMutAct_9fa48("5163") ? false : stryMutAct_9fa48("5162") ? true : (stryCov_9fa48("5162", "5163", "5164"), this.role() === (stryMutAct_9fa48("5165") ? "" : (stryCov_9fa48("5165"), 'seller')))) ? this.commission() : undefined,
            experience: (stryMutAct_9fa48("5168") ? this.role() !== 'technician' : stryMutAct_9fa48("5167") ? false : stryMutAct_9fa48("5166") ? true : (stryCov_9fa48("5166", "5167", "5168"), this.role() === (stryMutAct_9fa48("5169") ? "" : (stryCov_9fa48("5169"), 'technician')))) ? stryMutAct_9fa48("5172") ? this.experience() && undefined : stryMutAct_9fa48("5171") ? false : stryMutAct_9fa48("5170") ? true : (stryCov_9fa48("5170", "5171", "5172"), this.experience() || undefined) : undefined,
            trustRating: (stryMutAct_9fa48("5175") ? this.role() !== 'technician' : stryMutAct_9fa48("5174") ? false : stryMutAct_9fa48("5173") ? true : (stryCov_9fa48("5173", "5174", "5175"), this.role() === (stryMutAct_9fa48("5176") ? "" : (stryCov_9fa48("5176"), 'technician')))) ? this.trustRating() : undefined,
            skillIds: (stryMutAct_9fa48("5179") ? this.role() !== 'technician' : stryMutAct_9fa48("5178") ? false : stryMutAct_9fa48("5177") ? true : (stryCov_9fa48("5177", "5178", "5179"), this.role() === (stryMutAct_9fa48("5180") ? "" : (stryCov_9fa48("5180"), 'technician')))) ? this.selectedSkills().map(stryMutAct_9fa48("5181") ? () => undefined : (stryCov_9fa48("5181"), s => s.id)) : undefined
          })).subscribe(stryMutAct_9fa48("5182") ? {} : (stryCov_9fa48("5182"), {
            next: () => {
              if (stryMutAct_9fa48("5183")) {
                {}
              } else {
                stryCov_9fa48("5183");
                this.toastService.show(this.t(stryMutAct_9fa48("5184") ? "" : (stryCov_9fa48("5184"), 'common.toast.updated')), stryMutAct_9fa48("5185") ? "" : (stryCov_9fa48("5185"), 'success'));
                this.dialogRef.close(stryMutAct_9fa48("5186") ? false : (stryCov_9fa48("5186"), true));
              }
            },
            error: err => {
              if (stryMutAct_9fa48("5187")) {
                {}
              } else {
                stryCov_9fa48("5187");
                this.loading.set(stryMutAct_9fa48("5188") ? true : (stryCov_9fa48("5188"), false));
                console.error(stryMutAct_9fa48("5189") ? "" : (stryCov_9fa48("5189"), 'Update user failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("5190") ? "" : (stryCov_9fa48("5190"), 'common.toast.errorUpdated')), stryMutAct_9fa48("5191") ? "" : (stryCov_9fa48("5191"), 'error'));
              }
            },
            complete: stryMutAct_9fa48("5192") ? () => undefined : (stryCov_9fa48("5192"), () => this.loading.set(stryMutAct_9fa48("5193") ? true : (stryCov_9fa48("5193"), false)))
          }));
        }
      }
    }
  }
}