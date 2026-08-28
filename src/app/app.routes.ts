import { Routes } from '@angular/router';
import { HomeComponent } from '../features/home/home.component.js';
import { ProgramsComponent } from '../features/programs/programs.component.js';
// import { GalleryShowcaseComponent } from '../features/gallery-showcase/gallery-showcase.component.js';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'programs',
    component: ProgramsComponent,
  },
  {
    path: 'consulting',
    loadComponent: () =>
      import('../features/consulting/consulting.component').then((m) => m.ConsultingComponent),
  },
  
{
  path: 'team',
  loadComponent: () =>
    import('../features/team/team.component').then((m) => m.TeamComponent),
},
{
  path:'gallery',
  loadComponent: () =>
    import('../features/gallery-showcase/gallery-showcase.component').then((m) => m.GalleryShowcaseComponent),

}
];
