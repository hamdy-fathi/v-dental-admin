import { inject, Injectable, signal } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { GlobalListService } from '@gService/global-list.service';
import { TranslateService } from '@ngx-translate/core';
import { FieldBuilderService, LangRepeaterFieldService } from '@shared';
import { map } from 'rxjs';
import { ContentByLanguagePipe } from '../../../shared/pipes/content-by-language.pipe';

@Injectable({
  providedIn: 'root',
})
export class BlogFieldsService {
  translate = inject(TranslateService);
  #globalList = inject(GlobalListService);
  fieldBuilder = inject(FieldBuilderService);
  langRepeaterService = inject(LangRepeaterFieldService);
  #contentByLanguage = inject(ContentByLanguagePipe);
  pageList$ = this.#globalList.getGlobalList('blog');
  isSingleUploading = signal(false);
  isMultiUploading = signal(false);

  configureFields(editData: any) {
    return [
      {
        type: 'separator-field',
        fieldGroupClassName: 'col-12',
        props: {
          title: _('Content'),
        },
      },
      this.langRepeaterService.getlangRepeaterField(
        [
          {
            key: 'title',
            type: 'input-field',
            className: 'md:col-6 col-12',
            props: {
              required: true,
              label: _('Title'),
            },
          },
          {
            key: 'subTitle',
            type: 'input-field',
            className: 'md:col-6 col-12',
            props: {
              required: true,
              label: _('sub title'),
            },
          },
          {
            key: 'metaTitle',
            type: 'input-field',
            className: 'md:col-6 col-12',
            props: {
              required: true,
              label: _('metaTitle'),
            },
          },
          {
            key: 'description',
            type: 'editor-field',
            className: 'col-12',
            props: {
              required: true,
              label: _('Description'),
            },
          },
          {
            key: 'shortDescription',
            type: 'textarea-field',
            className: 'col-12',
            props: {
              label: _('short description'),
              rows: 3,
              autoResize: true,
            },
          },
          {
            key: 'metaDescription',
            type: 'textarea-field',
            className: 'col-12',
            props: {
              label: _('metaDescription'),
              rows: 3,
              autoResize: true,
            },
          },
        ],
        'content',
      ),
      this.fieldBuilder.fieldBuilder([
        {
          key: 'slug',
          type: 'input-field',
          className: 'md:col-4 col-12',
          props: {
            required: true,
            label: _('slug'),
          },
        },
        {
          key: 'order',
          type: 'input-field',
          className: 'md:col-4 col-12',
          props: {
            type: 'number',
            required: true,
            label: _('order sort'),
          },
        },
        {
          key: 'isPublished',
          type: 'switch-field',
          className: 'md:col-2 col-12',
          props: {
            label: _('isPublished'),
          },
        },
        {
          key: 'isFeatured',
          type: 'switch-field',
          className: 'md:col-2 col-12',
          props: {
            label: _('isFeatured'),
          },
        },
      ]),
      this.fieldBuilder.fieldBuilder([
        {
          key: 'startDate',
          type: 'date-field',
          className: 'md:col-6 col-12',
          props: {
            required: true,
            label: _('start Date'),
          },
        },
        {
          key: 'endDate',
          type: 'date-field',
          className: 'md:col-6 col-12',
          props: {
            required: true,
            label: _('end Date'),
          },
        },
      ]),
      this.fieldBuilder.fieldBuilder([
        {
          key: 'categoryIds',
          type: 'select-field',
          className: 'md:col-6 col-12',
          props: {
            required: true,
            multiple: true,
            label: _('Select category'),
            options: this.pageList$.pipe(
              map(({ categories }) =>
                (categories?.data || []).map((cat: any) => {
                  const selectedContent = this.#contentByLanguage.transform(
                    cat.content,
                  ) as { name?: string } | undefined;

                  return {
                    label: selectedContent?.name || cat.slug || `Category #${cat.id}`,
                    value: cat.id,
                  };
                }),
              ),
            ),
          },
        },
      ]),
      this.fieldBuilder.fieldBuilder([
        {
          key: 'thumb',
          type: 'file-field',
          props: {
            required: true,
            type: 'image',
            isUploading: this.isSingleUploading,
            chooseLabel: _('thumb'),
            description: _('Allowed format is jpeg, jpg, png'),
            fileLabel: _('thumb'),
            mode: !editData ? 'create' : 'update',
          },
        },
      ]),
    ];
  }
}
