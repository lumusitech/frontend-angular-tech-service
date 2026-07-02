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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExpensesService } from '../../core/services/expenses.service';
import { Expense, CreateExpenseDto, UpdateExpenseDto, ExpenseCategory } from '../../core/models/expense.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
interface DialogData {
  mode: 'create' | 'edit';
  expense?: Expense;
}
@Component({
  selector: 'app-expense-form',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, FormsModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>receipt_long</mat-icon>
      {{
        data.mode === 'create'
          ? ('expenses.newExpense' | translate)
          : ('expenses.editExpense' | translate)
      }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form #formRef="ngForm" (submit)="onSubmit($event, formRef)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'expenses.description' | translate }}</mat-label>
          <input
            matInput
            [(ngModel)]="description"
            name="description"
            #descriptionRef="ngModel"
            required
          />
          @if (descriptionRef.invalid && descriptionRef.touched) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'expenses.amount' | translate }}</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="amount"
              name="amount"
              #amountRef="ngModel"
              min="0.01"
              step="0.01"
              required
            />
            @if (amountRef.invalid && amountRef.touched) {
              <mat-error>{{ t('validation.invalidAmount') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'expenses.date' | translate }}</mat-label>
            <input
              matInput
              [matDatepicker]="datePicker"
              [(ngModel)]="dateValue"
              name="date"
              #dateRef="ngModel"
              (click)="datePicker.open()"
              required
            />
            <mat-datepicker-toggle matIconSuffix [for]="datePicker"></mat-datepicker-toggle>
            <mat-datepicker #datePicker></mat-datepicker>
            @if (dateRef.invalid && dateRef.touched) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'expenses.category' | translate }}</mat-label>
          <mat-select [(ngModel)]="category" name="category" required>
            <mat-option value="rent">{{ 'expenses.categories.rent' | translate }}</mat-option>
            <mat-option value="utilities">{{
              'expenses.categories.utilities' | translate
            }}</mat-option>
            <mat-option value="salaries">{{
              'expenses.categories.salaries' | translate
            }}</mat-option>
            <mat-option value="tools">{{ 'expenses.categories.tools' | translate }}</mat-option>
            <mat-option value="transport">{{
              'expenses.categories.transport' | translate
            }}</mat-option>
            <mat-option value="advertising">{{
              'expenses.categories.advertising' | translate
            }}</mat-option>
            <mat-option value="supplies">{{
              'expenses.categories.supplies' | translate
            }}</mat-option>
            <mat-option value="maintenance">{{
              'expenses.categories.maintenance' | translate
            }}</mat-option>
            <mat-option value="hosting">{{ 'expenses.categories.hosting' | translate }}</mat-option>
            <mat-option value="other">{{ 'expenses.categories.other' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'expenses.notes' | translate }}</mat-label>
          <textarea
            matInput
            [(ngModel)]="notes"
            name="notes"
            rows="3"
          ></textarea>
        </mat-form-field>

        <mat-checkbox [(ngModel)]="isRecurring" name="isRecurring">
          {{ 'expenses.recurringExpense' | translate }}
        </mat-checkbox>
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
export class ExpenseFormComponent {
  private readonly dialogRef = inject(MatDialogRef<ExpenseFormComponent>);
  private readonly expensesService = inject(ExpensesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  description = stryMutAct_9fa48("2200") ? this.data.expense?.description && '' : stryMutAct_9fa48("2199") ? false : stryMutAct_9fa48("2198") ? true : (stryCov_9fa48("2198", "2199", "2200"), (stryMutAct_9fa48("2201") ? this.data.expense.description : (stryCov_9fa48("2201"), this.data.expense?.description)) || (stryMutAct_9fa48("2202") ? "Stryker was here!" : (stryCov_9fa48("2202"), '')));
  amount = stryMutAct_9fa48("2205") ? this.data.expense?.amount?.toString() && '' : stryMutAct_9fa48("2204") ? false : stryMutAct_9fa48("2203") ? true : (stryCov_9fa48("2203", "2204", "2205"), (stryMutAct_9fa48("2207") ? this.data.expense.amount?.toString() : stryMutAct_9fa48("2206") ? this.data.expense?.amount.toString() : (stryCov_9fa48("2206", "2207"), this.data.expense?.amount?.toString())) || (stryMutAct_9fa48("2208") ? "Stryker was here!" : (stryCov_9fa48("2208"), '')));
  dateValue: Date | null = (stryMutAct_9fa48("2209") ? this.data.expense.date : (stryCov_9fa48("2209"), this.data.expense?.date)) ? new Date(this.data.expense.date) : new Date();
  category: ExpenseCategory = stryMutAct_9fa48("2212") ? this.data.expense?.category && 'other' : stryMutAct_9fa48("2211") ? false : stryMutAct_9fa48("2210") ? true : (stryCov_9fa48("2210", "2211", "2212"), (stryMutAct_9fa48("2213") ? this.data.expense.category : (stryCov_9fa48("2213"), this.data.expense?.category)) || (stryMutAct_9fa48("2214") ? "" : (stryCov_9fa48("2214"), 'other')));
  notes = stryMutAct_9fa48("2217") ? this.data.expense?.notes && '' : stryMutAct_9fa48("2216") ? false : stryMutAct_9fa48("2215") ? true : (stryCov_9fa48("2215", "2216", "2217"), (stryMutAct_9fa48("2218") ? this.data.expense.notes : (stryCov_9fa48("2218"), this.data.expense?.notes)) || (stryMutAct_9fa48("2219") ? "Stryker was here!" : (stryCov_9fa48("2219"), '')));
  isRecurring = stryMutAct_9fa48("2220") ? this.data.expense?.isRecurring && false : (stryCov_9fa48("2220"), (stryMutAct_9fa48("2221") ? this.data.expense.isRecurring : (stryCov_9fa48("2221"), this.data.expense?.isRecurring)) ?? (stryMutAct_9fa48("2222") ? true : (stryCov_9fa48("2222"), false)));
  readonly saving = signal(stryMutAct_9fa48("2223") ? true : (stryCov_9fa48("2223"), false));
  t(key: string): string {
    if (stryMutAct_9fa48("2224")) {
      {}
    } else {
      stryCov_9fa48("2224");
      return this.translationService.instant(key);
    }
  }
  onSubmit(event: Event, form: NgForm): void {
    if (stryMutAct_9fa48("2225")) {
      {}
    } else {
      stryCov_9fa48("2225");
      event.preventDefault();
      form.control.markAllAsTouched();
      if (stryMutAct_9fa48("2227") ? false : stryMutAct_9fa48("2226") ? true : (stryCov_9fa48("2226", "2227"), form.invalid)) return;
      this.saving.set(stryMutAct_9fa48("2228") ? false : (stryCov_9fa48("2228"), true));
      const dateStr = this.dateValue ? toLocalDateString(this.dateValue) : stryMutAct_9fa48("2229") ? "Stryker was here!" : (stryCov_9fa48("2229"), '');
      if (stryMutAct_9fa48("2232") ? this.data.mode !== 'create' : stryMutAct_9fa48("2231") ? false : stryMutAct_9fa48("2230") ? true : (stryCov_9fa48("2230", "2231", "2232"), this.data.mode === (stryMutAct_9fa48("2233") ? "" : (stryCov_9fa48("2233"), 'create')))) {
        if (stryMutAct_9fa48("2234")) {
          {}
        } else {
          stryCov_9fa48("2234");
          const dto: CreateExpenseDto = stryMutAct_9fa48("2235") ? {} : (stryCov_9fa48("2235"), {
            description: this.description,
            amount: parseFloat(this.amount),
            date: dateStr,
            category: this.category,
            isRecurring: this.isRecurring,
            notes: stryMutAct_9fa48("2238") ? this.notes && undefined : stryMutAct_9fa48("2237") ? false : stryMutAct_9fa48("2236") ? true : (stryCov_9fa48("2236", "2237", "2238"), this.notes || undefined)
          });
          this.expensesService.create(dto).subscribe(stryMutAct_9fa48("2239") ? {} : (stryCov_9fa48("2239"), {
            next: expense => {
              if (stryMutAct_9fa48("2240")) {
                {}
              } else {
                stryCov_9fa48("2240");
                this.saving.set(stryMutAct_9fa48("2241") ? true : (stryCov_9fa48("2241"), false));
                this.toastService.show(this.t(stryMutAct_9fa48("2242") ? "" : (stryCov_9fa48("2242"), 'common.toast.created')), stryMutAct_9fa48("2243") ? "" : (stryCov_9fa48("2243"), 'success'));
                this.dialogRef.close(expense);
              }
            },
            error: err => {
              if (stryMutAct_9fa48("2244")) {
                {}
              } else {
                stryCov_9fa48("2244");
                this.saving.set(stryMutAct_9fa48("2245") ? true : (stryCov_9fa48("2245"), false));
                console.error(stryMutAct_9fa48("2246") ? "" : (stryCov_9fa48("2246"), 'Create expense failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("2247") ? "" : (stryCov_9fa48("2247"), 'common.toast.errorCreated')), stryMutAct_9fa48("2248") ? "" : (stryCov_9fa48("2248"), 'error'));
              }
            }
          }));
        }
      } else {
        if (stryMutAct_9fa48("2249")) {
          {}
        } else {
          stryCov_9fa48("2249");
          const dto: UpdateExpenseDto = stryMutAct_9fa48("2250") ? {} : (stryCov_9fa48("2250"), {
            description: this.description,
            amount: parseFloat(this.amount),
            date: dateStr,
            category: this.category,
            isRecurring: this.isRecurring,
            notes: stryMutAct_9fa48("2253") ? this.notes && undefined : stryMutAct_9fa48("2252") ? false : stryMutAct_9fa48("2251") ? true : (stryCov_9fa48("2251", "2252", "2253"), this.notes || undefined)
          });
          this.expensesService.update(this.data.expense!.id, dto).subscribe(stryMutAct_9fa48("2254") ? {} : (stryCov_9fa48("2254"), {
            next: expense => {
              if (stryMutAct_9fa48("2255")) {
                {}
              } else {
                stryCov_9fa48("2255");
                this.saving.set(stryMutAct_9fa48("2256") ? true : (stryCov_9fa48("2256"), false));
                this.toastService.show(this.t(stryMutAct_9fa48("2257") ? "" : (stryCov_9fa48("2257"), 'common.toast.updated')), stryMutAct_9fa48("2258") ? "" : (stryCov_9fa48("2258"), 'success'));
                this.dialogRef.close(expense);
              }
            },
            error: err => {
              if (stryMutAct_9fa48("2259")) {
                {}
              } else {
                stryCov_9fa48("2259");
                this.saving.set(stryMutAct_9fa48("2260") ? true : (stryCov_9fa48("2260"), false));
                console.error(stryMutAct_9fa48("2261") ? "" : (stryCov_9fa48("2261"), 'Update expense failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("2262") ? "" : (stryCov_9fa48("2262"), 'common.toast.errorUpdated')), stryMutAct_9fa48("2263") ? "" : (stryCov_9fa48("2263"), 'error'));
              }
            }
          }));
        }
      }
    }
  }
}