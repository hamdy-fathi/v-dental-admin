import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AuthService,
  BreakpointService,
  ConfirmService,
  MenuSettingsSidebarService,
  RoleService,
} from '@shared';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { tap } from 'rxjs';
import { GlobalSearchComponent } from './global-search/global-search.component';

@Component({
  selector: 'app-header',
  imports: [
    SplitButtonModule,
    TooltipModule,
    TranslateModule,
    MenuModule,
    GlobalSearchComponent,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HeaderComponent {
  #authService = inject(AuthService);
  #confirmService = inject(ConfirmService);
  #breakpointService = inject(BreakpointService);
  isLgScreen = this.#breakpointService.isLgScreen;
  #translate = inject(TranslateService);
  #destroyRef = inject(DestroyRef);
  #userRoles = inject(RoleService);

  visible = inject(MenuSettingsSidebarService).visible;
  visibleFaq = inject(MenuSettingsSidebarService).visibleFaq;
  currentUser = inject(AuthService).currentUser;

  #router = inject(Router);
  displaySearchOnMobile = signal(false);

  hiddenSearchMobile$ = this.#breakpointService.isLgScreen$.pipe(
    tap((state) => {
      if (state) {
        this.displaySearchOnMobile.set(false);
      }
    }),
  );
  hiddenSearchMobile = toSignal(this.hiddenSearchMobile$, {
    initialValue: false,
  });

  createItems = computed<MenuItem[]>(() => [
    {
      label: 'New User',
      icon: 'pi pi-users',
      routerLink: '/new-user',
      routerLinkActiveOptions: { exact: true },
      visible: this.#checkVisibility([
        'CEO',
        'TECH_SUPPORT',
        'STORE_MANAGER',
        'SUPER_ADMIN',
        'INVENTORY_MANAGER',
        'CONTENT_MANAGER',
        'SYSTEM_ADMIN',
      ]),
    },
    {
      label: this.#translate.instant(_('Section One')),
      icon: 'pi pi-home',
      routerLink: '/section-one',
      routerLinkActiveOptions: { exact: true },
      visible: this.#checkVisibility([
        'CEO',
        'CONTENT_MANAGER',
        'SUPER_ADMIN',
        'SYSTEM_ADMIN',
      ]),
    },
    {
      label: this.#translate.instant(_('Section Two')),
      icon: 'pi pi-info-circle',
      routerLink: '/section-two',
      routerLinkActiveOptions: { exact: true },
      visible: this.#checkVisibility([
        'CEO',
        'CONTENT_MANAGER',
        'SUPER_ADMIN',
        'SYSTEM_ADMIN',
      ]),
    },
    {
      label: this.#translate.instant(_('Section Three')),
      icon: 'pi pi-cog',
      routerLink: '/section-three',
      routerLinkActiveOptions: { exact: true },
      visible: this.#checkVisibility([
        'CEO',
        'CONTENT_MANAGER',
        'SUPER_ADMIN',
        'SYSTEM_ADMIN',
      ]),
    },
    {
      label: this.#translate.instant(_('Section Four')),
      icon: 'pi pi-settings',
      routerLink: '/section-four',
      routerLinkActiveOptions: { exact: true },
      visible: this.#checkVisibility([
        'CEO',
        'CONTENT_MANAGER',
        'SUPER_ADMIN',
        'SYSTEM_ADMIN',
      ]),
    },
    {
      label: this.#translate.instant(_('Section Five')),
      icon: 'pi pi-list',
      routerLink: '/section-five',
      routerLinkActiveOptions: { exact: true },
      visible: this.#checkVisibility([
        'CEO',
        'CONTENT_MANAGER',
        'SUPER_ADMIN',
        'SYSTEM_ADMIN',
      ]),
    },
    {
      label: 'Reviews',
      icon: 'pi pi-star',
      routerLink: '/section-reviews',
      routerLinkActiveOptions: { exact: true },
      visible: this.#checkVisibility([
        'CEO',
        'CONTENT_MANAGER',
        'SUPER_ADMIN',
        'SYSTEM_ADMIN',
      ]),
    },
    {
      label: this.#translate.instant(_('Doctors')),
      icon: 'pi pi-user-plus',
      routerLink: '/section-doctors',
      routerLinkActiveOptions: { exact: true },
      visible: this.#checkVisibility([
        'CEO',
        'CONTENT_MANAGER',
        'SUPER_ADMIN',
        'SYSTEM_ADMIN',
      ]),
    },
    {
      label: this.#translate.instant(_('Branches')),
      icon: 'pi pi-building',
      routerLink: '/section-branches',
      routerLinkActiveOptions: { exact: true },
      visible: this.#checkVisibility([
        'CEO',
        'CONTENT_MANAGER',
        'SUPER_ADMIN',
        'SYSTEM_ADMIN',
      ]),
    },
    {
      label: this.#translate.instant(_('Blogs')),
      icon: 'pi pi-book',
      routerLink: '/blogs',
      routerLinkActiveOptions: { exact: true },
      visible: this.#checkVisibility([
        'CEO',
        'CONTENT_MANAGER',
        'SUPER_ADMIN',
        'SYSTEM_ADMIN',
      ]),
    },
    {
      label: this.#translate.instant(_('Categories')),
      icon: 'pi pi-tags',
      routerLink: '/categories',
      routerLinkActiveOptions: { exact: true },
      visible: this.#checkVisibility([
        'CEO',
        'CONTENT_MANAGER',
        'SUPER_ADMIN',
        'SYSTEM_ADMIN',
      ]),
    },
  ]);

  faqDrawer() {
    this.visibleFaq.set(true);
    document.documentElement.style.setProperty('--sidebar-faq-width', '28rem');
  }

  #checkVisibility(roles: string[]): boolean {
    return this.#userRoles.hasAnyRole(roles);
  }

  userItems = signal<MenuItem[]>([
    {
      label: this.#translate.instant(_('Logout')),
      command: () => {
        this.#confirmService.confirmDelete({
          message: this.#translate.instant(_('please confirm to proceed')),
          acceptCallback: () =>
            this.#authService
              .logout()
              .pipe(takeUntilDestroyed(this.#destroyRef))
              .subscribe(() => {
                this.#router.navigate(['/auth/login']);
              }),
        });
      },
    },
  ]);
}
