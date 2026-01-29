import { inject, Injectable, signal } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { GlobalListService } from '@gService/global-list.service';
import { TranslateService } from '@ngx-translate/core';
import { FieldBuilderService, LangRepeaterFieldService } from '@shared';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryFieldsService {
  translate = inject(TranslateService);
  #globalList = inject(GlobalListService);
  fieldBuilder = inject(FieldBuilderService);
  langRepeaterService = inject(LangRepeaterFieldService);
  pageList$ = of([]);
  isUploading = signal(false);

  configureFields(editData: any) {
    return [
      this.langRepeaterService.getlangRepeaterField(
        [
          {
            key: 'name',
            type: 'input-field',
            className: 'md:col-6 col-12',
            props: {
              required: true,
              label: _('Category Name'),
            },
          },
          {
            key: 'description',
            type: 'textarea-field',
            className: 'col-12',
            props: {
              label: _('Description'),
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
            label: _('Slug'),
          },
          hooks: {
            onInit: (field) => {
              return field.formControl?.valueChanges.pipe(
                tap((value) => {
                  field.formControl?.setValue(value?.toLowerCase().replace(/ /g, '-'), { emitEvent: false });
                  
                }),
              );
            },
          },
        },
      ]),
    ];
  }
}
