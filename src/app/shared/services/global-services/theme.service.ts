import { Injectable } from "@angular/core";
import { localStorageSignal } from "../../helpers";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  isDarkMode = localStorageSignal(false, "is-dark-mode");

  constructor() {
    const element = document.querySelector("html");
    this.isDarkMode() && element?.classList.add("app-dark");
  }

  toggleDarkMode() {
    const element = document.querySelector("html");
    element?.classList.toggle("app-dark");
    this.isDarkMode.set(!this.isDarkMode());
  }
}
