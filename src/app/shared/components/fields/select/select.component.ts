import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { FloatLabel } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { Observable, of } from 'rxjs';
import { AnimationElementDirective } from 'src/app/shared/directives/animation-element.directive';

@Component({
  selector: 'formly-select-field',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  imports: [
    NgClass,
    NgTemplateOutlet,
    FloatLabel,
    FormlyModule,
    Select,
    MultiSelectModule,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent extends FieldType<FieldTypeConfig> {
  get options$(): Observable<any[]> {
    return Array.isArray(this.props.options)
      ? of(this.props.options)
      : this.props.options ?? of([]);
  }
}
