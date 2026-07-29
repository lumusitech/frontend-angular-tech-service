import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { form, FormField, required, email } from '@angular/forms/signals';
import { ClientsService } from '../../core/services/clients.service';
import { Client, CreateClientDto, UpdateClientDto } from '../../core/models/client.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  mode: 'create' | 'edit';
  client?: Client;
}

interface ClientFormModel {
  name: string;
  email: string;
  phone: string;
  address: string;
  cuit: string;
  internetProvider: string;
  internetPlan: string;
  ivaCondition: string;
  isActive: boolean;
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
    FormField,
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
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.name' | translate }}</mat-label>
            <input matInput [formField]="clientForm.name" />
            @if (clientForm.name().invalid() && clientForm.name().touched()) {
              <mat-error>{{ 'validation.required' | translate }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.email' | translate }}</mat-label>
            <input matInput type="email" [formField]="clientForm.email" />
            @if (clientForm.email().invalid() && clientForm.email().touched()) {
              <mat-error>{{ t('validation.invalidEmail') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.phone' | translate }}</mat-label>
            <input matInput [formField]="clientForm.phone" />
            @if (clientForm.phone().invalid() && clientForm.phone().touched()) {
              <mat-error>{{ 'validation.required' | translate }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.cuit' | translate }}</mat-label>
            <input matInput [formField]="clientForm.cuit" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'clients.address' | translate }}</mat-label>
          <input matInput [formField]="clientForm.address" />
          @if (clientForm.address().invalid() && clientForm.address().touched()) {
            <mat-error>{{ 'validation.required' | translate }}</mat-error>
          }
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.internetProvider' | translate }}</mat-label>
            <input matInput [formField]="clientForm.internetProvider" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'clients.internetPlan' | translate }}</mat-label>
            <input matInput [formField]="clientForm.internetPlan" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'clients.ivaCondition' | translate }}</mat-label>
          <mat-select [formField]="clientForm.ivaCondition">
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

        <mat-checkbox [formField]="clientForm.isActive">
          {{ 'clients.activeClient' | translate }}
        </mat-checkbox>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="saving() || clientForm().invalid()">
        {{ saving() ? ('common.saving' | translate) : ('common.save' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ClientFormComponent {
  private readonly dialogRef = inject(MatDialogRef<ClientFormComponent>);
  private readonly clientsService = inject(ClientsService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly model = signal<ClientFormModel>({
    name: this.data.client?.name || '',
    email: this.data.client?.email || '',
    phone: this.data.client?.phone || '',
    address: this.data.client?.address || '',
    cuit: this.data.client?.cuit || '',
    internetProvider: this.data.client?.internetProvider || '',
    internetPlan: this.data.client?.internetPlan || '',
    ivaCondition: this.data.client?.ivaCondition || '',
    isActive: this.data.client?.isActive ?? true,
  });
  readonly clientForm = form(this.model, (p) => {
    required(p.name, { message: 'validation.required' });
    required(p.email, { message: 'validation.required' });
    email(p.email, { message: 'validation.invalidEmail' });
    required(p.phone, { message: 'validation.required' });
    required(p.address, { message: 'validation.required' });
  });
  readonly saving = signal(false);

  t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(): void {
    if (this.clientForm().invalid()) return;

    this.saving.set(true);
    const m = this.model();

    if (this.data.mode === 'create') {
      const dto: CreateClientDto = {
        name: m.name,
        email: m.email,
        phone: m.phone,
        address: m.address,
        cuit: m.cuit || undefined,
        internetProvider: m.internetProvider || undefined,
        internetPlan: m.internetPlan || undefined,
        ivaCondition: (m.ivaCondition as any) || undefined,
        isActive: m.isActive,
      };

      this.clientsService.create(dto).subscribe({
        next: (client) => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.created'), 'success');
          this.dialogRef.close(client);
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Create client failed:', err);
          this.toastService.show(this.t('common.toast.errorCreated'), 'error');
        },
      });
    } else {
      const dto: UpdateClientDto = {
        name: m.name,
        email: m.email,
        phone: m.phone,
        address: m.address,
        cuit: m.cuit || undefined,
        internetProvider: m.internetProvider || undefined,
        internetPlan: m.internetPlan || undefined,
        ivaCondition: (m.ivaCondition as any) || undefined,
        isActive: m.isActive,
      };

      this.clientsService.update(this.data.client!.id, dto).subscribe({
        next: (client) => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.updated'), 'success');
          this.dialogRef.close(client);
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Update client failed:', err);
          this.toastService.show(this.t('common.toast.errorUpdated'), 'error');
        },
      });
    }
  }
}
