import { Routes } from '@angular/router';
import { HomeComponent } from '../features/home/home.component';
import { NotFoundComponent } from '../features/not-found/not-found.component.js';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
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
  {
    path: '**',
    component: NotFoundComponent,
  },
];
