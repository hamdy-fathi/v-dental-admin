import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FooterComponent } from '@layout/footer/footer.component';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, BreakpointService } from '@shared';
import { LottieComponent } from 'ngx-lottie';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { finalize, map } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  imports: [
    TranslateModule,
    FormlyModule,
    ButtonModule,
    LottieComponent,
    FooterComponent,
    MessageModule,
    ReactiveFormsModule,
  ],
  templateUrl: './forget-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ForgetPasswordComponent {
  #authService = inject(AuthService);
  #translate = inject(TranslateService);
  isLgScreen = inject(BreakpointService).isLgScreen;
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  showMessage = signal(false);

  loading = signal(false);
  model = {} as any;
  forgetPasswordForm = new FormGroup({});

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
  ];

  forgetPassword(): void {
    if (this.forgetPasswordForm.invalid) return; // return early
    this.loading.set(true);
    this.#authService
      .forgetPassword(this.model)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
        map(({ data }) => data),
      )
      .subscribe({
        next: () => {
          this.showMessage.set(true);
        },
      });
  }
}
