import { Routes } from '@angular/router';

export const sectionTwoRoutes: Routes = [
  {
    path: 'section-two',
    loadComponent: () =>
      import('./section-two.component'),
  },
];
