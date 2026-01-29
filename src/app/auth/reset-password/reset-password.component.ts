import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FooterComponent } from '@layout/footer/footer.component';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, BreakpointService, constants } from '@shared';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [
    TranslateModule,
    FormlyModule,
    ButtonModule,
    FooterComponent,
    MessageModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ResetPasswordComponent {
  #authService = inject(AuthService);
  #router = inject(Router);
  #translate = inject(TranslateService);
  isLgScreen = inject(BreakpointService).isLgScreen;
  #destroyRef = inject(DestroyRef);
  token = input();

  loading = signal(false);
  model = {} as any;
  resetForm = new FormGroup({});

  fields: FormlyFieldConfig[] = [
    {
      key: 'password',
      type: 'password-field',
      className: 'shadow-none',
      props: {
        inputStyleClass: 'border-round-lg surface-100 border-none',
        required: true,
        placeholder: this.#translate.instant(_('New Password')),
        toggleMask: true,
        minLength: constants.MIN_LENGTH_TEXT_INPUT,
      },
    },
    {
      key: 'password_confirmation',
      type: 'password-field',
      className: 'shadow-none',
      props: {
        inputStyleClass: 'border-round-lg surface-100 border-none',
        required: true,
        placeholder: this.#translate.instant(_('Confirm Password')),
        toggleMask: true,
        minLength: constants.MIN_LENGTH_TEXT_INPUT,
      },
    },
  ];

  resetPassword(): void {
    if (this.resetForm.invalid) return; // return early
    this.loading.set(true);
    this.#authService
      .resetPassword({ ...this.model, token: this.token() })
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: () => {
          this.#router.navigate(['/auth/login']);
        },
      });
  }
}
