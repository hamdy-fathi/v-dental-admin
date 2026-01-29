import { AsyncPipe, NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FieldType, FieldTypeConfig, FormlyModule } from "@ngx-formly/core";
import { RadioButton } from "primeng/radiobutton";
import { Observable, of } from "rxjs";

@Component({
  selector: 'formly-radio-field',
  template: `
    <div [ngClass]="{ 'p-field': !props.isNotPField }">
      @if (props.label) {
        <label class="mb-3">
          {{ props.label }}
          @if (props.required && props.hideRequiredMarker !== true) {
            <span class="text-red">*</span>
          }
        </label>
      }

      @if (props.description) {
        <p class="mb-3 text-xs">{{ props.description }}</p>
      }

      <div
        [ngClass]="{ 'flex-column': props.direction === 'column' }"
        class="flex flex-wrap column-gap-3 row-gap-2"
      >
        @for (option of options$ | async; track option.value; let i = $index) {
          <p-radiobutton
            [inputId]="'field-' + i"
            [formControl]="option.disabled ? disabledControl : formControl"
            [formlyAttributes]="field"
            [name]="field.name || id"
            [value]="option.value"
            (onClick)="props.change && props.change(field, $event)"
          />
          <label
            [for]="'field-' + i"
            class="text-sm"
            [class.cursor-pointer]="!option.disabled"
          >
            {{ option.label }}
          </label>
        }
      </div>

      @if (showError && formControl.errors) {
        <small class="error-msg" role="alert">
          <formly-validation-message [field]="field" />
        </small>
      }
    </div>
  `,
  imports: [NgClass, AsyncPipe, FormlyModule, RadioButton, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent extends FieldType<FieldTypeConfig> {
  get options$(): Observable<any[]> {
    return Array.isArray(this.props.options)
      ? of(this.props.options)
      : this.props.options ?? of([]);
  }

  get disabledControl() {
    return new FormControl({ value: this.formControl.value, disabled: true });
  }
}
