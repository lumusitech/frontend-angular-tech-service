/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateUserDto {
  /** @example "John Doe" */
  name: string;
  /** @example "john@example.com" */
  email: string;
  /** @example "password123" */
  password: string;
  /** @example "technician" */
  role?: "admin" | "technician";
}

export type UpdateUserDto = object;

export interface LoginDto {
  /** @example "user@example.com" */
  email: string;
  /** @example "password123" */
  password: string;
}

export interface CreateClientDto {
  /** @example "Juan Pérez" */
  name: string;
  /** @example "juan@example.com" */
  email: string;
  /** @example "+5491112345678" */
  phone: string;
  /** @example "Av. Corrientes 1234, CABA" */
  address: string;
  /** @example "Fibertel" */
  internetProvider?: string;
  /** @example "100Mbps" */
  internetPlan?: string;
  /** @example true */
  isActive?: boolean;
  /** @example "20-12345678-9" */
  cuit?: string;
  /** @example "responsable_inscripto" */
  ivaCondition?:
    | "responsable_inscripto"
    | "consumidor_final"
    | "monotributo"
    | "exento";
}

export type UpdateClientDto = object;

export interface CreateSupplierDto {
  /** @example "Distribuidora XYZ" */
  name: string;
  /** @example "Carlos López" */
  contact: string;
  /** @example "+5491198765432" */
  phone: string;
  /** @example "contacto@xyz.com" */
  email?: string;
  /** @example "Av. San Martín 567, Buenos Aires" */
  address: string;
  /** @example "Proveedor de cámaras Hikvision" */
  notes?: string;
  /** @example true */
  isActive?: boolean;
}

export type UpdateSupplierDto = object;

export interface CreateServiceTypeDto {
  /** @example "Cámara IP Installation" */
  name: string;
  /** @example "Instalación de cámaras IP con configuración de red" */
  description?: string;
  /** @example 120 */
  estimatedDuration?: number;
  /** @example true */
  isActive?: boolean;
}

export type UpdateServiceTypeDto = object;

export interface CreateWorkOrderDto {
  /** @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890" */
  clientId: string;
  /** @example "b2c3d4e5-f6a7-8901-bcde-f12345678901" */
  serviceTypeId: string;
  /** @example ["c3d4e5f6-a7b8-9012-cdef-123456789012"] */
  technicianIds?: string[];
  /** @example "high" */
  priority?: "low" | "medium" | "high" | "urgent";
  /** @example "on_site" */
  location?: "on_site" | "workshop";
  /** @example "Pantalla rota, necesita reemplazo" */
  diagnosis?: string;
  /** @example "2026-12-31" */
  warrantyUntil?: string;
  /** @example "2026-06-15" */
  scheduledDate?: string;
}

export interface UpdateWorkOrderDto {
  /** @example "in_progress" */
  status?:
    | "pending"
    | "assigned"
    | "in_progress"
    | "postponed"
    | "completed"
    | "delivered"
    | "cancelled";
  /** @example "2026-06-10T08:00:00.000Z" */
  startedAt?: string;
  /** @example "2026-06-10T17:00:00.000Z" */
  completedAt?: string;
}

export interface CreateWorkOrderNoteDto {
  /** @example "observation" */
  type: "diagnosis" | "issue" | "observation" | "internal";
  /** @example "Se realizó diagnóstico inicial del equipo" */
  content: string;
}

export interface CreateWorkOrderMaterialDto {
  /** @example "Cable UTP Cat6 - 50m" */
  description: string;
  /** @example 2 */
  quantity: number;
  /** @example 1500.5 */
  unitCost: number;
  /** @example "d4e5f6a7-b8c9-0123-defa-234567890123" */
  supplierId?: string;
}

export interface CreateTaskDto {
  /** @example "Revisar conexión de red" */
  title: string;
  /** @example "Verificar cableado y configuración IP" */
  description?: string;
  /** @example "c3d4e5f6-a7b8-9012-cdef-123456789012" */
  assignedToId?: string;
}

export interface UpdateTaskDto {
  /** @example true */
  isCompleted?: boolean;
  /** @example "2026-06-10T15:30:00.000Z" */
  completedAt?: string;
}

export interface CreatePaymentDto {
  /**
   * @min 0.01
   * @example 1500.5
   */
  amount: number;
  /** @example "cash" */
  method: "credit_card" | "debit_card" | "cash" | "transfer";
  /** @example "MercadoPago" */
  provider: string;
  /** @example "Payment for camera installation" */
  description?: string;
  /**
   * @min 1
   * @example 1
   */
  installmentNumber?: number;
  /**
   * @min 1
   * @example 3
   */
  totalInstallments?: number;
  /** @example "2026-06-15" */
  dueDate?: string;
}

export interface UpdatePaymentDto {
  /** @example "approved" */
  status?: "pending" | "approved" | "rejected" | "refunded" | "cancelled";
  /** @example "2026-06-02T14:30:00.000Z" */
  paidAt?: string;
}

export interface CreateExpenseDto {
  /** @example "Office rent payment" */
  description: string;
  /** @example 25000 */
  amount: number;
  /** @example "2026-06-01" */
  date: string;
  /** @example "rent" */
  category:
    | "rent"
    | "utilities"
    | "salaries"
    | "tools"
    | "transport"
    | "advertising"
    | "supplies"
    | "maintenance"
    | "hosting"
    | "other";
  /** @example true */
  isRecurring?: boolean;
  /** @example "Monthly rent for office space" */
  notes?: string;
}

export type UpdateExpenseDto = object;

export interface CreateInvoiceDto {
  /** @example "B" */
  invoiceType: "A" | "B" | "C";
  /**
   * @min 1
   * @example 1
   */
  pointOfSale?: number;
  /** @example "services" */
  concept?: "products" | "services" | "both";
  /** @example "Juan Perez" */
  clientName: string;
  /** @example "20-12345678-9" */
  clientCuit?: string;
  /** @example "Av. Corrientes 1234, CABA" */
  clientAddress: string;
  /** @example "consumidor_final" */
  clientIvaCondition?:
    | "responsable_inscripto"
    | "consumidor_final"
    | "monotributo"
    | "exento";
  /** @example 10000 */
  subtotal: number;
  /** @example 2100 */
  ivaAmount?: number;
  /** @example 12100 */
  total: number;
  /** @example "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" */
  workOrderId: string;
  /** @example "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22" */
  paymentId?: string;
}
