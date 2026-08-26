import { Routes } from '@angular/router';
import { HomeComponent } from '../features/home/home.component.js';
import { ProgramsComponent } from '../features/programs/programs.component.js';

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
];
