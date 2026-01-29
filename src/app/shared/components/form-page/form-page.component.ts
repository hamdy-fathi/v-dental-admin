import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@gService/api.service';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { finalize, Observable, of } from 'rxjs';
import { FieldBuilderService } from '../../services';
import { FormComponent } from '../form.component';
import { SpinnerComponent } from '../spinner.component';

@Component({
  selector: 'app-form-page',
  imports: [AsyncPipe, FormComponent, SpinnerComponent],
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormPageComponent {
  public fieldBuilder = inject(FieldBuilderService);
  public api = inject(ApiService);
  public destroyRef = inject(DestroyRef);
  public router = inject(Router);
  isDisabled = computed(() => false);
  filtersQuery = input<string>();

  pageList$: Observable<any> = of(1);
  model = {} as any;
  isLoadingBtnSubmit = signal(false);
  formTitle = signal('');
  submitLabel = signal('');
  submitButtonClass = signal('');
  resetButtonClass = signal('');
  fields = signal([] as FormlyFieldConfig[]);
  showFormActions = signal(true);
  showSubmitButton = signal(true);
  showResetButton = signal(false);
  footerFormClass = signal('');
  endpoint = signal('');
  navigateAfterSubmit = signal('');

  options: FormlyFormOptions = {};
  createForm = new FormGroup({});

  protected updateModel(model: any) {
    return model;
  }

  protected deleteCache() {}

  protected createUpdateRecord() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    this.isLoadingBtnSubmit.set(true);

    this.api
      .request('post', this.endpoint(), this.updateModel(this.model))
      .pipe(
        finalize(() => this.isLoadingBtnSubmit.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.deleteCache();
        this.router.navigate([`/${this.navigateAfterSubmit()}`]);
      });
  }

  filterDataForUpdate(model: any) {
    if (!this.filtersQuery()) return null;
    const parsedData = JSON.parse(this.filtersQuery() as string);
    return Object.keys(parsedData).reduce((acc, key) => {
      if (key in model) {
        acc[key] = parsedData[key];
      }
      return acc;
    }, {} as any);
  }
}
