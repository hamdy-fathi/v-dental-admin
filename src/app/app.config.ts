import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';

import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  customFormlyConfig,
  CustomPageTitleProvider,
  HttpRequestInterceptor,
  HttpResponseInterceptor,
  LangService,
  RefreshTokenInterceptor,
} from '@shared';
import { DROPZONE_CONFIG, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { provideLottieOptions } from 'ngx-lottie';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Preset } from './app-theme';
import { routes } from './app.routes';
import { ContentByLanguagePipe } from './shared/pipes/content-by-language.pipe';

export function initializeLangFactory() {
  const langService = inject(LangService);
  const lang = langService.currentLanguage();
  return () => langService.switchLanguage(lang);
}

export function translateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  createImageThumbnails: true,
  method: 'post',
  paramName: 'files',
  uploadMultiple: true,
  addRemoveLinks: true,
  clickable: true,
  autoProcessQueue: true,
};

export const appConfig: ApplicationConfig = {
  providers: [
    ContentByLanguagePipe,
    MessageService,
    ConfirmationService,
    CustomPageTitleProvider,
    DynamicDialogConfig,
    DynamicDialogRef,
    DialogService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Preset,
        options: {
          darkModeSelector: 'none',
          prefix: 'azalove',
          cssLayer: true,
        },
      },
    }),
    provideHttpClient(
      withInterceptors([
        RefreshTokenInterceptor,
        HttpResponseInterceptor,
        HttpRequestInterceptor,
      ]),
    ),
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding(),
      withRouterConfig({
        onSameUrlNavigation: 'ignore',
        paramsInheritanceStrategy: 'always',
      }),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    importProvidersFrom(
      LoadingBarHttpClientModule,
      FormlyModule.forRoot(),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: translateLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),
    provideAppInitializer(() => {
      const initializerFn = initializeLangFactory();
      return initializerFn();
    }),
    {
      provide: FORMLY_CONFIG,
      useFactory: customFormlyConfig,
      deps: [TranslateService],
      multi: true,
    },
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    },
  ],
};
