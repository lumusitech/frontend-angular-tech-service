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
import { Component, inject, signal, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm } from '@angular/forms';
import { BillingService } from '../../core/services/billing.service';
import { CreateInvoiceDto } from '../../core/models/api.interfaces';
import { Client, PaginatedResponse } from '../../core/models/client.interfaces';
import { WorkOrder } from '../../core/models/work-order.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
@Component({
  selector: 'app-invoice-form',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, FormsModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>receipt</mat-icon>
      {{ 'billing.newInvoice' | translate }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form #formRef="ngForm" (submit)="onSubmit($event, formRef)" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.invoiceType' | translate }}</mat-label>
            <mat-select [(ngModel)]="invoiceType" name="invoiceType">
              <mat-option value="A">{{ 'billing.types.A' | translate }}</mat-option>
              <mat-option value="B">{{ 'billing.types.B' | translate }}</mat-option>
              <mat-option value="C">{{ 'billing.types.C' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.concept' | translate }}</mat-label>
            <mat-select [(ngModel)]="concept" name="concept">
              <mat-option value="services">{{ 'billing.concepts.services' | translate }}</mat-option>
              <mat-option value="products">{{ 'billing.concepts.products' | translate }}</mat-option>
              <mat-option value="both">{{ 'billing.concepts.both' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="relative">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.clientName' | translate }}</mat-label>
            <input
              matInput
              [(ngModel)]="clientName"
              name="clientName"
              #clientNameRef="ngModel"
              (input)="onClientSearch(clientName)"
              (focus)="showClientDropdown.set(true)"
              (blur)="hideClientDropdown()"
              required
            />
            @if (clientNameRef.invalid && clientNameRef.touched) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>
          @if (showClientDropdown() && filteredClients().length > 0) {
            <div class="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              @for (client of filteredClients(); track client.id) {
                <button
                  type="button"
                  class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  (mousedown)="selectClient(client)"
                >
                  <span class="font-medium">{{ client.name }}</span>
                  <span class="text-gray-500 text-sm ml-2">{{ client.email }}</span>
                </button>
              }
            </div>
          }
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.clientCuit' | translate }}</mat-label>
            <input
              matInput
              [(ngModel)]="clientCuit"
              name="clientCuit"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.clientIvaCondition' | translate }}</mat-label>
            <mat-select [(ngModel)]="clientIvaCondition" name="clientIvaCondition">
              <mat-option value="consumidor_final">{{ 'billing.ivaConditions.consumidorFinal' | translate }}</mat-option>
              <mat-option value="responsable_inscripto">{{ 'billing.ivaConditions.responsableInscripto' | translate }}</mat-option>
              <mat-option value="monotributo">{{ 'billing.ivaConditions.monotributo' | translate }}</mat-option>
              <mat-option value="exento">{{ 'billing.ivaConditions.exento' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'billing.clientAddress' | translate }}</mat-label>
          <input
            matInput
            [(ngModel)]="clientAddress"
            name="clientAddress"
            required
          />
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.subtotal' | translate }}</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="subtotal"
              name="subtotal"
              #subtotalRef="ngModel"
              min="0.01"
              step="0.01"
              required
            />
            @if (subtotalRef.invalid && subtotalRef.touched) {
              <mat-error>{{ t('validation.invalidAmount') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.ivaAmount' | translate }}</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="ivaAmount"
              name="ivaAmount"
              min="0"
              step="0.01"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.total' | translate }}</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="total"
              name="total"
              #totalRef="ngModel"
              min="0.01"
              step="0.01"
              required
            />
            @if (totalRef.invalid && totalRef.touched) {
              <mat-error>{{ t('validation.invalidAmount') }}</mat-error>
            }
          </mat-form-field>
        </div>

        <div class="relative">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.workOrder' | translate }}</mat-label>
            <input
              matInput
              [(ngModel)]="workOrderDisplay"
              name="workOrderDisplay"
              #workOrderDisplayRef="ngModel"
              (input)="onWorkOrderSearch(workOrderDisplay)"
              (focus)="showWorkOrderDropdown.set(true)"
              (blur)="hideWorkOrderDropdown()"
              required
            />
            @if (selectedWorkOrderId.length === 0 && workOrderDisplayRef.touched) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>
          @if (showWorkOrderDropdown() && filteredWorkOrders().length > 0) {
            <div class="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              @for (wo of filteredWorkOrders(); track wo.id) {
                <button
                  type="button"
                  class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  (mousedown)="selectWorkOrder(wo)"
                >
                  <span class="font-mono text-sm">{{ wo.trackingCode }}</span>
                  — {{ wo.client?.name ?? '' }}
                  @if (wo.serviceType) {
                    <span class="text-gray-500">({{ wo.serviceType.name }})</span>
                  }
                </button>
              }
            </div>
          }
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit($event, formRef)"
        [disabled]="saving() || formRef.invalid"
      >
        {{ saving() ? ('common.saving' | translate) : ('common.save' | translate) }}
      </button>
    </mat-dialog-actions>
  `
})
export class InvoiceFormComponent {
  private readonly dialogRef = inject(MatDialogRef<InvoiceFormComponent>);
  private readonly billingService = inject(BillingService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly data = inject<Record<string, never>>(MAT_DIALOG_DATA);
  invoiceType = stryMutAct_9fa48("1530") ? "" : (stryCov_9fa48("1530"), 'B');
  concept = stryMutAct_9fa48("1531") ? "" : (stryCov_9fa48("1531"), 'services');
  clientName = stryMutAct_9fa48("1532") ? "Stryker was here!" : (stryCov_9fa48("1532"), '');
  clientCuit = stryMutAct_9fa48("1533") ? "Stryker was here!" : (stryCov_9fa48("1533"), '');
  clientAddress = stryMutAct_9fa48("1534") ? "Stryker was here!" : (stryCov_9fa48("1534"), '');
  clientIvaCondition: 'consumidor_final' | 'responsable_inscripto' | 'monotributo' | 'exento' = stryMutAct_9fa48("1535") ? "" : (stryCov_9fa48("1535"), 'consumidor_final');
  subtotal = stryMutAct_9fa48("1536") ? "Stryker was here!" : (stryCov_9fa48("1536"), '');
  ivaAmount = stryMutAct_9fa48("1537") ? "Stryker was here!" : (stryCov_9fa48("1537"), '');
  total = stryMutAct_9fa48("1538") ? "Stryker was here!" : (stryCov_9fa48("1538"), '');
  selectedClientId = stryMutAct_9fa48("1539") ? "Stryker was here!" : (stryCov_9fa48("1539"), '');
  selectedWorkOrderId = stryMutAct_9fa48("1540") ? "Stryker was here!" : (stryCov_9fa48("1540"), '');
  workOrderDisplay = stryMutAct_9fa48("1541") ? "Stryker was here!" : (stryCov_9fa48("1541"), '');
  readonly saving = signal(stryMutAct_9fa48("1542") ? true : (stryCov_9fa48("1542"), false));
  readonly showClientDropdown = signal(stryMutAct_9fa48("1543") ? true : (stryCov_9fa48("1543"), false));
  readonly showWorkOrderDropdown = signal(stryMutAct_9fa48("1544") ? true : (stryCov_9fa48("1544"), false));
  t(key: string): string {
    if (stryMutAct_9fa48("1545")) {
      {}
    } else {
      stryCov_9fa48("1545");
      return this.translationService.instant(key);
    }
  }
  private clientSearch = signal(stryMutAct_9fa48("1546") ? "Stryker was here!" : (stryCov_9fa48("1546"), ''));
  private workOrderSearch = signal(stryMutAct_9fa48("1547") ? "Stryker was here!" : (stryCov_9fa48("1547"), ''));
  readonly clientsResource = httpResource<PaginatedResponse<Client>>(() => {
    if (stryMutAct_9fa48("1548")) {
      {}
    } else {
      stryCov_9fa48("1548");
      const term = this.clientSearch();
      if (stryMutAct_9fa48("1551") ? !term && term.length < 2 : stryMutAct_9fa48("1550") ? false : stryMutAct_9fa48("1549") ? true : (stryCov_9fa48("1549", "1550", "1551"), (stryMutAct_9fa48("1552") ? term : (stryCov_9fa48("1552"), !term)) || (stryMutAct_9fa48("1555") ? term.length >= 2 : stryMutAct_9fa48("1554") ? term.length <= 2 : stryMutAct_9fa48("1553") ? false : (stryCov_9fa48("1553", "1554", "1555"), term.length < 2)))) return undefined;
      return stryMutAct_9fa48("1556") ? {} : (stryCov_9fa48("1556"), {
        url: stryMutAct_9fa48("1557") ? "" : (stryCov_9fa48("1557"), '/api/clients'),
        params: stryMutAct_9fa48("1558") ? {} : (stryCov_9fa48("1558"), {
          search: term,
          limit: stryMutAct_9fa48("1559") ? "" : (stryCov_9fa48("1559"), '5')
        })
      });
    }
  });
  readonly workOrdersResource = httpResource<PaginatedResponse<WorkOrder>>(() => {
    if (stryMutAct_9fa48("1560")) {
      {}
    } else {
      stryCov_9fa48("1560");
      const term = this.workOrderSearch();
      if (stryMutAct_9fa48("1563") ? !term && term.length < 2 : stryMutAct_9fa48("1562") ? false : stryMutAct_9fa48("1561") ? true : (stryCov_9fa48("1561", "1562", "1563"), (stryMutAct_9fa48("1564") ? term : (stryCov_9fa48("1564"), !term)) || (stryMutAct_9fa48("1567") ? term.length >= 2 : stryMutAct_9fa48("1566") ? term.length <= 2 : stryMutAct_9fa48("1565") ? false : (stryCov_9fa48("1565", "1566", "1567"), term.length < 2)))) return undefined;
      return stryMutAct_9fa48("1568") ? {} : (stryCov_9fa48("1568"), {
        url: stryMutAct_9fa48("1569") ? "" : (stryCov_9fa48("1569"), '/api/work-orders'),
        params: stryMutAct_9fa48("1570") ? {} : (stryCov_9fa48("1570"), {
          search: term,
          limit: stryMutAct_9fa48("1571") ? "" : (stryCov_9fa48("1571"), '10')
        })
      });
    }
  });
  readonly filteredClients = computed(() => {
    if (stryMutAct_9fa48("1572")) {
      {}
    } else {
      stryCov_9fa48("1572");
      if (stryMutAct_9fa48("1574") ? false : stryMutAct_9fa48("1573") ? true : (stryCov_9fa48("1573", "1574"), this.clientsResource.hasValue())) {
        if (stryMutAct_9fa48("1575")) {
          {}
        } else {
          stryCov_9fa48("1575");
          return this.clientsResource.value().data;
        }
      }
      return stryMutAct_9fa48("1576") ? ["Stryker was here"] : (stryCov_9fa48("1576"), []);
    }
  });
  readonly filteredWorkOrders = computed(() => {
    if (stryMutAct_9fa48("1577")) {
      {}
    } else {
      stryCov_9fa48("1577");
      if (stryMutAct_9fa48("1579") ? false : stryMutAct_9fa48("1578") ? true : (stryCov_9fa48("1578", "1579"), this.workOrdersResource.hasValue())) {
        if (stryMutAct_9fa48("1580")) {
          {}
        } else {
          stryCov_9fa48("1580");
          return this.workOrdersResource.value().data;
        }
      }
      return stryMutAct_9fa48("1581") ? ["Stryker was here"] : (stryCov_9fa48("1581"), []);
    }
  });
  private clientSearchTimer: ReturnType<typeof setTimeout> | null = null;
  private workOrderSearchTimer: ReturnType<typeof setTimeout> | null = null;
  onClientSearch(value: string): void {
    if (stryMutAct_9fa48("1582")) {
      {}
    } else {
      stryCov_9fa48("1582");
      this.showClientDropdown.set(stryMutAct_9fa48("1583") ? false : (stryCov_9fa48("1583"), true));
      if (stryMutAct_9fa48("1585") ? false : stryMutAct_9fa48("1584") ? true : (stryCov_9fa48("1584", "1585"), this.clientSearchTimer)) clearTimeout(this.clientSearchTimer);
      this.clientSearchTimer = setTimeout(() => {
        if (stryMutAct_9fa48("1586")) {
          {}
        } else {
          stryCov_9fa48("1586");
          this.clientSearch.set(value);
        }
      }, 300);
    }
  }
  hideClientDropdown(): void {
    if (stryMutAct_9fa48("1587")) {
      {}
    } else {
      stryCov_9fa48("1587");
      setTimeout(stryMutAct_9fa48("1588") ? () => undefined : (stryCov_9fa48("1588"), () => this.showClientDropdown.set(stryMutAct_9fa48("1589") ? true : (stryCov_9fa48("1589"), false))), 200);
    }
  }
  selectClient(client: Client): void {
    if (stryMutAct_9fa48("1590")) {
      {}
    } else {
      stryCov_9fa48("1590");
      this.selectedClientId = client.id;
      this.clientName = client.name;
      this.clientCuit = stryMutAct_9fa48("1591") ? client.cuit && '' : (stryCov_9fa48("1591"), client.cuit ?? (stryMutAct_9fa48("1592") ? "Stryker was here!" : (stryCov_9fa48("1592"), '')));
      this.clientAddress = stryMutAct_9fa48("1593") ? client.address && '' : (stryCov_9fa48("1593"), client.address ?? (stryMutAct_9fa48("1594") ? "Stryker was here!" : (stryCov_9fa48("1594"), '')));
      if (stryMutAct_9fa48("1596") ? false : stryMutAct_9fa48("1595") ? true : (stryCov_9fa48("1595", "1596"), client.ivaCondition)) {
        if (stryMutAct_9fa48("1597")) {
          {}
        } else {
          stryCov_9fa48("1597");
          this.clientIvaCondition = client.ivaCondition;
        }
      }
      this.showClientDropdown.set(stryMutAct_9fa48("1598") ? true : (stryCov_9fa48("1598"), false));
    }
  }
  onWorkOrderSearch(value: string): void {
    if (stryMutAct_9fa48("1599")) {
      {}
    } else {
      stryCov_9fa48("1599");
      this.showWorkOrderDropdown.set(stryMutAct_9fa48("1600") ? false : (stryCov_9fa48("1600"), true));
      if (stryMutAct_9fa48("1602") ? false : stryMutAct_9fa48("1601") ? true : (stryCov_9fa48("1601", "1602"), this.workOrderSearchTimer)) clearTimeout(this.workOrderSearchTimer);
      this.workOrderSearchTimer = setTimeout(() => {
        if (stryMutAct_9fa48("1603")) {
          {}
        } else {
          stryCov_9fa48("1603");
          this.workOrderSearch.set(value);
        }
      }, 300);
    }
  }
  hideWorkOrderDropdown(): void {
    if (stryMutAct_9fa48("1604")) {
      {}
    } else {
      stryCov_9fa48("1604");
      setTimeout(stryMutAct_9fa48("1605") ? () => undefined : (stryCov_9fa48("1605"), () => this.showWorkOrderDropdown.set(stryMutAct_9fa48("1606") ? true : (stryCov_9fa48("1606"), false))), 200);
    }
  }
  selectWorkOrder(wo: WorkOrder): void {
    if (stryMutAct_9fa48("1607")) {
      {}
    } else {
      stryCov_9fa48("1607");
      this.selectedWorkOrderId = wo.id;
      this.workOrderDisplay = wo.trackingCode;
      this.showWorkOrderDropdown.set(stryMutAct_9fa48("1608") ? true : (stryCov_9fa48("1608"), false));
    }
  }
  onSubmit(event: Event, form: NgForm): void {
    if (stryMutAct_9fa48("1609")) {
      {}
    } else {
      stryCov_9fa48("1609");
      event.preventDefault();
      form.control.markAllAsTouched();
      if (stryMutAct_9fa48("1611") ? false : stryMutAct_9fa48("1610") ? true : (stryCov_9fa48("1610", "1611"), form.invalid)) return;
      this.saving.set(stryMutAct_9fa48("1612") ? false : (stryCov_9fa48("1612"), true));
      const dto: CreateInvoiceDto = stryMutAct_9fa48("1613") ? {} : (stryCov_9fa48("1613"), {
        invoiceType: this.invoiceType as 'A' | 'B' | 'C',
        concept: this.concept as 'products' | 'services' | 'both',
        clientName: this.clientName,
        clientCuit: stryMutAct_9fa48("1616") ? this.clientCuit && undefined : stryMutAct_9fa48("1615") ? false : stryMutAct_9fa48("1614") ? true : (stryCov_9fa48("1614", "1615", "1616"), this.clientCuit || undefined),
        clientAddress: this.clientAddress,
        clientIvaCondition: this.clientIvaCondition,
        subtotal: stryMutAct_9fa48("1619") ? parseFloat(this.subtotal) && 0 : stryMutAct_9fa48("1618") ? false : stryMutAct_9fa48("1617") ? true : (stryCov_9fa48("1617", "1618", "1619"), parseFloat(this.subtotal) || 0),
        ivaAmount: stryMutAct_9fa48("1622") ? parseFloat(this.ivaAmount) && 0 : stryMutAct_9fa48("1621") ? false : stryMutAct_9fa48("1620") ? true : (stryCov_9fa48("1620", "1621", "1622"), parseFloat(this.ivaAmount) || 0),
        total: stryMutAct_9fa48("1625") ? parseFloat(this.total) && 0 : stryMutAct_9fa48("1624") ? false : stryMutAct_9fa48("1623") ? true : (stryCov_9fa48("1623", "1624", "1625"), parseFloat(this.total) || 0),
        workOrderId: this.selectedWorkOrderId
      });
      this.billingService.create(dto).subscribe(stryMutAct_9fa48("1626") ? {} : (stryCov_9fa48("1626"), {
        next: invoice => {
          if (stryMutAct_9fa48("1627")) {
            {}
          } else {
            stryCov_9fa48("1627");
            this.saving.set(stryMutAct_9fa48("1628") ? true : (stryCov_9fa48("1628"), false));
            this.toastService.show(this.t(stryMutAct_9fa48("1629") ? "" : (stryCov_9fa48("1629"), 'common.toast.created')), stryMutAct_9fa48("1630") ? "" : (stryCov_9fa48("1630"), 'success'));
            this.dialogRef.close(invoice);
          }
        },
        error: err => {
          if (stryMutAct_9fa48("1631")) {
            {}
          } else {
            stryCov_9fa48("1631");
            this.saving.set(stryMutAct_9fa48("1632") ? true : (stryCov_9fa48("1632"), false));
            console.error(stryMutAct_9fa48("1633") ? "" : (stryCov_9fa48("1633"), 'Create invoice failed:'), err);
            this.toastService.show(this.t(stryMutAct_9fa48("1634") ? "" : (stryCov_9fa48("1634"), 'common.toast.errorCreated')), stryMutAct_9fa48("1635") ? "" : (stryCov_9fa48("1635"), 'error'));
          }
        }
      }));
    }
  }
}