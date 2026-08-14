export type InvoiceType = 'A' | 'B' | 'C';
export type InvoiceStatus = 'draft' | 'issued' | 'cancelled' | 'rejected';
export type InvoiceConcept = 'products' | 'services' | 'both';
export type IvaCondition = 'responsable_inscripto' | 'consumidor_final' | 'monotributo' | 'exento';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceType: InvoiceType;
  pointOfSale: number;
  concept: InvoiceConcept;
  status: InvoiceStatus;
  cae?: string;
  caeExpiry?: string;
  issuedAt?: string;
  cancelledAt?: string;
  clientName: string;
  clientCuit?: string;
  clientAddress: string;
  clientIvaCondition: IvaCondition;
  subtotal: number;
  ivaAmount: number;
  total: number;
  workOrderId: string;
  workOrder?: {
    id: string;
    trackingCode: string;
    client?: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
    serviceType?: {
      id: string;
      name: string;
    };
  };
  paymentId?: string;
  payment?: {
    id: string;
    amount: number;
    method: string;
    status: string;
  };
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  invoiceType?: InvoiceType;
  dateFrom?: string;
  dateTo?: string;
  clientName?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
