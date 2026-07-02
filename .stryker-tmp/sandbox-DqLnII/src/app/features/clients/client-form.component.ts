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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ClientsService } from '../../core/services/clients.service';
import { Client, CreateClientDto, UpdateClientDto } from '../../core/models/client.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
interface DialogData {
  mode: 'create' | 'edit';
  client?: Client;
}
@Component({
  selector: 'app-client-form',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatIconModule, FormsModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>person</mat-icon>
      {{
        data.mode === 'create'
          ? ('clients.newClient' | translate)
          : ('clients.editClient' | translate)
      }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form #clientForm="ngForm" (submit)="onSubmit($event, clientForm)" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.name' | translate }}</mat-label>
            <input matInput [(ngModel)]="name" name="name" #nameRef="ngModel" required />
            @if (nameRef.invalid && nameRef.touched) {
              <mat-error>{{ 'validation.required' | translate }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.email' | translate }}</mat-label>
            <input matInput type="email" [(ngModel)]="email" name="email" #emailRef="ngModel" required email />
            @if (emailRef.invalid && emailRef.touched) {
              <mat-error>{{ emailRef.hasError('required') ? ('validation.required' | translate) : ('validation.invalidEmail' | translate) }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.phone' | translate }}</mat-label>
            <input matInput [(ngModel)]="phone" name="phone" #phoneRef="ngModel" required />
            @if (phoneRef.invalid && phoneRef.touched) {
              <mat-error>{{ 'validation.required' | translate }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.cuit' | translate }}</mat-label>
            <input matInput [(ngModel)]="cuit" name="cuit" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'clients.address' | translate }}</mat-label>
          <input matInput [(ngModel)]="address" name="address" #addressRef="ngModel" required />
          @if (addressRef.invalid && addressRef.touched) {
            <mat-error>{{ 'validation.required' | translate }}</mat-error>
          }
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.internetProvider' | translate }}</mat-label>
            <input matInput [(ngModel)]="internetProvider" name="internetProvider" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.internetPlan' | translate }}</mat-label>
            <input matInput [(ngModel)]="internetPlan" name="internetPlan" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'clients.ivaCondition' | translate }}</mat-label>
          <mat-select [(ngModel)]="ivaCondition" name="ivaCondition">
            <mat-option value="responsable_inscripto">{{
              'clients.ivaConditions.responsableInscripto' | translate
            }}</mat-option>
            <mat-option value="consumidor_final">{{
              'clients.ivaConditions.consumidorFinal' | translate
            }}</mat-option>
            <mat-option value="monotributo">{{
              'clients.ivaConditions.monotributo' | translate
            }}</mat-option>
            <mat-option value="exento">{{ 'clients.ivaConditions.exento' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-checkbox [(ngModel)]="isActive" name="isActive">
          {{ 'clients.activeClient' | translate }}
        </mat-checkbox>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit($event, clientForm)" [disabled]="saving() || clientForm.invalid">
        {{ saving() ? ('common.saving' | translate) : ('common.save' | translate) }}
      </button>
    </mat-dialog-actions>
  `
})
export class ClientFormComponent {
  private readonly dialogRef = inject(MatDialogRef<ClientFormComponent>);
  private readonly clientsService = inject(ClientsService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly name = signal(stryMutAct_9fa48("1797") ? this.data.client?.name && '' : stryMutAct_9fa48("1796") ? false : stryMutAct_9fa48("1795") ? true : (stryCov_9fa48("1795", "1796", "1797"), (stryMutAct_9fa48("1798") ? this.data.client.name : (stryCov_9fa48("1798"), this.data.client?.name)) || (stryMutAct_9fa48("1799") ? "Stryker was here!" : (stryCov_9fa48("1799"), ''))));
  readonly email = signal(stryMutAct_9fa48("1802") ? this.data.client?.email && '' : stryMutAct_9fa48("1801") ? false : stryMutAct_9fa48("1800") ? true : (stryCov_9fa48("1800", "1801", "1802"), (stryMutAct_9fa48("1803") ? this.data.client.email : (stryCov_9fa48("1803"), this.data.client?.email)) || (stryMutAct_9fa48("1804") ? "Stryker was here!" : (stryCov_9fa48("1804"), ''))));
  readonly phone = signal(stryMutAct_9fa48("1807") ? this.data.client?.phone && '' : stryMutAct_9fa48("1806") ? false : stryMutAct_9fa48("1805") ? true : (stryCov_9fa48("1805", "1806", "1807"), (stryMutAct_9fa48("1808") ? this.data.client.phone : (stryCov_9fa48("1808"), this.data.client?.phone)) || (stryMutAct_9fa48("1809") ? "Stryker was here!" : (stryCov_9fa48("1809"), ''))));
  readonly address = signal(stryMutAct_9fa48("1812") ? this.data.client?.address && '' : stryMutAct_9fa48("1811") ? false : stryMutAct_9fa48("1810") ? true : (stryCov_9fa48("1810", "1811", "1812"), (stryMutAct_9fa48("1813") ? this.data.client.address : (stryCov_9fa48("1813"), this.data.client?.address)) || (stryMutAct_9fa48("1814") ? "Stryker was here!" : (stryCov_9fa48("1814"), ''))));
  readonly cuit = signal(stryMutAct_9fa48("1817") ? this.data.client?.cuit && '' : stryMutAct_9fa48("1816") ? false : stryMutAct_9fa48("1815") ? true : (stryCov_9fa48("1815", "1816", "1817"), (stryMutAct_9fa48("1818") ? this.data.client.cuit : (stryCov_9fa48("1818"), this.data.client?.cuit)) || (stryMutAct_9fa48("1819") ? "Stryker was here!" : (stryCov_9fa48("1819"), ''))));
  readonly internetProvider = signal(stryMutAct_9fa48("1822") ? this.data.client?.internetProvider && '' : stryMutAct_9fa48("1821") ? false : stryMutAct_9fa48("1820") ? true : (stryCov_9fa48("1820", "1821", "1822"), (stryMutAct_9fa48("1823") ? this.data.client.internetProvider : (stryCov_9fa48("1823"), this.data.client?.internetProvider)) || (stryMutAct_9fa48("1824") ? "Stryker was here!" : (stryCov_9fa48("1824"), ''))));
  readonly internetPlan = signal(stryMutAct_9fa48("1827") ? this.data.client?.internetPlan && '' : stryMutAct_9fa48("1826") ? false : stryMutAct_9fa48("1825") ? true : (stryCov_9fa48("1825", "1826", "1827"), (stryMutAct_9fa48("1828") ? this.data.client.internetPlan : (stryCov_9fa48("1828"), this.data.client?.internetPlan)) || (stryMutAct_9fa48("1829") ? "Stryker was here!" : (stryCov_9fa48("1829"), ''))));
  readonly ivaCondition = signal(stryMutAct_9fa48("1832") ? this.data.client?.ivaCondition && '' : stryMutAct_9fa48("1831") ? false : stryMutAct_9fa48("1830") ? true : (stryCov_9fa48("1830", "1831", "1832"), (stryMutAct_9fa48("1833") ? this.data.client.ivaCondition : (stryCov_9fa48("1833"), this.data.client?.ivaCondition)) || (stryMutAct_9fa48("1834") ? "Stryker was here!" : (stryCov_9fa48("1834"), ''))));
  readonly isActive = signal(stryMutAct_9fa48("1835") ? this.data.client?.isActive && true : (stryCov_9fa48("1835"), (stryMutAct_9fa48("1836") ? this.data.client.isActive : (stryCov_9fa48("1836"), this.data.client?.isActive)) ?? (stryMutAct_9fa48("1837") ? false : (stryCov_9fa48("1837"), true))));
  readonly saving = signal(stryMutAct_9fa48("1838") ? true : (stryCov_9fa48("1838"), false));
  private t(key: string): string {
    if (stryMutAct_9fa48("1839")) {
      {}
    } else {
      stryCov_9fa48("1839");
      return this.translationService.instant(key);
    }
  }
  onSubmit(event: Event, form: any): void {
    if (stryMutAct_9fa48("1840")) {
      {}
    } else {
      stryCov_9fa48("1840");
      event.preventDefault();
      form.control.markAllAsTouched();
      if (stryMutAct_9fa48("1842") ? false : stryMutAct_9fa48("1841") ? true : (stryCov_9fa48("1841", "1842"), form.invalid)) return;
      this.saving.set(stryMutAct_9fa48("1843") ? false : (stryCov_9fa48("1843"), true));
      if (stryMutAct_9fa48("1846") ? this.data.mode !== 'create' : stryMutAct_9fa48("1845") ? false : stryMutAct_9fa48("1844") ? true : (stryCov_9fa48("1844", "1845", "1846"), this.data.mode === (stryMutAct_9fa48("1847") ? "" : (stryCov_9fa48("1847"), 'create')))) {
        if (stryMutAct_9fa48("1848")) {
          {}
        } else {
          stryCov_9fa48("1848");
          const dto: CreateClientDto = stryMutAct_9fa48("1849") ? {} : (stryCov_9fa48("1849"), {
            name: this.name(),
            email: this.email(),
            phone: this.phone(),
            address: this.address(),
            cuit: stryMutAct_9fa48("1852") ? this.cuit() && undefined : stryMutAct_9fa48("1851") ? false : stryMutAct_9fa48("1850") ? true : (stryCov_9fa48("1850", "1851", "1852"), this.cuit() || undefined),
            internetProvider: stryMutAct_9fa48("1855") ? this.internetProvider() && undefined : stryMutAct_9fa48("1854") ? false : stryMutAct_9fa48("1853") ? true : (stryCov_9fa48("1853", "1854", "1855"), this.internetProvider() || undefined),
            internetPlan: stryMutAct_9fa48("1858") ? this.internetPlan() && undefined : stryMutAct_9fa48("1857") ? false : stryMutAct_9fa48("1856") ? true : (stryCov_9fa48("1856", "1857", "1858"), this.internetPlan() || undefined),
            ivaCondition: stryMutAct_9fa48("1861") ? this.ivaCondition() as any && undefined : stryMutAct_9fa48("1860") ? false : stryMutAct_9fa48("1859") ? true : (stryCov_9fa48("1859", "1860", "1861"), this.ivaCondition() as any || undefined),
            isActive: this.isActive()
          });
          this.clientsService.create(dto).subscribe(stryMutAct_9fa48("1862") ? {} : (stryCov_9fa48("1862"), {
            next: client => {
              if (stryMutAct_9fa48("1863")) {
                {}
              } else {
                stryCov_9fa48("1863");
                this.saving.set(stryMutAct_9fa48("1864") ? true : (stryCov_9fa48("1864"), false));
                this.toastService.show(this.t(stryMutAct_9fa48("1865") ? "" : (stryCov_9fa48("1865"), 'common.toast.created')), stryMutAct_9fa48("1866") ? "" : (stryCov_9fa48("1866"), 'success'));
                this.dialogRef.close(client);
              }
            },
            error: err => {
              if (stryMutAct_9fa48("1867")) {
                {}
              } else {
                stryCov_9fa48("1867");
                this.saving.set(stryMutAct_9fa48("1868") ? true : (stryCov_9fa48("1868"), false));
                console.error(stryMutAct_9fa48("1869") ? "" : (stryCov_9fa48("1869"), 'Create client failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("1870") ? "" : (stryCov_9fa48("1870"), 'common.toast.errorCreated')), stryMutAct_9fa48("1871") ? "" : (stryCov_9fa48("1871"), 'error'));
              }
            }
          }));
        }
      } else {
        if (stryMutAct_9fa48("1872")) {
          {}
        } else {
          stryCov_9fa48("1872");
          const dto: UpdateClientDto = stryMutAct_9fa48("1873") ? {} : (stryCov_9fa48("1873"), {
            name: this.name(),
            email: this.email(),
            phone: this.phone(),
            address: this.address(),
            cuit: stryMutAct_9fa48("1876") ? this.cuit() && undefined : stryMutAct_9fa48("1875") ? false : stryMutAct_9fa48("1874") ? true : (stryCov_9fa48("1874", "1875", "1876"), this.cuit() || undefined),
            internetProvider: stryMutAct_9fa48("1879") ? this.internetProvider() && undefined : stryMutAct_9fa48("1878") ? false : stryMutAct_9fa48("1877") ? true : (stryCov_9fa48("1877", "1878", "1879"), this.internetProvider() || undefined),
            internetPlan: stryMutAct_9fa48("1882") ? this.internetPlan() && undefined : stryMutAct_9fa48("1881") ? false : stryMutAct_9fa48("1880") ? true : (stryCov_9fa48("1880", "1881", "1882"), this.internetPlan() || undefined),
            ivaCondition: stryMutAct_9fa48("1885") ? this.ivaCondition() as any && undefined : stryMutAct_9fa48("1884") ? false : stryMutAct_9fa48("1883") ? true : (stryCov_9fa48("1883", "1884", "1885"), this.ivaCondition() as any || undefined),
            isActive: this.isActive()
          });
          this.clientsService.update(this.data.client!.id, dto).subscribe(stryMutAct_9fa48("1886") ? {} : (stryCov_9fa48("1886"), {
            next: client => {
              if (stryMutAct_9fa48("1887")) {
                {}
              } else {
                stryCov_9fa48("1887");
                this.saving.set(stryMutAct_9fa48("1888") ? true : (stryCov_9fa48("1888"), false));
                this.toastService.show(this.t(stryMutAct_9fa48("1889") ? "" : (stryCov_9fa48("1889"), 'common.toast.updated')), stryMutAct_9fa48("1890") ? "" : (stryCov_9fa48("1890"), 'success'));
                this.dialogRef.close(client);
              }
            },
            error: err => {
              if (stryMutAct_9fa48("1891")) {
                {}
              } else {
                stryCov_9fa48("1891");
                this.saving.set(stryMutAct_9fa48("1892") ? true : (stryCov_9fa48("1892"), false));
                console.error(stryMutAct_9fa48("1893") ? "" : (stryCov_9fa48("1893"), 'Update client failed:'), err);
                this.toastService.show(this.t(stryMutAct_9fa48("1894") ? "" : (stryCov_9fa48("1894"), 'common.toast.errorUpdated')), stryMutAct_9fa48("1895") ? "" : (stryCov_9fa48("1895"), 'error'));
              }
            }
          }));
        }
      }
    }
  }
}