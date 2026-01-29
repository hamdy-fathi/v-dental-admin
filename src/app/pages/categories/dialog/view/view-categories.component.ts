import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    model,
} from '@angular/core';
import { environment } from '@env';
import { DateFormatterPipe, ViewDialogComponent } from '@shared';
import { Category } from '../../services/services-type'; // adjust path if needed

@Component({
  selector: 'app-view-category',
  imports: [ViewDialogComponent],
  templateUrl: './view-categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewCategoryComponent {
  isShowDialog = model(false);
  category = input.required<Category>();
  domainUrl = environment.Domain_URL;
  #dateFormatter = new DateFormatterPipe();

  list = computed<{ label: string; value: any; hasToolTip?: boolean }[]>(() => {
    const categoryData = this.category();
    const content = categoryData?.content || [];
    
    return [
      {
        label: '#ID',
        value: categoryData?.id,
      },
      {
        label: 'Name',
        value: content[0]?.name || 'N/A',
        hasToolTip: true,
      },
      {
        label: 'Description',
        value: content[0]?.description || 'N/A',
        hasToolTip: true,
      },
      {
        label: 'Image',
        value: this.domainUrl + categoryData?.image,
        type: 'image',
      },
      {
        label: 'Created At',
        value: this.#dateFormatter.transform(
          categoryData?.createdAt,
          'relative',
        ),
      },
      {
        label: 'Updated At',
        value: this.#dateFormatter.transform(
          categoryData?.updatedAt,
          'relative',
        ),
      },
    ];
  });
}
