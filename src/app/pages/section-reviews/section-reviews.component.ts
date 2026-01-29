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
  selector: 'app-section-reviews',
  standalone: true,
  templateUrl: './section-reviews.component.html',
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
export default class SectionReviewsComponent {
  #fieldBuilder = inject(FieldBuilderService);
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef);
  #langRepeaterFieldService = inject(LangRepeaterFieldService);

  sectionReviewsForm = new FormGroup({});
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
        switchMap(() => this.#api.request('post', `section-reviews/get-active`, {})),
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
                reviews: []
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
              key: 'reviews',
              type: 'repeat-field',
              className: 'col-12',
              props: {
                label: _('reviews'),
                addText: _('add review'),
                removeText: _('remove review'),
              },
              fieldArray: {
                fieldGroup: [
                  this.#fieldBuilder.fieldBuilder([
                    {
                      key: 'image',
                      type: 'file-field',
                      className: 'col-12 md:col-6',
                      props: {
                        label: _('review image'),
                        accept: 'image/*',
                        description: '(width: 451px, height: 440px)',
                        isUploading: this.isUploading,
                        mode: this.type() === 'update' ? 'update' : 'store',
                      },
                    },
                    {
                      key: 'reviewer_image',
                      type: 'file-field',
                      className: 'col-12 md:col-6',
                      props: {
                        label: _('reviewer image'),
                        accept: 'image/*',
                        description: '(width: 50px, height: 50px)',
                        isUploading: this.isUploading,
                        mode: this.type() === 'update' ? 'update' : 'store',
                      },
                    },
                    {
                      key: 'reviewer_name',
                      type: 'input-field',
                      className: 'col-12 md:col-6',
                      props: {
                        type: 'text',
                        label: _('reviewer name'),
                        required: true,
                      },
                    },
                    {
                      key: 'rating',
                      type: 'number-field',
                      className: 'col-12 md:col-3',
                      props: {
                        label: _('rating'),
                        min: 1,
                        max: 5,
                        required: true,
                      },
                    },
                    {
                      key: 'rating_text',
                      type: 'input-field',
                      className: 'col-12 md:col-3',
                      props: {
                        type: 'text',
                        label: _('rating text'),
                        required: true,
                      },
                    },
                    {
                      key: 'review_text',
                      type: 'textarea-field',
                      className: 'col-12',
                      props: {
                        label: _('review text'),
                        rows: 4,
                        required: true,
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
    if (this.sectionReviewsForm.invalid) return;
    this.submitBtnLoading.set(true);
    this.#api
      .request(method, `section-reviews/${this.type()}`, this.model)
      .pipe(
        finalize(() => this.submitBtnLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }
}
