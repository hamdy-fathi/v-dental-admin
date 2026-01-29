import { Routes } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { RoleGuard } from '@shared';

export const generalSettingsRoutes: Routes = [
  {
    path: 'general-setting',
    canActivate: [RoleGuard],
    loadComponent: () => import('./general-settings.component'),
    title: _('general setting'),
    data: {
      breadcrumbs: [
        { label: _('settings'), url: '/settings' },
        { label: _('general-setting') },
      ],
      roles: {
        index: [
          'CEO',
          'TECH_SUPPORT',
          'STORE_MANAGER',
          'SUPER_ADMIN',
          'INVENTORY_MANAGER',
          'CONTENT_MANAGER',
          'SYSTEM_ADMIN',
        ],
        update: [
          'CEO',
          'TECH_SUPPORT',
          'STORE_MANAGER',
          'SUPER_ADMIN',
          'INVENTORY_MANAGER',
          'CONTENT_MANAGER',
          'SYSTEM_ADMIN',
        ],
        redirectTo: '403',
      },
    },
  },
];
