import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { BreakpointService } from './breakpoint.service';

@Injectable({
  providedIn: 'root',
})
export class MenuSettingsSidebarService {
  isLoggedIn = inject(AuthService).isLoggedIn;
  #breakpointService = inject(BreakpointService);

  visible = signal(false);
  model = signal(false);
  closable = signal(false);

  visibleFaq = signal(true);
  closableFaq = signal(true);

  openSidebar$ = this.#breakpointService.isLgScreen$.pipe(
    tap((state) => {
      if (state) {
        this.#setVisibleStateSidebar(true, false, false);
      } else {
        this.#setVisibleStateSidebar(
          this.isLoggedIn() ? true : false,
          true,
          true,
        );
      }
    }),
  );

  #setVisibleStateSidebar(visible: boolean, model: boolean, closable: boolean) {
    this.visible.set(visible);
    this.model.set(model);
    this.closable.set(closable);
  }

  isOpenSidebar = toSignal(this.openSidebar$, { initialValue: false });
}
