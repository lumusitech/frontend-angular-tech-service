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
  `,
})
export class ClientFormComponent {
  private readonly dialogRef = inject(MatDialogRef<ClientFormComponent>);
  private readonly clientsService = inject(ClientsService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
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

  private t(key: string): string {
    return this.translationService.instant(key);
  }

  onSubmit(event: Event, form: any): void {
    event.preventDefault();
    form.control.markAllAsTouched();
    if (form.invalid) return;

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
