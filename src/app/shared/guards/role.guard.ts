import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { RoleService } from '@gService/role.service';

export const RoleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const userRole = inject(RoleService);
  const router = inject(Router);

  const hasAnyRole = route.data.roles.index;
  const redirect = `/${route.data.roles.redirectTo}`;

  if (hasAnyRole?.length && userRole.hasAnyRole(hasAnyRole)) return true;
  router.navigate([redirect]);
  return false;
};
