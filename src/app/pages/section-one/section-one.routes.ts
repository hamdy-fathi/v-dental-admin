import { Routes } from '@angular/router';

export const sectionOneRoutes: Routes = [
  {
    path: 'section-one',
    loadComponent: () =>
      import('./section-one.component'),
  },
];
