import { Routes } from '@angular/router';

export const sectionFourRoutes: Routes = [
  {
    path: 'section-four',
    loadComponent: () =>
      import('./section-four.component'),
  },
];
