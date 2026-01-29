import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '@env';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import {
  FileSelectEvent,
  FileUpload,
  FileUploadEvent,
} from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { constants } from 'src/app/shared/config';

@Component({
  selector: 'formly-field-file',
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss',
  imports: [
    FormlyModule,
    ButtonModule,
    TranslateModule,
    ImageModule,
    FileUpload,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileFieldComponent extends FieldType<FieldTypeConfig> {
  #sanitizer = inject(DomSanitizer);
  domain = environment.Domain_URL;

  fileUploader = viewChild.required<FileUpload>('fileUploader');

  selectedFile = signal<any>(null);
  url = `${environment.API_URL}/v1/global-media/upload-single`;

  mediaFile = signal<string | null>(null);
  isFailed = signal(false);
  constants = constants;

  ngOnInit() {
    const value = this.formControl?.value;
    if (this.props.mode === 'update' && value) {
      this.mediaFile.set(this.domain + value);
    }
  }

  onSelect(event: FileSelectEvent) {
    const file = event.files[0];
    if (!file) return;

    const maxFileSize = this.fileUploader()?.maxFileSize ?? 0;

    if (file.size > maxFileSize) return;

    this.props?.isUploading?.set(true);
    (file as any).objectURL = this.#sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(file),
    );
    this.selectedFile.set(file);
  }

  onUpload(event: FileUploadEvent) {
    const body = (event.originalEvent as any)?.body;
    if (body.statusCode !== 201) return;
    this.props?.isUploading?.set(false);
    this.isFailed.set(false);
    const fileName = body.data[0].name;
    this.formControl?.setValue(fileName);
  }

  onError() {
    this.props?.isUploading?.set(false);
    this.isFailed.set(true);
  }
}
