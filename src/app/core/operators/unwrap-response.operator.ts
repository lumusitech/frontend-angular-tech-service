import { OperatorFunction, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.interfaces';

export function unwrapResponse<T>(): OperatorFunction<ApiResponse<T>, T> {
  return map((response: ApiResponse<T>) => response.data);
}
