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
import { toLocalDateString } from '../../core/utils/date.utils';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PendingItemsService } from '../../core/services/pending-items.service';
import { PendingItem, PendingItemType, PendingItemPriority, PendingItemStatus, CreatePendingItemDto, UpdatePendingItemDto } from '../../core/models/pending-item.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
interface DialogData {
  mode: 'create' | 'edit';
  item?: PendingItem;
}
@Component({
  selector: 'app-pending-item-form',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, FormsModule, MatDatepickerModule, MatNativeDateModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>pending_actions</mat-icon>
      {{
        data.mode === 'create'
          ? ('pendingItems.newPendingItem' | translate)
          : ('pendingItems.editPendingItem' | translate)
      }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form #formRef="ngForm" (submit)="onSubmit($event, formRef)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'pendingItems.titleColumn' | translate }}</mat-label>
          <input
            matInput
            [(ngModel)]="title"
            name="title"
            #titleRef="ngModel"
            required
          />
          @if (titleRef.invalid && titleRef.touched) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'pendingItems.description' | translate }}</mat-label>
          <textarea
            matInput
            [(ngModel)]="description"
            name="description"
            rows="3"
          ></textarea>
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'pendingItems.type' | translate }}</mat-label>
            <mat-select [(ngModel)]="type" name="type" #typeRef="ngModel" required>
              <mat-option value="work_order">{{
                'pendingItems.types.workOrder' | translate
              }}</mat-option>
              <mat-option value="inquiry">{{
                'pendingItems.types.inquiry' | translate
              }}</mat-option>
              <mat-option value="maintenance">{{
                'pendingItems.types.maintenance' | translate
              }}</mat-option>
              <mat-option value="follow_up">{{
                'pendingItems.types.followUp' | translate
              }}</mat-option>
              <mat-option value="other">{{ 'pendingItems.types.other' | translate }}</mat-option>
            </mat-select>
            @if (typeRef.invalid && typeRef.touched) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'pendingItems.priority' | translate }}</mat-label>
            <mat-select [(ngModel)]="priority" name="priority">
              <mat-option value="low">{{ 'pendingItems.priorities.low' | translate }}</mat-option>
              <mat-option value="medium">{{
                'pendingItems.priorities.medium' | translate
              }}</mat-option>
              <mat-option value="high">{{ 'pendingItems.priorities.high' | translate }}</mat-option>
              <mat-option value="urgent">{{
                'pendingItems.priorities.urgent' | translate
              }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'pendingItems.dueDate' | translate }}</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            [(ngModel)]="dueDateValue"
            name="dueDate"
            #dueDateRef="ngModel"
            (click)="picker.open()"
            required
          />
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-datepicker #picker />
          @if (dueDateRef.invalid && dueDateRef.touched) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        @if (data.mode === 'edit') {
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'common.status' | translate }}</mat-label>
            <mat-select [(ngModel)]="status" name="status">
              <mat-option value="pending">{{
                'pendingItems.statuses.pending' | translate
              }}</mat-option>
              <mat-option value="in_progress">{{
                'pendingItems.statuses.inProgress' | translate
              }}</mat-option>
              <mat-option value="completed">{{
                'pendingItems.statuses.completed' | translate
              }}</mat-option>
              <mat-option value="cancelled">{{
                'pendingItems.statuses.cancelled' | translate
              }}</mat-option>
            </mat-select>
          </mat-form-field>
        }
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit($event, formRef)" [disabled]="saving() || formRef.invalid">
        {{ saving() ? ('common.saving' | translate) : ('common.save' | translate) }}
      </button>
    </mat-dialog-actions>
  `
})
export class PendingItemFormComponent {
  private readonly dialogRef = inject(MatDialogRef<PendingItemFormComponent>);
  private readonly pendingItemsService = inject(PendingItemsService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  title = stryMutAct_9fa48("3226") ? this.data.item?.title && '' : stryMutAct_9fa48("3225") ? false : stryMutAct_9fa48("3224") ? true : (stryCov_9fa48("3224", "3225", "3226"), (stryMutAct_9fa48("3227") ? this.data.item.title : (stryCov_9fa48("3227"), this.data.item?.title)) || (stryMutAct_9fa48("3228") ? "Stryker was here!" : (stryCov_9fa48("3228"), '')));
  description = stryMutAct_9fa48("3231") ? this.data.item?.description && '' : stryMutAct_9fa48("3230") ? false : stryMutAct_9fa48("3229") ? true : (stryCov_9fa48("3229", "3230", "3231"), (stryMutAct_9fa48("3232") ? this.data.item.description : (stryCov_9fa48("3232"), this.data.item?.description)) || (stryMutAct_9fa48("3233") ? "Stryker was here!" : (stryCov_9fa48("3233"), '')));
  type: string = stryMutAct_9fa48("3236") ? this.data.item?.type && PendingItemType.WORK_ORDER : stryMutAct_9fa48("3235") ? false : stryMutAct_9fa48("3234") ? true : (stryCov_9fa48("3234", "3235", "3236"), (stryMutAct_9fa48("3237") ? this.data.item.type : (stryCov_9fa48("3237"), this.data.item?.type)) || PendingItemType.WORK_ORDER);
  priority: string = stryMutAct_9fa48("3240") ? this.data.item?.priority && PendingItemPriority.MEDIUM : stryMutAct_9fa48("3239") ? false : stryMutAct_9fa48("3238") ? true : (stryCov_9fa48("3238", "3239", "3240"), (stryMutAct_9fa48("3241") ? this.data.item.priority : (stryCov_9fa48("3241"), this.data.item?.priority)) || PendingItemPriority.MEDIUM);
  status: string = stryMutAct_9fa48("3244") ? this.data.item?.status && PendingItemStatus.PENDING : stryMutAct_9fa48("3243") ? false : stryMutAct_9fa48("3242") ? true : (stryCov_9fa48("3242", "3243", "3244"), (stryMutAct_9fa48("3245") ? this.data.item.status : (stryCov_9fa48("3245"), this.data.item?.status)) || PendingItemStatus.PENDING);
  dueDateValue: Date | null = (stryMutAct_9fa48("3246") ? this.data.item.dueDate : (stryCov_9fa48("3246"), this.data.item?.dueDate)) ? new Date(this.data.item.dueDate) : null;
  readonly saving = signal(stryMutAct_9fa48("3247") ? true : (stryCov_9fa48("3247"), false));
  t(key: string): string {
    if (stryMutAct_9fa48("3248")) {
      {}
    } else {
      stryCov_9fa48("3248");
      return this.translationService.instant(key);
    }
  }
  onSubmit(event: Event, form: NgForm): void {
    if (stryMutAct_9fa48("3249")) {
      {}
    } else {
      stryCov_9fa48("3249");
      event.preventDefault();
      form.control.markAllAsTouched();
      if (stryMutAct_9fa48("3251") ? false : stryMutAct_9fa48("3250") ? true : (stryCov_9fa48("3250", "3251"), form.invalid)) return;
      this.saving.set(stryMutAct_9fa48("3252") ? false : (stryCov_9fa48("3252"), true));
      const dueDateStr = toLocalDateString(this.dueDateValue!);
      if (stryMutAct_9fa48("3255") ? this.data.mode !== 'create' : stryMutAct_9fa48("3254") ? false : stryMutAct_9fa48("3253") ? true : (stryCov_9fa48("3253", "3254", "3255"), this.data.mode === (stryMutAct_9fa48("3256") ? "" : (stryCov_9fa48("3256"), 'create')))) {
        if (stryMutAct_9fa48("3257")) {
          {}
        } else {
          stryCov_9fa48("3257");
          const dto: CreatePendingItemDto = stryMutAct_9fa48("3258") ? {} : (stryCov_9fa48("3258"), {
            title: this.title,
            description: stryMutAct_9fa48("3261") ? this.description && undefined : stryMutAct_9fa48("3260") ? false : stryMutAct_9fa48("3259") ? true : (stryCov_9fa48("3259", "3260", "3261"), this.description || undefined),
            dueDate: dueDateStr,
            type: this.type as PendingItemType,
            priority: this.priority as PendingItemPriority
          });
          this.pendingItemsService.create(dto).subscribe(stryMutAct_9fa48("3262") ? {} : (stryCov_9fa48("3262"), {
            next: item => {
              if (stryMutAct_9fa48("3263")) {
                {}
              } else {
                stryCov_9fa48("3263");
                this.saving.set(stryMutAct_9fa48("3264") ? true : (stryCov_9fa48("3264"), false));
                this.toastService.show(this.t(stryMutAct_9fa48("3265") ? "" : (stryCov_9fa48("3265"), 'common.toast.created')), stryMutAct_9fa48("3266") ? "" : (stryCov_9fa48("3266"), 'success'));
                this.dialogRef.close(item);
              }
            },
            error: err => {
              if (stryMutAct_9fa48("3267")) {
                {}
              } else {
                stryCov_9fa48("3267");
                this.saving.set(stryMutAct_9fa48("3268") ? true : (stryCov_9fa48("3268"), false));
                console.error(stryMutAct_9fa48("3269") ? "" : (stryCov_9fa48("3269"), 'Create pending item failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("3270") ? "" : (stryCov_9fa48("3270"), 'common.toast.errorCreated')), stryMutAct_9fa48("3271") ? "" : (stryCov_9fa48("3271"), 'error'));
              }
            }
          }));
        }
      } else {
        if (stryMutAct_9fa48("3272")) {
          {}
        } else {
          stryCov_9fa48("3272");
          const dto: UpdatePendingItemDto = stryMutAct_9fa48("3273") ? {} : (stryCov_9fa48("3273"), {
            title: this.title,
            description: stryMutAct_9fa48("3276") ? this.description && undefined : stryMutAct_9fa48("3275") ? false : stryMutAct_9fa48("3274") ? true : (stryCov_9fa48("3274", "3275", "3276"), this.description || undefined),
            dueDate: dueDateStr,
            type: this.type as PendingItemType,
            priority: this.priority as PendingItemPriority,
            status: this.status as PendingItemStatus
          });
          this.pendingItemsService.update(this.data.item!.id, dto).subscribe(stryMutAct_9fa48("3277") ? {} : (stryCov_9fa48("3277"), {
            next: item => {
              if (stryMutAct_9fa48("3278")) {
                {}
              } else {
                stryCov_9fa48("3278");
                this.saving.set(stryMutAct_9fa48("3279") ? true : (stryCov_9fa48("3279"), false));
                this.toastService.show(this.t(stryMutAct_9fa48("3280") ? "" : (stryCov_9fa48("3280"), 'common.toast.updated')), stryMutAct_9fa48("3281") ? "" : (stryCov_9fa48("3281"), 'success'));
                this.dialogRef.close(item);
              }
            },
            error: err => {
              if (stryMutAct_9fa48("3282")) {
                {}
              } else {
                stryCov_9fa48("3282");
                this.saving.set(stryMutAct_9fa48("3283") ? true : (stryCov_9fa48("3283"), false));
                console.error(stryMutAct_9fa48("3284") ? "" : (stryCov_9fa48("3284"), 'Update pending item failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("3285") ? "" : (stryCov_9fa48("3285"), 'common.toast.errorUpdated')), stryMutAct_9fa48("3286") ? "" : (stryCov_9fa48("3286"), 'error'));
              }
            }
          }));
        }
      }
    }
  }
}