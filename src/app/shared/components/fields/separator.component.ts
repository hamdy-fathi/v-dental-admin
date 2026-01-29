import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { AnimationElementDirective } from '../../directives/animation-element.directive';

@Component({
  selector: 'formly-separator-field',
  template: `
    <h2 class="flex align-items-center section-title mb-3 capitalize">
      <i [class]="props.icon"></i>
      {{ props.title }}
    </h2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeparatorComponent extends FieldType<FieldTypeConfig> {}
