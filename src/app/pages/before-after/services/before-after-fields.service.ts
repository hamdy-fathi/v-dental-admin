import { inject, Injectable, signal } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FieldBuilderService } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class BeforeAfterFieldsService {
  fieldBuilder = inject(FieldBuilderService);
  isUploading = signal(false);

  configureFields(editData?: any) {
    const isUpdateMode = !!editData && editData.method !== 'create';
    const mode = isUpdateMode ? 'update' : 'store';

    return [
      this.fieldBuilder.fieldBuilder([
        {
          key: 'before',
          type: 'file-field',
          props: {
            label: _('Before Image'),
            accept: 'image/*',
            required: true,
            isUploading: this.isUploading,
            mode,
          },
        },
        {
          key: 'after',
          type: 'file-field',
          props: {
            label: _('After Image'),
            accept: 'image/*',
            required: true,
            isUploading: this.isUploading,
            mode,
          },
        },
      ]),
      this.fieldBuilder.fieldBuilder([
        {
          key: 'description',
          type: 'textarea-field',
          className: 'col-12',
          props: {
            label: _('Description'),
            rows: 3,
            autoResize: true,
            required: true,
          },
        },
      ]),
    ];
  }
}

