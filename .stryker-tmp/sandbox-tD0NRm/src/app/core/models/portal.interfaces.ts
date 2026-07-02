// @ts-nocheck
export interface PortalServiceType {
  name: string;
  description: string;
}
export interface PortalTask {
  title: string;
  description: string | null;
  isCompleted: boolean;
  completedAt: string | null;
}
export interface PortalNote {
  type: string;
  content: string;
  createdAt: string;
}
export interface PortalPaymentSummary {
  totalApproved: number;
  paymentCount: number;
  hasPayments: boolean;
  isFullyPaid: boolean;
  installmentsPending: number;
  installmentsTotal: number;
}
export interface PortalResponse {
  trackingCode: string;
  status: string;
  priority: string;
  location: string;
  diagnosis: string | null;
  scheduledDate: string | null;
  startedAt: string | null;
  completedAt: string | null;
  warrantyUntil: string | null;
  createdAt: string;
  serviceType: PortalServiceType;
  clientName: string;
  tasks: PortalTask[];
  publicNotes: PortalNote[];
  paymentSummary: PortalPaymentSummary;
}