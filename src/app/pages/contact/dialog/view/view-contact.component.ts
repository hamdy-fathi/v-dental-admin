import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { Contact } from '@pages/contact/services/services-type';
import { DateFormatterPipe, ViewDialogComponent } from '@shared';

@Component({
  selector: 'app-view-contact',
  standalone: true,
  imports: [ViewDialogComponent],
  templateUrl: './view-contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewContactComponent {
  isShowDialog = model(false);
  contact = input.required<Contact>();
  #dateFormatter = new DateFormatterPipe();

  list = computed<{ label: string; value: any; hasToolTip?: boolean }[]>(() => {
    return [
      {
        label: '#ID',
        value: this.contact()?.id,
      },
      {
        label: 'Name',
        value: this.contact()?.name,
      },
      {
        label: 'Email',
        value: this.contact()?.email,
      },
      {
        label: 'Phone',
        value: this.contact()?.phone,
      },
      {
        label: 'Message',
        value: this.contact()?.message,
        hasToolTip: true,
      },
      {
        label: 'Created At',
        value: this.#dateFormatter.transform(
          this.contact().createdAt,
          'relative',
        ),
      },
    ];
  });
}
