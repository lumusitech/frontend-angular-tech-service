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
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { NoteType } from '../../core/models/work-order.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
interface DialogData {
  workOrderId: string;
}
@Component({
  selector: 'app-add-note-dialog',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>note_add</mat-icon>
      {{ 'workOrders.notes.addNote' | translate }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.notes.noteType' | translate }}</mat-label>
          <mat-select [value]="noteType()" (selectionChange)="noteType.set($event.value)">
            <mat-option value="diagnosis">{{
              'workOrders.notes.types.diagnosis' | translate
            }}</mat-option>
            <mat-option value="issue">{{ 'workOrders.notes.types.issue' | translate }}</mat-option>
            <mat-option value="observation">{{
              'workOrders.notes.types.observation' | translate
            }}</mat-option>
            <mat-option value="internal">{{
              'workOrders.notes.types.internal' | translate
            }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.notes.content' | translate }}</mat-label>
          <textarea
            matInput
            [value]="content()"
            (input)="content.set(getInputValue($event))"
            rows="4"
            [placeholder]="'workOrders.notes.contentPlaceholder' | translate"
          ></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit($event)"
        [disabled]="saving() || !content()"
      >
        {{ saving() ? ('common.saving' | translate) : ('workOrders.notes.saveNote' | translate) }}
      </button>
    </mat-dialog-actions>
  `
})
export class AddNoteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddNoteDialogComponent>);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly noteType = signal<NoteType>(stryMutAct_9fa48("5333") ? "" : (stryCov_9fa48("5333"), 'observation'));
  readonly content = signal(stryMutAct_9fa48("5334") ? "Stryker was here!" : (stryCov_9fa48("5334"), ''));
  readonly saving = signal(stryMutAct_9fa48("5335") ? true : (stryCov_9fa48("5335"), false));
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("5336")) {
      {}
    } else {
      stryCov_9fa48("5336");
      return (event.target as HTMLInputElement).value;
    }
  }
  onSubmit(event: Event): void {
    if (stryMutAct_9fa48("5337")) {
      {}
    } else {
      stryCov_9fa48("5337");
      event.preventDefault();
      if (stryMutAct_9fa48("5340") ? false : stryMutAct_9fa48("5339") ? true : stryMutAct_9fa48("5338") ? this.content() : (stryCov_9fa48("5338", "5339", "5340"), !this.content())) return;
      this.saving.set(stryMutAct_9fa48("5341") ? false : (stryCov_9fa48("5341"), true));
      this.workOrdersService.addNote(this.data.workOrderId, stryMutAct_9fa48("5342") ? {} : (stryCov_9fa48("5342"), {
        type: this.noteType(),
        content: this.content()
      })).subscribe(stryMutAct_9fa48("5343") ? {} : (stryCov_9fa48("5343"), {
        next: () => {
          if (stryMutAct_9fa48("5344")) {
            {}
          } else {
            stryCov_9fa48("5344");
            this.saving.set(stryMutAct_9fa48("5345") ? true : (stryCov_9fa48("5345"), false));
            this.dialogRef.close(stryMutAct_9fa48("5346") ? false : (stryCov_9fa48("5346"), true));
          }
        },
        error: () => {
          if (stryMutAct_9fa48("5347")) {
            {}
          } else {
            stryCov_9fa48("5347");
            this.saving.set(stryMutAct_9fa48("5348") ? true : (stryCov_9fa48("5348"), false));
          }
        }
      }));
    }
  }
}