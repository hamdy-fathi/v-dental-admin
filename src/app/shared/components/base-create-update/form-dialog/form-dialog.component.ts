import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FormlyFieldConfig,
  FormlyFormOptions,
  FormlyModule,
} from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { DefaultScreenHeaderComponent } from '../../default-screen-header.component';
import { SpinnerComponent } from '../../spinner.component';

@Component({
  selector: 'app-form-dialog',
  imports: [
    AsyncPipe,
    ButtonModule,
    FormlyModule,
    ReactiveFormsModule,
    DefaultScreenHeaderComponent,
    SpinnerComponent,
    TranslateModule,
  ],
  template: `
    <form
      [formGroup]="form()"
      (ngSubmit)="onSubmit.emit(model())"
      class="h-full"
    >
      <div class="flex flex-column h-full">
        @if (showDialogHeader()) {
          <div
            class="sticky top-0 z-10 p-3 border-bottom-1 border-300 surface-0"
          >
            <app-default-screen-header
              [title]="dialogTitle()"
              [titleIcon]="titleIcon()"
              [isTitleRenderedAsBtn]="isTitleRenderedAsBtn()"
              [titleClass]="dialogTitleClass()"
              [subtitle]="dialogSubtitle()"
              buttonIcon="pi pi-times"
              buttonClass="p-button-text p-button-secondary p-button-rounded w-2rem h-2rem"
              (onTitleBtnClicked)="onTitleBtnClicked.emit()"
              (onClick)="closeDialog.emit()"
            />
          </div>
        }
        @if (dialogData$() | async) {
          <div class="flex-auto p-3">
            <ng-content select="[additionalContent]" />
            <formly-form
              [model]="model()"
              [fields]="fields()"
              [form]="form()"
              [options]="options()"
            />
          </div>

          @if (showFormActions()) {
            <div
              class="sticky bottom-0 z-10 p-3 border-top-1 border-300 surface-0"
            >
              <div class="flex flex-wrap justify-content-end gap-2">
                @if (showResetButton()) {
                  <button
                    pButton
                    type="button"
                    class="p-button-secondary p-button-outlined py-2 text-sm"
                    (click)="options().resetModel?.()"
                    [label]="'clear' | translate"
                  ></button>
                }

                @if (showSubmitButton()) {
                  <button
                    pButton
                    class="p-button-success py-2 text-sm"
                    type="submit"
                    [loading]="isLoading()"
                    [disabled]="isDisabled()"
                    [label]="submitBtnLabel()"
                  ></button>
                }
              </div>
            </div>
          }
        } @else {
          <app-spinner></app-spinner>
        }
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDialogComponent<T> {
  showDialogHeader = input(true);
  dialogData$ = input<Observable<any>>();
  dialogTitle = input('');
  dialogTitleClass = input('');
  dialogSubtitle = input('');
  isTitleRenderedAsBtn = input(false);
  titleIcon = input('');
  onTitleBtnClicked = output();
  closeDialog = output();
  form = input<FormGroup<any>>({} as FormGroup);
  model = input<T>({} as T);
  fields = input.required<FormlyFieldConfig[]>();
  options = input<FormlyFormOptions>({});
  submitBtnLabel = input<string>('');
  isLoading = input(false);
  isDisabled = input(false);
  showFormActions = input(true);
  showSubmitButton = input(true);
  showResetButton = input(false);
  onSubmit = output<T>();
}
