import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';

import { environment } from '@env';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { AuthService } from 'src/app/shared/services';
import { resolveMediaUrl } from '@shared';

@Component({
  selector: 'formly-multi-files-field',
  templateUrl: './multi-files.component.html',
  styleUrl: './multi-files.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DropzoneModule,
    ImageModule,
    ButtonModule,
    FormlyModule,
    TranslateModule,
  ],
})
export class MultiFilesFieldComponent extends FieldType<FieldTypeConfig> {
  #config = inject(PrimeNG);
  #auth = inject(AuthService);
  uploadedFiles = signal<{ original_name: string; name: string }[]>([]);
  mediaFiles = signal<string[]>([]);

  uploadedFileNames = computed(() => this.uploadedFiles().map((f) => f.name));
  files = computed(() => [...new Set(this.uploadedFileNames())]);

  config!: DropzoneConfigInterface;

  formControlEffect = effect(() => {
    this.files().length
      ? this.formControl.setValue(this.files())
      : this.formControl.setValue(null);
  });

  onUploadSuccess(args: any): void {
    if (args[1].statusCode !== 201) return;
    const files = args[1].data;
    this.uploadedFiles.update((oldfiles) => [...oldfiles, ...files]);
  }

  ngOnInit() {
    this.config = {
      url:
        environment.API_URL +
        '/' +
        (this.props.url ?? `v1/global-media/upload`),
      acceptedFiles: this.props.acceptedFiles ?? 'image/*',
      parallelUploads: 2, // Process 2 files at a time.
      maxFilesize: this.props.maxFileSize ?? 10.48576, // Maximum file size in megabytes.
      headers: {
        Authorization: `Bearer ${this.#auth.accessToken()}`,
        'Cache-Control': null,
        'X-Requested-With': null,
      },
      // maxFiles: 1,
      autoReset: null, // Time for resetting component after upload (Default: null).
      errorReset: null, // Time for resetting component after an error (Default: null).
      cancelReset: null, // Time for resetting component after canceling (Default: null).
    };

    const mediaAccessKey = this.props?.mediaAccessKey ?? 'featuredImages';
    const media = this.field.model?.[mediaAccessKey];
    if (this.props.mode === 'update' && media && media.length > 0) {
      this.mediaFiles.set(media.map((m: string) => resolveMediaUrl(m)));
      this.uploadedFiles.set(media.map((m: string) => ({ original_name: m, name: m })));
    }
  }

  removeFile(index: number) {
    this.mediaFiles.update((files) => files.filter((_, i) => i !== index));
    this.onRemovedFile({ name: this.uploadedFiles()[index].name });
  }

  onRemovedFile(file: any) {
    this.uploadedFiles.update((files) =>
      files.filter((f) => f.original_name !== file.name),
    );
  }

  formatSize(bytes: number) {
    const k = 1024;
    const dm = 3;
    const sizes = this.#config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes?.[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes?.[i]}`;
  }
}
