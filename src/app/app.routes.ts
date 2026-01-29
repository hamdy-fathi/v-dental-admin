import { Routes } from '@angular/router';
import { AuthGuard, LoginGuard } from '@shared';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [LoginGuard],
    canActivateChild: [LoginGuard],
    loadChildren: () => import('./child-auth.routes'),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadComponent: () =>
      import('@layout/content-layout/content-layout.component'),
    loadChildren: () => import('./child.routes'),
  },
  {
    path: '**',
    loadComponent: () => import('@pages/errors/404/404.component'),
  },
];
