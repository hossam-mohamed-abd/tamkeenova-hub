import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { TrainerService } from '../services/trainer.service';

export const trainerStatusGuard: CanActivateFn = () => {
  const trainerService = inject(TrainerService);
  const router = inject(Router);

  if (trainerService.isApprovedCached) return true;

  return trainerService.getApplicationStatus().pipe(
    map((res) => {
      if (res.data.status === 'APPROVED') return true;
      return router.createUrlTree(['/portal/trainer/status']);
    }),
    catchError(() => of(router.createUrlTree(['/portal/trainer/status']))),
  );
};
