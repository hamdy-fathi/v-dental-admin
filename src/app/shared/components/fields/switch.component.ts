import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FieldType, FieldTypeConfig, FormlyModule } from "@ngx-formly/core";
import { ToggleSwitch } from "primeng/toggleswitch";

@Component({
  selector: 'formly-switch-field',
  template: `
    <div [ngClass]="{ 'p-field': !props.isNotPField }">
      <div class="flex gap-2 align-items-center">
        <p-toggleswitch
          [formControl]="formControl"
          [formlyAttributes]="field"
          [trueValue]="props.trueValue ?? true"
          [falseValue]="props.falseValue ?? false"
          (onChange)="props.change && props.change(field, $event)"
        />

        @if (props.label) {
          <label [ngClass]="props.labelClass" class="switch-label">
            {{ props.label }}
            @if (props.required && props.hideRequiredMarker !== true) {
              <span class="text-red">*</span>
            }
          </label>
        }
      </div>

      @if (props.description) {
        <p class="mt-2 text-xs">{{ props.description }}</p>
      }

      @if (showError && formControl.errors) {
        <small class="error-msg" role="alert">
          <formly-validation-message [field]="field" />
        </small>
      }
    </div>
  `,
  styles: `::ng-deep p-inputSwitch { font-size: 0 }`,
  imports: [NgClass, FormlyModule, ToggleSwitch, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchComponent extends FieldType<FieldTypeConfig> {}
