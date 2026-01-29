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
  selector: 'app-section-four',
  standalone: true,
  templateUrl: './section-four.component.html',
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
export default class SectionFourComponent {
  #fieldBuilder = inject(FieldBuilderService);
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef);
  #langRepeaterFieldService = inject(LangRepeaterFieldService);

  sectionFourForm = new FormGroup({});
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
        switchMap(() => this.#api.request('post', `section-four/get-active`, {})),
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
                main_description: '',
                right_section_image_1: '',
                right_section_image_2: '',
                right_section_image_3: '',
                right_section_image_4: '',
                features: []
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
              key: 'main_description',
              type: 'textarea-field',
              className: 'col-12',
              props: {
                label: _('main description'),
                rows: 5,
                required: true,
              },
            },
            {
              key: 'right_section_image_1',
              type: 'file-field',
              className: 'col-12 md:col-3',
              props: {
                label: _('right section image 1'),
                accept: 'image/*',
                description: '(width: 315px, height: 265px)',
                isUploading: this.isUploading,
                mode: this.type() === 'update' ? 'update' : 'store',
              },
            },
            {
              key: 'right_section_image_2',
              type: 'file-field',
              className: 'col-12 md:col-3',
              props: {
                label: _('right section image 2'),
                accept: 'image/*',
                description: '(width: 125px, height: 125px)',
                isUploading: this.isUploading,
                mode: this.type() === 'update' ? 'update' : 'store',
              },
            },
            {
              key: 'right_section_image_3',
              type: 'file-field',
              className: 'col-12 md:col-3',
              props: {
                label: _('right section image 3'),
                accept: 'image/*',
                description: '(width: 310px, height: 175px)',
                isUploading: this.isUploading,
                mode: this.type() === 'update' ? 'update' : 'store',
              },
            },
            {
              key: 'right_section_image_4',
              type: 'file-field',
              className: 'col-12 md:col-3',
              props: {
                label: _('right section image 4'),
                accept: 'image/*',
                description: '(width: 130px, height: 120px)',
                isUploading: this.isUploading,
                mode: this.type() === 'update' ? 'update' : 'store',
              },
            },
            {
              key: 'features',
              type: 'repeat-field',
              className: 'col-12',
              props: {
                label: _('features'),
                addText: _('add feature'),
                removeText: _('remove feature'),
              },
              fieldArray: {
                fieldGroup: [
                  this.#fieldBuilder.fieldBuilder([
                    {
                      key: 'title',
                      type: 'input-field',
                      className: 'col-12',
                      props: {
                        type: 'text',
                        label: _('feature title'),
                        required: true,
                      },
                    },
                    {
                      key: 'description',
                      type: 'textarea-field',
                      className: 'col-12',
                      props: {
                        label: _('feature description'),
                        rows: 3,
                        required: true,
                      },
                    },
                    {
                      key: 'image',
                      type: 'file-field',
                      className: 'col-12',
                      props: {
                        label: _('feature image'),
                        accept: 'image/*',
                        description: '(width: 155px, height: 200px)',
                        isUploading: this.isUploading,
                        mode: this.type() === 'update' ? 'update' : 'store',
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
    if (this.sectionFourForm.invalid) return;
    this.submitBtnLoading.set(true);
    this.#api
      .request(method, `section-four/${this.type()}`, this.model)
      .pipe(
        finalize(() => this.submitBtnLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }
}
