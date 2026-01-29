import { NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  AuthService,
  InitialsPipe,
  MenuSettingsSidebarService,
  RandomColorPipe,
  RoleService,
} from '@shared';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-sidebar',
  imports: [
    NgStyle,
    DrawerModule,
    RouterLink,
    RandomColorPipe,
    TranslateModule,
    ButtonModule,
    NgTemplateOutlet,
    InitialsPipe,
    TooltipModule,
    RouterLinkActive,
    AccordionModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SidebarComponent {
  isLoggedIn = inject(AuthService).isLoggedIn;
  currentUser = inject(AuthService).currentUser;
  #userRoles = inject(RoleService);

  visible = inject(MenuSettingsSidebarService).visible;
  model = inject(MenuSettingsSidebarService).model;
  closable = inject(MenuSettingsSidebarService).closable;
  showAll = signal<boolean>(false);
  defaultVisibleItems = signal(4);
  openSetting = signal(false);

  #checkVisibility(roles: string[]): boolean {
    return this.#userRoles.hasAnyRole(roles);
  }

  lists = computed(() => [
    {
      title: 'Sections',
      items: [
        {
          name: 'Section One',
          routerlink: 'section-one',
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
          name: 'Section Two',
          routerlink: 'section-two',
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
          name: 'Section Three',
          routerlink: 'section-three',
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
          name: 'Section Four',
          routerlink: 'section-four',
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
          name: 'Section Five',
          routerlink: 'section-five',
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
          name: 'Section Reviews',
          routerlink: 'section-reviews',
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
          name: 'Section Branches',
          routerlink: 'section-branches',
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
          name: 'Section Doctors',
          routerlink: 'section-doctors',
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
      ],
    },
    {
      title: 'Content',
      items: [
        {
          name: 'Blogs',
          routerlink: 'blogs',
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
          name: 'Categories',
          routerlink: 'categories',
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
      ],
    },
  ]);

  settingSections = computed(() => [
    {
      title: 'Settings',
      items: [
        {
          name: 'General Settings',
          routerlink: 'general-setting',
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
          name: 'Users',
          routerlink: 'users',
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
      ],
    },
  ]);
}
