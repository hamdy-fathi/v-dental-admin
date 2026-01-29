import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { User } from '@pages/users/services/services-type';
import { map, tap } from 'rxjs';
import { localStorageSignal } from '../../helpers';
import { ApiService } from '../global-services/api.service';
import { LoginData } from './service-types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  #api = inject(ApiService);

  /*****************************************/

  #userIdToVerifyOtpLogin = signal<null | number>(null);
  userId = this.#userIdToVerifyOtpLogin.asReadonly();

  /*****************************************/
  // current user
  #CURRENT_USER_KEY = 'azalove-current-user-key';
  #currentUser = localStorageSignal<User | null>(null, this.#CURRENT_USER_KEY);

  currentUser = this.#currentUser.asReadonly(); // exposed publicly.
  currentUserId = computed(() => this.#currentUser()?.id);

  setCurrentUser(user: User | null) {
    this.#currentUser.set(user);
  }
  /*****************************************/

  #ACCESS_TOKEN_KEY = 'azalove-access-token-key';

  #accessToken = localStorageSignal<string | null>(
    null,
    this.#ACCESS_TOKEN_KEY,
  );

  accessToken = this.#accessToken.asReadonly();

  updateAccessToken(token: string | null) {
    this.#accessToken.set(token);
  }

  /*****************************************/

  isLoggedIn = computed<boolean>(() => !!this.accessToken());

  /*****************************************/

  effectSidebar = effect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      this.isLoggedIn() ? '18rem' : '32rem',
    );
  });

  /*****************************************/

  /*****************************************/

  // refresh token
  #REFRESH_TOKEN_KEY = 'azalove-refresh-token-key';

  #refreshToken = localStorageSignal<string | null>(
    null,
    this.#REFRESH_TOKEN_KEY,
  );

  refreshToken = this.#refreshToken.asReadonly();

  updateRefreshToken(token: string | null) {
    this.#refreshToken.set(token);
  }

  /*****************************************/

  #ROLE_KEY = 'azalove-role-key';
  #userRole = localStorageSignal<string[] | null>(null, this.#ROLE_KEY);
  userRole = this.#userRole.asReadonly();

  updateUserRole(role: string | null) {
    this.#userRole.set(role ? [role] : null);
  }

  login(credentials: any) {
    return this.#api
      .request('post', 'auth/login', credentials)
      .pipe(tap(({ data }) => this.doLogin(data)));
  }

  forgetPassword(credentials: any) {
    return this.#api.request('post', 'auth/forget-password', credentials);
  }

  resetPassword(credentials: any) {
    return this.#api.request('post', 'auth/reset-password', credentials);
  }

  verifyOtp(credentials: any) {
    return this.#api
      .request('post', 'auth/verify-otp', credentials)
      .pipe(tap(({ data }) => this.doLogin(data)));
  }

  logout() {
    return this.#api
      .request('post', 'auth/logout', {})
      .pipe(tap(() => this.doLogout()));
  }

  doLogin(data: LoginData) {
    this.setCurrentUser(data.user);
    this.updateAccessToken(data.access_token);
    this.updateRefreshToken(data.refreshToken);
    this.updateUserRole(data.user.role);
  }

  doLogout() {
    this.setCurrentUser(null);
    this.updateAccessToken(null);
    this.updateUserRole(null);
  }

  refreshAccessToken() {
    const requestBody = {
      refreshToken: this.refreshToken(),
    };
    return this.#api
      .request('post', 'auth/refresh-tokens', requestBody)
      .pipe(map(({ data }) => data));
  }
}
