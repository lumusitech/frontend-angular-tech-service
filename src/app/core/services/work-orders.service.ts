import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  WorkOrder,
  CreateWorkOrderDto,
  UpdateWorkOrderDto,
  CreateWorkOrderNoteDto,
  CreateWorkOrderMaterialDto,
  CreateTaskDto,
  UpdateTaskDto,
  WorkOrderFilters,
} from '../models/work-order.interfaces';
import { PaginatedResponse } from '../models/client.interfaces';

@Service()
export class WorkOrdersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/work-orders';

  getAll(filters?: WorkOrderFilters): Observable<PaginatedResponse<WorkOrder>> {
    let params = new HttpParams();

    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.priority) params = params.set('priority', filters.priority);
    if (filters?.technicianId) params = params.set('technicianId', filters.technicianId);
    if (filters?.clientId) params = params.set('clientId', filters.clientId);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<PaginatedResponse<WorkOrder>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<WorkOrder> {
    return this.http.get<WorkOrder>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateWorkOrderDto): Observable<WorkOrder> {
    return this.http.post<WorkOrder>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateWorkOrderDto): Observable<WorkOrder> {
    return this.http.patch<WorkOrder>(`${this.apiUrl}/${id}`, dto);
  }

  addNote(workOrderId: string, dto: CreateWorkOrderNoteDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${workOrderId}/notes`, dto);
  }

  addMaterial(workOrderId: string, dto: CreateWorkOrderMaterialDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${workOrderId}/materials`, dto);
  }

  addTask(workOrderId: string, dto: CreateTaskDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${workOrderId}/tasks`, dto);
  }

  updateTask(workOrderId: string, taskId: string, dto: UpdateTaskDto): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${workOrderId}/tasks/${taskId}`, dto);
  }

  replaceTechnicians(workOrderId: string, technicianIds: string[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${workOrderId}/technicians`, { technicianIds });
  }
}
