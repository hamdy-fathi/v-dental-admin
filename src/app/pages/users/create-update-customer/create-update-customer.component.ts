import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormComponent } from '@shared';
import { FormPageComponent } from 'src/app/shared/components/form-page/form-page.component';
import { SpinnerComponent } from '../../../shared/components/spinner.component';
import { CustomersFieldsService } from '../services/customers-fields.service';
import { CustomerModel } from '../services/services-type';

@Component({
  selector: 'app-create-update-customer',
  imports: [AsyncPipe, FormComponent, SpinnerComponent],
  templateUrl: '../../../shared/components/form-page/form-page.component.html',
  providers: [CustomersFieldsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateUpdateCustomerComponent extends FormPageComponent {
  fieldsService = inject(CustomersFieldsService);

  ngOnInit() {
    this.pageList$ = this.fieldsService.pageList$;
    this.filtersQuery() ? this.setupForm(true) : this.setupForm(false);
    this.fields.set(this.fieldsService.configureFields(this.filtersQuery()));
    this.navigateAfterSubmit.set('customers');
  }

  setupForm(isUpdate: boolean) {
    this.model = isUpdate
      ? new CustomerModel(this.filterDataForUpdate(new CustomerModel()))
      : new CustomerModel();

    this.formTitle.set(isUpdate ? 'Update Customer' : 'Create New Customer');
    this.submitLabel.set(isUpdate ? 'Update' : 'Create');
    this.endpoint.set(isUpdate ? 'user/update' : 'user/store');
  }
}
