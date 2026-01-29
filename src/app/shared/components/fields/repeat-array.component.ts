import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType, FormlyModule } from '@ngx-formly/core';
import { AnimationElementDirective } from '../../directives/animation-element.directive';
@Component({
  selector: 'formly-repeat-array',
  template: `
    @for (field of field.fieldGroup; track field.id) {
      <div class="bg-gray-50 border-1 border-300 border-round mt-2 p-2">
        <formly-field [field]="field"></formly-field>
      </div>
    }
  `,
  imports: [FormlyModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepeatArrayTypeComponent extends FieldArrayType {}
