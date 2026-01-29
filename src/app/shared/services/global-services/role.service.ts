import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  #userRole = inject(AuthService).userRole;

  hasAnyRole(roles: string[]) {
    return roles.some((role) => this.#userRole()?.includes(role)) as boolean;
  }
}
