import { Route } from '@angular/router';
import LoginComponent from './auth/login/login.component';

export default [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'otp',
    loadComponent: () => import('./auth/otp/otp.component'),
    title: 'otp',
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./auth/forget-password/forget-password.component'),
    title: 'forget-password',
  },
  {
    path: 'password-reset/:token',
    loadComponent: () =>
      import('./auth/reset-password/reset-password.component'),
    title: 'reset-password',
  },
] as Route[];
