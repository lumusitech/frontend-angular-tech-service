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
import { Component, input, inject, signal } from '@angular/core';
import { ReportsService } from '../../../core/services/reports.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
@Component({
  selector: 'app-export-buttons',
  imports: [MatIconModule, MatButtonModule, MatMenuModule, TranslatePipe],
  template: `
    <button mat-stroked-button [matMenuTriggerFor]="exportMenu" [disabled]="downloading()">
      <mat-icon>download</mat-icon>
      {{ 'reports.export.export' | translate }}
    </button>
    <mat-menu #exportMenu="matMenu">
      @if (workOrderId()) {
        <button mat-menu-item (click)="downloadBudget()" [disabled]="downloading()">
          <mat-icon>description</mat-icon>
          <span>{{ 'reports.export.budget' | translate }}</span>
        </button>
      }
      @if (paymentId()) {
        <button mat-menu-item (click)="downloadReceipt()" [disabled]="downloading()">
          <mat-icon>receipt</mat-icon>
          <span>{{ 'reports.export.receipt' | translate }}</span>
        </button>
      }
    </mat-menu>
  `
})
export class ExportButtonsComponent {
  private readonly reportsService = inject(ReportsService);
  workOrderId = input<string>(stryMutAct_9fa48("5886") ? "Stryker was here!" : (stryCov_9fa48("5886"), ''));
  paymentId = input<string>(stryMutAct_9fa48("5887") ? "Stryker was here!" : (stryCov_9fa48("5887"), ''));
  readonly downloading = signal(stryMutAct_9fa48("5888") ? true : (stryCov_9fa48("5888"), false));
  downloadBudget(): void {
    if (stryMutAct_9fa48("5889")) {
      {}
    } else {
      stryCov_9fa48("5889");
      const id = this.workOrderId();
      if (stryMutAct_9fa48("5892") ? false : stryMutAct_9fa48("5891") ? true : stryMutAct_9fa48("5890") ? id : (stryCov_9fa48("5890", "5891", "5892"), !id)) return;
      this.downloading.set(stryMutAct_9fa48("5893") ? false : (stryCov_9fa48("5893"), true));
      this.reportsService.downloadBudgetPdf(id).subscribe(stryMutAct_9fa48("5894") ? {} : (stryCov_9fa48("5894"), {
        next: blob => {
          if (stryMutAct_9fa48("5895")) {
            {}
          } else {
            stryCov_9fa48("5895");
            this.downloadBlob(blob, stryMutAct_9fa48("5896") ? `` : (stryCov_9fa48("5896"), `presupuesto-${id}.pdf`));
            this.downloading.set(stryMutAct_9fa48("5897") ? true : (stryCov_9fa48("5897"), false));
          }
        },
        error: stryMutAct_9fa48("5898") ? () => undefined : (stryCov_9fa48("5898"), () => this.downloading.set(stryMutAct_9fa48("5899") ? true : (stryCov_9fa48("5899"), false)))
      }));
    }
  }
  downloadReceipt(): void {
    if (stryMutAct_9fa48("5900")) {
      {}
    } else {
      stryCov_9fa48("5900");
      const id = this.paymentId();
      if (stryMutAct_9fa48("5903") ? false : stryMutAct_9fa48("5902") ? true : stryMutAct_9fa48("5901") ? id : (stryCov_9fa48("5901", "5902", "5903"), !id)) return;
      this.downloading.set(stryMutAct_9fa48("5904") ? false : (stryCov_9fa48("5904"), true));
      this.reportsService.downloadReceiptPdf(id).subscribe(stryMutAct_9fa48("5905") ? {} : (stryCov_9fa48("5905"), {
        next: blob => {
          if (stryMutAct_9fa48("5906")) {
            {}
          } else {
            stryCov_9fa48("5906");
            this.downloadBlob(blob, stryMutAct_9fa48("5907") ? `` : (stryCov_9fa48("5907"), `recibo-${id}.pdf`));
            this.downloading.set(stryMutAct_9fa48("5908") ? true : (stryCov_9fa48("5908"), false));
          }
        },
        error: stryMutAct_9fa48("5909") ? () => undefined : (stryCov_9fa48("5909"), () => this.downloading.set(stryMutAct_9fa48("5910") ? true : (stryCov_9fa48("5910"), false)))
      }));
    }
  }
  private downloadBlob(blob: Blob, filename: string): void {
    if (stryMutAct_9fa48("5911")) {
      {}
    } else {
      stryCov_9fa48("5911");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement(stryMutAct_9fa48("5912") ? "" : (stryCov_9fa48("5912"), 'a'));
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
}