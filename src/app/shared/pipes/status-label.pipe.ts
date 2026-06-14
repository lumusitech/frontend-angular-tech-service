import { Pipe, PipeTransform } from '@angular/core';

type LabelType =
  | 'workOrderStatus'
  | 'workOrderPriority'
  | 'paymentStatus'
  | 'paymentMethod'
  | 'expenseCategory'
  | 'noteType'
  | 'activeInactive';

const LABELS: Record<LabelType, Record<string, string>> = {
  workOrderStatus: {
    pending: 'Pendiente',
    assigned: 'Asignada',
    in_progress: 'En Progreso',
    postponed: 'Pospuesta',
    completed: 'Completada',
    delivered: 'Entregada',
    cancelled: 'Cancelada',
  },
  workOrderPriority: {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente',
  },
  paymentStatus: {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    refunded: 'Reembolsado',
    cancelled: 'Cancelado',
  },
  paymentMethod: {
    cash: 'Efectivo',
    transfer: 'Transferencia',
    credit_card: 'Tarjeta Crédito',
    debit_card: 'Tarjeta Débito',
  },
  expenseCategory: {
    rent: 'Alquiler',
    utilities: 'Servicios',
    salaries: 'Sueldos',
    tools: 'Herramientas',
    transport: 'Transporte',
    advertising: 'Publicidad',
    supplies: 'Insumos',
    maintenance: 'Mantenimiento',
    hosting: 'Hosting',
    other: 'Otros',
  },
  noteType: {
    diagnosis: 'Diagnóstico',
    issue: 'Problema',
    observation: 'Observación',
    internal: 'Interna',
  },
  activeInactive: {
    true: 'Activo',
    false: 'Inactivo',
  },
};

@Pipe({ name: 'statusLabel' })
export class StatusLabelPipe implements PipeTransform {
  transform(value: string | boolean, type: LabelType): string {
    const key = String(value);
    return LABELS[type]?.[key] ?? key;
  }
}
