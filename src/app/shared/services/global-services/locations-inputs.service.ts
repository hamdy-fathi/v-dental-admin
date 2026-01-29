import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { CacheService, FieldBuilderService } from '@shared';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationsInputsService {
  #fieldBuilder = inject(FieldBuilderService);
  #cacheList = inject(CacheService);
  #destroyRef = inject(DestroyRef);

  countryKey = signal('countryId');
  regionKey = signal('regionId');
  cityKey = signal('cityId');
  areaKey = signal('areaId');

  getLocationFields(data?: any): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.getCountryField(),
        this.getRegionField(),
        this.getCityField(),
        this.getAreaField(),
      ]),
    ];
  }

  getLocationsOptions(field: FormlyFieldConfig | undefined, endpoint: string) {
    this.#cacheList
      .getData(endpoint, 'get', undefined, endpoint)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((data) => {
        field?.props &&
          (field.props.options = data?.map((item: any) => ({
            label: item.label,
            value: item.value,
          })));
      });
  }

  getCountryField(data?: any): FormlyFieldConfig {
    return {
      key: this.countryKey(),
      type: 'select-field',
      className: data?.className ?? 'col-12 md:col-3',
      resetOnHide: false,
      expressions: {
        hide: data?.hide ?? false,
        'props.required': data?.required ?? false,
        'props.disabled': data?.disabled ?? false,
      },
      props: {
        label: _('country'),
        isFloatedLabel: true,
        filter: true,
        options: [],
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
      hooks: {
        onInit: (field) => {
          const regionField = field.parent?.get?.(this.regionKey());
          this.getLocationsOptions(field, 'location/select-options');

          if (field.formControl?.value) {
            this.getLocationsOptions(
              regionField,
              `location/select-options?parentId=${field.formControl?.value}`,
            );
          }
          return field.formControl?.valueChanges.pipe(
            tap((id) => {
              if (id) {
                this.getLocationsOptions(
                  regionField,
                  `location/select-options?parentId=${id}`,
                );
              }
              regionField?.formControl?.setValue(null);
            }),
          );
        },
      },
    };
  }

  getRegionField(data?: any): FormlyFieldConfig {
    return {
      key: this.regionKey(),
      type: 'select-field',
      className: data?.className ?? 'col-12 md:col-3',
      resetOnHide: false,
      expressions: {
        hide: data?.hide ?? ((field) => !field.model?.[this.countryKey()]),
        'props.required': data?.required ?? false,
        'props.disabled': data?.disabled ?? false,
      },
      props: {
        label: _('region'),
        isFloatedLabel: true,
        filter: true,
        options: [],
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
      hooks: {
        onInit: (field) => {
          const cityField = field.parent?.get?.(this.cityKey());

          if (field.formControl?.value) {
            this.getLocationsOptions(
              cityField,
              `location/select-options?parentId=${field.formControl?.value}`,
            );
          }

          return field.formControl?.valueChanges.pipe(
            tap((id) => {
              if (id) {
                this.getLocationsOptions(
                  cityField,
                  `location/select-options?parentId=${id}`,
                );
              }
              cityField?.formControl?.setValue(null);
            }),
          );
        },
      },
    };
  }

  getCityField(data?: any): FormlyFieldConfig {
    return {
      key: this.cityKey(),
      type: 'select-field',
      className: data?.className ?? 'col-12 md:col-3',
      resetOnHide: false,
      expressions: {
        hide: data?.hide ?? ((field) => !field.model?.[this.regionKey()]),
        'props.required': data?.required ?? false,
        'props.disabled': data?.disabled ?? false,
      },
      props: {
        label: _('city'),
        isFloatedLabel: true,
        filter: true,
        options: [],
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
      hooks: {
        onInit: (field) => {
          const areaField = field.parent?.get?.(this.areaKey());

          if (field.formControl?.value) {
            this.getLocationsOptions(
              areaField,
              `location/select-options?parentId=${field.formControl?.value}`,
            );
          }

          return field.formControl?.valueChanges.pipe(
            tap((id) => {
              if (id) {
                this.getLocationsOptions(
                  areaField,
                  `location/select-options?parentId=${id}`,
                );
              }
              areaField?.formControl?.setValue(null);
            }),
          );
        },
      },
    };
  }

  getAreaField(data?: any): FormlyFieldConfig {
    return {
      key: this.areaKey(),
      type: 'select-field',
      className: data?.className ?? 'col-12 md:col-3',
      resetOnHide: false,
      expressions: {
        hide: data?.hide ?? ((field) => !field.model?.[this.cityKey()]),
        'props.required': data?.required ?? false,
        'props.disabled': data?.disabled ?? false,
      },
      props: {
        label: _('area place'),
        isFloatedLabel: true,
        filter: true,
        options: [],
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
    };
  }
}
