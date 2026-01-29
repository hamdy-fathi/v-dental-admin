import { DOCUMENT } from "@angular/common";
import { DestroyRef, Injectable, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TranslateService } from "@ngx-translate/core";
import { PrimeNG } from "primeng/config";
import { constants } from "../../config";
import { localStorageSignal } from "../../helpers";

@Injectable({ providedIn: "root" })
export class LangService {
  #translate = inject(TranslateService);
  #primengConfig = inject(PrimeNG);
  #document = inject(DOCUMENT);
  #destroyRef = inject(DestroyRef);

  #currentLanguage = localStorageSignal<string>(constants.DEFAULT_LANGUAGE, "app-lang");
  currentLanguage = this.#currentLanguage.asReadonly();

  switchLanguage(lang: string) {
    this.#translate.use(lang);
    this.#currentLanguage.set(lang);
    this.changeHtmlAttributes(lang);
    this.translatePrimeNg();
  }

  changeHtmlAttributes(lang: string) {
    const htmlTag = this.#document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.lang = lang;
    htmlTag.dir = lang === "ar" ? "rtl" : "ltr";
  }

  translatePrimeNg() {
    this.#translate
      .get("primeng")
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(res => this.#primengConfig.setTranslation(res));
  }
}
