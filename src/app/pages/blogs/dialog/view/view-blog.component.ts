import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { environment } from '@env';
import { TranslateModule } from '@ngx-translate/core';
import { ContentByLanguagePipe, DateFormatterPipe, ViewDialogComponent } from '@shared';
import { ImageModule } from 'primeng/image';
import { Blog } from '../../services/services-type';

@Component({
  selector: 'app-view-blog',
  standalone: true,
  imports: [ViewDialogComponent, ImageModule, TranslateModule],
  templateUrl: './view-blog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewBlogComponent {
  isShowDialog = model(false);
  blog = input.required<Blog>();
  domainUrl = environment.Domain_URL;
  #dateFormatter = new DateFormatterPipe();
  #contentByLanguagePipe = new ContentByLanguagePipe();

  list = computed<
    { label: string; value: any; hasToolTip?: boolean; type?: string }[]
  >(() => {
    const blogData = this.blog();
    const content = blogData?.content || [];
    
    return [
      {
        label: '#ID',
        value: blogData?.id,
      },
      {
        label: 'Title',
        value: this.#contentByLanguagePipe.transform(content)?.title || content[0]?.title || 'N/A',
      },
      {
        label: 'Sub Title',
        value: this.#contentByLanguagePipe.transform(content)?.subTitle || content[0]?.subTitle || 'N/A',
      },
      {
        label: 'Slug',
        value: blogData?.slug,
      },
      {
        label: 'Order',
        value: blogData?.order,
      },
      {
        label: 'Is Featured',
        value: blogData?.isFeatured ? 'Yes' : 'No',
      },
      {
        label: 'Is Published',
        value: blogData?.isPublished ? 'Yes' : 'No',
      },
      {
        label: 'Start Date',
        value: this.#dateFormatter.transform(
          blogData?.startDate,
          'relative',
        ),
      },
      {
        label: 'End Date',
        value: this.#dateFormatter.transform(
          blogData?.endDate,
          'relative',
        ),
      },
      {
        label: 'Description',
        value: this.#contentByLanguagePipe.transform(content)?.description || content[0]?.description || 'N/A',
        hasToolTip: true,
      },
      {
        label: 'Short Description',
        value: this.#contentByLanguagePipe.transform(content)?.shortDescription || content[0]?.shortDescription || 'N/A',
        hasToolTip: true,
      },
      {
        label: 'Meta Title',
        value: this.#contentByLanguagePipe.transform(content)?.metaTitle || content[0]?.metaTitle || 'N/A',
      },
      {
        label: 'Meta Description',
        value: this.#contentByLanguagePipe.transform(content)?.metaDescription || content[0]?.metaDescription || 'N/A',
        hasToolTip: true,
      },
      {
        label: 'Created At',
        value: this.#dateFormatter.transform(
          blogData?.createdAt,
          'relative',
        ),
      },
      {
        label: 'Updated At',
        value: this.#dateFormatter.transform(
          blogData?.updatedAt,
          'relative',
        ),
      },
    ];
  });
}
