import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GlobalListService } from '@gService/global-list.service';
import { _ } from '@ngx-translate/core';
import { UserFieldsService } from '@pages/users/services/users-fields.service';
import { AuthService, BaseCreateUpdateComponent } from '@shared';
import { FormDialogComponent } from 'src/app/shared/components/base-create-update/form-dialog/form-dialog.component';
import { User, UserModel } from '../../services/services-type';

@Component({
  selector: 'app-cu-customer-dialog',
  imports: [FormDialogComponent],
  providers: [UserFieldsService],
  templateUrl:
    '../../../../shared/components/base-create-update/base-create-update.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuUserDialogComponent extends BaseCreateUpdateComponent<UserModel> {
  #globalList = inject(GlobalListService);
  #auth = inject(AuthService);
  fieldsService = inject(UserFieldsService);
  #list$ = this.#globalList.getGlobalList('user');

  ngOnInit() {
    const isCreateMode = !this.editData || this.editData.method === 'create';
    const dialogTitle = isCreateMode ? _('Create New User') : _('Update User');
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

    this.model = new UserModel(this.editData);
    this.fields = this.fieldsService.configureFields(this.editData);
  }

  override updateUi(model: UserModel) {
    const isCurrentUser = this.#auth.currentUser()?.id === model.id;
    if (isCurrentUser) {
      const updateModel = { ...this.#auth.currentUser(), ...model } as User;
      this.#auth.setCurrentUser(updateModel);
    }
  }
}
