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
import { Component, inject, Injectable } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
interface CrudToastData {
  message: string;
  type: 'success' | 'error' | 'info';
}
const TYPE_ICONS: Record<string, string> = stryMutAct_9fa48("1119") ? {} : (stryCov_9fa48("1119"), {
  success: stryMutAct_9fa48("1120") ? "" : (stryCov_9fa48("1120"), 'check_circle'),
  error: stryMutAct_9fa48("1121") ? "" : (stryCov_9fa48("1121"), 'error'),
  info: stryMutAct_9fa48("1122") ? "" : (stryCov_9fa48("1122"), 'info')
});
@Component({
  selector: 'app-crud-toast-content',
  imports: [MatIconModule],
  template: `
    <div class="flex items-center gap-2 min-w-[250px] max-w-[400px]">
      <mat-icon [class]="data.type === 'success' ? '!text-green-500' : data.type === 'error' ? '!text-red-500' : '!text-blue-500'">
        {{ icon }}
      </mat-icon>
      <span class="text-sm font-medium">{{ data.message }}</span>
    </div>
  `,
  host: {
    class: 'block'
  }
})
export class CrudToastContentComponent {
  readonly data: CrudToastData = inject(MAT_SNACK_BAR_DATA);
  readonly icon = stryMutAct_9fa48("1125") ? TYPE_ICONS[this.data.type] && 'info' : stryMutAct_9fa48("1124") ? false : stryMutAct_9fa48("1123") ? true : (stryCov_9fa48("1123", "1124", "1125"), TYPE_ICONS[this.data.type] || (stryMutAct_9fa48("1126") ? "" : (stryCov_9fa48("1126"), 'info')));
}
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private snackBar = inject(MatSnackBar);
  show(message: string, type: 'success' | 'error' | 'info' = stryMutAct_9fa48("1127") ? "" : (stryCov_9fa48("1127"), 'success')): void {
    if (stryMutAct_9fa48("1128")) {
      {}
    } else {
      stryCov_9fa48("1128");
      this.snackBar.openFromComponent(CrudToastContentComponent, stryMutAct_9fa48("1129") ? {} : (stryCov_9fa48("1129"), {
        duration: 3000,
        horizontalPosition: stryMutAct_9fa48("1130") ? "" : (stryCov_9fa48("1130"), 'end'),
        verticalPosition: stryMutAct_9fa48("1131") ? "" : (stryCov_9fa48("1131"), 'top'),
        panelClass: stryMutAct_9fa48("1132") ? [] : (stryCov_9fa48("1132"), [stryMutAct_9fa48("1133") ? `` : (stryCov_9fa48("1133"), `toast-${type}`)]),
        data: (stryMutAct_9fa48("1134") ? {} : (stryCov_9fa48("1134"), {
          message,
          type
        })) satisfies CrudToastData
      }));
    }
  }
}