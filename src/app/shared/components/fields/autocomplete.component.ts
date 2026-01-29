import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FloatLabel } from 'primeng/floatlabel';
import { AutocompleteFieldComponent } from './autocomplete-field/autocomplete-field.component';

@Component({
  selector: 'formly-autocomplete-field',
  template: `
    <div class="p-field z-5">
      <p-floatlabel variant="on">
        <app-autocomplete-field
          [useFormly]="true"
          [formControl]="formControl"
          [formlyAttributes]="field"
          [entity]="props.entity"
          [multiple]="props.multiple"
          [transformFn]="getTransformFn()"
          [sideEffectFn]="getSideEffectFn()"
          [placeholder]="props.placeholder ?? ''"
        />

        @if (props.label) {
          <label class="capitalize">
            {{ props.label }}
            @if (props.required && props.hideRequiredMarker !== true) {
              <span class="text-red">*</span>
            }
          </label>
        }
      </p-floatlabel>

      @if (props.description) {
        <p class="mt-1 mb-0 font-medium text-xs text-primary capitalize">
          {{ props.description }}
        </p>
      }

      @if (showError && formControl.errors) {
        <small class="error-msg" role="alert">
          <formly-validation-message [field]="field" />
        </small>
      }
    </div>
  `,
  styles: `
    :host ::ng-deep {
      .p-floatlabel-on:has(.ng-select.ng-select-filtered) label,
      .p-floatlabel-on:has(.ng-select-container.ng-has-value) label {
        top: 0;
        transform: translateY(-50%);
        border-radius: var(--azalove-floatlabel-on-border-radius);
        background: var(--azalove-floatlabel-on-active-background);
        padding: var(--azalove-floatlabel-on-active-padding);
        font-size: var(--azalove-floatlabel-active-font-size);
        font-weight: var(--azalove-floatlabel-label-active-font-weight);
      }
    }
  `,
  imports: [FormlyModule, FloatLabel, AutocompleteFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent extends FieldType<FieldTypeConfig> {
  getTransformFn() {
    return this.props.transformFn || ((items: any[]) => items);
  }

  getSideEffectFn() {
    return (data: any) => {
      if (this.props.sideEffectFn) {
        this.props.sideEffectFn(data, this.field);
      }
    };
  }
}
