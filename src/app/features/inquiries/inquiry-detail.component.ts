import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { InquiriesService } from '../../core/services/inquiries.service';
import {
  Inquiry,
  InquiryStatus,
  InquiryDecision,
} from '../../core/models/inquiry.interfaces';
import { ApiResponse } from '../../core/models/api-response.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { InquiryContactFormComponent } from './inquiry-contact-form.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

const STATUS_LABELS: Record<string, string> = {
  new: 'Nueva',
  contacted: 'Contactada',
  reviewed: 'Revisada',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  converted: 'Convertida',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
  contacted: 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
  reviewed: 'text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
  approved: 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
  rejected: 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
  converted: 'text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-700',
};

const SOURCE_LABELS: Record<string, string> = {
  phone: 'Teléfono',
  whatsapp: 'WhatsApp',
  email: 'Email',
  walk_in: 'Presencial',
  social_media: 'Redes sociales',
  referral: 'Referido',
};

const RECOMMENDATION_LABELS: Record<string, string> = {
  repair: 'Reparación',
  replacement: 'Reemplazo',
  maintenance: 'Mantenimiento',
  inspection: 'Inspección',
  no_action: 'Sin acción',
};

@Component({
  selector: 'app-inquiry-detail',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    ErrorStateComponent,
    DatePipe,
    DecimalPipe,
    TranslatePipe,
  ],
  template: `
    @if (resource.status() === 'loading' && !resource.hasValue()) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="48" />
      </div>
    } @else if (resource.error()) {
      <app-error-state (retry)="resource.reload()" />
    } @else if (resource.hasValue()) {
      @let inquiry = resource.value();

      <div class="space-y-6">
        <app-page-header
          [title]="'Consulta de ' + inquiry.clientName"
          [subtitle]="'Detalle de la consulta'"
        >
          <button mat-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Volver
          </button>
        </app-page-header>

        <!-- Workflow actions -->
        <div class="flex gap-2 flex-wrap">
          @if (inquiry.status === 'new') {
            <button mat-flat-button color="primary" (click)="openContactForm()">
              <mat-icon>phone</mat-icon>
              Contactar cliente
            </button>
          }
          @if (inquiry.status === 'contacted') {
            <button mat-flat-button color="accent" (click)="review('approved')">
              <mat-icon>check_circle</mat-icon>
              Aprobar
            </button>
            <button mat-flat-button color="warn" (click)="review('rejected')">
              <mat-icon>cancel</mat-icon>
              Rechazar
            </button>
          }
          @if (inquiry.status === 'reviewed' && inquiry.adminDecision === 'approved') {
            <button mat-flat-button color="primary" (click)="convertToWorkOrder()">
              <mat-icon>construction</mat-icon>
              Convertir en orden de trabajo
            </button>
          }
        </div>

        <!-- Status badge -->
        <div class="flex items-center gap-3">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            [class]="getStatusColor(inquiry.status)"
          >
            {{ getStatusLabel(inquiry.status) }}
          </span>
          @if (inquiry.adminDecision !== 'pending') {
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              [class]="inquiry.adminDecision === 'approved' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'"
            >
              {{ inquiry.adminDecision === 'approved' ? 'Aprobada' : 'Rechazada' }}
            </span>
          }
        </div>

        <!-- Client info card -->
        <mat-card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            <mat-icon class="mr-1 align-middle">person</mat-icon>
            Datos del cliente
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Nombre</span>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.clientName }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Teléfono</span>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.clientPhone || '-' }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Email</span>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.clientEmail || '-' }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Dirección</span>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.clientAddress || '-' }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Origen</span>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ getSourceLabel(inquiry.source) }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Asignado a</span>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.assignedTo?.name || '-' }}</p>
            </div>
          </div>
        </mat-card>

        <!-- Description -->
        <mat-card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            <mat-icon class="mr-1 align-middle">description</mat-icon>
            Descripción del problema
          </h3>
          <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ inquiry.description }}</p>
        </mat-card>

        <!-- Technician notes (if contacted) -->
        @if (inquiry.technicianNotes) {
          <mat-card class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              <mat-icon class="mr-1 align-middle">build</mat-icon>
              Notas del técnico
            </h3>
            <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ inquiry.technicianNotes }}</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              @if (inquiry.estimatedCost) {
                <div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Costo estimado</span>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.estimatedCost | number: '1.2-2' }}</p>
                </div>
              }
              @if (inquiry.estimatedDuration) {
                <div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Duración estimada</span>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.estimatedDuration }}h</p>
                </div>
              }
              @if (inquiry.recommendation) {
                <div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Recomendación</span>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ getRecommendationLabel(inquiry.recommendation) }}</p>
                </div>
              }
            </div>
            @if (inquiry.materialsNeeded) {
              <div class="mt-4">
                <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Materiales necesarios</span>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ inquiry.materialsNeeded }}</p>
              </div>
            }
          </mat-card>
        }

        <!-- Admin decision (if reviewed) -->
        @if (inquiry.adminNotes) {
          <mat-card class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              <mat-icon class="mr-1 align-middle">admin_panel_settings</mat-icon>
              Decisión del admin
            </h3>
            <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ inquiry.adminNotes }}</p>
          </mat-card>
        }

        <!-- Timestamps -->
        <mat-card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            <mat-icon class="mr-1 align-middle">schedule</mat-icon>
            Fechas
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Creada</span>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.createdAt | date: 'dd/MM/yyyy HH:mm' }}</p>
            </div>
            @if (inquiry.contactedAt) {
              <div>
                <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Contactada</span>
                <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.contactedAt | date: 'dd/MM/yyyy HH:mm' }}</p>
              </div>
            }
            @if (inquiry.reviewedAt) {
              <div>
                <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Revisada</span>
                <p class="text-sm text-gray-900 dark:text-gray-100">{{ inquiry.reviewedAt | date: 'dd/MM/yyyy HH:mm' }}</p>
              </div>
            }
          </div>
        </mat-card>
      </div>
    }
  `,
})
export class InquiryDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly inquiriesService = inject(InquiriesService);
  private readonly dialog = inject(MatDialog);

  readonly resource = httpResource<Inquiry>(
    () => {
      const id = this.route.snapshot.paramMap.get('id');
      return id ? `/api/inquiries/${id}` : '';
    },
    {
      parse: (res: unknown) => (res as ApiResponse<Inquiry>).data,
    },
  );

  getStatusLabel(status: string): string {
    return STATUS_LABELS[status] || status;
  }

  getStatusColor(status: string): string {
    return STATUS_COLORS[status] || 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
  }

  getSourceLabel(source: string): string {
    return SOURCE_LABELS[source] || source;
  }

  getRecommendationLabel(recommendation: string): string {
    return RECOMMENDATION_LABELS[recommendation] || recommendation;
  }

  goBack(): void {
    this.router.navigate(['/admin/inquiries']);
  }

  openContactForm(): void {
    const dialogRef = this.dialog.open(InquiryContactFormComponent, {
      width: '600px',
      data: { inquiryId: this.resource.value()?.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.resource.reload();
    });
  }

  review(decision: 'approved' | 'rejected'): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: decision === 'approved' ? 'Aprobar consulta' : 'Rechazar consulta',
        message: decision === 'approved'
          ? '¿Estás seguro de aprobar esta consulta?'
          : '¿Estás seguro de rechazar esta consulta?',
        confirmLabel: decision === 'approved' ? 'Aprobar' : 'Rechazar',
        color: decision === 'approved' ? 'primary' : 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed && this.resource.hasValue()) {
        this.inquiriesService.review(this.resource.value()!.id, {
          adminDecision: decision,
        }).subscribe({
          next: () => this.resource.reload(),
        });
      }
    });
  }

  convertToWorkOrder(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Convertir en orden de trabajo',
        message: '¿Estás seguro de convertir esta consulta en una orden de trabajo?',
        confirmLabel: 'Convertir',
        color: 'primary',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed && this.resource.hasValue()) {
        const inquiry = this.resource.value()!;
        this.inquiriesService.convert(inquiry.id, '', '').subscribe({
          next: () => this.resource.reload(),
        });
      }
    });
  }
}
