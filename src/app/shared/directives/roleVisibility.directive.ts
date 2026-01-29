import { Directive, TemplateRef, ViewContainerRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appHasRole]',
})
export class RoleVisibilityDirective<T> {
  #viewContainer = inject(ViewContainerRef);
  #templateRef = inject(TemplateRef<T>);

  hasRole = input<boolean>(false, { alias: 'appHasRole' });

  ngOnInit() {
    if (this.hasRole()) {
      this.#viewContainer.createEmbeddedView(this.#templateRef);
    } else {
      this.#viewContainer.clear();
    }
  }
}
