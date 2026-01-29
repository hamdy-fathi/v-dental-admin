import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { Checkbox } from 'primeng/checkbox';
import { AnimationElementDirective } from '../../directives/animation-element.directive';

@Component({
  selector: 'formly-checkbox-field',
  template: `
    <div class="p-field">
      <div class="flex align-items-center gap-2">
        <p-checkbox
          [inputId]="'field-' + id"
          [formControl]="formControl"
          [formlyAttributes]="field"
          [binary]="true"
          [required]="props.required ?? false"
          [trueValue]="props.trueValue ?? true"
          [falseValue]="props.falseValue ?? false"
          (onChange)="props.change && props.change(field, $event)"
        />
        <label
          [for]="'field-' + id"
          class="cursor-pointer text-base mb-0 capitalize"
        >
          {{ props.label }}
        </label>
      </div>

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
  imports: [
    FormlyModule,
    Checkbox,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent extends FieldType<FieldTypeConfig> {}
