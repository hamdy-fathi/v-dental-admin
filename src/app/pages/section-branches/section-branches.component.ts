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
import { ApiService, FieldBuilderService, SpinnerComponent } from '@shared';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { finalize, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-section-branches',
  standalone: true,
  templateUrl: './section-branches.component.html',
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
export default class SectionBranchesComponent {
  #fieldBuilder = inject(FieldBuilderService);
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef);

  sectionBranchesForm = new FormGroup({});
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
        switchMap(() => this.#api.request('post', `section-branches/get-active`, {})),
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
                branches: []
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
        key: 'content',
        type: 'repeat-field',
        className: 'col-12',
        props: {
          label: _('content by language'),
          addText: _('add language content'),
          removeText: _('remove language content'),
          disabledRepeater: this.languages().length,
        },
        fieldArray: {
          fieldGroup: [
            this.#fieldBuilder.fieldBuilder([
              {
                key: 'language_id',
                type: 'select-field',
                className: 'col-12 md:col-6',
                props: {
                  label: _('language'),
                  options: this.languages().map((lang: any) => ({
                    label: lang.name,
                    value: lang.id,
                  })),
                  required: true,
                },
              },
            ]),
            {
              key: 'branches',
              type: 'repeat-field',
              className: 'col-12',
              props: {
                label: _('branches'),
                addText: _('add branch'),
                removeText: _('remove branch'),
              },
              fieldArray: {
                fieldGroup: [
                  this.#fieldBuilder.fieldBuilder([
                    {
                      key: 'address',
                      type: 'textarea-field',
                      className: 'col-12',
                      props: {
                        label: _('address'),
                        rows: 3,
                        required: true,
                      },
                    },
                    {
                      key: 'working_hours',
                      type: 'input-field',
                      className: 'col-12 md:col-6',
                      props: {
                        type: 'text',
                        label: _('working hours'),
                        required: true,
                      },
                    },
                    {
                      key: 'iframe',
                      type: 'textarea-field',
                      className: 'col-12',
                      props: {
                        label: _('iframe code'),
                        rows: 4,
                        required: true,
                      },
                    },
                  ]),
                ],
              },
            },
          ],
        },
      },
    ];
  }

  update() {
    const method = this.type() === 'store' ? 'post' : 'put';
    if (this.sectionBranchesForm.invalid) return;
    this.submitBtnLoading.set(true);
    this.#api
      .request(method, `section-branches/${this.type()}`, this.model)
      .pipe(
        finalize(() => this.submitBtnLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }
}
