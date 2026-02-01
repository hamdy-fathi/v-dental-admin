import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { resolveMediaUrl } from '@shared';
import { TranslateModule } from '@ngx-translate/core';
import { BaseIndexComponent, TableWrapperComponent } from '@shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { catchError, map, of, tap } from 'rxjs';
import { CuBeforeAfterDialogComponent } from '../dialog/cu/cu-before-after-dialog.component';
import { ViewBeforeAfterComponent } from '../dialog/view/view-before-after.component';
import { BeforeAfterCase } from '../services/services-type';

@Component({
  selector: 'app-before-after',
  standalone: true,
  imports: [
    TableWrapperComponent,
    ButtonModule,
    TooltipModule,
    TranslateModule,
    ImageModule,
    ViewBeforeAfterComponent,
    MenuModule,
    Dialog,
  ],
  templateUrl: './before-after.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BeforeAfterComponent extends BaseIndexComponent<BeforeAfterCase> {
  beforeImage = viewChild.required<TemplateRef<any>>('beforeImage');
  afterImage = viewChild.required<TemplateRef<any>>('afterImage');
  description = viewChild.required<TemplateRef<any>>('description');
  mediaUrl = resolveMediaUrl;

  ngOnInit() {
    this.dialogComponent = CuBeforeAfterDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: 'before-after/index',
        delete: 'before-after/delete',
      },
      provideFields: ['before', 'after', 'description'],
      displayViewButton: true,
      displayFilterButton: false,
      indexTitle: this.#translate(_('Before/After Cases')),
      indexIcon: 'pi pi-images',
      createBtnLabel: this.#translate(_('Create Case')),
      indexTableKey: 'BEFORE_AFTER_KEY',
      columns: [
        {
          title: this.#translate(_('#ID')),
          name: 'id',
          searchable: false,
          orderable: false,
        },
        {
          title: this.#translate(_('Before')),
          name: 'before',
          searchable: false,
          orderable: false,
          render: this.beforeImage(),
        },
        {
          title: this.#translate(_('After')),
          name: 'after',
          searchable: false,
          orderable: false,
          render: this.afterImage(),
        },
        {
          title: this.#translate(_('Description')),
          name: 'description',
          searchable: true,
          orderable: false,
          render: this.description(),
        },
   
      ],
    };

    this.initRolesUser();
  }

  protected override loadRecords(_: LazyLoadEvent) {
    this.isLoading.set(true);
    this.api
      .request(
        'get',
        this.indexMeta.endpoints.index,
        undefined,
        undefined,
        undefined,
        this.indexMeta.indexApiVersion,
      )
      .pipe(
        map(({ data }) => data),
        tap((data) => {
          const records = Array.isArray(data) ? data : data?.data || [];
          this.records.set(records);
          this.totalRecords.set(data?.totalRecords ?? records.length);
          this.recordsFiltered.set(data?.recordsFiltered ?? records.length);
          this.isLoading.set(false);
        }),
        catchError(() => {
          this.isLoading.set(false);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }
}

