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
import { finalize, map, tap } from 'rxjs';

@Component({
  selector: 'app-language',
  standalone: true,
  templateUrl: './language.component.html',
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
export default class LanguageComponent {
  #fieldBuilder = inject(FieldBuilderService);
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef);

  languageForm = new FormGroup({});
  fields!: FormlyFieldConfig[];
  model: any = {};
  loadingScreen = signal(true);
  submitBtnLoading = signal(false);
  type = signal<'store' | 'update'>('store');

  ngOnInit() {
    return this.#api
      .request('post', `language/index`, {})
      .pipe(
        map(({ data }) => data),
        tap((data) => {
          data.data[0] && this.type.set('update');
          data.data[0] && (this.model = { ...this.model, ...data.data[0] });
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
          title: _('languages'),
        },
      },
      {
        key: 'languages',
        type: 'repeat-field',
        className: 'col-12',
        props: {
          label: _('languages'),
          addText: _('add language'),
          removeText: _('remove language'),
        },
        fieldArray: {
          fieldGroup: [
            {
              key: 'id',
              type: 'number-field',
              className: 'col-12 md:col-6',
              props: {
                label: _('language id'),
                min: 1,
                required: true,
              },
            },
            {
              key: 'name',
              type: 'input-field',
              className: 'col-12 md:col-6',
              props: {
                type: 'text',
                label: _('language name'),
                required: true,
              },
            },
          ],
        },
      },
    ];
  }

  update() {
    const method = this.type() === 'store' ? 'post' : 'put';
    if (this.languageForm.invalid) return;
    this.submitBtnLoading.set(true);
    this.#api
      .request(method, `language/${this.type()}`, this.model)
      .pipe(
        finalize(() => this.submitBtnLoading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }
}
