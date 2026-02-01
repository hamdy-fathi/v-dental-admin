import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { _ } from '@ngx-translate/core';
import { BaseCreateUpdateComponent } from '@shared';
import { FormDialogComponent } from 'src/app/shared/components/base-create-update/form-dialog/form-dialog.component';
import { BeforeAfterFieldsService } from '../../services/before-after-fields.service';
import { BeforeAfterModel } from '../../services/services-type';

@Component({
  selector: 'app-cu-before-after-dialog',
  imports: [FormDialogComponent],
  providers: [BeforeAfterFieldsService],
  templateUrl:
    '../../../../shared/components/base-create-update/base-create-update.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuBeforeAfterDialogComponent extends BaseCreateUpdateComponent<BeforeAfterModel> {
  fieldsService = inject(BeforeAfterFieldsService);

  ngOnInit() {
    const isCreateMode = !this.editData || this.editData.method === 'create';
    const dialogTitle = isCreateMode
      ? _('Create Before/After Case')
      : _('Update Before/After Case');
    const submitButtonLabel = isCreateMode ? _('create') : _('update');

    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: 'before-after/store',
        update: 'before-after/update',
      },
      dialogTitle,
      submitButtonLabel,
    };

    this.isDisabled = computed(() => this.fieldsService.isUploading());
    this.model = new BeforeAfterModel(this.editData);
    this.fields = this.fieldsService.configureFields(this.editData);
  }
}

