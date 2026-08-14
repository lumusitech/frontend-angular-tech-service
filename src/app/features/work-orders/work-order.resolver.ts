import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { WorkOrder } from '../../core/models/work-order.interfaces';

export const workOrderResolver: ResolveFn<WorkOrder> = (route) => {
  const http = inject(HttpClient);
  const id = route.paramMap.get('id');
  if (!id) throw new Error('Work order ID is required');
  return firstValueFrom(
    http.get<WorkOrder>(`/api/work-orders/${id}`, {
      headers: new HttpHeaders({ 'X-Skip-Loading': 'true' }),
    }),
  );
};
