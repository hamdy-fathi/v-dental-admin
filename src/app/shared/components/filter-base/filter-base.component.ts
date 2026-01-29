import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FiltersData } from '@gService/global';
import { GlobalListService } from '@gService/global-list.service';
import { LangService } from '@gService/lang.service';
import {
  FormlyFieldConfig,
  FormlyFormOptions,
  FormlyModule,
} from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { FieldBuilderService } from '../../services';

@Component({
  selector: 'app-filter-base',
  imports: [FormlyModule, NgClass, ReactiveFormsModule],
  templateUrl: './filter-base.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBaseComponent {
  translate = inject(TranslateService);
  displayFilters = input.required<boolean>();
  fieldBuilder = inject(FieldBuilderService);
  currentLang = inject(LangService).currentLanguage;
  globalList = inject(GlobalListService);

  filtersData = model<FiltersData | null>();
  model = {};
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  fields = [] as FormlyFieldConfig[];

  sendModel() {
    if (Object.keys(this.model).length === 0) return;
    this.filtersData.update((filters) => ({
      ...filters,
      customFilters: {
        ...this.model,
      },
    }));
  }

  refreshModel() {
    const modelKeys = Object.keys(this.model);
    if (modelKeys.length === 0) return;
    this.options.resetModel?.();
    this.filtersData.update((oldFilters) => {
      const updatedFilters = { ...oldFilters };
      delete updatedFilters.customFilters;
      return updatedFilters;
    });
  }
}
