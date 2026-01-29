import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormComponent } from '@shared';
import { FormPageComponent } from 'src/app/shared/components/form-page/form-page.component';
import { SpinnerComponent } from '../../../shared/components/spinner.component';
import { CustomersFieldsService } from '../services/customers-fields.service';
import { UserModel } from '../services/services-type';
import { UserFieldsService } from '../services/users-fields.service';

@Component({
  selector: 'app-create-update-user',
  imports: [AsyncPipe, FormComponent, SpinnerComponent],
  templateUrl: '../../../shared/components/form-page/form-page.component.html',
  providers: [CustomersFieldsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateUpdateUserComponent extends FormPageComponent {
  fieldsService = inject(UserFieldsService);

  ngOnInit() {
    this.pageList$ = this.fieldsService.pageList$;
    this.filtersQuery() ? this.setupForm(true) : this.setupForm(false);
    this.fields.set(this.fieldsService.configureFields(this.filtersQuery()));
    this.navigateAfterSubmit.set('users');
  }

  setupForm(isUpdate: boolean) {
    this.model = isUpdate
      ? new UserModel(this.filterDataForUpdate(new UserModel()))
      : new UserModel();

    this.formTitle.set(isUpdate ? 'Update User' : 'Create New User');
    this.submitLabel.set(isUpdate ? 'Update' : 'Create');
    this.endpoint.set(isUpdate ? 'user/update' : 'user/store');
  }
}
