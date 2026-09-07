import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { TrainerService } from '../services/trainer.service';

export const trainerStatusGuard: CanActivateFn = () => {
  const trainerService = inject(TrainerService);
  const router = inject(Router);

  return trainerService.getApplicationStatus().pipe(
    map((res) => {
      if (res.data.status === 'APPROVED') return true;
      router.navigate(['/portal/trainer/status']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/portal/trainer/status']);
      return of(false);
    }),
  );
};
