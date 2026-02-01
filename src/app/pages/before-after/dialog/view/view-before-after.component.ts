import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import { resolveMediaUrl, ViewDialogComponent } from '@shared';
import { ImageModule } from 'primeng/image';
import { BeforeAfterCase } from '../../services/services-type';

@Component({
  selector: 'app-view-before-after',
  standalone: true,
  imports: [ViewDialogComponent, ImageModule, TranslateModule],
  templateUrl: './view-before-after.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewBeforeAfterComponent {
  isShowDialog = model(false);
  beforeAfter = input.required<BeforeAfterCase>();
  mediaUrl = resolveMediaUrl;

  list = computed<
    { label: string; value: any; hasToolTip?: boolean; type?: string }[]
  >(() => {
    const record = this.beforeAfter();

    return [
      {
        label: _('#ID'),
        value: record?.id,
      },
      {
        label: _('Description'),
        value: record?.description,
        hasToolTip: true,
      },
    ];
  });
}

