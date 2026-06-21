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
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

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
    FormsModule,
    TranslatePipe,
  ],
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
      <form (submit)="onSubmit($event)" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.name' | translate }}</mat-label>
            <input matInput [(ngModel)]="name" [ngModelOptions]="{standalone: true}" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.email' | translate }}</mat-label>
            <input
              matInput
              type="email"
              [value]="email()"
              (input)="email.set(getInputValue($event))"
              required
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.phone' | translate }}</mat-label>
            <input matInput [(ngModel)]="phone" [ngModelOptions]="{standalone: true}" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.cuit' | translate }}</mat-label>
            <input matInput [(ngModel)]="cuit" [ngModelOptions]="{standalone: true}" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'clients.address' | translate }}</mat-label>
          <input
            matInput
            [value]="address()"
            (input)="address.set(getInputValue($event))"
            required
          />
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.internetProvider' | translate }}</mat-label>
            <input
              matInput
              [value]="internetProvider()"
              (input)="internetProvider.set(getInputValue($event))"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.internetPlan' | translate }}</mat-label>
            <input
              matInput
              [value]="internetPlan()"
              (input)="internetPlan.set(getInputValue($event))"
            />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'clients.ivaCondition' | translate }}</mat-label>
          <mat-select [(value)]="ivaCondition">
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

        <mat-checkbox [checked]="isActive()" (change)="isActive.set($event.checked)">
          {{ 'clients.activeClient' | translate }}
        </mat-checkbox>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit($event)" [disabled]="saving()">
        {{ saving() ? ('common.saving' | translate) : ('common.save' | translate) }}
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
