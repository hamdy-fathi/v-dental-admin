import { Routes } from '@angular/router';

export const sectionThreeRoutes: Routes = [
  {
    path: 'section-three',
    loadComponent: () =>
      import('./section-three.component'),
  },
];
