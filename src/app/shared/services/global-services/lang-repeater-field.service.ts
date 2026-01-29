import { Injectable, inject } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith, tap } from 'rxjs';
import { FieldBuilderService } from '../forms/field-builder.service';
import { StaticDataService } from './static-data.service';

@Injectable({
  providedIn: 'root',
})
export class LangRepeaterFieldService {
  #staticDataService = inject(StaticDataService);
  #fieldBuilder = inject(FieldBuilderService);
  #translate = inject(TranslateService);

  getlangRepeaterField(
    fields: FormlyFieldConfig[] = [],
    key: string = 'content',
  ): FormlyFieldConfig {
    return {
      key,
      type: 'repeat-field',
      props: {
        addBtnText: this.#translate.instant(_('add_translation')),
        disabledRepeater: false,
      },
      hooks: {
        onInit: (field: FormlyFieldConfig) => {
          return field.formControl?.valueChanges.pipe(
            startWith(field.model || []),
            tap((langs) => {
              if (!field.props) return;
              if (
                langs.length === this.#staticDataService.languageOptions?.length
              ) {
                return (field.props.disabledRepeater = true);
              } else {
                return (field.props.disabledRepeater = false);
              }
            }),
          );
        },
      },
      fieldArray: this.#fieldBuilder.fieldBuilder([
        {
          key: 'language_id',
          type: 'select-field',
          props: {
            required: true,
            label: _('languages'),
            options: this.#staticDataService.languageOptions,
          },
          hooks: {
            onInit: (field: FormlyFieldConfig) => {
              const repeaterField = field.parent?.parent;
              if (!repeaterField?.formControl) return;

              const getCurrentIndex = () => {
                const arrayItem = field.parent;
                if (!arrayItem || !repeaterField.fieldGroup) return -1;
                return repeaterField.fieldGroup.indexOf(arrayItem);
              };

              const options$ = repeaterField.formControl.valueChanges.pipe(
                startWith(repeaterField.model || []),
                map((items: any[]) => {
                  const currentIndex = getCurrentIndex();
                  const selectedLanguageIds = items
                    .map((item, index) =>
                      index !== currentIndex ? item?.language_id : null,
                    )
                    .filter(
                      (id): id is number => id !== null && id !== undefined,
                    );

                  return (
                    this.#staticDataService.languageOptions?.map(
                      (option: any) => {
                        const isSelected = selectedLanguageIds.includes(
                          option.value,
                        );
                        return {
                          ...option,
                          disabled: isSelected,
                        };
                      },
                    ) || []
                  );
                }),
              );

              options$.subscribe((options) => {
                if (field.props) {
                  field.props.options = options;
                }
              });

              return options$;
            },
          },
        },
        ...fields,
      ]),
    };
  }
}
