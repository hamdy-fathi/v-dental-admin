import { Routes } from '@angular/router';

export const languageRoutes: Routes = [
  {
    path: 'language',
    loadComponent: () =>
      import('./language.component'),
  },
];
