import { Routes } from '@angular/router';
import { HomeComponent } from '../features/home/home.component';
import { NotFoundComponent } from '../features/not-found/not-found.component.js';
import { guestGuard } from '../core/guards/guest.guard';
import { authGuard } from '../core/guards/auth.guard';
import { roleGuard } from '../core/guards/role.guard';
import { trainerStatusGuard } from '../core/guards/trainer-status.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'programs',
    loadComponent: () =>
      import('../features/programs/programs.component').then((m) => m.ProgramsComponent),
  },
  {
    path: 'consulting',
    loadComponent: () =>
      import('../features/consulting/consulting.component').then((m) => m.ConsultingComponent),
  },
  {
    path: 'team',
    loadComponent: () => import('../features/team/team.component').then((m) => m.TeamComponent),
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('../features/gallery-showcase/gallery-showcase.component').then(
        (m) => m.GalleryShowcaseComponent,
      ),
  },

  // -- Authentication Routes --
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('../features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'register/trainer',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('../features/auth/register-trainer/trainer-register.component').then(
        (m) => m.TrainerRegisterComponent,
      ),
  },
  {
    path: 'verify-otp',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('../features/auth/verify-otp/verify-otp.component').then((m) => m.VerifyOtpComponent),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('../features/auth/login/login.component').then((m) => m.LoginComponent),
  },

  // -- Student Portal Routes --
  {
    path: 'portal/student',
    canActivate: [authGuard, roleGuard(['STUDENT'])],
    loadComponent: () =>
      import('../features/portal/student/dashboard/student-dashboard.component').then(
        (m) => m.StudentDashboardComponent,
      ),
  },
  {
    path: 'portal/student/profile',
    canActivate: [authGuard, roleGuard(['STUDENT'])],
    loadComponent: () =>
      import('../features/portal/student/profile/student-profile.component').then(
        (m) => m.StudentProfileComponent,
      ),
  },

  // -- Trainer Portal Routes --
  {
    path: 'portal/trainer',
    canActivate: [authGuard, roleGuard(['TRAINER'])],
    children: [
      {
        path: '',
        canActivate: [trainerStatusGuard],
        loadComponent: () =>
          import('../features/portal/trainer/dashboard/trainer-dashboard.component').then(
            (m) => m.TrainerDashboardComponent,
          ),
      },
      {
        path: 'status',
        loadComponent: () =>
          import('../features/portal/trainer/status/trainer-status.component').then(
            (m) => m.TrainerStatusComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../features/portal/trainer/profile/trainer-profile.component').then(
            (m) => m.TrainerProfileComponent,
          ),
      },
      {
        path: 'programs',
        canActivate: [trainerStatusGuard],
        loadComponent: () =>
          import('../features/portal/trainer/programs/trainer-programs.component').then(
            (m) => m.TrainerProgramsComponent,
          ),
      },
      {
        path: 'availability',
        canActivate: [trainerStatusGuard],
        loadComponent: () =>
          import('../features/portal/trainer/availability/trainer-availability.component').then(
            (m) => m.TrainerAvailabilityComponent,
          ),
      },
      {
        path: 'reviews',
        canActivate: [trainerStatusGuard],
        loadComponent: () =>
          import('../features/portal/trainer/reviews/trainer-reviews.component').then(
            (m) => m.TrainerReviewsComponent,
          ),
      },
    ],
  },

  { path: '**', component: NotFoundComponent },
];
