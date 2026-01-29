import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { User } from '@pages/users/services/services-type';
import { DateFormatterPipe, ViewDialogComponent } from '@shared';

@Component({
  selector: 'app-view-user',
  imports: [ViewDialogComponent],
  templateUrl: './view-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewUserComponent {
  isShowDialog = model(false);
  user = input.required<User>();
  #dateFormatter = new DateFormatterPipe();
  list = computed<{ label: string; value: any; hasToolTip?: boolean }[]>(() => {
    return [
      {
        label: '#ID',
        value: this.user()?.id,
      },
      {
        label: 'first Name',
        value: this.user()?.firstName,
      },
      {
        label: 'last Name',
        value: this.user()?.lastName,
      },
      {
        label: 'Full Name',
        value: this.user()?.fullName,
        hasToolTip: true,
      },
      {
        label: 'Role',
        value: this.user()?.role,
      },
      {
        label: 'email',
        value: this.user()?.email,
        hasToolTip: true,
      },
      {
        label: 'phone',
        value: this.user()?.phoneNumber,
      },
      {
        label: 'username',
        value: this.user()?.username,
      },
      {
        label: 'role',
        value: this.user()?.role,
      },
      {
        label: 'created at',
        value: this.#dateFormatter.transform(
          this.user()?.created_at,
          'relative',
        ),
      },
    ];
  });
}
