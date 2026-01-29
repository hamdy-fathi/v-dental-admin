import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { Customer } from '@pages/users/services/services-type';
import { DateFormatterPipe, ViewDialogComponent } from '@shared';

@Component({
  selector: 'app-view-customer',
  imports: [ViewDialogComponent],
  templateUrl: './view-customer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewCustomerComponent {
  isShowDialog = model(false);
  customer = input.required<Customer>();
  #dateFormatter = new DateFormatterPipe();
  list = computed<{ label: string; value: any; hasToolTip?: boolean }[]>(() => {
    return [
      {
        label: '#ID',
        value: this.customer()?.id,
      },
      {
        label: 'first Name',
        value: this.customer()?.fullName,
      },
      {
        label: 'last Name',
        value: this.customer()?.lastName,
      },
      {
        label: 'Full Name',
        value: this.customer()?.fullName,
        hasToolTip: true,
      },
      {
        label: 'email',
        value: this.customer()?.email,
        hasToolTip: true,
      },
      {
        label: 'username',
        value: this.customer()?.username,
        hasToolTip: true,
      },
      {
        label: 'phone',
        value: this.customer()?.phone,
      },
      {
        label: 'created at',
        value: this.customer()?.created_at,
      },
    ];
  });
}
