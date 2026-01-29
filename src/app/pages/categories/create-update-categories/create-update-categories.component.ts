import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormComponent } from '@shared';
import { FormPageComponent } from 'src/app/shared/components/form-page/form-page.component';
import { SpinnerComponent } from '../../../shared/components/spinner.component';
import { CategoryFieldsService } from '../services/categories-fields.service';
import { CategoryModel } from '../services/services-type';

@Component({
  selector: 'app-create-update-category',
  imports: [AsyncPipe, FormComponent, SpinnerComponent],
  templateUrl: '../../../shared/components/form-page/form-page.component.html',
  providers: [CategoryFieldsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateUpdateCategoryComponent extends FormPageComponent {
  fieldsService = inject(CategoryFieldsService);
  #queryData = {} as { [key: string]: any };

  ngOnInit() {
    this.pageList$ = this.fieldsService.pageList$;
    this.#queryData = JSON.parse(this.filtersQuery() || '{}');
    const isCreate = this.filtersQuery() && this.#queryData.method !== 'create';
    isCreate ? this.setupForm(true) : this.setupForm(false);
    this.fields.set(this.fieldsService.configureFields({showCategoryType:!! this.#queryData.categoryId, ...this.#queryData}));
    this.navigateAfterSubmit.set('categories');
  }

  setupForm(isUpdate: boolean) {
    this.model = isUpdate
      ? new CategoryModel(this.filterDataForUpdate(new CategoryModel()))
      : new CategoryModel({
          categoryId: this.#queryData.categoryId,
          categoryType: this.#queryData.categoryType,
        } as CategoryModel);

    const storeEndpoint = this.#queryData.categoryId
      ? 'sub-category/store'
      : 'category/store';
    const updateEndpoint = this.#queryData.categoryId
      ? 'sub-category/update'
      : 'category/update';

    const titleStore = this.#queryData.categoryId
      ? 'Create New Sub Category'
      : 'Create New Category';

    const titleUpdate = this.#queryData.categoryId
      ? 'Update Sub Category'
      : 'Update Category';

    this.formTitle.set(isUpdate ? titleUpdate : titleStore);
    this.submitLabel.set(isUpdate ? 'Update' : 'Create');
    this.endpoint.set(isUpdate ? updateEndpoint : storeEndpoint);
  }
}
