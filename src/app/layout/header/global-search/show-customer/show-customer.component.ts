import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ViewCustomerComponent } from '@pages/users/dialog/view/view-customer/view-customer.component';
import { ApiService, SpinnerComponent } from '@shared';
import { filter, finalize, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-show-customer',
  imports: [ViewCustomerComponent, SpinnerComponent],
  templateUrl: './show-customer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowCustomerComponent {
  #api = inject(ApiService);
  customerId = input.required<number>();
  isLoading = signal(true);
  isShowDialog = model(false);

  customer$ = toObservable(this.customerId).pipe(
    filter((v) => !!v),
    tap(() => this.isLoading.set(true)),
    switchMap((id) => {
      return this.#api.request('get', `auth/users/user/${id}`).pipe(
        map(({ data }) => data),
        finalize(() => {
          this.isLoading.set(false);
        }),
      );
    }),
  );

  customer = toSignal(this.customer$, { initialValue: null });
}
