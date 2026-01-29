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
  selector: 'app-section-five',
  standalone: true,
  templateUrl: './section-five.component.html',
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
export default class SectionFiveComponent {
  #fieldBuilder = inject(FieldBuilderService);
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef);
  #langRepeaterFieldService = inject(LangRepeaterFieldService);

  sectionFiveForm = new FormGroup({});
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
        switchMap(() => this.#api.request('post', `section-five/get-active`, {})),
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
                short_description: '',
                experience_years: '',
                doctor_image: '',
                about_services: []
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
              key: 'short_description',
              type: 'textarea-field',
              className: 'col-12',
              props: {
                label: _('short description'),
                rows: 4,
                required: true,
              },
            },
            {
              key: 'experience_years',
              type: 'input-field',
              className: 'col-12',
              props: {
                type: 'text',
                label: _('experience years'),
                required: true,
              },
            },
            {
              key: 'doctor_image',
              type: 'file-field',
              className: 'col-12',
              props: {
                label: _('doctor image'),
                accept: 'image/*',
                description: '(width: 430px, height: 592px)',
                isUploading: this.isUploading,
                mode: this.type() === 'update' ? 'update' : 'store',
              },
            },
            {
              key: 'about_services',
              type: 'repeat-field',
              className: 'col-12',
              props: {
                label: _('about services'),
                addText: _('add service'),
                removeText: _('remove service'),
              },
              fieldArray: {
                type: 'input-field',
                className: 'col-12',
                props: {
                  type: 'text',
                  label: _('service name'),
                  required: true,
                },
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
    if (this.sectionFiveForm.invalid) return;
    this.submitBtnLoading.set(true);
    this.#api
      .request(method, `section-five/${this.type()}`, this.model)
      .pipe(
        finalize(() => this.submitBtnLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }
}
