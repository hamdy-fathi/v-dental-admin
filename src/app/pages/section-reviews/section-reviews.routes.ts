import { Routes } from '@angular/router';

export const sectionReviewsRoutes: Routes = [
  {
    path: 'section-reviews',
    loadComponent: () =>
      import('./section-reviews.component'),
  },
];
