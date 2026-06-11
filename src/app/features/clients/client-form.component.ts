import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ClientsService } from '../../core/services/clients.service';
import { Client, CreateClientDto, UpdateClientDto } from '../../core/models/client.interfaces';

interface DialogData {
  mode: 'create' | 'edit';
  client?: Client;
}

@Component({
  selector: 'app-client-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>person</mat-icon>
      {{ data.mode === 'create' ? 'Nuevo Cliente' : 'Editar Cliente' }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Nombre</mat-label>
            <input matInput [value]="name()" (input)="name.set(getInputValue($event))" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Email</mat-label>
            <input
              matInput
              type="email"
              [value]="email()"
              (input)="email.set(getInputValue($event))"
              required
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Teléfono</mat-label>
            <input matInput [value]="phone()" (input)="phone.set(getInputValue($event))" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>CUIT</mat-label>
            <input matInput [value]="cuit()" (input)="cuit.set(getInputValue($event))" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Dirección</mat-label>
          <input
            matInput
            [value]="address()"
            (input)="address.set(getInputValue($event))"
            required
          />
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Proveedor de Internet</mat-label>
            <input
              matInput
              [value]="internetProvider()"
              (input)="internetProvider.set(getInputValue($event))"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Plan de Internet</mat-label>
            <input
              matInput
              [value]="internetPlan()"
              (input)="internetPlan.set(getInputValue($event))"
            />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Condición IVA</mat-label>
          <mat-select [value]="ivaCondition()" (selectionChange)="ivaCondition.set($event.value)">
            <mat-option value="responsable_inscripto">Responsable Inscripto</mat-option>
            <mat-option value="consumidor_final">Consumidor Final</mat-option>
            <mat-option value="monotributo">Monotributo</mat-option>
            <mat-option value="exento">Exento</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-checkbox [checked]="isActive()" (change)="isActive.set($event.checked)">
          Cliente activo
        </mat-checkbox>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="onSubmit($event)" [disabled]="saving()">
        {{ saving() ? 'Guardando...' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ClientFormComponent {
  private readonly dialogRef = inject(MatDialogRef<ClientFormComponent>);
  private readonly clientsService = inject(ClientsService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly name = signal(this.data.client?.name || '');
  readonly email = signal(this.data.client?.email || '');
  readonly phone = signal(this.data.client?.phone || '');
  readonly address = signal(this.data.client?.address || '');
  readonly cuit = signal(this.data.client?.cuit || '');
  readonly internetProvider = signal(this.data.client?.internetProvider || '');
  readonly internetPlan = signal(this.data.client?.internetPlan || '');
  readonly ivaCondition = signal(this.data.client?.ivaCondition || '');
  readonly isActive = signal(this.data.client?.isActive ?? true);
  readonly saving = signal(false);

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.saving.set(true);

    if (this.data.mode === 'create') {
      const dto: CreateClientDto = {
        name: this.name(),
        email: this.email(),
        phone: this.phone(),
        address: this.address(),
        cuit: this.cuit() || undefined,
        internetProvider: this.internetProvider() || undefined,
        internetPlan: this.internetPlan() || undefined,
        ivaCondition: (this.ivaCondition() as any) || undefined,
        isActive: this.isActive(),
      };

      this.clientsService.create(dto).subscribe({
        next: (client) => {
          this.saving.set(false);
          this.dialogRef.close(client);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    } else {
      const dto: UpdateClientDto = {
        name: this.name(),
        email: this.email(),
        phone: this.phone(),
        address: this.address(),
        cuit: this.cuit() || undefined,
        internetProvider: this.internetProvider() || undefined,
        internetPlan: this.internetPlan() || undefined,
        ivaCondition: (this.ivaCondition() as any) || undefined,
        isActive: this.isActive(),
      };

      this.clientsService.update(this.data.client!.id, dto).subscribe({
        next: (client) => {
          this.saving.set(false);
          this.dialogRef.close(client);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    }
  }
}
