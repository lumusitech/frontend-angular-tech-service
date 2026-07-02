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
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../../core/services/billing.service';
import { Invoice } from '../../core/models/invoice.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
@Component({
  selector: 'app-invoice-detail',
  imports: [MatIconModule, MatButtonModule, MatCardModule, MatDividerModule, MatDialogModule, MatProgressSpinnerModule, StatusBadgeComponent, ErrorStateComponent, PageHeaderComponent, CurrencyArsPipe, DatePipe, TranslatePipe],
  template: `
    <div class="space-y-6">
      @if (invoiceResource.status() === 'loading' && !invoiceResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (invoiceResource.error()) {
        <app-error-state (retry)="invoiceResource.reload()" />
      } @else if (invoiceResource.hasValue()) {
        @let invoice = invoiceResource.value();

        <app-page-header
          [title]="invoice.invoiceNumber"
          [subtitle]="'billing.types.' + invoice.invoiceType | translate"
        >
          <div class="flex gap-2">
            @if (invoice.status === 'draft') {
              <button mat-flat-button color="primary" (click)="issueInvoice(invoice)">
                <mat-icon>send</mat-icon>
                {{ 'billing.issue' | translate }}
              </button>
            }
            @if (invoice.status === 'issued') {
              <button mat-flat-button color="warn" (click)="cancelInvoice(invoice)">
                <mat-icon>cancel</mat-icon>
                {{ 'billing.cancel' | translate }}
              </button>
            }
            <button mat-stroked-button (click)="downloadPdf(invoice)">
              <mat-icon>download</mat-icon>
              {{ 'billing.downloadPdf' | translate }}
            </button>
          </div>
        </app-page-header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <mat-card>
              <mat-card-header>
                <mat-card-title>{{ 'common.details' | translate }}</mat-card-title>
              </mat-card-header>
              <mat-card-content class="!p-6">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.invoiceNumber' | translate }}</p>
                    <p class="font-mono">{{ invoice.invoiceNumber }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'common.status' | translate }}</p>
                    <app-status-badge [value]="invoice.status" type="invoiceStatus" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.invoiceType' | translate }}</p>
                    <app-status-badge [value]="invoice.invoiceType" type="invoiceType" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.concept' | translate }}</p>
                    <p>{{ 'billing.concepts.' + invoice.concept | translate }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.createdAt' | translate }}</p>
                    <p>{{ invoice.createdAt | date : 'dd/MM/yyyy HH:mm' }}</p>
                  </div>
                  @if (invoice.issuedAt) {
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.issuedAt' | translate }}</p>
                      <p>{{ invoice.issuedAt | date : 'dd/MM/yyyy HH:mm' }}</p>
                    </div>
                  }
                  @if (invoice.cancelledAt) {
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.cancelledAt' | translate }}</p>
                      <p>{{ invoice.cancelledAt | date : 'dd/MM/yyyy HH:mm' }}</p>
                    </div>
                  }
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header>
                <mat-card-title>{{ 'billing.clientName' | translate }}</mat-card-title>
              </mat-card-header>
              <mat-card-content class="!p-6">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.clientName' | translate }}</p>
                    <p>{{ invoice.clientName }}</p>
                  </div>
                  @if (invoice.clientCuit) {
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.clientCuit' | translate }}</p>
                      <p class="font-mono">{{ invoice.clientCuit }}</p>
                    </div>
                  }
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.clientAddress' | translate }}</p>
                    <p>{{ invoice.clientAddress }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.clientIvaCondition' | translate }}</p>
                    <p>{{ 'billing.ivaConditions.' + invoice.clientIvaCondition | translate }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            @if (invoice.workOrder) {
              <mat-card>
                <mat-card-header>
                  <mat-card-title>{{ 'billing.workOrder' | translate }}</mat-card-title>
                </mat-card-header>
                <mat-card-content class="!p-6">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'workOrders.code' | translate }}</p>
                      <p class="font-mono">{{ invoice.workOrder.trackingCode }}</p>
                    </div>
                    @if (invoice.workOrder.client) {
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'workOrders.client' | translate }}</p>
                        <p>{{ invoice.workOrder.client.name }}</p>
                      </div>
                    }
                    @if (invoice.workOrder.serviceType) {
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'workOrders.serviceType' | translate }}</p>
                        <p>{{ invoice.workOrder.serviceType.name }}</p>
                      </div>
                    }
                  </div>
                </mat-card-content>
              </mat-card>
            }
          </div>

          <div class="space-y-6">
            <mat-card>
              <mat-card-header>
                <mat-card-title>{{ 'billing.total' | translate }}</mat-card-title>
              </mat-card-header>
              <mat-card-content class="!p-6">
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400">{{ 'billing.subtotal' | translate }}</span>
                    <span>{{ invoice.subtotal | currencyArs }}</span>
                  </div>
                  @if (invoice.ivaAmount > 0) {
                    <div class="flex justify-between">
                      <span class="text-gray-500 dark:text-gray-400">{{ 'billing.ivaAmount' | translate }}</span>
                      <span>{{ invoice.ivaAmount | currencyArs }}</span>
                    </div>
                  }
                  <mat-divider />
                  <div class="flex justify-between text-lg font-bold">
                    <span>{{ 'billing.total' | translate }}</span>
                    <span>{{ invoice.total | currencyArs }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            @if (invoice.cae) {
              <mat-card>
                <mat-card-header>
                  <mat-card-title>{{ 'billing.cae' | translate }}</mat-card-title>
                </mat-card-header>
                <mat-card-content class="!p-6">
                  <div class="space-y-3">
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.cae' | translate }}</p>
                      <p class="font-mono text-lg">{{ invoice.cae }}</p>
                    </div>
                    @if (invoice.caeExpiry) {
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.caeExpiry' | translate }}</p>
                        <p>{{ invoice.caeExpiry | date : 'dd/MM/yyyy' }}</p>
                      </div>
                    }
                  </div>
                </mat-card-content>
              </mat-card>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class InvoiceDetailComponent {
  private readonly billingService = inject(BillingService);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  readonly invoiceResource = httpResource<Invoice>(() => {
    if (stryMutAct_9fa48("1494")) {
      {}
    } else {
      stryCov_9fa48("1494");
      const id = this.route.snapshot.paramMap.get(stryMutAct_9fa48("1495") ? "" : (stryCov_9fa48("1495"), 'id'));
      return id ? stryMutAct_9fa48("1496") ? `` : (stryCov_9fa48("1496"), `/api/billing/invoices/${id}`) : stryMutAct_9fa48("1497") ? "Stryker was here!" : (stryCov_9fa48("1497"), '');
    }
  });
  issueInvoice(invoice: Invoice): void {
    if (stryMutAct_9fa48("1498")) {
      {}
    } else {
      stryCov_9fa48("1498");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("1499") ? {} : (stryCov_9fa48("1499"), {
        width: stryMutAct_9fa48("1500") ? "" : (stryCov_9fa48("1500"), '400px'),
        data: stryMutAct_9fa48("1501") ? {} : (stryCov_9fa48("1501"), {
          titleKey: stryMutAct_9fa48("1502") ? "" : (stryCov_9fa48("1502"), 'billing.issueConfirmTitle'),
          message: stryMutAct_9fa48("1503") ? `` : (stryCov_9fa48("1503"), `¿Emitir factura ${invoice.invoiceNumber}? Se generará el CAE.`),
          confirmLabel: stryMutAct_9fa48("1504") ? "" : (stryCov_9fa48("1504"), 'billing.issue'),
          color: stryMutAct_9fa48("1505") ? "" : (stryCov_9fa48("1505"), 'primary')
        })
      }));
      dialogRef.afterClosed().subscribe(confirmed => {
        if (stryMutAct_9fa48("1506")) {
          {}
        } else {
          stryCov_9fa48("1506");
          if (stryMutAct_9fa48("1508") ? false : stryMutAct_9fa48("1507") ? true : (stryCov_9fa48("1507", "1508"), confirmed)) {
            if (stryMutAct_9fa48("1509")) {
              {}
            } else {
              stryCov_9fa48("1509");
              this.billingService.issue(invoice.id).subscribe(stryMutAct_9fa48("1510") ? {} : (stryCov_9fa48("1510"), {
                next: stryMutAct_9fa48("1511") ? () => undefined : (stryCov_9fa48("1511"), () => this.invoiceResource.reload())
              }));
            }
          }
        }
      });
    }
  }
  cancelInvoice(invoice: Invoice): void {
    if (stryMutAct_9fa48("1512")) {
      {}
    } else {
      stryCov_9fa48("1512");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("1513") ? {} : (stryCov_9fa48("1513"), {
        width: stryMutAct_9fa48("1514") ? "" : (stryCov_9fa48("1514"), '400px'),
        data: stryMutAct_9fa48("1515") ? {} : (stryCov_9fa48("1515"), {
          titleKey: stryMutAct_9fa48("1516") ? "" : (stryCov_9fa48("1516"), 'billing.cancelConfirmTitle'),
          message: stryMutAct_9fa48("1517") ? `` : (stryCov_9fa48("1517"), `¿Anular factura ${invoice.invoiceNumber}? Esta acción no se puede deshacer.`),
          confirmLabel: stryMutAct_9fa48("1518") ? "" : (stryCov_9fa48("1518"), 'billing.cancel'),
          color: stryMutAct_9fa48("1519") ? "" : (stryCov_9fa48("1519"), 'warn')
        })
      }));
      dialogRef.afterClosed().subscribe(confirmed => {
        if (stryMutAct_9fa48("1520")) {
          {}
        } else {
          stryCov_9fa48("1520");
          if (stryMutAct_9fa48("1522") ? false : stryMutAct_9fa48("1521") ? true : (stryCov_9fa48("1521", "1522"), confirmed)) {
            if (stryMutAct_9fa48("1523")) {
              {}
            } else {
              stryCov_9fa48("1523");
              this.billingService.cancel(invoice.id).subscribe(stryMutAct_9fa48("1524") ? {} : (stryCov_9fa48("1524"), {
                next: stryMutAct_9fa48("1525") ? () => undefined : (stryCov_9fa48("1525"), () => this.invoiceResource.reload())
              }));
            }
          }
        }
      });
    }
  }
  downloadPdf(invoice: Invoice): void {
    if (stryMutAct_9fa48("1526")) {
      {}
    } else {
      stryCov_9fa48("1526");
      this.billingService.downloadPdf(invoice.id).subscribe(blob => {
        if (stryMutAct_9fa48("1527")) {
          {}
        } else {
          stryCov_9fa48("1527");
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement(stryMutAct_9fa48("1528") ? "" : (stryCov_9fa48("1528"), 'a'));
          a.href = url;
          a.download = stryMutAct_9fa48("1529") ? `` : (stryCov_9fa48("1529"), `factura-${invoice.invoiceNumber}.pdf`);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      });
    }
  }
}