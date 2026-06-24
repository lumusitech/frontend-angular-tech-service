import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

interface ApiResponseWrapper<T> {
  statusCode: number;
  data: T;
  timestamp: string;
}

export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (
        event instanceof HttpResponse &&
        event.body &&
        typeof event.body === 'object' &&
        'statusCode' in event.body &&
        'data' in event.body &&
        'timestamp' in event.body
      ) {
        return event.clone({ body: (event.body as ApiResponseWrapper<unknown>).data });
      }
      return event;
    }),
  );
};
