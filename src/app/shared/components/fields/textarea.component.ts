import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { AnimationElementDirective } from '../../directives/animation-element.directive';

@Component({
  selector: 'formly-textarea-input',
  template: `
    <div [ngClass]="{ 'p-field': !props.isNotPField }">
      <p-floatlabel variant="on">
        <textarea
          pTextarea
          class="w-full"
          [formControl]="formControl"
          [formlyAttributes]="field"
          [rows]="props.rows"
        ></textarea>

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
    TextareaModule,
    FloatLabel,
    FormlyModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent extends FieldType<FieldTypeConfig> {}
