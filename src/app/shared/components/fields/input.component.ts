import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AnimationElementDirective } from '../../directives/animation-element.directive';

@Component({
  selector: 'formly-input-field',
  template: `
    <div [ngClass]="{ 'p-field': !props.isNotPField }">
      <p-floatlabel variant="on">
        <input
          pInputText
          [class]="'w-full font-medium opacity-0' + props.styleClass"
          [type]="props.type || 'text'"
          [formControl]="formControl"
          [min]="props.min"
          [max]="props.max"
          [formlyAttributes]="field"
        />
        @if (props.label) {
          <label class="capitalize" [ngClass]="props.labelClass">
            {{ props.label }}
            @if (props.required && props.hideRequiredMarker !== true) {
              <span class="text-red">*</span>
            }
          </label>
        }
      </p-floatlabel>

      @if (props.description) {
        <p class="mt-1 mb-0 font-medium text-xs text-primary capitalize">
          {{ props.description }} <i class="fas fa-circle-info text-sm"></i>
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
    NgClass,
    InputTextModule,
    FormlyModule,
    FloatLabel,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent extends FieldType<FieldTypeConfig> {}
