import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);

  activeRequests++;
  loader.show();

  return next(req).pipe(
    finalize(() => {
      activeRequests--;
      if (activeRequests <= 0) {
        activeRequests = 0;
        loader.hide();
      }
    }),
  );
};
