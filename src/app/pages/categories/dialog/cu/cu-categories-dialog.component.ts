import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GlobalListService } from '@gService/global-list.service';
import { _ } from '@ngx-translate/core';
import { CategoryFieldsService } from '@pages/categories/services/categories-fields.service';
import { BaseCreateUpdateComponent } from '@shared';
import { FormDialogComponent } from 'src/app/shared/components/base-create-update/form-dialog/form-dialog.component';
import { CategoryModel } from '../../services/services-type';

@Component({
  selector: 'app-cu-category-dialog',
  imports: [FormDialogComponent],
  providers: [CategoryFieldsService],
  templateUrl:
    '../../../../shared/components/base-create-update/base-create-update.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuCategoryDialogComponent extends BaseCreateUpdateComponent<CategoryModel> {
  #globalList = inject(GlobalListService);
  fieldsService = inject(CategoryFieldsService);
  #list$ = this.#globalList.getGlobalList('category');

  ngOnInit() {
    const isCreateMode = !this.editData || this.editData.method === 'create';
    const hasParentId = this.editData?.parentId;
    const categoryType = hasParentId ? 'Subcategory' : 'Category';
    const dialogTitle = isCreateMode
      ? _(`Create New ${categoryType}`)
      : _(`Update ${categoryType}`);
    const submitButtonLabel = isCreateMode ? _('create') : _('update');
    this.dialogMeta = {
      ...this.dialogMeta,
      dialogData$: this.#list$,
      endpoints: {
        store: hasParentId ? 'sub-category/store' : 'category/store',
        update: hasParentId ? 'sub-category/update' : 'category/update',
      },
      dialogTitle,
      submitButtonLabel,
    };

    this.model = new CategoryModel({
      ...this.editData,
      categoryId: this.editData.parentId,
    });
    this.fields = this.fieldsService.configureFields(this.editData);
  }
}
