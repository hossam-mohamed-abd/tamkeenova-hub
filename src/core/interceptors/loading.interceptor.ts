import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

let activeRequests = 0;
const IGNORED_URLS = ['/notifications/unread-count', '/application-status', '/dashboard'];

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);

  // تجاهل طلبات الخلفية الصغيرة لتجنب وميض اللودر كل ثانية
  const shouldIgnore = IGNORED_URLS.some((url) => req.url.includes(url));
  if (shouldIgnore) {
    return next(req);
  }

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
