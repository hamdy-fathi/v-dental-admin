import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { DefaultScreenHeaderComponent } from '../default-screen-header.component';
import { ListInfoComponent } from '../list-info-item/list-info-item.component';

@Component({
  selector: 'app-view-dialog',
  imports: [ListInfoComponent, DefaultScreenHeaderComponent],
  templateUrl: './view-dialog.component.html',
  styleUrl: './view-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewDialogComponent {
  showDialog = model(true);
  title = input.required<string>();
  data =
    input.required<
      { label: string; value: any; hasToolTip?: boolean; type?: string }[]
    >();
}
