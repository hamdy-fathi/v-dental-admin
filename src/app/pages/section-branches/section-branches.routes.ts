import { Routes } from '@angular/router';

export const sectionBranchesRoutes: Routes = [
  {
    path: 'section-branches',
    loadComponent: () =>
      import('./section-branches.component'),
  },
];
