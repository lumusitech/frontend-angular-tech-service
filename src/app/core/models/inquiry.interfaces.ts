export interface Inquiry {
  id: string;
  clientName: string;
  clientPhone: string | null;
  clientEmail: string | null;
  clientAddress: string | null;
  description: string;
  source: InquirySource;
  status: InquiryStatus;
  priority: string | null;
  assignedTo: InquiryUser | null;
  assignedToId: string | null;
  createdBy: InquiryUser;
  createdById: string;
  technicianNotes: string | null;
  estimatedCost: number | null;
  estimatedDuration: number | null;
  materialsNeeded: string | null;
  recommendation: InquiryRecommendation | null;
  adminDecision: InquiryDecision;
  adminNotes: string | null;
  workOrderId: string | null;
  contactedAt: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryUser {
  id: string;
  name: string;
  email: string;
}

export enum InquirySource {
  PHONE = 'phone',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  WALK_IN = 'walk_in',
  SOCIAL_MEDIA = 'social_media',
  REFERRAL = 'referral',
}

export enum InquiryStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  REVIEWED = 'reviewed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CONVERTED = 'converted',
}

export enum InquiryRecommendation {
  REPAIR = 'repair',
  REPLACEMENT = 'replacement',
  MAINTENANCE = 'maintenance',
  INSPECTION = 'inspection',
  NO_ACTION = 'no_action',
}

export enum InquiryDecision {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

export interface CreateInquiryDto {
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  clientAddress?: string;
  description: string;
  source: InquirySource;
  priority?: string;
  assignedToId?: string;
}

export interface UpdateInquiryDto {
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  clientAddress?: string;
  description?: string;
  source?: InquirySource;
  priority?: string;
  assignedToId?: string;
  status?: InquiryStatus;
  technicianNotes?: string;
  estimatedCost?: number;
  estimatedDuration?: number;
  materialsNeeded?: string;
  recommendation?: InquiryRecommendation;
  adminDecision?: InquiryDecision;
  adminNotes?: string;
}

export interface ContactInquiryDto {
  technicianNotes: string;
  estimatedCost?: number;
  estimatedDuration?: number;
  materialsNeeded?: string;
  recommendation?: InquiryRecommendation;
}

export interface InquiryFilters {
  status?: InquiryStatus;
  priority?: string;
  source?: InquirySource;
  assignedToId?: string;
  dateFrom?: string;
  dateTo?: string;
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
