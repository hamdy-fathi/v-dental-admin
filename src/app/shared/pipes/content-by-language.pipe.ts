import { Pipe, PipeTransform, inject } from '@angular/core';
import { StaticDataService } from '@gService/static-data.service';
import { LangService } from '../services/global-services/lang.service';

@Pipe({
  name: 'contentByLanguage',
})
export class ContentByLanguagePipe implements PipeTransform {
  #langService = inject(LangService);
  #staticDataService = inject(StaticDataService);
  
  transform<T extends { language_id: number }>(
    content: T[] | undefined | null,
    fallback?: T
  ): T | undefined {
    if (!content || content.length === 0) {
      return fallback;
    }

    const currentLangId = this.getLanguageId(this.#langService.currentLanguage());
    const currentLangContent = content.find(item => item.language_id === currentLangId);
    return currentLangContent || content[0] || fallback;
  }

  private getLanguageId(lang: string): number {
    return this.#staticDataService.languageOptions.find(option => option.label === lang)?.value || 1;
  }
}
