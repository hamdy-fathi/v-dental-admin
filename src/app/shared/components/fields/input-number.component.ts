import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { AutoFocus } from 'primeng/autofocus';
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'formly-input-number-field',
  template: `
    <div [ngClass]="{ 'p-field': !props.isNotPField }">
      @if (props.label) {
        <label class="capitalize">
          {{ props.label }}
          @if (props.required && props.hideRequiredMarker !== true) {
            <span class="text-red">*</span>
          }
        </label>
      }
      @if (props.description) {
        <p class="mb-3 text-xs">{{ props.description }}</p>
      }

      <p-inputnumber
        [pAutoFocus]="props.focused"
        [formlyAttributes]="field"
        [formControl]="formControl"
        [class.ng-dirty]="showError"
        class="w-full"
        [styleClass]="props.styleClass"
        [inputStyleClass]="props.inputStyleClass"
        [placeholder]="props.placeholder"
        [required]="props.required ?? false"
        [mode]="props.mode ?? 'decimal'"
        [format]="props.format ?? true"
        [useGrouping]="props.useGrouping ?? true"
        [prefix]="props.prefix"
        [suffix]="props.suffix"
        [locale]="locale"
        [min]="props.min"
        [max]="props.max"
        [step]="props.step ?? 1"
        [allowEmpty]="props.allowEmpty ?? true"
        [showButtons]="props.showButtons"
        [buttonLayout]="props.buttonLayout"
        [autocomplete]="props.autocomplete"
        [inputId]="props.inputId"
        [showClear]="props.showClear"
        (onInput)="props.onInput && props.onInput(field, $event)"
        (onKeyDown)="props.onKeyDown && props.onKeyDown(field, $event)"
        (onBlur)="props.onBlur && props.onBlur(field, $event)"
      />

      @if (showError && formControl.errors) {
        <small class="error-msg" role="alert">
          <formly-validation-message [field]="field" />
        </small>
      }
    </div>
  `,
  imports: [FormlyModule, NgClass, InputNumber, AutoFocus, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberComponent extends FieldType<FieldTypeConfig> {
  public locale = inject(LOCALE_ID);
}
