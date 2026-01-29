import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { createDialogConfig, RandomColorPipe } from '@shared';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-notification-item',
  imports: [ButtonModule, TooltipModule, RandomColorPipe, DatePipe],
  template: `
    <button
      (click)="handleClick(item())"
      [class.cursor-auto]="!isClickable()"
      class="w-full text-left flex gap-2 p-3 border-none bg-transparent"
    >
      <span
        class="flex-shrink-0 w-2rem h-2rem text-white border-round flex justify-content-center align-items-center"
        [style.background-color]="'' | randomColor"
      >
        <i [class]="'text-xl ' + item().icon"></i>
      </span>
      <span>
        <span
          [pTooltip]="item().title"
          tooltipPosition="top"
          class="text-xs font-medium line-clamp-1"
        >
          {{ item().title }}
        </span>
        <span class="block text-xs font-medium text-primary">
          {{ item().created | date: 'MMMM d, yyyy - hh:mm a' }}
        </span>
      </span>
    </button>
  `,
  styles: `
    button {
      transition: transform 200ms ease-in-out;
      &:hover {
        transform: translateX(8px);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationItemComponent {
  #router = inject(Router);
  item = input<{ [key: string]: string }>({});
  isClickable = signal(true);
  dialogConfig = createDialogConfig({ width: '980px' });

  handleClick(item: { [key: string]: string }) {
    const foundModel = this.#getCurrentItem(item.related_models);
  }

  #getCurrentItem(jsonModels: string) {
    const models = JSON.parse(jsonModels);
    return null;
  }
}
