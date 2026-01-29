import { Routes } from '@angular/router';

export const sectionDoctorsRoutes: Routes = [
  {
    path: 'section-doctors',
    loadComponent: () =>
      import('./section-doctors.component'),
  },
];
