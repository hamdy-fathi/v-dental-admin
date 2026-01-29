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
  selector: 'app-general-setting',
  standalone: true,
  templateUrl: './general-settings.component.html',
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
export default class ManageGlobalSettingsCuComponent {
  #fieldBuilder = inject(FieldBuilderService);
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef);
  #langRepeaterFieldService = inject(LangRepeaterFieldService);

  generalSettingsForm = new FormGroup({});
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
        switchMap(() =>
          this.#api.request('post', `general-settings/index`, {}),
        ),
        map(({ data }) => data),
        tap((data) => {
          const settingsData = data.data?.[0] || data;
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            this.type.set('update');
          }
          settingsData && (this.model = { ...this.model, ...settingsData });

          // Add default English content if no content exists
          if (!settingsData?.content || settingsData.content.length === 0) {
            const defaultLang = this.languages().find(
              (lang) => lang.name === 'en',
            );
            if (defaultLang) {
              this.model.content = [
                {
                  language_id: defaultLang.id,
                  store_name: '',
                  store_address: '',
                  meta_title: '',
                  meta_favicon: '',
                  logo: '',
                  meta_description: '',
                  meta_keywords: '',
                  meta_author: '',
                  meta_robots: '',
                  meta_canonical: '',
                  meta_image: '',
                  meta_og_title: '',
                  meta_og_description: '',
                  meta_og_image: '',
                  meta_og_url: '',
                  meta_og_type: '',
                  meta_og_locale: '',
                  meta_og_site_name: '',
                },
              ];
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
              key: 'store_name',
              type: 'input-field',
              className: 'col-12 md:col-6',
              props: {
                type: 'text',
                label: _('store name'),
                required: true,
              },
            },
            {
              key: 'logo',
              type: 'file-field',
              className: 'col-12 md:col-6',
              props: {
                label: _('logo'),
                accept: 'image/*',
                isUploading: this.isUploading,
                mode: this.type() === 'update' ? 'update' : 'store',
              },
            },
            {
              key: 'meta_favicon',
              type: 'file-field',
              className: 'col-12 md:col-6',
              props: {
                label: _('favicon'),
                accept: 'image/*',
                isUploading: this.isUploading,
                mode: this.type() === 'update' ? 'update' : 'store',
              },
            },
            {
              key: 'meta_title',
              type: 'input-field',
              className: 'col-12 md:col-6',
              props: {
                type: 'text',
                label: _('meta title'),
                maxLength: 60,
              },
            },
            {
              key: 'meta_description',
              type: 'textarea-field',
              className: 'col-12',
              props: {
                label: _('meta description'),
                rows: 3,
                maxLength: 160,
              },
            },
            {
              key: 'meta_keywords',
              type: 'textarea-field',
              className: 'col-12',
              props: {
                label: _('meta keywords'),
                rows: 3,
              },
            },
            {
              key: 'meta_author',
              type: 'input-field',
              className: 'col-12 md:col-4',
              props: {
                type: 'text',
                label: _('meta author'),
              },
            },
            {
              key: 'meta_robots',
              type: 'input-field',
              className: 'col-12 md:col-4',
              props: {
                type: 'text',
                label: _('meta robots'),
              },
            },
            {
              key: 'meta_canonical',
              type: 'input-field',
              className: 'col-12 md:col-4',
              props: {
                type: 'url',
                label: _('meta canonical'),
              },
            },
            {
              key: 'meta_image',
              type: 'file-field',
              className: 'col-12 md:col-6',
              props: {
                label: _('meta image'),
                accept: 'image/*',
                isUploading: this.isUploading,
                mode: this.type() === 'update' ? 'update' : 'store',
              },
            },
            {
              key: 'meta_og_title',
              type: 'input-field',
              className: 'col-12 md:col-6',
              props: {
                type: 'text',
                label: _('og title'),
              },
            },
            {
              key: 'meta_og_description',
              type: 'textarea-field',
              className: 'col-12',
              props: {
                label: _('og description'),
                rows: 3,
              },
            },
            {
              key: 'meta_og_image',
              type: 'file-field',
              className: 'col-12 md:col-4',
              props: {
                label: _('og image'),
                accept: 'image/*',
                isUploading: this.isUploading,
                mode: this.type() === 'update' ? 'update' : 'store',
              },
            },
            {
              key: 'meta_og_url',
              type: 'input-field',
              className: 'col-12 md:col-4',
              props: {
                type: 'url',
                label: _('og url'),
              },
            },
            {
              key: 'meta_og_type',
              type: 'input-field',
              className: 'col-12 md:col-4',
              props: {
                type: 'text',
                label: _('og type'),
              },
            },
            {
              key: 'meta_og_locale',
              type: 'input-field',
              className: 'col-12 md:col-4',
              props: {
                type: 'text',
                label: _('og locale'),
              },
            },
            {
              key: 'meta_og_site_name',
              type: 'input-field',
              className: 'col-12 md:col-4',
              props: {
                type: 'text',
                label: _('og site name'),
              },
            },
          ],
          'content',
        ) as FormlyFieldConfig),
        className: 'col-12',
      },
      {
        type: 'separator-field',
        fieldGroupClassName: 'col-12',
        props: {
          title: _('store contact information'),
        },
      },
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'store_email',
          type: 'input-field',
          className: 'col-12 md:col-6',
          props: {
            type: 'email',
            label: _('store email'),
          },
        },
        {
          key: 'store_phone',
          type: 'input-field',
          className: 'col-12 md:col-6',
          props: {
            type: 'text',
            label: _('store phone'),
          },
        },
      ]),
      {
        type: 'separator-field',
        fieldGroupClassName: 'col-12',
        props: {
          title: _('google tag manager'),
        },
      },
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'gtm_enabled',
          type: 'switch-field',
          className: 'col-12 md:col-4',
          props: {
            label: _('enable gtm'),
          },
        },
        {
          key: 'gtm_container_id',
          type: 'input-field',
          className: 'col-12 md:col-8',
          props: {
            type: 'text',
            label: _('gtm container id'),
          },
        },
      ]),
      {
        type: 'separator-field',
        fieldGroupClassName: 'col-12',
        props: {
          title: _('analytics & marketing'),
        },
      },
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'google_analytics_enabled',
          type: 'switch-field',
          className: 'col-12 md:col-4',
          props: {
            label: _('enable google analytics'),
          },
        },
        {
          key: 'google_analytics_id',
          type: 'input-field',
          className: 'col-12 md:col-8',
          props: {
            type: 'text',
            label: _('google analytics id'),
          },
        },
        {
          key: 'facebook_pixel_enabled',
          type: 'switch-field',
          className: 'col-12 md:col-4',
          props: {
            label: _('enable facebook pixel'),
          },
        },
        {
          key: 'facebook_pixel_id',
          type: 'input-field',
          className: 'col-12 md:col-8',
          props: {
            type: 'text',
            label: _('facebook pixel id'),
          },
        },
        {
          key: 'snapchat_pixel_enabled',
          type: 'switch-field',
          className: 'col-12 md:col-4',
          props: {
            label: _('enable snapchat pixel'),
          },
        },
        {
          key: 'snapchat_pixel_id',
          type: 'input-field',
          className: 'col-12 md:col-8',
          props: {
            type: 'text',
            label: _('snapchat pixel id'),
          },
        },
        {
          key: 'init_tiktok_enabled',
          type: 'switch-field',
          className: 'col-12 md:col-4',
          props: {
            label: _('enable tiktok pixel'),
          },
        },
        {
          key: 'init_tiktok_id',
          type: 'input-field',
          className: 'col-12 md:col-8',
          props: {
            type: 'text',
            label: _('tiktok pixel id'),
          },
        },
      ]),
      {
        type: 'separator-field',
        fieldGroupClassName: 'col-12',
        props: {
          title: _('social media'),
        },
      },
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'facebook_url',
          type: 'input-field',
          className: 'col-12 md:col-4',
          props: {
            type: 'url',
            label: _('facebook url'),
          },
        },
        {
          key: 'instagram_url',
          type: 'input-field',
          className: 'col-12 md:col-4',
          props: {
            type: 'url',
            label: _('instagram url'),
          },
        },
        {
          key: 'tiktok_url',
          type: 'input-field',
          className: 'col-12 md:col-4',
          props: {
            type: 'url',
            label: _('tiktok url'),
          },
        },
      ]),
      {
        type: 'separator-field',
        fieldGroupClassName: 'col-12',
        props: {
          title: _('blog settings'),
        },
      },
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'blog_image',
          type: 'file-field',
          className: 'col-12 md:col-12',
          props: {
            label: _('blog image'),
            accept: 'image/*',
            isUploading: this.isUploading,
            mode: this.type() === 'update' ? 'update' : 'store',
          },
        },
      ]),
    ];
  }

  update() {
    const method = this.type() === 'store' ? 'post' : 'put';
    if (this.generalSettingsForm.invalid) return;
    this.submitBtnLoading.set(true);
    this.#api
      .request(method, `general-settings/${this.type()}`, this.model)
      .pipe(
        finalize(() => this.submitBtnLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }
}
