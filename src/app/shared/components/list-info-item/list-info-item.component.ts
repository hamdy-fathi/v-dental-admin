import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';
import { FormatStringPipe } from '../../pipes';
import { FallbackPipe } from '../../pipes/fallback.pipe';

@Component({
  selector: 'app-list-info-item',
  imports: [
    TranslateModule,
    TooltipModule,
    ImageModule,
    FormatStringPipe,
    FallbackPipe,
  ],
  template: `
    <span class="item-label"> {{ label() | translate | formatString }}</span>
    @if (type() === 'image') {
      <p-image
        [src]="item()"
        [preview]="true"
        alt="Image"
        width="60"
        class="block"
      >
        <ng-template #indicator>
          <i class="pi pi-search"></i>
        </ng-template>
      </p-image>
    } @else if (type() === 'svg') {
      <div
        [innerHTML]="sanitizeHtml(item() || '')"
        class="flex items-center justify-center border-1 border-300 border-round p-2"
        style="min-height: 60px; background-color: #f8f9fa;"
      ></div>
    } @else if (type() === 'color') {
      <div class="flex items-center gap-2">
        <div
          [style.background-color]="item()"
          class="border-1 border-300 border-round"
          style="width: 40px; height: 40px;"
          [title]="item()"
        ></div>
        <span class="text-sm font-mono">{{ item() | fallback }}</span>
      </div>
    } @else if (!hasToolTip()) {
      <h6 class="text-sm text-700 font-semibold m-0">
        {{ item() | fallback }}
      </h6>
    } @else {
      <h6
        class="text-sm text-700 font-semibold m-0 line-clamp-1"
        pTooltip="{{ item() | fallback }}"
        tooltipPosition="top"
      >
        {{ item() | fallback }}
      </h6>
    }

    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListInfoComponent {
  label = input<string>('');
  item = input<string>();
  hasToolTip = input<boolean>(false);
  type = input<string>('');
  private sanitizer = inject(DomSanitizer);

  sanitizeHtml(html: string): SafeHtml {
    if (!html) return '';
    if (html.includes('<svg') || html.includes('</svg>')) {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
    return this.sanitizer.sanitize(1, html) || '';
  }
}
