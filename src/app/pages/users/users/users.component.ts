import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import { BaseIndexComponent, TableWrapperComponent } from '@shared';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { CuUserDialogComponent } from '../dialog/cu/cu-user-dialog.component';
import { ViewUserComponent } from '../dialog/view/view-user/view-user.component';
import { FiltersUsersComponent } from '../filters-users/filters-users.component';
import { User } from '../services/services-type';

@Component({
  selector: 'app-users',
  imports: [
    TableWrapperComponent,
    ButtonModule,
    FiltersUsersComponent,
    TooltipModule,
    TranslateModule,
    ViewUserComponent,
    MenuModule,
    Dialog,
    TranslateModule,
    FormsModule,
    ToggleSwitchModule,
  ],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersComponent extends BaseIndexComponent<User> {
  isActive = viewChild.required<TemplateRef<any>>('isActive');
  ngOnInit() {
    this.dialogComponent = CuUserDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: 'user/index',
        delete: 'user/delete',
      },
      navigateCreatePage: 'new-user',
      displayViewButton: true,
      indexTitle: this.#translate(_('Users')),
      indexIcon: 'pi pi-users',
      createBtnLabel: this.#translate(_('Create User')),
      indexTableKey: 'USER_KEY',
      columns: [
        {
          title: this.#translate(_('#ID')),
          name: `id`,
          searchable: false,
          orderable: false,
        },
        {
          title: this.#translate(_('first name')),
          name: `firstName`,
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('last name')),
          name: `lastName`,
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('email')),
          name: `email`,
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('username')),
          name: `username`,
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('birth of date')),
          name: `birthOfDate`,
          searchable: false,
          orderable: false,
        },
        {
          title: this.#translate(_('phone number')),
          name: `phoneNumber`,
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('isActive')),
          name: 'isActive',
          searchable: false,
          orderable: false,
          render: this.isActive(),
        },
        {
          title: this.#translate(_('created at')),
          name: 'createdAt',
          searchable: false,
          orderable: false,
        },
        {
          title: this.#translate(_('updated at')),
          name: 'updatedAt',
          searchable: false,
          orderable: false,
        },
      ],
    };

    this.initRolesUser();

    this.filtersData.update((filters) => ({
      ...filters,
      customFilters: {
        type: 'user',
      },
    }));
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }
}
