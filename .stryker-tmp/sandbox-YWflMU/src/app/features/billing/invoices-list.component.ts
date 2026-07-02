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
import { Component, computed, inject, signal } from '@angular/core';
import { toLocalDateString } from '../../core/utils/date.utils';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { BillingService } from '../../core/services/billing.service';
import { TranslationService } from '../../core/services/translation.service';
import { Invoice, InvoiceType, InvoiceStatus } from '../../core/models/invoice.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { MobileCardComponent, MobileCardField } from '../../shared/components/mobile-card/mobile-card.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { InvoiceFormComponent } from './invoice-form.component';
@Component({
  selector: 'app-invoices-list',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatProgressSpinnerModule, MatAccordion, EmptyStateComponent, ErrorStateComponent, PageHeaderComponent, StatusBadgeComponent, CurrencyArsPipe, MobileCardComponent, TranslatePipe, RelativeDatePipe],
  template: `
    <div class="space-y-6">
      <app-page-header
        [title]="'billing.title' | translate"
        [subtitle]="'billing.subtitle' | translate"
        [actionLabel]="'billing.newInvoice' | translate"
        actionIcon="add"
        [action]="openCreateDialog.bind(this)"
      />

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex items-center gap-3 flex-wrap">
          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'common.status' | translate }}</mat-label>
            <mat-select [value]="statusFilter()" (selectionChange)="statusFilter.set($event.value)">
              <mat-option value="">{{ 'billing.filters.allStatuses' | translate }}</mat-option>
              <mat-option value="draft">{{ 'billing.statuses.draft' | translate }}</mat-option>
              <mat-option value="issued">{{ 'billing.statuses.issued' | translate }}</mat-option>
              <mat-option value="cancelled">{{ 'billing.statuses.cancelled' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'billing.invoiceType' | translate }}</mat-label>
            <mat-select [value]="typeFilter()" (selectionChange)="typeFilter.set($event.value)">
              <mat-option value="">{{ 'billing.filters.allTypes' | translate }}</mat-option>
              <mat-option value="A">{{ 'billing.types.A' | translate }}</mat-option>
              <mat-option value="B">{{ 'billing.types.B' | translate }}</mat-option>
              <mat-option value="C">{{ 'billing.types.C' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-44">
            <mat-label>{{ 'billing.clientName' | translate }}</mat-label>
            <input
              matInput
              [value]="clientNameFilter()"
              (input)="clientNameFilter.set(getInputValue($event))"
              [placeholder]="'common.search' | translate"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-40">
            <mat-label>{{ 'common.from' | translate }}</mat-label>
            <input matInput [matDatepicker]="dateFromPicker" [value]="dateFromValue()" (dateChange)="onDateFromChange($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="dateFromPicker"></mat-datepicker-toggle>
            <mat-datepicker #dateFromPicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-40">
            <mat-label>{{ 'common.to' | translate }}</mat-label>
            <input matInput [matDatepicker]="dateToPicker" [value]="dateToValue()" (dateChange)="onDateToChange($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="dateToPicker"></mat-datepicker-toggle>
            <mat-datepicker #dateToPicker></mat-datepicker>
          </mat-form-field>

          @if (hasActiveFilters()) {
            <button mat-stroked-button (click)="clearFilters()" class="!text-gray-500 dark:!text-gray-400">
              <mat-icon class="!w-5 !h-5">filter_list_off</mat-icon>
              {{ 'common.clearFilters' | translate }}
            </button>
          }
        </div>
      </div>

      @if (invoicesResource.status() === 'loading' && !invoicesResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (invoicesResource.error()) {
        <app-error-state (retry)="invoicesResource.reload()" />
      } @else if (invoicesResource.hasValue() && invoicesResource.value().data.length === 0) {
        <app-empty-state
          [title]="'billing.noInvoices' | translate"
          [message]="'billing.noInvoicesMessage' | translate"
          [actionLabel]="'billing.createInvoice' | translate"
          [action]="openCreateDialog.bind(this)"
        />
      } @else if (invoicesResource.hasValue()) {
        <!-- Mobile: Cards -->
        <mat-accordion class="block md:hidden">
          @for (invoice of invoicesResource.value().data; track invoice.id) {
            <app-mobile-card
              [title]="invoice.invoiceNumber"
              [status]="invoice.status"
              [statusType]="$any('invoiceStatus')"
              [fields]="getInvoiceFields(invoice)"
            />
          }
        </mat-accordion>

        <!-- Desktop: Table -->
        <div class="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table
            mat-table
            matSort
            matSortDisableClear
            [dataSource]="invoicesResource.value().data"
            (matSortChange)="onSortChange($event)"
            class="w-full"
          >
            <ng-container matColumnDef="invoiceNumber">
              <th mat-header-cell mat-sort-header *matHeaderCellDef>
                {{ 'billing.invoiceNumber' | translate }}
              </th>
              <td mat-cell *matCellDef="let invoice">
                <span class="font-mono text-sm">{{ invoice.invoiceNumber }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="invoiceType">
              <th mat-header-cell mat-sort-header *matHeaderCellDef>
                {{ 'billing.invoiceType' | translate }}
              </th>
              <td mat-cell *matCellDef="let invoice">
                <app-status-badge [value]="invoice.invoiceType" type="invoiceType" />
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell mat-sort-header *matHeaderCellDef>
                {{ 'common.status' | translate }}
              </th>
              <td mat-cell *matCellDef="let invoice">
                <app-status-badge [value]="invoice.status" type="invoiceStatus" />
              </td>
            </ng-container>

            <ng-container matColumnDef="clientName">
              <th mat-header-cell mat-sort-header *matHeaderCellDef>
                {{ 'billing.clientName' | translate }}
              </th>
              <td mat-cell *matCellDef="let invoice">
                {{ invoice.clientName }}
              </td>
            </ng-container>

            <ng-container matColumnDef="total">
              <th mat-header-cell mat-sort-header *matHeaderCellDef>
                {{ 'billing.total' | translate }}
              </th>
              <td mat-cell *matCellDef="let invoice">
                {{ invoice.total | currencyArs }}
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell mat-sort-header *matHeaderCellDef>
                {{ 'billing.createdAt' | translate }}
              </th>
              <td mat-cell *matCellDef="let invoice">
                {{ invoice.createdAt | relativeDate }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              (click)="goToDetail(row)"
              class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            ></tr>
          </table>

          <mat-paginator
            [length]="invoicesResource.value().total"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[10, 25, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons
          />
        </div>
      }
    </div>
  `
})
export class InvoicesListComponent {
  private readonly billingService = inject(BillingService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly statusFilter = signal<InvoiceStatus | ''>(stryMutAct_9fa48("1636") ? "Stryker was here!" : (stryCov_9fa48("1636"), ''));
  readonly typeFilter = signal<InvoiceType | ''>(stryMutAct_9fa48("1637") ? "Stryker was here!" : (stryCov_9fa48("1637"), ''));
  readonly clientNameFilter = signal(stryMutAct_9fa48("1638") ? "Stryker was here!" : (stryCov_9fa48("1638"), ''));
  readonly sortBy = signal(stryMutAct_9fa48("1639") ? "" : (stryCov_9fa48("1639"), 'createdAt'));
  readonly sortOrder = signal<'asc' | 'desc'>(stryMutAct_9fa48("1640") ? "" : (stryCov_9fa48("1640"), 'desc'));
  readonly dateFrom = signal(stryMutAct_9fa48("1641") ? "Stryker was here!" : (stryCov_9fa48("1641"), ''));
  readonly dateTo = signal(stryMutAct_9fa48("1642") ? "Stryker was here!" : (stryCov_9fa48("1642"), ''));
  readonly dateFromValue = computed(stryMutAct_9fa48("1643") ? () => undefined : (stryCov_9fa48("1643"), () => this.dateFrom() ? new Date(this.dateFrom()) : null));
  readonly dateToValue = computed(stryMutAct_9fa48("1644") ? () => undefined : (stryCov_9fa48("1644"), () => this.dateTo() ? new Date(this.dateTo()) : null));
  readonly invoicesResource = httpResource<PaginatedResponse<Invoice>>(stryMutAct_9fa48("1645") ? () => undefined : (stryCov_9fa48("1645"), () => stryMutAct_9fa48("1646") ? {} : (stryCov_9fa48("1646"), {
    url: stryMutAct_9fa48("1647") ? "" : (stryCov_9fa48("1647"), '/api/billing/invoices'),
    params: stryMutAct_9fa48("1648") ? {} : (stryCov_9fa48("1648"), {
      page: this.currentPage(),
      limit: this.pageSize(),
      ...(this.statusFilter() ? stryMutAct_9fa48("1649") ? {} : (stryCov_9fa48("1649"), {
        status: this.statusFilter()
      }) : {}),
      ...(this.typeFilter() ? stryMutAct_9fa48("1650") ? {} : (stryCov_9fa48("1650"), {
        invoiceType: this.typeFilter()
      }) : {}),
      ...(this.clientNameFilter() ? stryMutAct_9fa48("1651") ? {} : (stryCov_9fa48("1651"), {
        clientName: this.clientNameFilter()
      }) : {}),
      sortBy: this.sortBy(),
      order: stryMutAct_9fa48("1652") ? this.sortOrder().toLowerCase() : (stryCov_9fa48("1652"), this.sortOrder().toUpperCase()),
      ...(this.dateFrom() ? stryMutAct_9fa48("1653") ? {} : (stryCov_9fa48("1653"), {
        dateFrom: this.dateFrom()
      }) : {}),
      ...(this.dateTo() ? stryMutAct_9fa48("1654") ? {} : (stryCov_9fa48("1654"), {
        dateTo: this.dateTo()
      }) : {})
    })
  })));
  displayedColumns = stryMutAct_9fa48("1655") ? [] : (stryCov_9fa48("1655"), [stryMutAct_9fa48("1656") ? "" : (stryCov_9fa48("1656"), 'invoiceNumber'), stryMutAct_9fa48("1657") ? "" : (stryCov_9fa48("1657"), 'invoiceType'), stryMutAct_9fa48("1658") ? "" : (stryCov_9fa48("1658"), 'status'), stryMutAct_9fa48("1659") ? "" : (stryCov_9fa48("1659"), 'clientName'), stryMutAct_9fa48("1660") ? "" : (stryCov_9fa48("1660"), 'total'), stryMutAct_9fa48("1661") ? "" : (stryCov_9fa48("1661"), 'createdAt')]);
  readonly hasActiveFilters = computed(() => {
    if (stryMutAct_9fa48("1662")) {
      {}
    } else {
      stryCov_9fa48("1662");
      return stryMutAct_9fa48("1665") ? (this.statusFilter() !== '' || this.typeFilter() !== '' || this.clientNameFilter() !== '' || this.dateFrom() !== '') && this.dateTo() !== '' : stryMutAct_9fa48("1664") ? false : stryMutAct_9fa48("1663") ? true : (stryCov_9fa48("1663", "1664", "1665"), (stryMutAct_9fa48("1667") ? (this.statusFilter() !== '' || this.typeFilter() !== '' || this.clientNameFilter() !== '') && this.dateFrom() !== '' : stryMutAct_9fa48("1666") ? false : (stryCov_9fa48("1666", "1667"), (stryMutAct_9fa48("1669") ? (this.statusFilter() !== '' || this.typeFilter() !== '') && this.clientNameFilter() !== '' : stryMutAct_9fa48("1668") ? false : (stryCov_9fa48("1668", "1669"), (stryMutAct_9fa48("1671") ? this.statusFilter() !== '' && this.typeFilter() !== '' : stryMutAct_9fa48("1670") ? false : (stryCov_9fa48("1670", "1671"), (stryMutAct_9fa48("1673") ? this.statusFilter() === '' : stryMutAct_9fa48("1672") ? false : (stryCov_9fa48("1672", "1673"), this.statusFilter() !== (stryMutAct_9fa48("1674") ? "Stryker was here!" : (stryCov_9fa48("1674"), '')))) || (stryMutAct_9fa48("1676") ? this.typeFilter() === '' : stryMutAct_9fa48("1675") ? false : (stryCov_9fa48("1675", "1676"), this.typeFilter() !== (stryMutAct_9fa48("1677") ? "Stryker was here!" : (stryCov_9fa48("1677"), '')))))) || (stryMutAct_9fa48("1679") ? this.clientNameFilter() === '' : stryMutAct_9fa48("1678") ? false : (stryCov_9fa48("1678", "1679"), this.clientNameFilter() !== (stryMutAct_9fa48("1680") ? "Stryker was here!" : (stryCov_9fa48("1680"), '')))))) || (stryMutAct_9fa48("1682") ? this.dateFrom() === '' : stryMutAct_9fa48("1681") ? false : (stryCov_9fa48("1681", "1682"), this.dateFrom() !== (stryMutAct_9fa48("1683") ? "Stryker was here!" : (stryCov_9fa48("1683"), '')))))) || (stryMutAct_9fa48("1685") ? this.dateTo() === '' : stryMutAct_9fa48("1684") ? false : (stryCov_9fa48("1684", "1685"), this.dateTo() !== (stryMutAct_9fa48("1686") ? "Stryker was here!" : (stryCov_9fa48("1686"), '')))));
    }
  });
  clearFilters(): void {
    if (stryMutAct_9fa48("1687")) {
      {}
    } else {
      stryCov_9fa48("1687");
      this.statusFilter.set(stryMutAct_9fa48("1688") ? "Stryker was here!" : (stryCov_9fa48("1688"), ''));
      this.typeFilter.set(stryMutAct_9fa48("1689") ? "Stryker was here!" : (stryCov_9fa48("1689"), ''));
      this.clientNameFilter.set(stryMutAct_9fa48("1690") ? "Stryker was here!" : (stryCov_9fa48("1690"), ''));
      this.dateFrom.set(stryMutAct_9fa48("1691") ? "Stryker was here!" : (stryCov_9fa48("1691"), ''));
      this.dateTo.set(stryMutAct_9fa48("1692") ? "Stryker was here!" : (stryCov_9fa48("1692"), ''));
    }
  }
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("1693")) {
      {}
    } else {
      stryCov_9fa48("1693");
      return (event.target as HTMLInputElement).value;
    }
  }
  onDateFromChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("1694")) {
      {}
    } else {
      stryCov_9fa48("1694");
      const date = event.value;
      this.dateFrom.set(date ? toLocalDateString(date) : stryMutAct_9fa48("1695") ? "Stryker was here!" : (stryCov_9fa48("1695"), ''));
    }
  }
  onDateToChange(event: MatDatepickerInputEvent<Date>): void {
    if (stryMutAct_9fa48("1696")) {
      {}
    } else {
      stryCov_9fa48("1696");
      const date = event.value;
      this.dateTo.set(date ? toLocalDateString(date) : stryMutAct_9fa48("1697") ? "Stryker was here!" : (stryCov_9fa48("1697"), ''));
    }
  }
  onPageChange(event: PageEvent): void {
    if (stryMutAct_9fa48("1698")) {
      {}
    } else {
      stryCov_9fa48("1698");
      this.currentPage.set(stryMutAct_9fa48("1699") ? event.pageIndex - 1 : (stryCov_9fa48("1699"), event.pageIndex + 1));
      this.pageSize.set(event.pageSize);
    }
  }
  onSortChange(sort: Sort): void {
    if (stryMutAct_9fa48("1700")) {
      {}
    } else {
      stryCov_9fa48("1700");
      this.sortBy.set(sort.active);
      this.sortOrder.set((sort.direction || 'asc') as 'asc' | 'desc');
    }
  }
  openCreateDialog(): void {
    if (stryMutAct_9fa48("1701")) {
      {}
    } else {
      stryCov_9fa48("1701");
      const dialogRef = this.dialog.open(InvoiceFormComponent, stryMutAct_9fa48("1702") ? {} : (stryCov_9fa48("1702"), {
        width: stryMutAct_9fa48("1703") ? "" : (stryCov_9fa48("1703"), '700px')
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("1704")) {
          {}
        } else {
          stryCov_9fa48("1704");
          if (stryMutAct_9fa48("1706") ? false : stryMutAct_9fa48("1705") ? true : (stryCov_9fa48("1705", "1706"), result)) {
            if (stryMutAct_9fa48("1707")) {
              {}
            } else {
              stryCov_9fa48("1707");
              this.invoicesResource.reload();
              this.router.navigate(stryMutAct_9fa48("1708") ? [] : (stryCov_9fa48("1708"), [stryMutAct_9fa48("1709") ? "" : (stryCov_9fa48("1709"), '/admin/billing'), result.id]));
            }
          }
        }
      });
    }
  }
  goToDetail(invoice: Invoice): void {
    if (stryMutAct_9fa48("1710")) {
      {}
    } else {
      stryCov_9fa48("1710");
      this.router.navigate(stryMutAct_9fa48("1711") ? [] : (stryCov_9fa48("1711"), [stryMutAct_9fa48("1712") ? "" : (stryCov_9fa48("1712"), '/admin/billing'), invoice.id]));
    }
  }
  getInvoiceFields(invoice: Invoice): MobileCardField[] {
    if (stryMutAct_9fa48("1713")) {
      {}
    } else {
      stryCov_9fa48("1713");
      return stryMutAct_9fa48("1714") ? [] : (stryCov_9fa48("1714"), [stryMutAct_9fa48("1715") ? {} : (stryCov_9fa48("1715"), {
        label: this.translationService.instant(stryMutAct_9fa48("1716") ? "" : (stryCov_9fa48("1716"), 'billing.invoiceType')),
        value: invoice.invoiceType
      }), stryMutAct_9fa48("1717") ? {} : (stryCov_9fa48("1717"), {
        label: this.translationService.instant(stryMutAct_9fa48("1718") ? "" : (stryCov_9fa48("1718"), 'billing.clientName')),
        value: stryMutAct_9fa48("1721") ? invoice.clientName && '-' : stryMutAct_9fa48("1720") ? false : stryMutAct_9fa48("1719") ? true : (stryCov_9fa48("1719", "1720", "1721"), invoice.clientName || (stryMutAct_9fa48("1722") ? "" : (stryCov_9fa48("1722"), '-')))
      }), stryMutAct_9fa48("1723") ? {} : (stryCov_9fa48("1723"), {
        label: this.translationService.instant(stryMutAct_9fa48("1724") ? "" : (stryCov_9fa48("1724"), 'billing.total')),
        value: String(invoice.total)
      }), stryMutAct_9fa48("1725") ? {} : (stryCov_9fa48("1725"), {
        label: this.translationService.instant(stryMutAct_9fa48("1726") ? "" : (stryCov_9fa48("1726"), 'billing.createdAt')),
        value: invoice.createdAt,
        type: stryMutAct_9fa48("1727") ? "" : (stryCov_9fa48("1727"), 'date')
      })]);
    }
  }
}