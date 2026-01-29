import {
    ChangeDetectionStrategy,
    Component,
    input,
    numberAttribute,
    TemplateRef,
    viewChild,
} from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import { BaseIndexComponent, TableWrapperComponent } from '@shared';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { environment } from '@env';
import { ImageModule } from 'primeng/image';
import { filter, tap } from 'rxjs';
import { CuCategoryDialogComponent } from '../dialog/cu/cu-categories-dialog.component';
import { ViewCategoryComponent } from '../dialog/view/view-categories.component';
import { Category } from '../services/services-type';

@Component({
  selector: 'app-categories',
  imports: [
    TableWrapperComponent,
    ButtonModule,
    TooltipModule,
    RouterLink,
    TranslateModule,
    ImageModule,
    ViewCategoryComponent,
    MenuModule,
    Dialog,
    TranslateModule,
  ],
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CategoriesComponent extends BaseIndexComponent<Category> {
  image = viewChild.required<TemplateRef<any>>('image');
  name = viewChild.required<TemplateRef<any>>('name');
  domainUrl = environment.Domain_URL;
  categoryId = input.required({ transform: numberAttribute });
  categoryType = input.required();

  ngOnInit() {
    this.dialogComponent = CuCategoryDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      displayFilterButton : false,
      provideFields: ['content'],
      endpoints: {
        index: !this.categoryId() ? 'category/index' : 'sub-category/index',
        delete: !this.categoryId() ? 'category/delete' : 'sub-category/delete',
      },
      navigateCreatePage: 'new-category',
      displayViewButton: true,
      indexTitle: this.#translate(_('Categories')),
      indexIcon: 'pi pi-tags',
      createBtnLabel: this.#translate(_('Create Category')),
      indexTableKey: 'CATEGORIES_KEY',
      columns: [
        {
          title: this.#translate(_('#ID')),
          name: `id`,
          searchable: false,
          orderable: false,
        },
        {
          title: this.#translate(_('name')),
          name: `content.name`,
          searchable: true,
          orderable: false,
          render: this.name(),
        },
        {
          title: this.#translate(_('slug')),
          name: `slug`,
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('categoty type')),
          name: `categoryType`,
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('Created At')),
          name: 'createdAt',
          searchable: false,
          orderable: false,
        },
      ],
    };

    this.initRolesUser();
  }

  parentCategoryId$ = toObservable(this.categoryId).pipe(
    filter((categoryId) => !!categoryId),
    tap((categoryId) => {
      this.globalFilterValue.set(null);
      this.filtersData.update((oldData) => ({
        ...oldData,
        search: { value: null, regex: false },
        parentId: categoryId,
      }));
      const data = { parentId: categoryId, method: 'create' , categoryType: this.categoryType()};
      this.dialogConfig = { ...this.dialogConfig, data };
    }),
  );

  parentCategoryIdReadonly = toSignal(this.parentCategoryId$);

  override openUpdateRecordDialog(oldModel: any) {
    const model = { ...oldModel, parentId: this.categoryId() };
    super.openUpdateRecordDialog(model);
  }

  override navigateCreatePage() {
    console.log(this.categoryType() , this.categoryId());
    const data = this.categoryId()
      ? { categoryId: this.categoryId(), method: 'create' , categoryType: this.categoryType() }
      : undefined;
    super.navigateCreatePage(undefined, data);
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }

  getName(category: Category): string {
    return this.getMultilingualField(category, 'name');
  }
}
