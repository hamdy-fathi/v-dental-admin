import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FooterComponent } from '@layout/footer/footer.component';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, BreakpointService, constants } from '@shared';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    TranslateModule,
    FormlyModule,
    ButtonModule,
    RouterLink,
    FooterComponent,
    MessageModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  #authService = inject(AuthService);
  #translate = inject(TranslateService);
  isLgScreen = inject(BreakpointService).isLgScreen;
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);

  loading = signal(false);
  model = {} as any;
  loginForm = new FormGroup({});

  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input-field',
      className: 'shadow-none',
      props: {
        styleClass: 'border-round-lg surface-100 border-none font-bold',
        required: true,
        placeholder: this.#translate.instant(_('Email')),
      },
      validators: {
        validation: ['email'],
      },
    },
    {
      key: 'password',
      type: 'password-field',
      className: 'shadow-none',
      props: {
        inputStyleClass: 'border-round-lg surface-100 border-none',
        required: true,
        label: this.#translate.instant(_('password')),
        placeholder: '********',
        toggleMask: true,
        minLength: constants.MIN_LENGTH_TEXT_INPUT,
      },
    },
  ];

  login() {
    if (this.loginForm.invalid) return;
    this.loading.set(true);
    this.#authService
      .login(this.model)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: () => {
          this.#router.navigate([constants.LOGIN_SUCCESS_REDIRECT_URL]);
        },
      });
  }
}
