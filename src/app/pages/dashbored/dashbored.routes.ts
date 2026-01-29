import { Routes } from '@angular/router';

export const dashboredRoutes: Routes = [
  {
    path: 'dashbored',
    loadComponent: () => import('./dashbored.component'),
    title: 'dashbored',
  },
];
