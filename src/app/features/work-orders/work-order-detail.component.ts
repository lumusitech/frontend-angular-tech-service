import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { WorkOrder, WorkOrderStatus } from '../../core/models/work-order.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-work-order-detail',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    DatePipe,
    CurrencyPipe,
  ],
  template: `
    @if (loading()) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="48" />
      </div>
    } @else if (workOrder()) {
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button mat-icon-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-gray-900 font-mono">
                  {{ workOrder()!.trackingCode }}
                </h1>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  [class]="getStatusClass(workOrder()!.status)"
                >
                  {{ getStatusLabel(workOrder()!.status) }}
                </span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  [class]="getPriorityClass(workOrder()!.priority)"
                >
                  {{ getPriorityLabel(workOrder()!.priority) }}
                </span>
              </div>
              <p class="text-gray-500 mt-1">
                {{ workOrder()!.serviceType.name }} - {{ workOrder()!.client.name }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <mat-tab-group>
              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">info</mat-icon>
                  Info General
                </ng-template>
                <div class="p-4 space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-500">Cliente</p>
                      <p class="font-medium">{{ workOrder()!.client.name }}</p>
                      <p class="text-sm text-gray-500">{{ workOrder()!.client.email }}</p>
                      <p class="text-sm text-gray-500">{{ workOrder()!.client.phone }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Ubicación</p>
                      <p class="font-medium">
                        {{ workOrder()!.location === 'workshop' ? 'Taller' : 'En sitio' }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Fecha Programada</p>
                      <p class="font-medium">
                        {{
                          workOrder()!.scheduledDate
                            ? (workOrder()!.scheduledDate | date: 'dd/MM/yyyy')
                            : '-'
                        }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Garantía hasta</p>
                      <p class="font-medium">
                        {{
                          workOrder()!.warrantyUntil
                            ? (workOrder()!.warrantyUntil | date: 'dd/MM/yyyy')
                            : '-'
                        }}
                      </p>
                    </div>
                  </div>
                  @if (workOrder()!.diagnosis) {
                    <div>
                      <p class="text-sm text-gray-500">Diagnóstico</p>
                      <p class="mt-1 p-3 bg-gray-50 rounded-lg">{{ workOrder()!.diagnosis }}</p>
                    </div>
                  }
                </div>
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">checklist</mat-icon>
                  Tareas ({{ getCompletedTasks() }}/{{ workOrder()!.tasks.length }})
                </ng-template>
                <div class="p-4">
                  @if (workOrder()!.tasks.length === 0) {
                    <p class="text-gray-500 text-center py-8">No hay tareas asignadas</p>
                  } @else {
                    <div class="space-y-3">
                      @for (task of workOrder()!.tasks; track task.id) {
                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <button mat-icon-button (click)="toggleTask(task.id, !task.isCompleted)">
                            <mat-icon>
                              {{ task.isCompleted ? 'check_circle' : 'radio_button_unchecked' }}
                            </mat-icon>
                          </button>
                          <div class="flex-1">
                            <p
                              [class.line-through]="task.isCompleted"
                              [class.text-gray-400]="task.isCompleted"
                            >
                              {{ task.title }}
                            </p>
                            @if (task.description) {
                              <p class="text-sm text-gray-500">{{ task.description }}</p>
                            }
                          </div>
                          @if (task.assignedTo) {
                            <span class="text-xs text-gray-400">{{ task.assignedTo.name }}</span>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">build</mat-icon>
                  Materiales
                </ng-template>
                <div class="p-4">
                  @if (workOrder()!.materials.length === 0) {
                    <p class="text-gray-500 text-center py-8">No hay materiales registrados</p>
                  } @else {
                    <div class="overflow-x-auto">
                      <table class="w-full text-sm">
                        <thead>
                          <tr class="border-b">
                            <th class="text-left py-2 px-3 font-medium text-gray-500">
                              Descripción
                            </th>
                            <th class="text-right py-2 px-3 font-medium text-gray-500">Cant.</th>
                            <th class="text-right py-2 px-3 font-medium text-gray-500">
                              Costo Unit.
                            </th>
                            <th class="text-right py-2 px-3 font-medium text-gray-500">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (material of workOrder()!.materials; track material.id) {
                            <tr class="border-b">
                              <td class="py-2 px-3">{{ material.description }}</td>
                              <td class="py-2 px-3 text-right">{{ material.quantity }}</td>
                              <td class="py-2 px-3 text-right">
                                {{ material.unitCost | currency: 'ARS' }}
                              </td>
                              <td class="py-2 px-3 text-right font-medium">
                                {{ material.totalCost | currency: 'ARS' }}
                              </td>
                            </tr>
                          }
                        </tbody>
                        <tfoot>
                          <tr class="font-medium">
                            <td colspan="3" class="py-2 px-3 text-right">Total Materiales:</td>
                            <td class="py-2 px-3 text-right">
                              {{ getMaterialsTotal() | currency: 'ARS' }}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  }
                </div>
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">notes</mat-icon>
                  Notas
                </ng-template>
                <div class="p-4">
                  @if (workOrder()!.notes.length === 0) {
                    <p class="text-gray-500 text-center py-8">No hay notas</p>
                  } @else {
                    <div class="space-y-3">
                      @for (note of workOrder()!.notes; track note.id) {
                        <div class="p-3 bg-gray-50 rounded-lg">
                          <div class="flex items-center gap-2 mb-1">
                            <span
                              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                              [class]="getNoteTypeClass(note.type)"
                            >
                              {{ getNoteTypeLabel(note.type) }}
                            </span>
                            <span class="text-xs text-gray-400">
                              {{ note.createdBy.name }} -
                              {{ note.createdAt | date: 'dd/MM/yyyy HH:mm' }}
                            </span>
                          </div>
                          <p class="text-sm">{{ note.content }}</p>
                        </div>
                      }
                    </div>
                  }
                </div>
              </mat-tab>
            </mat-tab-group>
          </div>

          <div class="space-y-4">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 class="font-medium text-gray-900 mb-3">Técnicos Asignados</h3>
              @if (workOrder()!.technicians.length === 0) {
                <p class="text-sm text-gray-500">Sin técnicos asignados</p>
              } @else {
                <div class="space-y-2">
                  @for (tech of workOrder()!.technicians; track tech.id) {
                    <div class="flex items-center gap-2">
                      <div
                        class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                      >
                        <span class="text-blue-600 text-sm font-medium">{{
                          tech.name.charAt(0)
                        }}</span>
                      </div>
                      <span class="text-sm">{{ tech.name }}</span>
                    </div>
                  }
                </div>
              }
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 class="font-medium text-gray-900 mb-3">Resumen</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Tareas completadas</span>
                  <span class="font-medium"
                    >{{ getCompletedTasks() }}/{{ workOrder()!.tasks.length }}</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Costo materiales</span>
                  <span class="font-medium">{{ getMaterialsTotal() | currency: 'ARS' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Creada</span>
                  <span>{{ workOrder()!.createdAt | date: 'dd/MM/yyyy' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class WorkOrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workOrdersService = inject(WorkOrdersService);

  readonly workOrder = signal<WorkOrder | null>(null);
  readonly loading = signal(true);

  getCompletedTasks(): number {
    return this.workOrder()?.tasks.filter((t) => t.isCompleted).length || 0;
  }

  getMaterialsTotal(): number {
    return this.workOrder()?.materials.reduce((sum, m) => sum + m.totalCost, 0) || 0;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.workOrdersService.getById(id).subscribe({
        next: (workOrder) => {
          this.workOrder.set(workOrder);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.router.navigate(['/admin/work-orders']);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/work-orders']);
  }

  toggleTask(taskId: string, isCompleted: boolean): void {
    const id = this.workOrder()?.id;
    if (id) {
      this.workOrdersService.updateTask(id, taskId, { isCompleted }).subscribe({
        next: () => {
          this.workOrdersService.getById(id).subscribe({
            next: (wo) => this.workOrder.set(wo),
          });
        },
      });
    }
  }

  getStatusClass(status: WorkOrderStatus): string {
    const classes: Record<WorkOrderStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-indigo-100 text-indigo-800',
      postponed: 'bg-gray-100 text-gray-800',
      completed: 'bg-green-100 text-green-800',
      delivered: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: WorkOrderStatus): string {
    const labels: Record<WorkOrderStatus, string> = {
      pending: 'Pendiente',
      assigned: 'Asignada',
      in_progress: 'En Progreso',
      postponed: 'Pospuesta',
      completed: 'Completada',
      delivered: 'Entregada',
      cancelled: 'Cancelada',
    };
    return labels[status] || status;
  }

  getPriorityClass(priority: string): string {
    const classes: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      urgent: 'Urgente',
    };
    return labels[priority] || priority;
  }

  getNoteTypeClass(type: string): string {
    const classes: Record<string, string> = {
      diagnosis: 'bg-blue-100 text-blue-800',
      issue: 'bg-red-100 text-red-800',
      observation: 'bg-gray-100 text-gray-800',
      internal: 'bg-yellow-100 text-yellow-800',
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
  }

  getNoteTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      diagnosis: 'Diagnóstico',
      issue: 'Problema',
      observation: 'Observación',
      internal: 'Interna',
    };
    return labels[type] || type;
  }
}
