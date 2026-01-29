import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ApiService, RangePipe } from '@shared';
import { ButtonModule } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Popover } from 'primeng/popover';
import { Skeleton } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { NotificationItemComponent } from './notification-item/notification-item.component';

export interface notification {
  created: string;
  icon: string;
  related_models: string;
  title: string;
  type: string;
}

@Component({
  selector: 'app-notification',
  imports: [
    ButtonModule,
    NotificationItemComponent,
    TooltipModule,
    Divider,
    Popover,
    RangePipe,
    Skeleton,
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  #api = inject(ApiService);
  animateBell = signal(false);

  // notifications$: Observable<notification[]> = this.#api
  //   .request('get', 'notifications/notifications')
  //   .pipe(map(({ data }) => data.notifications.map((n: any) => n.data)));

  // notifications = toSignal(this.notifications$, { initialValue: null });

  notifications = signal<any[] | null>(null);
}
