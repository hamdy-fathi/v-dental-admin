import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GlobalListService } from '@gService/global-list.service';
import { _ } from '@ngx-translate/core';
import { CustomersFieldsService } from '@pages/users/services/customers-fields.service';
import { AuthService, BaseCreateUpdateComponent } from '@shared';
import { of } from 'rxjs';
import { FormDialogComponent } from 'src/app/shared/components/base-create-update/form-dialog/form-dialog.component';
import { CustomerModel } from '../../services/services-type';

@Component({
  selector: 'app-cu-customer-dialog',
  imports: [FormDialogComponent],
  providers: [CustomersFieldsService],
  templateUrl:
    '../../../../shared/components/base-create-update/base-create-update.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuCustomerDialogComponent extends BaseCreateUpdateComponent<CustomerModel> {
  #globalList = inject(GlobalListService);
  fieldsService = inject(CustomersFieldsService);
  #list$ = of(1);
  #auth = inject(AuthService);

  ngOnInit() {
    const isCreateMode = !this.editData || this.editData.method === 'create';
    const dialogTitle = isCreateMode
      ? _('Create New Customer')
      : _('Update Customer');
    const submitButtonLabel = isCreateMode ? _('create') : _('update');

    this.dialogMeta = {
      ...this.dialogMeta,
      dialogData$: this.#list$,
      endpoints: {
        store: 'user/store',
        update: 'user/update',
      },
      dialogTitle,
      submitButtonLabel,
    };

    this.model = new CustomerModel(this.editData);
    this.fields = this.fieldsService.configureFields(this.editData);
  }
}
