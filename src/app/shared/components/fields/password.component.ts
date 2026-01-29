import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { PasswordModule } from 'primeng/password';
import { AnimationElementDirective } from '../../directives/animation-element.directive';

@Component({
  selector: 'formly-password-field',
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

      <p-password
        [formControl]="formControl"
        [formlyAttributes]="field"
        [placeholder]="props.placeholder"
        [required]="props.required ?? false"
        [class.ng-dirty]="showError"
        [feedback]="props.feedback"
        [toggleMask]="props.toggleMask"
        [showClear]="false"
        [inputStyleClass]="'w-full ' + props.inputStyleClass"
        styleClass="w-full"
      />

      @if (showError && formControl.errors) {
        <small class="error-msg" role="alert">
          <formly-validation-message [field]="field" />
        </small>
      }
    </div>
  `,
  imports: [
    FormlyModule,
    NgClass,
    PasswordModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordComponent extends FieldType<FieldTypeConfig> {}
