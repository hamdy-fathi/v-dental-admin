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
  selector: 'app-section-doctors',
  standalone: true,
  templateUrl: './section-doctors.component.html',
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
export default class SectionDoctorsComponent {
  #fieldBuilder = inject(FieldBuilderService);
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef);
  #langRepeaterFieldService = inject(LangRepeaterFieldService);

  sectionDoctorsForm = new FormGroup({});
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
        switchMap(() => this.#api.request('post', `section-doctors/get-active`, {})),
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
                title: '',
                description: '',
                doctors: []
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
              key: 'title',
              type: 'input-field',
              className: 'col-12 md:col-6',
              props: {
                type: 'text',
                label: _('title'),
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
              key: 'doctors',
              type: 'repeat-field',
              className: 'col-12',
              props: {
                label: _('doctors'),
                addText: _('add doctor'),
                removeText: _('remove doctor'),
              },
              fieldArray: {
                fieldGroup: [
                  this.#fieldBuilder.fieldBuilder([
                    {
                      key: 'name',
                      type: 'input-field',
                      className: 'col-12 md:col-6',
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
                      key: 'small_image',
                      type: 'file-field',
                      className: 'col-12 md:col-4',
                      props: {
                        label: _('small image'),
                        accept: 'image/*',
                        description: '(width: 50px, height: 50px)',
                        isUploading: this.isUploading,
                        mode: this.type() === 'update' ? 'update' : 'store',
                      },
                    },
                    {
                      key: 'image_main',
                      type: 'file-field',
                      className: 'col-12 md:col-4',
                      props: {
                        label: _('main image'),
                        accept: 'image/*',
                        description: '(width: 580px, height: 835px)',
                        isUploading: this.isUploading,
                        mode: this.type() === 'update' ? 'update' : 'store',
                      },
                    },
                    {
                      key: 'facebook',
                      type: 'input-field',
                      className: 'col-12 md:col-6',
                      props: {
                        type: 'url',
                        label: _('facebook url'),
                      },
                    },
                    {
                      key: 'instagram',
                      type: 'input-field',
                      className: 'col-12 md:col-6',
                      props: {
                        type: 'url',
                        label: _('instagram url'),
                      },
                    },
                  ]),
                ],
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
    if (this.sectionDoctorsForm.invalid) return;
    this.submitBtnLoading.set(true);
    this.#api
      .request(method, `section-doctors/${this.type()}`, this.model)
      .pipe(
        finalize(() => this.submitBtnLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }
}
