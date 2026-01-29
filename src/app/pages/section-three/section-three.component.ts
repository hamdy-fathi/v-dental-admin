import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService, FieldBuilderService, LangRepeaterFieldService, SpinnerComponent } from '@shared';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { finalize, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-section-three',
  standalone: true,
  templateUrl: './section-three.component.html',
  imports: [
    DividerModule,
    TranslateModule,
    FormlyModule,
    SpinnerComponent,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SectionThreeComponent {
  #fieldBuilder = inject(FieldBuilderService);
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef);
  #langRepeaterFieldService = inject(LangRepeaterFieldService);

  sectionThreeForm = new FormGroup({});
  fields!: FormlyFieldConfig[];
  model: any = {};
  loadingScreen = signal(true);
  submitBtnLoading = signal(false);
  type = signal<'store' | 'update'>('store');
  languages = signal<any[]>([]);
  isUploading = signal(false);
  ngOnInit() {
    return this.#api
      .request('post', `language/index`, {})
      .pipe(
        map(({ data }) => data),
        tap((languages) => {
          this.languages.set(languages.data);
        }),
        switchMap(() => this.#api.request('post', `section-three/get-active`, {})),
        map(({ data }) => data),
        tap((data) => {
          data.content && data.content.length > 0 && this.type.set('update');
          data.content &&
            data.content.length > 0 &&
            (this.model = { ...this.model, ...data });
          
          // Add default English content if no content exists
          if (!data.content || data.content.length === 0) {
            const defaultLang = this.languages().find(lang => lang.name === 'en');
            if (defaultLang) {
              this.model.content = [{
                language_id: defaultLang.id,
                main_headline: '',
                description: '',
                services_images: [],
                service_image_before: '',
                service_image_after: ''
              }];
            }
          }
          
          this.loadingScreen.set(false);
          this.fields = this.configureFields();
        }),
      )
      .subscribe();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        type: 'separator-field',
        fieldGroupClassName: 'col-12',
        props: {
          title: _('content by language'),
        },
      },
      {
        ...(this.#langRepeaterFieldService.getlangRepeaterField(
          [
            {
              key: 'main_headline',
              type: 'input-field',
              className: 'col-12 md:col-6',
              props: {
                type: 'text',
                label: _('main headline'),
                required: true,
              },
            },
            {
              key: 'description',
              type: 'textarea-field',
              className: 'col-12',
              props: {
                label: _('description'),
                rows: 5,
                required: true,
              },
            },
            {
              key: 'services_images',
              type: 'multi-files-field',
              className: 'col-12',
              props: {
                label: _('services images'),
                accept: 'image/*',
                description: '(width: 600px, height: 400px)',
                isUploading: this.isUploading,
                mode: this.type() === 'update' ? 'update' : 'store',
                mediaAccessKey: 'services_images',
              },
            },
            {
              key: 'service_image_before',
              type: 'file-field',
              className: 'col-12 md:col-4',
              props: {
                label: _('service image before'),
                accept: 'image/*',
                description: '(width: 875px, height: 500px)',
                isUploading: this.isUploading,
                mode: this.type() === 'update' ? 'update' : 'store',
              },
            },
            {
              key: 'service_image_after',
              type: 'file-field',
              className: 'col-12 md:col-4',
              props: {
                label: _('service image after'),
                accept: 'image/*',
                description: '(width: 875px, height: 500px)',
                isUploading: this.isUploading,
                mode: this.type() === 'update' ? 'update' : 'store',
              },
            },
          ],
          'content',
        ) as FormlyFieldConfig),
        className: 'col-12',
      },
    ];
  }

  update() {
    const method = this.type() === 'store' ? 'post' : 'put';
    if (this.sectionThreeForm.invalid) return;
    this.submitBtnLoading.set(true);
    this.#api
      .request(method, `section-three/${this.type()}`, this.model)
      .pipe(
        finalize(() => this.submitBtnLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }
}
