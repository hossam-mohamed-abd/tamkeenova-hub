import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { TrainerService } from '../services/trainer.service';

export const trainerStatusGuard: CanActivateFn = (route) => {
  const trainerService = inject(TrainerService);
  const router = inject(Router);

  // ✅ لو الحالة محفوظة في الـ cache (APPROVED)
  if (trainerService.isApprovedCached) {
    return true;
  }

  return trainerService.getApplicationStatus().pipe(
    map((res) => {
      const status = res.data.status;

      // ✅ لو معتمد، يدخل عادي
      if (status === 'APPROVED') {
        return true;
      }

      // ✅ لو مش معتمد (PENDING أو REJECTED)، يروح لصفحة الحالة
      console.log(`🚫 Trainer status: ${status} - Redirecting to status page`);
      return router.createUrlTree(['/portal/trainer/status']);
    }),
    catchError((err) => {
      console.error('❌ Error checking trainer status:', err);
      // ✅ لو حصل error، يروح لصفحة الحالة
      return of(router.createUrlTree(['/portal/trainer/status']));
    }),
  );
};
