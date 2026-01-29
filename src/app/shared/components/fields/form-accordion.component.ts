import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FieldType, FormlyModule } from "@ngx-formly/core";
import { AccordionModule } from "primeng/accordion";

@Component({
  selector: "formly-form-accordion",
  template: `
    <p-accordion [value]="props.AccordionValue" [multiple]="props.multiple">
      @for (tab of field.fieldGroup; track $index) {
        <p-accordion-panel [value]="$index" [disabled]="tab.props?.accordionDisabled">
          <p-accordion-header>
            <div class="flex gap-2 align-items-center">
              <i [class]="tab.props?.icon"></i>
              <span>{{ tab.props?.header }}</span>
            </div>
          </p-accordion-header>

          <p-accordion-content>
            <formly-field [field]="tab"></formly-field>
          </p-accordion-content>
        </p-accordion-panel>
      }
    </p-accordion>
  `,
  styles: `
    :host ::ng-deep {
      .p-accordionpanel {
        .p-accordionheader {
          padding: 10px;

          &:focus-visible {
            outline: none;
          }
        }

        .p-accordioncontent-content {
          padding: 1rem 1rem 0 1rem;
        }
      }
    }
  `,
  imports: [FormlyModule, AccordionModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormAccordionComponent extends FieldType {}
