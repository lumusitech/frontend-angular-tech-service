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
import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
@Component({
  selector: 'app-quick-actions-widget',
  imports: [MatIconModule, MatButtonModule, TranslatePipe],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-6" [style.border-left-color]="borderColor()">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {{ 'dashboard.quickActions' | translate }}
      </h3>
      <div class="grid grid-cols-2 gap-3">
        <button mat-stroked-button class="!h-20 !flex !flex-col !gap-1 !border-2 hover:!bg-opacity-5"
                [style.border-color]="secondaryColor() + '40'"
                [style.--mdc-outlined-button-label-text-color]="secondaryColor()"
                (click)="navigate.emit('/admin/work-orders')">
          <mat-icon [style.color]="secondaryColor()">add_circle</mat-icon>
          <span class="text-xs">{{ 'dashboard.newOrder' | translate }}</span>
        </button>
        <button mat-stroked-button class="!h-20 !flex !flex-col !gap-1 !border-2 hover:!bg-opacity-5"
                [style.border-color]="secondaryColor() + '40'"
                [style.--mdc-outlined-button-label-text-color]="secondaryColor()"
                (click)="navigate.emit('/admin/clients')">
          <mat-icon [style.color]="secondaryColor()">person_add</mat-icon>
          <span class="text-xs">{{ 'dashboard.newClient' | translate }}</span>
        </button>
        <button mat-stroked-button class="!h-20 !flex !flex-col !gap-1 !border-2 hover:!bg-opacity-5"
                [style.border-color]="secondaryColor() + '40'"
                [style.--mdc-outlined-button-label-text-color]="secondaryColor()"
                (click)="navigate.emit('/admin/pending-items')">
          <mat-icon [style.color]="secondaryColor()">pending_actions</mat-icon>
          <span class="text-xs">{{ 'dashboard.pendingItems' | translate }}</span>
        </button>
        <button mat-stroked-button class="!h-20 !flex !flex-col !gap-1 !border-2 hover:!bg-opacity-5"
                [style.border-color]="secondaryColor() + '40'"
                [style.--mdc-outlined-button-label-text-color]="secondaryColor()"
                (click)="navigate.emit('/admin/expenses')">
          <mat-icon [style.color]="secondaryColor()">money_off</mat-icon>
          <span class="text-xs">{{ 'dashboard.viewExpenses' | translate }}</span>
        </button>
      </div>
    </div>
  `
})
export class QuickActionsWidgetComponent {
  secondaryColor = input<string>(stryMutAct_9fa48("2193") ? "" : (stryCov_9fa48("2193"), '#059669'));
  borderColor = input<string>(stryMutAct_9fa48("2194") ? "" : (stryCov_9fa48("2194"), '#059669'));
  navigate = output<string>();
}