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
import { FooterComponent } from '@layout/footer/footer.component';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, BreakpointService, constants } from '@shared';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { finalize, map } from 'rxjs';

@Component({
  selector: 'app-otp',
  imports: [
    TranslateModule,
    FormlyModule,
    RouterLink,
    ButtonModule,
    FooterComponent,
    MessageModule,
    ReactiveFormsModule,
  ],
  templateUrl: './otp.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OtpComponent {
  #authService = inject(AuthService);
  isLgScreen = inject(BreakpointService).isLgScreen;
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);
  LENGTHOTPFIELD = 6;

  routerData = this.#router.getCurrentNavigation()?.extras.state;
  loading = signal(false);
  model = {} as any;
  otpForm = new FormGroup({});

  ngOnInit(): void {
    const routerData = history.state;
    if (routerData?.otp) {
      this.model.otp = String(routerData.otp);
    }
  }

  fields: FormlyFieldConfig[] = [
    {
      key: 'otp',
      type: 'otp-field',
      props: {
        required: true,
        change: (field) => {
          if (field.model.otp.length === this.LENGTHOTPFIELD) {
            this.sendOtp();
          }
        },
      },
      hooks: {
        onInit: (field) => {
          if (field.model.otp.length === this.LENGTHOTPFIELD) {
            this.sendOtp();
          }
        },
      },
    },
  ];

  sendOtp() {
    if (this.otpForm.invalid) return;
    this.loading.set(true);
    this.#authService
      .verifyOtp({ ...this.model, id: this.#authService.userId() })
      .pipe(
        finalize(() => this.loading.set(false)),
        map(({ data }) => data),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: () => {
          this.#router.navigate([constants.LOGIN_SUCCESS_REDIRECT_URL]);
        },
      });
  }
}
