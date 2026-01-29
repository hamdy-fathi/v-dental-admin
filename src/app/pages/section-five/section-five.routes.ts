import { Routes } from '@angular/router';

export const sectionFiveRoutes: Routes = [
  {
    path: 'section-five',
    loadComponent: () =>
      import('./section-five.component'),
  },
];
