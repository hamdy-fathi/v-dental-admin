import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class StaticDataService {
  languageOptions = [
    { label: 'en', value: 1 },
    { label: 'ar', value: 2 },
  ];
}
