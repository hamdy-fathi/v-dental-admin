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
import { CuCustomerDialogComponent } from '../dialog/cu/cu-customer-dialog.component';
import { ViewCustomerComponent } from '../dialog/view/view-customer/view-customer.component';
import { FiltersCustomersComponent } from '../filters-users/filters-customers.component';
import { Customer } from '../services/services-type';

@Component({
  selector: 'app-customers',
  imports: [
    TableWrapperComponent,
    ButtonModule,
    FiltersCustomersComponent,
    TooltipModule,
    TranslateModule,
    ViewCustomerComponent,
    MenuModule,
    Dialog,
    TranslateModule,
    FormsModule,
    ToggleSwitchModule,
  ],
  templateUrl: './customers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CustomersComponent extends BaseIndexComponent<Customer> {
  isActive = viewChild.required<TemplateRef<any>>('isActive');

  ngOnInit() {
    this.dialogComponent = CuCustomerDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: 'user/index',
        delete: 'user/delete',
      },
      navigateCreatePage: 'new-customer',
      displayViewButton: true,
      indexTitle: this.#translate(_('Customers')),
      indexIcon: 'pi pi-users',
      createBtnLabel: this.#translate(_('Create Customers')),
      indexTableKey: 'CUSTOMERS_KEY',
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

    this.filtersData.update((filters) => ({
      ...filters,
      customFilters: {
        type: 'customer',
      },
    }));

    this.initRolesUser();
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }
}
