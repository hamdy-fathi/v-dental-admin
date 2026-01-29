import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { TimeoutError, catchError, filter, tap, throwError } from 'rxjs';
import { AlertService } from '../services';
import { GlobalApiResponse } from '../services/global-services/global';

export const HttpResponseInterceptor: HttpInterceptorFn = (request, next) => {
  const alertService = inject(AlertService);

  if (request.url.includes('assets/i18n/')) {
    return next(request);
  }

  return next(request).pipe(
    filter(
      (event): event is HttpResponse<GlobalApiResponse> =>
        event instanceof HttpResponse,
    ),
    // `event is HttpResponse<GlobalApiResponse>` syntax is not a return type, but rather a `type predicate`. the purpose of the `type predicate` is to tell TypeScript that if the predicate function returns true, the type of event inside the `tap` should be narrowed down to HttpResponse<GlobalApiResponse>. This allows you to access properties and methods of HttpResponse<GlobalApiResponse> (like body.status, body.message) without TypeScript raising a type error.
    tap((response) => {
      if (response.body)
        alertService?.setMessage({
          severity: 'success',
          detail: response.body.message,
        });
    }),
    // retry({
    // count: 1,
    // delay: (_, retryCount) => timer(retryCount * 1000), // 1sec, 2sec, 3sec...etc, error
    // we can provide a static value for delay like 1000 (one second),
    // but also we can Implement Progressive retry strategies.
    // so the interval between calls will be always increasing.
    // }),
    // retry 1 times on failed requests before throwing an error.
    // retry() must comes before the catchError().

    // The error is catched using the catchError operator.
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (!navigator.onLine) {
        // Handle connection error due to losing internet connection
        errorMessage =
          'No internet connection. Please check your network and try again.';
      } else {
        if (error instanceof TimeoutError) {
          // Timeout error
          errorMessage = 'Connection timed out.';
        } else {
          errorMessage = error.error.message;
        }
      }
      console.log(errorMessage);
      alertService?.setMessage({ severity: 'error', detail: errorMessage });
      return throwError(() => error); // Re-throw the error
    }),
  );
};
