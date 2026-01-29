import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyModule } from '@ngx-formly/core';
import { map } from 'rxjs';
import { FilterBaseComponent } from 'src/app/shared/components/filter-base/filter-base.component';

@Component({
  selector: 'app-blogs-filters',
  standalone: true,
  imports: [FormlyModule, NgClass, ReactiveFormsModule],
  templateUrl:
    '../../../shared/components/filter-base/filter-base.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersBlogsComponent extends FilterBaseComponent {
  pageList$ = this.globalList.getGlobalList('blog');

  ngOnInit() {
    this.fields = [
      this.fieldBuilder.fieldBuilder(
        [
          {
            key: 'postType',
            type: 'select-field',
            className: 'md:col-3 col-12',
            props: {
              isFloatedLabel: true,
              label: _('select post type'),
              options: this.pageList$.pipe(
                map(({ articleType }) => articleType),
              ),
            },
          },
          {
            key: 'mediaType',
            type: 'select-field',
            className: 'md:col-3 col-12',
            props: {
              required: true,
              label: _('select article type'),
              options: this.pageList$.pipe(map(({ mediaType }) => mediaType)),
            },
          },
          {
            type: 'button-field',
            className: 'md:col-1 col-3',
            props: {
              type: 'button',
              buttonIcon: 'fas fa-search',
              isButtonRight: true,
              buttonClass: 'w-full bg-primary-900 height-field',
              onClick: () => {
                this.sendModel();
              },
            },
          },
          {
            type: 'button-field',
            className: 'md:col-1 col-3',
            props: {
              type: 'button',
              buttonIcon: 'fas fa-eraser',
              buttonClass: 'w-full p-button-outlined height-field',
              onClick: () => {
                this.refreshModel();
              },
            },
          },
        ],
        'grid align-items-start',
      ),
    ];
  }
}
