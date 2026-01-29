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
  selector: 'app-section-one',
  standalone: true,
  templateUrl: './section-one.component.html',
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
export default class SectionOneComponent {
  #fieldBuilder = inject(FieldBuilderService);
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef);
  #langRepeaterFieldService = inject(LangRepeaterFieldService);

  sectionOneForm = new FormGroup({});
  isUploading = signal(false);
  fields!: FormlyFieldConfig[];
  model: any = {};
  loadingScreen = signal(true);
  submitBtnLoading = signal(false);
  type = signal<'store' | 'update'>('store');
  languages = signal<any[]>([]);

  ngOnInit() {
    return this.#api
      .request('post', `language/index`, {})
      .pipe(
        map(({ data }) => data),
        tap((languages) => {
          this.languages.set(languages.data);
        }),
        switchMap(() =>
          this.#api.request('post', `section-one/get-active`, {}),
        ),
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
                sub_headline: '',
                doctor_count_text: '',
                available_doctors_images: [],
                talk_doctors_images: [],
                main_clinic_image: '',
                additional_clinic_images: []
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
              key: 'sub_headline',
              type: 'input-field',
              className: 'col-12 md:col-6',
              props: {
                type: 'text',
                label: _('sub headline'),
                required: true,
              },
            },
            {
              key: 'doctor_count_text',
              type: 'input-field',
              className: 'col-12 md:col-6',
              props: {
                type: 'text',
                label: _('doctor count text'),
                required: true,
              },
            },
            {
              key: 'main_clinic_image',
              type: 'file-field',
              className: 'col-12 md:col-6',
              props: {
                label: _('main clinic image'),
                accept: 'image/*',
                description: '(width: 580px, height: 835px)',
                isUploading: this.isUploading,
                mode: this.type() === 'update' ? 'update' : 'store',
              },
            },
            {
              key: 'additional_clinic_images',
              type: 'multi-files-field',
              className: 'col-12 md:col-6',
              props: {
                label: _('additional clinic images'),
                accept: 'image/*',
                description:
                  '(width: 92px, height: 92px) ||  (width: 72px, height: 72px) ',
                isUploading: this.isUploading,
                mode: this.type() === 'update' ? 'update' : 'store',
                mediaAccessKey: 'additional_clinic_images',
              },
            },
            {
              key: 'available_doctors_images',
              type: 'repeat-field',
              className: 'col-12',
              props: {
                label: _('available doctors'),
                addText: _('add doctor'),
                removeText: _('remove doctor'),
              },
              fieldArray: {
                fieldGroup: [
                  this.#fieldBuilder.fieldBuilder([
                    {
                      key: 'name',
                      type: 'input-field',
                      className: 'col-12',
                      props: {
                        type: 'text',
                        label: _('doctor name'),
                        required: true,
                      },
                    },
                    {
                      key: 'short_description',
                      type: 'textarea-field',
                      className: 'col-12',
                      props: {
                        label: _('short description'),
                        rows: 3,
                        required: true,
                      },
                    },
                    {
                      key: 'image',
                      type: 'file-field',
                      className: 'col-12',
                      props: {
                        label: _('doctor image'),
                        accept: 'image/*',
                        isUploading: this.isUploading,
                        description: '(width: 50px, height: 50px)',
                        mode: this.type() === 'update' ? 'update' : 'store',
                      },
                    },
                  ]),
                ],
              },
            },
            {
              key: 'talk_doctors_images',
              type: 'multi-files-field',
              className: 'col-12',
              props: {
                label: _('talk doctors images'),
                accept: 'image/*',
                isUploading: this.isUploading,
                description: '(width: 50px, height: 50px)',
                mode: this.type() === 'update' ? 'update' : 'store',
                mediaAccessKey: 'talk_doctors_images',
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
    if (this.sectionOneForm.invalid) return;
    this.submitBtnLoading.set(true);
    this.#api
      .request(method, `section-one/${this.type()}`, this.model)
      .pipe(
        finalize(() => this.submitBtnLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }
}
